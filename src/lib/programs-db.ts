import fs from "fs";
import path from "path";
import { getMongoDb, isMongoDbConfigured } from "@/lib/mongodb";
import { sanitizeString } from "@/lib/security";

export interface ProgramRoleSetting {
  id: string;
  title: string;
  dept: string;
  type: string;
  fee?: number;
  active: boolean;
}

export interface ProgramSettings {
  defaultFee: number;
  currency: string;
  roles: ProgramRoleSetting[];
}

export interface ProgramApplicationRecord {
  id: string;
  submittedAt: string;
  role: string;
  status?: "SUBMITTED" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "ENROLLED" | "REJECTED";
  personalInfo: {
    fullName: string;
    email: string;
    mobile: string;
    city: string;
  };
  experience: {
    level: "Fresher" | "Experienced";
    totalExperience?: string;
    noticePeriod: string;
    currentCompany?: string;
    currentDesignation?: string;
    currentCTC?: string;
    expectedCTC?: string;
  };
  academic: {
    qualification: string;
    college: string;
    graduationYear: string;
  };
  skills: string[];
  proficiency: "Beginner" | "Intermediate" | "Advanced";
  documents: {
    resumeName: string;
    resumeSize: number;
    resumeType?: string;
    resumeDataUrl?: string;
  };
  profiles: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    codingProfile?: string;
  };
  screening: {
    aboutYourself: string;
    proudProject: string;
    whyJoin: string;
    whyHire: string;
  };
  joining: {
    whenCanJoin: string;
    hearAboutUs?: string;
  };
  digitalSignature: string;
  paymentInfo: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
    amount: number;
    currency: string;
    status: "PAID" | "PENDING" | "FAILED";
    paidAt?: string;
  };
}

const COLLECTION_NAME = "program_applications";
const SETTINGS_COLLECTION = "program_settings";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "program_applications.json");
const SETTINGS_FILE = path.join(DB_DIR, "program_settings.json");

const DEFAULT_PROGRAM_ROLES: ProgramRoleSetting[] = [
  { id: "fullstack", title: "Full Stack Developer Intern", dept: "Engineering", type: "Full-Time / Part-Time", fee: 499, active: true },
  { id: "frontend", title: "Frontend Developer Intern (React / Next.js)", dept: "Frontend Engineering", type: "Full-Time", fee: 499, active: true },
  { id: "backend", title: "Backend Engineer Intern (Node / Python / Java)", dept: "Backend Engineering", type: "Full-Time", fee: 499, active: true },
  { id: "ai_ml", title: "AI & Machine Learning Engineer Intern", dept: "AI Innovation Lab", type: "Full-Time", fee: 499, active: true },
  { id: "cloud_devops", title: "Cloud & DevOps Specialist Intern", dept: "Infrastructure", type: "Full-Time", fee: 499, active: true },
  { id: "cyber_sec", title: "Cyber Security Analyst Intern", dept: "Security & Operations", type: "Full-Time", fee: 499, active: true },
  { id: "mobile_app", title: "Mobile App Developer Intern (Flutter / React Native)", dept: "Mobile Engineering", type: "Full-Time", fee: 499, active: true },
  { id: "ui_ux", title: "UI/UX Product Designer Intern", dept: "Product Design", type: "Full-Time", fee: 499, active: true },
  { id: "qa_automation", title: "QA & Software Automation Testing Intern", dept: "Quality Assurance", type: "Full-Time", fee: 499, active: true }
];

const DEFAULT_SETTINGS: ProgramSettings = {
  defaultFee: 499,
  currency: "INR",
  roles: DEFAULT_PROGRAM_ROLES
};

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
    const tmp = path.join("/tmp", "program_applications.json");
    if (!fs.existsSync(tmp)) {
      fs.writeFileSync(tmp, JSON.stringify([], null, 2), "utf-8");
    }
    return tmp;
  }
}

/**
 * Fetch Program Settings (Default fee & Role list with editable fees)
 */
