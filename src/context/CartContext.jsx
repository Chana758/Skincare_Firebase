import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const LOCAL_KEY = "lumiere_cart";
const mergedFlagKey = (uid) => `lumiere_cart_merged_${uid}`;

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const mergeInFlightRef = useRef(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  }, [items]);

  // Merge Firestore cart with local cart on login
  useEffect(() => {
    if (!currentUser) {
      setIsInitialized(false);
      return;
    }

    const flagKey = mergedFlagKey(currentUser.uid);
    if (localStorage.getItem(flagKey) || mergeInFlightRef.current) {
      setIsInitialized(true);
      return;
    }

    mergeInFlightRef.current = true;
    localStorage.setItem(flagKey, "true");

    (async () => {
      try {
        const cartRef = doc(db, "carts", currentUser.uid);
        const snap = await getDoc(cartRef);
        if (snap.exists() && snap.data().items?.length) {
          setItems((prev) => {
            const merged = [...snap.data().items];
            prev.forEach((p) => {
              const found = merged.find((m) => m.id === p.id);
              if (found) found.qty += p.qty;
              else merged.push(p);
            });
            return merged;
          });
        }
      } catch (err) {
        console.error("Cart merge failed:", err);
      } finally {
        mergeInFlightRef.current = false;
        setIsInitialized(true);
      }
    })();
  }, [currentUser]);

  // Persist to Firestore only AFTER initialization completes
  useEffect(() => {
    if (!currentUser || !isInitialized) return;
    const cartRef = doc(db, "carts", currentUser.uid);
    setDoc(cartRef, { items, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
  }, [items, currentUser, isInitialized]);

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image || "", qty }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { totalItems, totalPrice } = useMemo(
    () => ({
      totalItems: items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    [items]
  );

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }),
    [items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart ត្រូវប្រើនៅក្នុង <CartProvider> តែប៉ុណ្ណោះ");
  return ctx;
};