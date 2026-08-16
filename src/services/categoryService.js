// src/services/categoryService.js
import {
  collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

/** Live-subscribes to the categories collection, ordered by `order` field. */
export function subscribeCategories(callback) {
  return onSnapshot(collection(db, "categories"), (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    callback(list);
  });
}

export async function fetchCategoriesOnce() {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** id is a slug like "serum", "cleanser" — used in URLs (?category=serum) and product.category field. */
export async function upsertCategory({ id, name, image, order = 0 }) {
  const slug = id.trim().toLowerCase().replace(/\s+/g, "-");
  return setDoc(doc(db, "categories", slug), {
    name: name.trim(),
    image: image.trim(),
    order: Number(order),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(id) {
  return deleteDoc(doc(db, "categories", id));
}