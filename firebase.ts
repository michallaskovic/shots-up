// src/services/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from "@firebase/app";
import { getAuth, type Auth } from "@firebase/auth";
import { getFirestore, type Firestore } from "@firebase/firestore";
import { getDatabase, type Database } from "@firebase/database"; // 

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ",
    databaseURL: "" // 
};

// Singleton instances
let services: { app: FirebaseApp; auth: Auth; db: Firestore; realtime: Database } | null = null;

// This function ensures Firebase is only initialized once, on demand.
export const getFirebaseServices = () => {
    if (!services) {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const auth = getAuth(app);
        const db = getFirestore(app);
        const realtime = getDatabase(app); 
        services = { app, auth, db, realtime };
    }
    return services;
};
