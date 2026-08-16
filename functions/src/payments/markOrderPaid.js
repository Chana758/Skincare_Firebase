const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();


exports.markOrderPaid = onCall(async (request) => {
  const caller = request.auth;
  if (!caller) throw new HttpsError("unauthenticated", "Login required.");

  const role = caller.token.role;
  if (role !== "admin" && role !== "staff") {
    throw new HttpsError("permission-denied", "Only staff or admin can confirm payment.");
  }

  const { orderId } = request.data || {};
  if (!orderId) throw new HttpsError("invalid-argument", "orderId is required.");

  const orderRef = db.doc(`orders/${orderId}`);
  const snap = await orderRef.get();
  if (!snap.exists) throw new HttpsError("not-found", "Order not found.");

  const order = snap.data();
  if (order.status === "cancelled") {
    throw new HttpsError("failed-precondition", "Cannot mark a cancelled order as paid.");
  }
  if (order.status === "paid") {
    return { success: true, alreadyPaid: true };
  }

  await orderRef.update({
    status: "paid",
    "payment.confirmedAt": admin.firestore.FieldValue.serverTimestamp(),
    "payment.confirmedBy": caller.uid,
    "payment.confirmationMethod": "manual_staff",
  });

  return { success: true };
});