import { db, isFirebaseConfigured } from "./firebase";
import { INITIAL_OPPORTUNITIES } from "./opportunities-db";
import { doc, setDoc } from "firebase/firestore";

export async function seedFirebaseCollections() {
  if (!db || !isFirebaseConfigured()) {
    return { success: false, message: "Firebase not configured" };
  }

  try {
    for (const opp of INITIAL_OPPORTUNITIES) {
      const docRef = doc(db, "opportunities", opp.id);
      await setDoc(docRef, opp, { merge: true });
    }
    return { success: true, message: "Firebase collections seeded with initial job opportunities" };
  } catch (err: any) {
    console.error("[SeedFirebase] Error seeding collections:", err);
    return { success: false, message: err?.message || "Failed to seed collections" };
  }
}
