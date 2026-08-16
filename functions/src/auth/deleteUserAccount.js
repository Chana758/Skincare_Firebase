const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

/**
 * Callable: admin-only. Deletes a Firebase Auth user + their Firestore profile.
 * Admins cannot delete their own account through this function (safety guard).
 *
 * client call: httpsCallable(functions, "deleteUserAccount")({ uid })
 */
exports.deleteUserAccount = onCall(async (request) => {
  const caller = request.auth;
  if (!caller) throw new HttpsError("unauthenticated", "Login required.");
  if (caller.token.role !== "admin") {
    throw new HttpsError("permission-denied", "Only admins can delete accounts.");
  }

  const { uid } = request.data || {};
  if (!uid) throw new HttpsError("invalid-argument", "uid is required.");
  if (uid === caller.uid) {
    throw new HttpsError("failed-precondition", "You cannot delete your own account.");
  }

  await admin.auth().deleteUser(uid);
  await admin.firestore().doc(`users/${uid}`).delete();

  return { success: true };
});