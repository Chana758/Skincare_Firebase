import {
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const ORDER_STATUSES = [
  "awaiting_payment", "pending", "processing", "paid",
  "shipped", "delivered", "completed", "cancelled",
];

/** Used by OrdersAdmin.jsx to change an order's status. Staff/admin only per firestore.rules. */
export async function updateOrderStatus(orderId, status) {
  return updateDoc(doc(db, "orders", orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Cancels an order and restores stock for every item, atomically, via a
 * client-side Firestore transaction. Allowed for: the order's own
 * customer (while still pending/awaiting_payment, per firestore.rules),
 * or staff/admin at any time.
 */
export async function cancelOrder(orderId, reason) {
  return runTransaction(db, async (tx) => {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists()) throw new Error("Order not found.");

    const order = orderSnap.data();
    if (order.status === "cancelled") return;

    const productRefs = (order.items || []).map((i) => doc(db, "products", i.id));
    const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));

    productSnaps.forEach((snap, i) => {
      if (snap.exists()) {
        tx.update(productRefs[i], { stock: increment(order.items[i].qty) });
      }
    });

    tx.update(orderRef, {
      status: "cancelled",
      cancelReason: reason || null,
      cancelledAt: serverTimestamp(),
    });
  });
}

/** Hard-delete — admin-only per firestore.rules. */
export async function deleteOrder(orderId) {
  return deleteDoc(doc(db, "orders", orderId));
}