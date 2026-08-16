const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const WEBHOOK_SECRET = defineSecret("BANK_WEBHOOK_SECRET");

exports.verifyPaymentWebhook = onRequest(
  { secrets: [WEBHOOK_SECRET] },
  async (req, res) => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const signature = req.get("X-Webhook-Signature");
    if (signature !== WEBHOOK_SECRET.value()) {
      console.warn("Rejected webhook: bad signature");
      return res.status(401).send("Invalid signature");
    }

    const { md5, status, transactionId } = req.body || {};
    if (!md5 || !status) return res.status(400).send("Missing md5 or status");

    try {
      const q = await db.collection("orders").where("payment.qrMd5", "==", md5).limit(1).get();
      if (q.empty) {
        console.warn("Webhook: no matching order for md5", md5);
        return res.status(404).send("Order not found");
      }

      const orderDoc = q.docs[0];
      const newStatus = status === "SUCCESS" ? "paid" : "payment_failed";

      await orderDoc.ref.update({
        status: newStatus,
        "payment.transactionId": transactionId || null,
        "payment.confirmedAt": admin.firestore.FieldValue.serverTimestamp(),
        "payment.confirmationMethod": "bank_webhook",
      });

      return res.status(200).send("OK");
    } catch (err) {
      console.error("verifyPaymentWebhook error:", err);
      return res.status(500).send("Internal error");
    }
  }
);