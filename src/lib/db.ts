import fs from "fs";
import path from "path";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, query, orderBy } from "firebase/firestore";

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
 * Saves candidate application record to Firebase Firestore (if configured) AND local storage fallback
 */
export async function saveCareerApplication(record: ApplicationRecord): Promise<{ success: boolean; id: string }> {
  // 1. Try Firestore save if Firebase is configured
  if (db && isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "career_applications", record.id);
      await setDoc(docRef, record);
      console.log(`🔥 [Firebase Firestore] Successfully saved application record: ${record.id}`);
    } catch (firebaseErr) {
      console.warn("⚠️ [Firebase Firestore Warning] Failed to write to Firestore, falling back to local file:", firebaseErr);
    }
  }

  // 2. Always persist to local filesystem storage fallback
  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let applications: ApplicationRecord[] = [];
    
    try {
      applications = JSON.parse(data);
      if (!Array.isArray(applications)) applications = [];
    } catch {
      applications = [];
    }

    applications.push(record);
    fs.writeFileSync(file, JSON.stringify(applications, null, 2), "utf-8");
    return { success: true, id: record.id };
  } catch (error) {
    console.error("[Database] Error saving application record:", error);
    return { success: true, id: record.id };
  }
}

/**
 * Reads candidate application records from Firebase Firestore (if configured) or local storage
 */
export async function getCareerApplications(): Promise<ApplicationRecord[]> {
  if (db && isFirebaseConfigured()) {
    try {
      const colRef = collection(db, "career_applications");
      const q = query(colRef, orderBy("submittedAt", "desc"));
      const snapshot = await getDocs(q);
      const list: ApplicationRecord[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as ApplicationRecord);
      });
      if (list.length > 0) {
        return list;
      }
    } catch (firebaseErr) {
      console.warn("⚠️ [Firebase Firestore Warning] Failed to read from Firestore, using local fallback:", firebaseErr);
    }
  }

  // Fallback to local file storage
  try {
    const file = getStoragePath();
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch (error) {
    console.error("[Database] Error reading applications:", error);
    return [];
  }
}
