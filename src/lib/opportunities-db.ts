import fs from "fs";
import path from "path";
import { Opportunity as BaseOpportunity } from "./careers-data";
import { getMongoDb, isMongoDbConfigured } from "@/lib/mongodb";

export interface Opportunity extends BaseOpportunity {
  status?: "Active" | "Closed";
  createdAt?: string;
  updatedAt?: string;
}

const COLLECTION_NAME = "career_opportunities";
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
    description: "Design and construct resilient REST APIs, microservices, and database systems with Node.js, Express, PostgreSQL, and MongoDB.",
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
 * Fetch all opportunities from MongoDB (if configured) OR local storage fallback
 */
export async function getOpportunities(): Promise<Opportunity[]> {
  const map = new Map<string, Opportunity>();

  // 1. Initialize map with default initial opportunities
  INITIAL_OPPORTUNITIES.forEach(item => {
    map.set(item.id, item);
  });

  // 2. Read local JSON storage
  try {
    const file = getStoragePath();
    if (fs.existsSync(file)) {
      const localList: Opportunity[] = JSON.parse(fs.readFileSync(file, "utf-8"));
      if (Array.isArray(localList)) {
        localList.forEach(item => {
          if (item && item.id) map.set(item.id, item);
        });
      }
    }
  } catch (err) {
    console.error("[OpportunitiesDB] Error reading local file:", err);
  }

  // 3. Fetch from MongoDB (if configured)
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const docs = await db.collection<Opportunity>(COLLECTION_NAME).find({}).toArray();
        docs.forEach(doc => {
          if (doc && doc.id) {
            map.set(doc.id, doc);
          }
        });
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to fetch opportunities from MongoDB:", err);
    }
  }

  const result = Array.from(map.values());
  result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return result;
}

/**
 * Get active opportunities only
 */
export async function getActiveOpportunities(): Promise<Opportunity[]> {
  const all = await getOpportunities();
  return all.filter(o => (o.status || "Active") === "Active");
}

/**
 * Save opportunity to MongoDB & local JSON fallback
 */
export async function saveOpportunity(opp: Partial<Opportunity>): Promise<{ success: boolean; id: string; opportunity: Opportunity }> {
  const now = new Date().toISOString();

  const fullOpp: Opportunity = {
    id: opp.id || `opp_${Date.now()}`,
    title: opp.title || "New Opportunity",
    department: opp.department || "Engineering",
    type: opp.type || "Job",
    employmentType: opp.employmentType || "Full-Time",
    experience: opp.experience || "Fresher",
    location: opp.location || "Remote",
    description: opp.description || "",
    slug: opp.slug || (opp.title ? opp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : `opp-${Date.now()}`),
    status: opp.status || "Active",
    createdAt: opp.createdAt || now,
    updatedAt: now,
  };

  // 1. Save to MongoDB
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const cleanRecord = JSON.parse(JSON.stringify(fullOpp));
        await db.collection<Opportunity>(COLLECTION_NAME).updateOne(
          { id: fullOpp.id },
          { $set: cleanRecord },
          { upsert: true }
        );
        console.log(`🌱 [MongoDB] Saved career opportunity: ${fullOpp.id}`);
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to save opportunity to MongoDB:", err);
    }
  }

  // 2. Save locally
  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let list: Opportunity[] = [];
    try {
      list = JSON.parse(data);
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }

    const idx = list.findIndex(o => o.id === fullOpp.id);
    if (idx >= 0) {
      list[idx] = fullOpp;
    } else {
      list.unshift(fullOpp);
    }
    fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
    return { success: true, id: fullOpp.id, opportunity: fullOpp };
  } catch (err) {
    console.error("[OpportunitiesDB] Error saving local opportunity:", err);
    return { success: true, id: fullOpp.id, opportunity: fullOpp };
  }
}

/**
 * Toggle opportunity status (Active <-> Closed)
 */
export async function toggleOpportunityStatus(id: string): Promise<{ success: boolean; newStatus?: "Active" | "Closed" }> {
  const opps = await getOpportunities();
  const target = opps.find(o => o.id === id);
  if (!target) return { success: false };

  const newStatus = target.status === "Closed" ? "Active" : "Closed";
  target.status = newStatus;
  target.updatedAt = new Date().toISOString();

  await saveOpportunity(target);
  return { success: true, newStatus };
}

/**
 * Delete opportunity from MongoDB & local JSON fallback
 */
export async function deleteOpportunity(id: string): Promise<{ success: boolean }> {
  // 1. Delete from MongoDB
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection(COLLECTION_NAME).deleteOne({ id: id });
        console.log(`🌱 [MongoDB] Deleted opportunity: ${id}`);
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to delete opportunity from MongoDB:", err);
    }
  }

  // 2. Delete locally
  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let list: Opportunity[] = [];
    try {
      list = JSON.parse(data);
    } catch {
      list = [];
    }
    list = list.filter(o => o.id !== id);
    fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[OpportunitiesDB] Error deleting local opportunity:", err);
  }

  return { success: true };
}
