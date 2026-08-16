
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { products as staticProducts } from "../data/products";

/**
 * Copies the hard-coded `products` array (src/data/products.js) into the
 * Firestore "products" collection — run this ONCE to migrate your data.
 *
 * Usage: temporarily import + call it from a page you control while
 * logged in as an admin, e.g. a button in the Admin Dashboard:
 *
 *   import { seedProducts } from "../../utils/seedProducts";
 *   <button onClick={seedProducts}>Import Sample Products</button>
 *
 * Remove the button/import afterwards so it can't be run again by accident.
 */
export async function seedProducts() {
  const existing = await getDocs(collection(db, "products"));
  if (!existing.empty) {
    const proceed = window.confirm(
      `Firestore already has ${existing.size} product(s). Import the sample data anyway?`
    );
    if (!proceed) return;
  }

  for (const { id, ...product } of staticProducts) {
    await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
    });
  }

  window.alert(`Imported ${staticProducts.length} products into Firestore.`);
}