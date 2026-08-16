const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

exports.createOrder = onCall(async (request) => {
  const caller = request.auth;
  const { items, shipping, paymentMethod, discountCode, source = "online" } = request.data || {};

  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpsError("invalid-argument", "Order must contain at least one item.");
  }
  if (source === "pos" && !caller) {
    throw new HttpsError("unauthenticated", "Staff login required for POS orders.");
  }

  return db.runTransaction(async (tx) => {
    let subtotal = 0;
    const resolvedItems = [];

    // 1. Validate stock + price for every item, server-side only
    // Accepts either { productId, qty } or the cart's native shape
    // { id, name, price, image, qty } — only productId/id and qty are
    // ever trusted; name/price/image are always re-read from Firestore below.
    for (const rawItem of items) {
      const productId = rawItem.productId || rawItem.id;
      const qty = rawItem.qty;
      if (!productId || !qty || qty < 1) {
        throw new HttpsError("invalid-argument", "Each item needs a productId (or id) and qty >= 1.");
      }
      const ref = db.doc(`products/${productId}`);
      const snap = await tx.get(ref);
      if (!snap.exists) throw new HttpsError("not-found", `Product ${productId} not found.`);

      const product = snap.data();
      const stock = product.stock ?? 0;
      if (stock < qty) {
        throw new HttpsError("failed-precondition", `Not enough stock for "${product.name}".`);
      }

      const lineTotal = product.price * qty;
      subtotal += lineTotal;
      resolvedItems.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image || null,
        qty,
      });

      tx.update(ref, { stock: stock - qty });
    }

    // 2. Apply discount code if present
    let discountRate = 0;
    let appliedCode = null;
    if (discountCode) {
      const discRef = db.doc(`discounts/${discountCode.toUpperCase()}`);
      const discSnap = await tx.get(discRef);
      if (discSnap.exists && discSnap.data().active) {
        const d = discSnap.data();
        const now = Date.now();
        const notExpired = !d.expiresAt || d.expiresAt.toMillis() > now;
        if (notExpired) {
          discountRate = d.rate || 0;
          appliedCode = discountCode.toUpperCase();
        }
      }
    }

    const discountAmount = subtotal * discountRate;
    const afterDiscount = subtotal - discountAmount;
    const shippingFee = source === "pos" || afterDiscount >= 50 || afterDiscount === 0 ? 0 : 4.99;
    const total = afterDiscount + shippingFee;

    // 3. Determine initial status by payment method:
    //    - cash: money is handed over at the counter right now -> paid immediately
    //    - cod: customer pays later when the delivery arrives -> not yet paid
    //    - khqr / card: waiting on a transfer/charge to clear -> awaiting_payment
    let status;
    if (paymentMethod === "cash") {
      status = "paid";
    } else if (paymentMethod === "cod") {
      status = "pending";
    } else {
      status = "awaiting_payment";
    }

    // 4. Create the order document
    const orderRef = db.collection("orders").doc();
    tx.set(orderRef, {
      userId: caller?.uid || null,
      source, // "online" | "pos"
      staffId: source === "pos" ? caller.uid : null,
      items: resolvedItems,
      shipping: shipping || null,
      paymentMethod: paymentMethod || "khqr",
      subtotal,
      discountCode: appliedCode,
      discountAmount,
      shippingFee,
      total,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(status === "paid" ? { "payment.confirmedAt": admin.firestore.FieldValue.serverTimestamp(), "payment.confirmationMethod": "cash_at_counter" } : {}),
    });

    return { orderId: orderRef.id, total };
  });
});