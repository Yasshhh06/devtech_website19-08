import fs from "fs";
import path from "path";
import { CURRENT_OPPORTUNITIES, Opportunity as BaseOpportunity } from "./careers-data";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from "firebase/firestore";

export interface Opportunity extends BaseOpportunity {
  status?: "Active" | "Closed";
  createdAt?: string;
  updatedAt?: string;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "opportunities.json");
const TMP_FILE = path.join("/tmp", "opportunities.json");

function getStoragePath(): string {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialData: Opportunity[] = CURRENT_OPPORTUNITIES.map(op => ({
        ...op,
        status: "Active",
        createdAt: new Date().toISOString()
      }));
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    }
    fs.accessSync(DB_FILE, fs.constants.W_OK);
    return DB_FILE;
  } catch {
    if (!fs.existsSync(TMP_FILE)) {
      const initialData: Opportunity[] = CURRENT_OPPORTUNITIES.map(op => ({
        ...op,
        status: "Active",
        createdAt: new Date().toISOString()
      }));
      fs.writeFileSync(TMP_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    }
    return TMP_FILE;
  }
}

/**
 * Fetch all opportunities from Firebase Firestore (if configured) or local storage
 */
export async function getOpportunities(): Promise<Opportunity[]> {
  if (db && isFirebaseConfigured()) {
    try {
      const colRef = collection(db, "opportunities");
      const snapshot = await getDocs(colRef);
      const items: Opportunity[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Opportunity);
      });
      if (items.length > 0) {
        return items;
      }

      // Check if storage file exists before auto-seeding
      const filePath = path.join(process.cwd(), "data", "opportunities.json");
      if (fs.existsSync(filePath)) {
        return items; // User deleted all items or database is intentionally empty
      }

      // Seed initial opportunities to Firestore if collection is empty and file doesn't exist
      console.log("🔥 [Firebase] Firestore collection 'opportunities' is empty. Auto-seeding initial openings...");
      const seedItems: Opportunity[] = CURRENT_OPPORTUNITIES.map(op => ({
        ...op,
        status: "Active",
        createdAt: new Date().toISOString()
      }));
      for (const item of seedItems) {
        try {
          await setDoc(doc(db, "opportunities", item.id), item);
        } catch (sErr) {
          console.warn(`Failed to seed ${item.id} to Firestore:`, sErr);
        }
      }
      return seedItems;
    } catch (firebaseErr) {
      console.warn("⚠️ [Firebase Opportunities Warning] Error reading from Firestore:", firebaseErr);
    }
  }

  // Local fallback
  try {
    const filePath = getStoragePath();
    const content = fs.readFileSync(filePath, "utf-8");
    let items: Opportunity[] = JSON.parse(content);
    if (!Array.isArray(items)) {
      items = CURRENT_OPPORTUNITIES.map(op => ({
        ...op,
        status: "Active",
        createdAt: new Date().toISOString()
      }));
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
    }
    return items;
  } catch (error) {
    console.error("[OpportunitiesDB] Error reading storage:", error);
    return CURRENT_OPPORTUNITIES.map(op => ({ ...op, status: "Active" }));
  }
}

/**
 * Fetch active opportunities for public display
 */
export async function getActiveOpportunities(): Promise<Opportunity[]> {
  const all = await getOpportunities();
  return all.filter(op => op.status !== "Closed");
}

/**
 * Create or update an opportunity in Firestore and local storage
 */
export async function saveOpportunity(data: Partial<Opportunity>): Promise<{ success: boolean; opportunity: Opportunity }> {
  const all = await getOpportunities();
  const now = new Date().toISOString();

  let target: Opportunity;
  if (data.id) {
    const index = all.findIndex(o => o.id === data.id);
    if (index !== -1) {
      target = {
        ...all[index],
        ...data,
        updatedAt: now,
      } as Opportunity;
      all[index] = target;
    } else {
      target = {
        id: data.id,
        title: data.title || "Untitled Role",
        department: data.department || "Engineering",
        type: data.type || "Job",
        employmentType: data.employmentType || "Full-Time",
        experience: data.experience || "1+ Years",
        location: data.location || "Remote",
        description: data.description || "",
        slug: data.slug || (data.title || "role").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        status: data.status || "Active",
        createdAt: now,
        updatedAt: now,
      };
      all.unshift(target);
    }
  } else {
    const slugBase = (data.title || "new-opening").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    target = {
      id: `${data.type === "Internship" ? "intern" : "job"}-${Date.now()}`,
      title: data.title || "New Position",
      department: data.department || "Engineering",
      type: data.type || "Job",
      employmentType: data.employmentType || "Full-Time",
      experience: data.experience || "Freshers / Experienced",
      location: data.location || "Remote",
      description: data.description || "",
      slug: `${slugBase}-${Math.floor(100 + Math.random() * 900)}`,
      status: data.status || "Active",
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(target);
  }

  // Write to Firebase Firestore if configured
  if (db && isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "opportunities", target.id);
      await setDoc(docRef, target);
      console.log(`🔥 [Firebase Firestore] Saved opportunity: ${target.id}`);
    } catch (err) {
      console.warn("⚠️ [Firebase] Failed to save opportunity to Firestore:", err);
    }
  }

  const filePath = getStoragePath();
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2), "utf-8");
  return { success: true, opportunity: target };
}

/**
 * Toggle opportunity active/closed status
 */
export async function toggleOpportunityStatus(id: string): Promise<{ success: boolean; newStatus?: string }> {
  const all = await getOpportunities();
  const index = all.findIndex(o => o.id === id);
  if (index === -1) return { success: false };

  const currentStatus = all[index].status || "Active";
  const newStatus = currentStatus === "Active" ? "Closed" : "Active";
  all[index].status = newStatus;
  all[index].updatedAt = new Date().toISOString();

  if (db && isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "opportunities", id);
      await setDoc(docRef, { status: newStatus, updatedAt: all[index].updatedAt }, { merge: true });
    } catch (err) {
      console.warn("⚠️ [Firebase] Failed to toggle opportunity in Firestore:", err);
    }
  }

  const filePath = getStoragePath();
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2), "utf-8");
  return { success: true, newStatus };
}

/**
 * Delete an opportunity by ID
 */
export async function deleteOpportunity(id: string): Promise<{ success: boolean }> {
  const all = await getOpportunities();
  const filtered = all.filter(o => o.id !== id);
  if (filtered.length === all.length) return { success: false };

  if (db && isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "opportunities", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("⚠️ [Firebase] Failed to delete opportunity from Firestore:", err);
    }
  }

  const filePath = getStoragePath();
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf-8");
  return { success: true };
}
