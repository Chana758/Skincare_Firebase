import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * ASSUMPTION: each product document has a `barcode` field (string).
 * If your product schema uses a different field name (e.g. `sku`, `code`),
 * rename it below — this also checks `sku` and falls back to the
 * document `id` itself, so scanning a product's own Firestore ID also works.
 */
export function findProductByBarcode(products, scannedCode) {
  if (!scannedCode || !Array.isArray(products)) return null;
  const code = scannedCode.trim();
  return (
    products.find(
      (p) =>
        (p.barcode && String(p.barcode).trim() === code) ||
        (p.sku && String(p.sku).trim() === code) ||
        p.id === code
    ) || null
  );
}

/** Live-subscribes to the products collection. */
export function subscribeProducts(callback) {
  return onSnapshot(collection(db, "products"), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function fetchProductsOnce() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProduct(product) {
  return addDoc(collection(db, "products"), {
    ...product,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id, updates) {
  return updateDoc(doc(db, "products", id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, "products", id));
}