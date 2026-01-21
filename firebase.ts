// src/services/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from "@firebase/app";
import { getAuth, type Auth } from "@firebase/auth";
import { getFirestore, type Firestore } from "@firebase/firestore";
import { getDatabase, type Database } from "@firebase/database"; // ✅ Realtime DB import

const firebaseConfig = {
    apiKey: "AIzaSyBPwpPI2Dr_0ZIEcAmSl-ypDu8YdjfXueI",
    authDomain: "partygame-72ba0.firebaseapp.com",
    projectId: "partygame-72ba0",
    storageBucket: "partygame-72ba0.firebasestorage.app",
    messagingSenderId: "523089801881",
    appId: "1:523089801881:web:32737608ec37def316be08",
    databaseURL: "https://partygame-72ba0-default-rtdb.europe-west1.firebasedatabase.app" // ✅ Adj hozza, ha nincs
};

// Singleton instances
let services: { app: FirebaseApp; auth: Auth; db: Firestore; realtime: Database } | null = null;

// This function ensures Firebase is only initialized once, on demand.
export const getFirebaseServices = () => {
    if (!services) {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const auth = getAuth(app);
        const db = getFirestore(app);
        const realtime = getDatabase(app); // ✅ Realtime DB init
        services = { app, auth, db, realtime };
    }
    return services;
};
