import {
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  increment,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Creates an order + deducts stock atomically using a Firestore client
 * transaction — works fully on the Spark (free) plan, no Cloud Functions
 * required.
 *
 * NOTE on security: unlike a Cloud Function, this trusts `item.price` from
 * the cart at the moment of writing. Firestore rules can't fully re-price
 * an order server-side, so this is a known trade-off of staying on Spark.
 * If you outgrow this, move createOrder back to the Cloud Function version
 * (functions/src/orders/createOrder.js) which re-reads price from
 * Firestore before charging.
 */
export const createOrder = async ({
  items,
  paymentMethod,
  discountCode = null,
  discountRate = 0,
  source = "pos",
  staffId = null,
  userId = null,
  shipping = null,
}) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  let subtotal = 0;
  const processedItems = items.map((item) => {
    const id = item.productId || item.id;
    if (!id || !item.qty || item.qty < 1) {
      throw new Error("Each item needs a valid id and quantity.");
    }
    subtotal += item.price * item.qty;
    return {
      id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image || "",
    };
  });

  const rate = Number(discountRate) || 0;
  const discountAmount = subtotal * rate;
  const afterDiscount = subtotal - discountAmount;
  const shippingFee = source === "pos" || afterDiscount >= 50 || afterDiscount === 0 ? 0 : 4.99;
  const total = Math.max(0, afterDiscount + shippingFee);

  // Initial status by payment method:
  //  - cash: money handed over at the counter right now -> paid immediately
  //  - cod: customer pays later when the delivery arrives -> not yet paid
  //  - khqr / card: waiting on a transfer/charge to clear -> awaiting_payment
  let status;
  if (paymentMethod === "cash") {
    status = "paid";
  } else if (paymentMethod === "cod") {
    status = "pending";
  } else {
    status = "awaiting_payment";
  }

  const orderId = await runTransaction(db, async (transaction) => {
    const refs = [];
    for (const item of processedItems) {
      const productRef = doc(db, "products", item.id);
      const snap = await transaction.get(productRef);
      if (!snap.exists()) throw new Error(`Product not found: ${item.name}`);
      const currentStock = snap.data().stock ?? 0;
      if (currentStock < item.qty) {
        throw new Error(`Insufficient stock for "${item.name}". Only ${currentStock} left.`);
      }
      refs.push(productRef);
    }

    refs.forEach((ref, i) => {
      transaction.update(ref, { stock: increment(-processedItems[i].qty) });
    });

    const newOrderRef = doc(collection(db, "orders"));
    transaction.set(newOrderRef, {
      items: processedItems,
      subtotal,
      discountAmount,
      discountCode,
      shippingFee,
      total,
      paymentMethod,
      status,
      source,
      staffId,
      userId,
      shipping,
      createdAt: serverTimestamp(),
      ...(status === "paid"
        ? {
            "payment.confirmedAt": serverTimestamp(),
            "payment.confirmationMethod": "cash_at_counter",
          }
        : {}),
    });

    return newOrderRef.id;
  });

  return { orderId, total };
};


const KHQR_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export const generateKHQR = async (orderId, amount) => {
  if (!orderId) throw new Error("orderId is required to generate a QR code.");
  // Round to exactly 2 decimal places before sending to bakong-khqr.
  // Without this, floating-point math upstream (e.g. 25 + 4.99) can produce
  // something like 29.990000000000002, which bakong-khqr rejects with
  // "Amount is invalid" since it only accepts up to 2 decimal places.
  const safeAmount = Math.round((Number(amount) || 0) * 100) / 100;

  const merchantId = import.meta.env.VITE_BAKONG_MERCHANT_ID;
  const merchantName = import.meta.env.VITE_BAKONG_MERCHANT_NAME;

  if (!merchantId || !merchantName) {
    throw new Error(
      "Missing VITE_BAKONG_MERCHANT_ID / VITE_BAKONG_MERCHANT_NAME in your .env file."
    );
  }

  // bakong-khqr generates the EMV-compliant QR payload — same library the
  // Cloud Function version used, just running in the browser instead.
  const { BakongKHQR, khqrData, IndividualInfo } = await import("bakong-khqr");

  const expirationTimestamp = Date.now() + KHQR_EXPIRY_MS;

  const optionalData = {
    currency: khqrData.currency.usd,
    amount: safeAmount,
    billNumber: orderId,
    storeLabel: merchantName,
    expirationTimestamp,
  };

  const individualInfo = new IndividualInfo(merchantId, merchantName, "Phnom Penh", optionalData);
  const khqr = new BakongKHQR();
  const response = khqr.generateIndividual(individualInfo);

  // bakong-khqr doesn't throw on invalid input — it returns { data: null,
  // status: { code, message, ... } } instead. Surface that real reason
  // rather than crashing on `.qr` of null.
  if (!response || !response.data) {
    const reason =
      response?.status?.message ||
      response?.status?.errorMessage ||
      JSON.stringify(response?.status) ||
      "Unknown validation error from bakong-khqr.";
    console.error("bakong-khqr rejected the input:", response);
    throw new Error(`Could not generate KHQR: ${reason}`);
  }

  // Save the md5 + expiry on the order so staff (or a future webhook) can
  // match this QR back to the order and know when it goes stale.
  try {
    await updateDoc(doc(db, "orders", orderId), {
      "payment.qrMd5": response.data.md5,
      "payment.generatedAt": serverTimestamp(),
      "payment.expiresAt": expirationTimestamp,
    });
  } catch (err) {
    console.error("Could not save QR md5 to order (non-blocking):", err);
  }

  return {
    qrString: response.data.qr,
    md5: response.data.md5,
    expiresAt: expirationTimestamp,
  };
};

/**
 * Staff manually confirms a KHQR payment landed (no bank webhook wired up).
 * Restricted to staff/admin by firestore.rules — a customer's own SDK
 * call to this would be rejected.
 */
export const markOrderPaid = async (orderId) => {
  if (!orderId) throw new Error("orderId is required.");
  return updateDoc(doc(db, "orders", orderId), {
    status: "paid",
    "payment.confirmedAt": serverTimestamp(),
    "payment.confirmedManually": true,
  });
};