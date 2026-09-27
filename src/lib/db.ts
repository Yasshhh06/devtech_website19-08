import fs from "fs";
import path from "path";
import { getMongoDb, isMongoDbConfigured } from "@/lib/mongodb";

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
  // 1. Save to MongoDB if configured
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection<ApplicationRecord>(COLLECTION_NAME);
        const cleanRecord = JSON.parse(JSON.stringify(record));
        await collection.updateOne(
          { id: record.id },
          { $set: cleanRecord },
          { upsert: true }
        );
        console.log(`🌱 [MongoDB] Saved career application: ${record.id}`);
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

    const idx = list.findIndex(a => a.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record);
    }
    fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
    return { success: true, id: record.id };
  } catch (error) {
    console.error("[CareerDB] Error saving local record:", error);
    return { success: true, id: record.id };
  }
}

/**
 * Fetch all candidate application records from MongoDB OR local JSON fallback
 */
export async function getCareerApplications(): Promise<ApplicationRecord[]> {
  const map = new Map<string, ApplicationRecord>();

  // 1. Read local storage first
  try {
    const file = getStoragePath();
    if (fs.existsSync(file)) {
      const localList: ApplicationRecord[] = JSON.parse(fs.readFileSync(file, "utf-8"));
      if (Array.isArray(localList)) {
        localList.forEach(item => {
          if (item && item.id) map.set(item.id, item);
        });
      }
    }
  } catch (err) {
    console.error("[CareerDB] Error reading local applications:", err);
  }

  // 2. Read MongoDB applications and merge
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection<ApplicationRecord>(COLLECTION_NAME);
        const docs = await collection.find({}).sort({ submittedAt: -1 }).toArray();
        docs.forEach(doc => {
          if (doc && doc.id) {
            const localItem = map.get(doc.id);
            map.set(doc.id, {
              ...doc,
              documents: {
                ...doc.documents,
                resumeDataUrl: localItem?.documents?.resumeDataUrl || doc.documents?.resumeDataUrl,
              }
            });
          }
        });
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to read career applications from MongoDB:", err);
    }
  }

  const result = Array.from(map.values());
  result.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
  return result;
}
