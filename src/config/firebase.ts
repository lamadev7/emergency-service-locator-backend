import admin from "firebase-admin";

const serviceAccount = require("../../public/firebaseServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DB_URL,
});

export const db = admin.database();
