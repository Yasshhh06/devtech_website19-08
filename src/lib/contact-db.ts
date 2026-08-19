import fs from "fs";
import path from "path";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, query, orderBy } from "firebase/firestore";

export interface ContactInquiryRecord {
  id: string;
  submittedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  ip?: string;
  userAgent?: string;
  status?: "New" | "Contacted" | "Closed";
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "contact_inquiries.json");
const TMP_FILE = path.join("/tmp", "contact_inquiries.json");

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
 * Save client contact form inquiry to Firebase Firestore AND local file fallback
 */
export async function saveContactInquiry(record: ContactInquiryRecord): Promise<{ success: boolean; id: string }> {
  if (db && isFirebaseConfigured()) {
    try {
      const docRef = doc(db, "contact_inquiries", record.id);
      await setDoc(docRef, record);
      console.log(`🔥 [Firebase Firestore] Saved contact inquiry: ${record.id}`);
    } catch (firebaseErr) {
      console.warn("⚠️ [Firebase] Failed to write contact inquiry to Firestore:", firebaseErr);
    }
  }

  try {
    const file = getStoragePath();
    const data = fs.readFileSync(file, "utf-8");
    let list: ContactInquiryRecord[] = [];
    try {
      list = JSON.parse(data);
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }
    list.unshift(record);
    fs.writeFileSync(file, JSON.stringify(list, null, 2), "utf-8");
    return { success: true, id: record.id };
  } catch (error) {
    console.error("[ContactDB] Error saving inquiry:", error);
    return { success: true, id: record.id };
  }
}

/**
 * Read client contact form inquiries from Firestore or local fallback
 */
export async function getContactInquiries(): Promise<ContactInquiryRecord[]> {
  if (db && isFirebaseConfigured()) {
    try {
      const colRef = collection(db, "contact_inquiries");
      const snapshot = await getDocs(colRef);
      const list: ContactInquiryRecord[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as ContactInquiryRecord;
        if (data && data.id) {
          list.push(data);
        }
      });
      list.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
      if (list.length > 0) {
        return list;
      }
    } catch (firebaseErr) {
      console.warn("⚠️ [Firebase] Failed to read contact inquiries from Firestore:", firebaseErr);
    }
  }

  try {
    const file = getStoragePath();
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch (error) {
    console.error("[ContactDB] Error reading inquiries:", error);
    return [];
  }
}
