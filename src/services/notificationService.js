
import {
  collection, addDoc, doc, updateDoc, deleteDoc, getDocs,
  onSnapshot, query, orderBy, limit, where, serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Writes a lightweight notification whenever an order is placed — powers
 * the bell icon in AdminLayout/StaffLayout. Non-blocking: callers already
 * wrap this in try/catch so a notification failure never breaks a sale.
 */
export async function createOrderNotification({ orderId, total, method, source }) {
  return addDoc(collection(db, "notifications"), {
    type: "order",
    orderId,
    total: Number(total) || 0,
    method,
    source, // "pos" | "online"
    read: false,
    createdAt: serverTimestamp(),
  });
}

/** Live-subscribes to the most recent notifications, newest first. */
export function subscribeNotifications(callback, max = 20) {
  const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(max));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function markNotificationRead(id) {
  return updateDoc(doc(db, "notifications", id), { read: true });
}

/**
 * Marks every currently-unread notification as read in one batch write —
 * used by the bell icon's "mark all as read" action.
 */
export async function markAllNotificationsRead() {
  const q = query(collection(db, "notifications"), where("read", "==", false));
  const snap = await getDocs(q);
  if (snap.empty) return;

  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
  await batch.commit();
}

export async function deleteNotification(id) {
  return deleteDoc(doc(db, "notifications", id));
}