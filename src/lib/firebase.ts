import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAi59Xhsd4ClQp-yN5rWGR9qh9vG_rSwLU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "devtechwebsite-2e505.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "devtechwebsite-2e505",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "devtechwebsite-2e505.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "447881496135",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:447881496135:web:3059ab971febe132921362",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-489X43228E",
};

export const isFirebaseConfigured = (): boolean => {
  const apiKey = firebaseConfig.apiKey;
  const projectId = firebaseConfig.projectId;
  return Boolean(
    apiKey &&
    projectId &&
    apiKey !== "your_firebase_api_key_here" &&
    projectId !== "your_project_id"
  );
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    if (typeof window !== "undefined") {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      });
    }
  } catch (error) {
    console.warn("[Firebase] Firebase initialization skipped or invalid config:", error);
  }
}

export { app, db, storage, analytics };

