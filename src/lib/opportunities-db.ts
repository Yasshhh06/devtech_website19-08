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
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
    }
    fs.accessSync(DB_FILE, fs.constants.W_OK);
    return DB_FILE;
  } catch {
    if (!fs.existsSync(TMP_FILE)) {
      fs.writeFileSync(TMP_FILE, JSON.stringify([], null, 2), "utf-8");
    }
    return TMP_FILE;
  }
}

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "job-fullstack-dev",
    title: "Full Stack Developer",
    department: "Engineering",
    type: "Job",
    employmentType: "Full-Time",
    experience: "1-3 Years / Freshers",
    location: "Hybrid / Remote",
    description: "Join our core engineering team building scalable web & cloud applications using React, Next.js, Node.js, and modern databases.",
    slug: "full-stack-developer",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "job-frontend-dev",
    title: "Frontend Developer",
    department: "Engineering",
    type: "Job",
    employmentType: "Full-Time",
    experience: "1-2 Years / Freshers",
    location: "Hybrid / Remote",
    description: "Craft modern, responsive, high-performance web user interfaces using React, Next.js, TypeScript, and Tailwind CSS.",
    slug: "frontend-developer",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "job-backend-dev",
    title: "Backend Developer",
    department: "Engineering",
    type: "Job",
    employmentType: "Full-Time",
    experience: "1-3 Years / Freshers",
    location: "Hybrid / Remote",
    description: "Design and construct resilient REST APIs, microservices, and database systems with Node.js, Express, PostgreSQL, and Firebase.",
    slug: "backend-developer",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "intern-uiux-designer",
    title: "UI/UX Designer",
    department: "Design & Media",
    type: "Internship",
    employmentType: "Internship",
    experience: "Student / Intern",
    location: "Remote / Hybrid",
    description: "Design intuitive user journeys, interactive wireframes, and modern visual UI mockups in Figma for live client projects.",
    slug: "ui-ux-designer-intern",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

/**
 * Fetch all opportunities from Firebase Firestore (if configured) or local storage
 */
export async function getOpportunities(): Promise<Opportunity[]> {
  const map = new Map<string, Opportunity>();

  // 1. Initialize map with initial default opportunities
  INITIAL_OPPORTUNITIES.forEach(opp => {
    map.set(opp.id, opp);
  });

  // 2. Merge local storage file
  try {
    const filePath = getStoragePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        parsed.forEach((item: Opportunity) => {
          if (item && item.id) {
            map.set(item.id, item);
          }
        });
      }
    }
  } catch (error) {
    console.error("[OpportunitiesDB] Error reading storage:", error);
  }

  // 3. Merge Firebase Firestore collection & sync missing initial items
  if (db && isFirebaseConfigured()) {
    try {
      const colRef = collection(db, "opportunities");
      const snapshot = await getDocs(colRef);
      const existingDocIds = new Set<string>();

      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Opportunity;
        const docId = data.id || docSnap.id;
        if (data && docId) {
          existingDocIds.add(docId);
          map.set(docId, { ...data, id: docId });
        }
      });

      // Sync any missing INITIAL_OPPORTUNITIES to Firestore
      for (const initialOpp of INITIAL_OPPORTUNITIES) {
        if (!existingDocIds.has(initialOpp.id)) {
          try {
            const docRef = doc(db, "opportunities", initialOpp.id);
            await setDoc(docRef, initialOpp);
            console.log(`🔥 [Firebase Firestore] Synced default opportunity: ${initialOpp.id}`);
          } catch (syncErr) {
            console.warn("⚠️ Syncing initial opp to Firestore error:", syncErr);
          }
        }
      }
    } catch (firebaseErr) {
      console.warn("⚠️ [Firebase Opportunities Warning] Error reading from Firestore:", firebaseErr);
    }
  }

  const result = Array.from(map.values());
  
  // Persist updated merged array to local storage file
  try {
    const filePath = getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf-8");
  } catch (err) {
    console.warn("[OpportunitiesDB] Error saving merged opportunities to disk:", err);
  }

  return result;
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
  const index = all.findIndex(o => o.id === id || o.slug === id);
  if (index === -1) return { success: false };

  const targetId = all[index].id || id;
  const currentStatus = all[index].status || "Active";
  const newStatus = currentStatus === "Active" ? "Closed" : "Active";
  all[index].status = newStatus;
  all[index].updatedAt = new Date().toISOString();

  if (db && isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "opportunities", targetId);
      await setDoc(docRef, { status: newStatus, updatedAt: all[index].updatedAt }, { merge: true });
    } catch (err) {
      console.warn("⚠️ [Firebase] Failed to toggle opportunity in Firestore:", err);
    }
  }

  try {
    const filePath = getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(all, null, 2), "utf-8");
  } catch (err) {
    console.warn("[OpportunitiesDB] Storage file write error:", err);
  }
  return { success: true, newStatus };
}

/**
 * Delete an opportunity by ID
 */
export async function deleteOpportunity(id: string): Promise<{ success: boolean }> {
  const all = await getOpportunities();
  const targetDoc = all.find(o => o.id === id || o.slug === id);
  const targetId = targetDoc ? targetDoc.id : id;

  const filtered = all.filter(o => o.id !== targetId && o.slug !== targetId && o.id !== id);

  if (db && isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "opportunities", targetId);
      await deleteDoc(docRef);
      if (targetId !== id) {
        await deleteDoc(doc(db, "opportunities", id));
      }
      console.log(`🔥 [Firebase] Deleted opportunity from Firestore: ${targetId}`);
    } catch (err) {
      console.warn("⚠️ [Firebase] Failed to delete opportunity from Firestore:", err);
    }
  }

  try {
    const filePath = getStoragePath();
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf-8");
  } catch (err) {
    console.warn("[OpportunitiesDB] Storage file write error:", err);
  }

  return { success: true };
}
