
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Load this user's saved favorites from Firestore whenever they log in;
  // clear them from state whenever they log out (nothing shown to guests).
  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }
    (async () => {
      const snap = await getDoc(doc(db, "favorites", currentUser.uid));
      setFavorites(snap.exists() ? snap.data().items || [] : []);
    })();
  }, [currentUser]);

  const persist = useCallback(
    (items) => {
      if (!currentUser) return;
      setDoc(doc(db, "favorites", currentUser.uid), { items }, { merge: true }).catch(() => {});
    },
    [currentUser]
  );

  const isFavorite = useCallback(
    (productId) => favorites.some((p) => p.id === productId),
    [favorites]
  );

  // Only ever called after the UI has confirmed currentUser exists (see ProductCard)
  const toggleFavorite = useCallback(
    (product) => {
      setFavorites((prev) => {
        const next = prev.some((p) => p.id === product.id)
          ? prev.filter((p) => p.id !== product.id)
          : [...prev, product];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFavorite = useCallback(
    (productId) => {
      setFavorites((prev) => {
        const next = prev.filter((p) => p.id !== productId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, isFavorite, toggleFavorite, removeFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites ត្រូវប្រើនៅក្នុង <FavoritesProvider> តែប៉ុណ្ណោះ");
  return ctx;
};