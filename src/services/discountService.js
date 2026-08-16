// src/services/discountService.js
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

/** Discount docs are keyed by their UPPERCASE code, e.g. discounts/GLOW10 */
export function subscribeDiscounts(callback) {
  return onSnapshot(collection(db, "discounts"), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function upsertDiscount({ code, rate, active = true, expiresAt = null }) {
  const id = code.trim().toUpperCase();
  return setDoc(doc(db, "discounts", id), {
    code: id,
    rate: Number(rate),
    active,
    expiresAt,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDiscount(code) {
  return deleteDoc(doc(db, "discounts", code.toUpperCase()));
}

/** Client-side pre-check before calling createOrder — server re-validates anyway. */
export async function validateDiscountCode(code) {
  if (!code) return null;
  const snap = await getDoc(doc(db, "discounts", code.trim().toUpperCase()));
  if (!snap.exists()) return null;
  const d = snap.data();
  if (!d.active) return null;
  if (d.expiresAt && d.expiresAt.toMillis() < Date.now()) return null;
  return d;
}