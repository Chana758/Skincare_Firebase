
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Streams the "products" collection from Firestore in real time.
 * Any add/edit/delete made in the Admin console shows up here instantly,
 * with no page refresh needed.
 *
 * const { products, loading } = useProducts();
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load products:", error);
        setLoading(false);
      }
    );
    return unsubscribe; // stop listening when the component unmounts
  }, []);

  return { products, loading };
}