export async function getProgramSettings(): Promise<ProgramSettings> {
  // 1. Try reading from MongoDB
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const doc = await db.collection(SETTINGS_COLLECTION).findOne({ _id: "main_settings" as any });
        if (doc && doc.settings) {
          return doc.settings as ProgramSettings;
        }
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to read program settings:", err);
    }
  }

  // 2. Local File Fallback
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.defaultFee === "number" && Array.isArray(parsed.roles)) {
        return parsed as ProgramSettings;
      }
    }
  } catch (err) {
    console.error("[ProgramsDB] Error reading local settings:", err);
  }

  return DEFAULT_SETTINGS;
}

/**
 * Update Program Settings (Edit Fees & Roles from Admin)
 */
export async function updateProgramSettings(settings: ProgramSettings): Promise<{ success: boolean; error?: string }> {
  // 1. Save to MongoDB
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection(SETTINGS_COLLECTION).updateOne(
          { _id: "main_settings" as any },
          { $set: { settings, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
        console.log("⚙️ [MongoDB] Updated program settings and fees.");
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to update program settings:", err);
    }
  }

  // 2. Save locally
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
    return { success: true };
  } catch (err: any) {
    console.error("[ProgramsDB] Error saving local program settings:", err);
    return { success: false, error: err?.message || "Failed to save settings locally." };
  }
}

/**
 * Save candidate application record
 */
export async function saveProgramApplication(record: ProgramApplicationRecord): Promise<{ success: boolean; id: string }> {
  const cleanId = sanitizeString(record.id);
  if (!cleanId) return { success: false, id: "" };

  const sanitizedRecord: ProgramApplicationRecord = {
    ...record,
    id: cleanId,
    status: record.status || "SUBMITTED",
    personalInfo: {
      fullName: sanitizeString(record.personalInfo?.fullName),
      email: sanitizeString(record.personalInfo?.email),
      mobile: sanitizeString(record.personalInfo?.mobile),
      city: sanitizeString(record.personalInfo?.city),
    },
  };

  // Save to MongoDB
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection<ProgramApplicationRecord>(COLLECTION_NAME);
        const cleanRecord = JSON.parse(JSON.stringify(sanitizedRecord));
        await collection.updateOne(
          { id: cleanId },
          { $set: cleanRecord },
          { upsert: true }
        );
        console.log(`🌱 [MongoDB] Saved application: ${cleanId}`);
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to save application to MongoDB:", err);
    }
  }

  // Save to Local JSON fallback
  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let apps: ProgramApplicationRecord[] = [];
    try {
      apps = JSON.parse(data);
      if (!Array.isArray(apps)) apps = [];
    } catch {
      apps = [];
    }

    const idx = apps.findIndex(a => a.id === cleanId);
    if (idx >= 0) {
      apps[idx] = sanitizedRecord;
    } else {
      apps.push(sanitizedRecord);
    }
    fs.writeFileSync(file, JSON.stringify(apps, null, 2), "utf-8");
    return { success: true, id: cleanId };
  } catch (error) {
    console.error("[ProgramsDB] Error saving local record:", error);
    return { success: true, id: cleanId };
  }
}

/**
 * Update payment status
 */
