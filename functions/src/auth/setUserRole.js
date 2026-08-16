// functions/src/auth/setUserRole.js
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

const ALLOWED_ROLES = ["customer", "staff", "admin"];

exports.setUserRole = onCall(async (request) => {
  const caller = request.auth;
  if (!caller) throw new HttpsError("unauthenticated", "Login required.");
  if (caller.token.role !== "admin") {
    throw new HttpsError("permission-denied", "Only admins can change roles.");
  }

  const { uid, role } = request.data || {};
  if (!uid || !ALLOWED_ROLES.includes(role)) {
    throw new HttpsError("invalid-argument", "uid and a valid role are required.");
  }

  await admin.auth().setCustomUserClaims(uid, { role });
  await admin.firestore().doc(`users/${uid}`).set(
    { role, roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );

  return { success: true, uid, role };
});