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
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // "customer" | "staff" | "admin"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // អាន role  bezpośred ទាញយកពី Firestore Document (users/{uid}) ផ្ទាល់ ដើម្បីធានាថាបានទិន្នន័យចុងក្រោយបង្អស់
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists() && snap.data().role) {
            setRole(snap.data().role);
          } else {
            setRole("customer");
          }
        } catch (err) {
          console.error("Error fetching user role from Firestore:", err);
          setRole("customer");
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    
    try {
      await setDoc(doc(db, "users", user.uid), {
        name, 
        email, 
        role: "customer",
        createdAt: serverTimestamp(), 
        wishlist: [],
      });
    } catch (err) {
      console.error("Error creating user profile document in Firestore:", err);
    }
    
    return user;
  }, []);

  const login = useCallback((email, password) => signInWithEmailAndPassword(auth, email, password), []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    const userRef = doc(db, "users", user.uid);
    
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: user.displayName, 
          email: user.email, 
          role: "customer",
          createdAt: serverTimestamp(), 
          wishlist: [],
        });
      }
    } catch (err) {
      console.error("Error checking/creating Google user profile:", err);
    }
    
    return user;
  }, []);

  const resetPassword = useCallback((email) => sendPasswordResetEmail(auth, email), []);
  const logout = useCallback(() => signOut(auth), []);

  const refreshRole = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      setRole(snap.exists() ? snap.data().role || "customer" : "customer");
    } catch (err) {
      console.error("Error refreshing role:", err);
    }
  }, []);

  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const isStaffOrAdmin = isAdmin || isStaff;

  const value = useMemo(
    () => ({
      currentUser, role, isAdmin, isStaff, isStaffOrAdmin, loading,
      register, login, loginWithGoogle, resetPassword, logout, refreshRole,
    }),
    [currentUser, role, isAdmin, isStaff, isStaffOrAdmin, loading, register, login, loginWithGoogle, resetPassword, logout, refreshRole]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth ត្រូវប្រើនៅក្នុង <AuthProvider> តែប៉ុណ្ណោះ");
  return ctx;
};