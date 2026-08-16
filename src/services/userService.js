
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth, createUserWithEmailAndPassword, updateProfile, signOut,
} from "firebase/auth";
import { doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import app from "../firebase/config";

export const USER_ROLES = ["customer", "staff", "admin"];

export async function setUserRole(uid, role) {
  if (!USER_ROLES.includes(role)) {
    throw new Error(`Invalid role: ${role}`);
  }
  return updateDoc(doc(db, "users", uid), {
    role,
    roleUpdatedAt: serverTimestamp(),
  });
}

export async function createStaffUser({ name, email, password, role }) {
  if (!USER_ROLES.includes(role) || role === "customer") {
    throw new Error("Role must be 'staff' or 'admin'.");
  }

  const secondaryApp = initializeApp(app.options, `secondary-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const { user } = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    await updateProfile(user, { displayName: name });

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      createdAt: serverTimestamp(),
    });

    await signOut(secondaryAuth);

    return { uid: user.uid };
  } finally {
    await deleteApp(secondaryApp).catch(() => {});
  }
}

export async function deleteUserAccount(uid) {
  return deleteDoc(doc(db, "users", uid));
}