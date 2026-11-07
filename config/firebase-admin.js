const { initializeApp, applicationDefault, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

function getCredential() {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawServiceAccount) return applicationDefault();

  try {
    return cert(JSON.parse(rawServiceAccount));
  } catch (error) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON doit contenir un JSON de compte de service valide.", { cause: error });
  }
}

const firebaseAdmin = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: getCredential() });

const adminAuth = getAuth(firebaseAdmin);

module.exports = { adminAuth };
