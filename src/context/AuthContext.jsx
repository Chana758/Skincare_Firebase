// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ស្តាប់ Firebase auth state - unsubscribe នៅពេល component unmount ដើម្បីជៀសវាង memory leak
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ចុះឈ្មោះថ្មី + បង្កើត profile document ក្នុង Firestore
  const register = useCallback(async ({ name, email, password }) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: serverTimestamp(),
      wishlist: [],
    });
    return user;
  }, []);

  const login = useCallback((email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        createdAt: serverTimestamp(),
        wishlist: [],
      });
    }
    return user;
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  // useMemo ការពារកុំឲ្យ context value ត្រូវបានបង្កើតឡើងវិញរាល់ render (perf optimization)
  const value = useMemo(
    () => ({ currentUser, loading, register, login, loginWithGoogle, logout }),
    [currentUser, loading, register, login, loginWithGoogle, logout]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth ត្រូវប្រើនៅក្នុង <AuthProvider> តែប៉ុណ្ណោះ");
  return ctx;
};