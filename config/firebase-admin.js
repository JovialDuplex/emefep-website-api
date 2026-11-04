const {initializeApp, applicationDefault} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");

const firebaseAdmin = initializeApp({
    credential: applicationDefault(),
});

const adminAuth = getAuth(firebaseAdmin);

module.exports = {
    adminAuth,    
}