const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const VALID_STATUSES = [
  "awaiting_payment", "pending", "processing", "paid",
  "shipped", "delivered", "completed", "cancelled",
];

/**
 * Callable: staff/admin only. Updates an order's status.
 * client call: httpsCallable(functions, "updateOrderStatus")({ orderId, status })
 */
exports.updateOrderStatus = onCall(async (request) => {
  const caller = request.auth;
  if (!caller) throw new HttpsError("unauthenticated", "Login required.");
  const role = caller.token.role;
  if (role !== "admin" && role !== "staff") {
    throw new HttpsError("permission-denied", "Only staff or admin can update order status.");
  }

  const { orderId, status } = request.data || {};
  if (!orderId || !VALID_STATUSES.includes(status)) {
    throw new HttpsError("invalid-argument", "Valid orderId and status are required.");
  }

  await db.doc(`orders/${orderId}`).update({
    status,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: caller.uid,
  });

  return { success: true };
});