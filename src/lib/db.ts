import fs from "fs";
import path from "path";
import { getMongoDb, isMongoDbConfigured } from "@/lib/mongodb";
import { sanitizeString } from "@/lib/security";

export interface ApplicationRecord {
  id: string;
  submittedAt: string;
  personalInfo: {
    fullName: string;
    email: string;
    mobile: string;
    city?: string;
  };
  applicationInfo: {
    type: string;
    position: string;
    experience?: string;
    totalExperience?: string;
    currentCompany?: string;
    currentDesignation?: string;
    noticePeriod?: string;
    currentCTC?: string;
    expectedCTC?: string;
    workMode?: string;
    internshipMode?: string;
    internshipDuration?: string;
    mandatoryCollegeInternship?: string;
    dedicateHours?: string;
  };
  education: {
    highestQualification?: string;
    college?: string;
    graduationYear?: string;
    currentSemester?: string;
    cgpa?: string;
  };
  skills: string[];
  rateSkills?: string;
  portfolioLinks: {
    linkedIn?: string;
    gitHub?: string;
    portfolioWebsite?: string;
    codingProfile?: string;
  };
  documents: {
    resumeName: string;
    resumeSize: number;
    resumeType?: string;
    resumeUrl?: string;
    resumeDataUrl?: string;
  };
  screeningQuestions: {
    aboutYourself?: string;
    proudProject?: string;
    whyJoinDevTech?: string;
    whyHireYou?: string;
    technologiesLearning?: string;
    certifications?: string;
    expectToLearn?: string;
    hackathons?: string;
    freelanceProjects?: string;
    hearAboutUs?: string;
  };
  availability: string;
  digitalSignature?: string;
}

const COLLECTION_NAME = "career_applications";
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "career_applications.json");
const TMP_FILE = path.join("/tmp", "career_applications.json");

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

/**
 * Saves candidate application record to MongoDB (if configured) AND local JSON fallback
 */
export async function saveCareerApplication(record: ApplicationRecord): Promise<{ success: boolean; id: string }> {
  const cleanId = sanitizeString(record.id);
  if (!cleanId) return { success: false, id: "" };

  const sanitizedRecord: ApplicationRecord = {
    ...record,
    id: cleanId,
    personalInfo: {
      fullName: sanitizeString(record.personalInfo?.fullName),
      email: sanitizeString(record.personalInfo?.email),
      mobile: sanitizeString(record.personalInfo?.mobile),
      city: sanitizeString(record.personalInfo?.city),
    },
  };

  // 1. Save to MongoDB if configured
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection<ApplicationRecord>(COLLECTION_NAME);
        const cleanRecord = JSON.parse(JSON.stringify(sanitizedRecord));
        await collection.updateOne(
          { id: cleanId },
          { $set: cleanRecord },
          { upsert: true }
        );
        console.log(`🌱 [MongoDB] Saved career application: ${cleanId}`);
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to save career application to MongoDB:", err);
    }
  }

  // 2. Save locally
  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let list: ApplicationRecord[] = [];
    try {
      list = JSON.parse(data);
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }

    const idx = list.findIndex(a => a.id === cleanId);
    if (idx >= 0) {
      list[idx] = sanitizedRecord;
    } else {
      list.unshift(sanitizedRecord);
    }
    fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
    return { success: true, id: cleanId };
  } catch (error) {
    console.error("[CareerDB] Error saving local record:", error);
    return { success: true, id: cleanId };
  }
}

/**
 * Fetch all candidate application records from MongoDB OR local JSON fallback
 */
export async function getCareerApplications(): Promise<ApplicationRecord[]> {
  const map = new Map<string, ApplicationRecord>();

  // 1. Read MongoDB applications first if configured
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection<ApplicationRecord>(COLLECTION_NAME);
        const docs = await collection.find({}).sort({ submittedAt: -1 }).toArray();
        docs.forEach(doc => {
          if (doc && doc.id) {
            map.set(doc.id, doc);
          }
        });
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to read career applications from MongoDB:", err);
    }
  }

  // 2. Read local storage and merge missing
  try {
    const file = getStoragePath();
    if (fs.existsSync(file)) {
      const localList: ApplicationRecord[] = JSON.parse(fs.readFileSync(file, "utf-8"));
      if (Array.isArray(localList)) {
        localList.forEach(item => {
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
    console.error("[CareerDB] Error reading local applications:", err);
  }

  const result = Array.from(map.values());
  result.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
  return result;
}

/**
 * Delete career application from MongoDB & local JSON fallback
 */
export async function deleteCareerApplication(id: string): Promise<{ success: boolean }> {
  const cleanId = sanitizeString(id);
  if (!cleanId) return { success: false };

  // 1. Delete from MongoDB
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        await db.collection(COLLECTION_NAME).deleteOne({ id: cleanId });
        console.log(`🌱 [MongoDB] Deleted career application: ${cleanId}`);
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to delete career application from MongoDB:", err);
    }
  }

  // 2. Delete locally
  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let list: ApplicationRecord[] = [];
    try {
      list = JSON.parse(data);
    } catch {
      list = [];
    }
    list = list.filter(a => a.id !== cleanId);
    fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[CareerDB] Error deleting local application:", err);
  }

  return { success: true };
}
