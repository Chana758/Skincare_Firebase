const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const BAKONG_MERCHANT_ID = defineSecret("BAKONG_MERCHANT_ID");
const BAKONG_MERCHANT_NAME = defineSecret("BAKONG_MERCHANT_NAME");


exports.generateKHQR = onCall(
  { secrets: [BAKONG_MERCHANT_ID, BAKONG_MERCHANT_NAME] },
  async (request) => {
    const caller = request.auth;
    const { orderId } = request.data || {};
    if (!orderId) throw new HttpsError("invalid-argument", "orderId is required.");

    const orderSnap = await db.doc(`orders/${orderId}`).get();
    if (!orderSnap.exists) throw new HttpsError("not-found", "Order not found.");
    const order = orderSnap.data();

    if (caller && order.userId && order.userId !== caller.uid && caller.token.role === "customer") {
      throw new HttpsError("permission-denied", "Not your order.");
    }

    // bakong-khqr generates the EMV-compliant QR payload for Cambodian banks/wallets
    const { BakongKHQR, khqrData, IndividualInfo } = require("bakong-khqr");

    const optionalData = {
      currency: khqrData.currency.usd,
      amount: order.total,
      billNumber: orderId,
      storeLabel: "Lumière Beauty",
      terminalLabel: order.source === "pos" ? "POS-01" : "ONLINE",
    };

    const individualInfo = new IndividualInfo(
      BAKONG_MERCHANT_ID.value(),
      BAKONG_MERCHANT_NAME.value(),
      "Phnom Penh",
      optionalData
    );

    const khqr = new BakongKHQR();
    const response = khqr.generateIndividual(individualInfo);

    await db.doc(`orders/${orderId}`).update({
      "payment.qrMd5": response.data.md5,
      "payment.generatedAt": admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      qrString: response.data.qr,
      md5: response.data.md5,
      amount: order.total,
      currency: "USD",
    };
  }
);