export async function updateProgramPaymentStatus(
  id: string,
  paymentDetails: {
    orderId: string;
    paymentId: string;
    signature?: string;
    amount: number;
    status: "PAID" | "FAILED";
  }
): Promise<{ success: boolean }> {
  const cleanId = sanitizeString(id);
  const cleanOrderId = sanitizeString(paymentDetails.orderId);
  const cleanPaymentId = sanitizeString(paymentDetails.paymentId);
  const cleanSignature = sanitizeString(paymentDetails.signature);
  const paidAt = new Date().toISOString();

  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection(COLLECTION_NAME).updateOne(
          { $or: [{ id: cleanId }, { "paymentInfo.orderId": cleanOrderId }] },
          {
            $set: {
              "paymentInfo.orderId": cleanOrderId,
              "paymentInfo.paymentId": cleanPaymentId,
              "paymentInfo.signature": cleanSignature,
              "paymentInfo.amount": paymentDetails.amount,
              "paymentInfo.status": paymentDetails.status,
              "paymentInfo.paidAt": paidAt,
            }
          }
        );
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to update payment in MongoDB:", err);
    }
  }

  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let apps: ProgramApplicationRecord[] = [];
    try {
      apps = JSON.parse(data);
      if (!Array.isArray(apps)) apps = [];
    } catch {
      apps = [];
    }

    const idx = apps.findIndex(a => a.id === cleanId || a.paymentInfo?.orderId === cleanOrderId);
    if (idx >= 0) {
      apps[idx].paymentInfo = {
        ...apps[idx].paymentInfo,
        orderId: cleanOrderId,
        paymentId: cleanPaymentId,
        signature: cleanSignature,
        amount: paymentDetails.amount,
        status: paymentDetails.status,
        paidAt: paidAt
      };
      fs.writeFileSync(file, JSON.stringify(apps, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[ProgramsDB] Error updating payment status locally:", err);
  }

  return { success: true };
}

/**
 * Update candidate application status from Admin
 */
export async function updateApplicationStatus(id: string, status: ProgramApplicationRecord["status"]): Promise<{ success: boolean; error?: string }> {
  const cleanId = sanitizeString(id);
  if (!cleanId) return { success: false, error: "Invalid ID" };

  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection(COLLECTION_NAME).updateOne(
          { id: cleanId },
          { $set: { status: status } }
        );
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to update status in MongoDB:", err);
    }
  }

  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let apps: ProgramApplicationRecord[] = [];
    try {
      apps = JSON.parse(data);
      if (!Array.isArray(apps)) apps = [];
    } catch {
      apps = [];
    }

    const idx = apps.findIndex(a => a.id === cleanId);
    if (idx >= 0) {
      apps[idx].status = status;
      fs.writeFileSync(file, JSON.stringify(apps, null, 2), "utf-8");
    }
    return { success: true };
  } catch (err: any) {
    console.error("[ProgramsDB] Error updating status locally:", err);
    return { success: false, error: err?.message || "Failed to update status." };
  }
}

/**
 * Get all applications
 */
export async function getProgramApplications(): Promise<ProgramApplicationRecord[]> {
  const map = new Map<string, ProgramApplicationRecord>();

  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection<ProgramApplicationRecord>(COLLECTION_NAME);
        const docs = await collection.find({}).sort({ submittedAt: -1 }).toArray();
        docs.forEach(doc => {
          if (doc && doc.id) {
            map.set(doc.id, doc);
          }
        });
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to read program applications from MongoDB:", err);
    }
  }

  try {
    const file = getStoragePath();
    if (fs.existsSync(file)) {
      const list: ProgramApplicationRecord[] = JSON.parse(fs.readFileSync(file, "utf-8"));
      if (Array.isArray(list)) {
        list.forEach(item => {
          if (item && item.id) {
            const mongoItem = map.get(item.id);
            if (!mongoItem) {
              map.set(item.id, item);
            } else {
              map.set(item.id, {
                ...mongoItem,
                documents: {
                  ...mongoItem.documents,
                  resumeDataUrl: item.documents?.resumeDataUrl || mongoItem.documents?.resumeDataUrl,
                }
              });
            }
          }
        });
      }
    }
  } catch (err) {
    console.error("[ProgramsDB] Error reading local applications:", err);
  }

  const result = Array.from(map.values());
  result.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
  return result;
}

/**
 * Delete application record
 */
export async function deleteProgramApplication(id: string): Promise<{ success: boolean }> {
  const cleanId = sanitizeString(id);
  if (!cleanId) return { success: false };

  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection(COLLECTION_NAME).deleteOne({ id: cleanId });
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to delete from MongoDB:", err);
    }
  }

  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let apps: ProgramApplicationRecord[] = [];
    try {
      apps = JSON.parse(data);
    } catch {
      apps = [];
    }
    apps = apps.filter(a => a.id !== cleanId);
    fs.writeFileSync(file, JSON.stringify(apps, null, 2), "utf-8");
  } catch (err) {
    console.error("[ProgramsDB] Error deleting local record:", err);
  }

  return { success: true };
}
