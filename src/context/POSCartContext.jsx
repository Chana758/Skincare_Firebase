// src/context/POSCartContext.jsx
import { createContext, useContext, useState, useMemo, useCallback } from "react";

const POSCartContext = createContext(null);

export const POSCartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  // discount: { code, rate, type } -> type អាចជា "percentage" ឬ "fixed"
  const [discount, setDiscount] = useState(null);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      qty < 1 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const applyDiscount = useCallback((code, rate, type = "percentage") => {
    setDiscount({ code, rate, type });
  }, []);

  const clearDiscount = useCallback(() => setDiscount(null), []);

  const clearSale = useCallback(() => {
    setItems([]);
    setDiscount(null);
  }, []);

  const { subtotal, discountAmount, discountLabel, total, totalItems } = useMemo(() => {
    const sub = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    let disc = 0;
    let label = "0%";

    if (discount && sub > 0) {
      if (discount.type === "fixed") {
        disc = Math.min(discount.rate, sub); // ការពារកុំឱ្យបញ្ចុះលើសទឹកប្រាក់ទំនិញសរុប
        label = discount.code; 
      } else {
        disc = sub * discount.rate;
        label = `${Math.round(discount.rate * 100)}%`;
      }
    }

    return {
      subtotal: sub,
      discountAmount: disc,
      discountLabel: label,
      total: Math.max(0, sub - disc),
      totalItems: items.reduce((sum, i) => sum + i.qty, 0),
    };
  }, [items, discount]);

  const value = useMemo(
    () => ({
      items, discount, subtotal, discountAmount, discountLabel, total, totalItems,
      addItem, removeItem, updateQty, applyDiscount, clearDiscount, clearSale,
    }),
    [items, discount, subtotal, discountAmount, discountLabel, total, totalItems, addItem, removeItem, updateQty, applyDiscount, clearDiscount, clearSale]
  );

  return <POSCartContext.Provider value={value}>{children}</POSCartContext.Provider>;
};

export const usePOSCart = () => {
  const ctx = useContext(POSCartContext);
  if (!ctx) throw new Error("usePOSCart ត្រូវប្រើនៅក្នុង <POSCartProvider> តែប៉ុណ្ណោះ");
  return ctx;
};