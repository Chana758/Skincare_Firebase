// src/hooks/useCategories.js
import { useEffect, useState } from "react";
import { subscribeCategories } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeCategories((data) => {
      setCategories(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { categories, loading };
}