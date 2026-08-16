const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

/**
 * Callable: cancels an order and restores stock for each item, atomically.
 * Allowed for: the order's own customer (if still pending/awaiting_payment),
 * or any staff/admin at any time.
 *
 * client call: httpsCallable(functions, "cancelOrder")({ orderId, reason })
 */
exports.cancelOrder = onCall(async (request) => {
  const caller = request.auth;
  if (!caller) throw new HttpsError("unauthenticated", "Login required.");

  const { orderId, reason } = request.data || {};
  if (!orderId) throw new HttpsError("invalid-argument", "orderId is required.");

  return db.runTransaction(async (tx) => {
    const orderRef = db.doc(`orders/${orderId}`);
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) throw new HttpsError("not-found", "Order not found.");

    const order = orderSnap.data();
    const role = caller.token.role;
    const isOwner = order.userId === caller.uid;
    const isStaffOrAdmin = role === "admin" || role === "staff";

    if (!isStaffOrAdmin) {
      if (!isOwner) throw new HttpsError("permission-denied", "Not your order.");
      if (!["pending", "awaiting_payment"].includes(order.status)) {
        throw new HttpsError("failed-precondition", "Order can no longer be cancelled.");
      }
    }

    if (order.status === "cancelled") {
      return { success: true, alreadyCancelled: true };
    }

    // Restore stock for every item
    for (const item of order.items || []) {
      const productRef = db.doc(`products/${item.id}`);
      const productSnap = await tx.get(productRef);
      if (productSnap.exists) {
        const currentStock = productSnap.data().stock ?? 0;
        tx.update(productRef, { stock: currentStock + item.qty });
      }
    }

    tx.update(orderRef, {
      status: "cancelled",
      cancelReason: reason || null,
      cancelledBy: caller.uid,
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  });
});