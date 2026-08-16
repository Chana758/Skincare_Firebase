const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

/**
 * Callable: admin-only. Creates a new Firebase Auth user + Firestore profile
 * with a specific role (staff or admin) in one step.
 *
 * client call: httpsCallable(functions, "createStaffUser")({ name, email, password, role })
 */
exports.createStaffUser = onCall(async (request) => {
  const caller = request.auth;
  if (!caller) throw new HttpsError("unauthenticated", "Login required.");
  if (caller.token.role !== "admin") {
    throw new HttpsError("permission-denied", "Only admins can create staff accounts.");
  }

  const { name, email, password, role } = request.data || {};
  if (!name || !email || !password || !["staff", "admin"].includes(role)) {
    throw new HttpsError("invalid-argument", "name, email, password, and a valid role are required.");
  }
  if (password.length < 6) {
    throw new HttpsError("invalid-argument", "Password must be at least 6 characters.");
  }

  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });

  await admin.auth().setCustomUserClaims(userRecord.uid, { role });

  await admin.firestore().doc(`users/${userRecord.uid}`).set({
    name,
    email,
    role,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: caller.uid,
    wishlist: [],
  });

  return { success: true, uid: userRecord.uid };
});