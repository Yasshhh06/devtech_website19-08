import fs from "fs";
import path from "path";
import { getMongoDb, isMongoDbConfigured } from "@/lib/mongodb";

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

const COLLECTION_NAME = "contact_inquiries";
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
 * Save client contact form inquiry to MongoDB & local file fallback
 */
export async function saveContactInquiry(record: ContactInquiryRecord): Promise<{ success: boolean; id: string }> {
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const cleanRecord = JSON.parse(JSON.stringify(record));
        await db.collection<ContactInquiryRecord>(COLLECTION_NAME).updateOne(
          { id: record.id },
          { $set: cleanRecord },
          { upsert: true }
        );
        console.log(`🌱 [MongoDB] Saved contact inquiry: ${record.id}`);
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to save contact inquiry to MongoDB:", err);
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
 * Read client contact form inquiries from MongoDB or local fallback
 */
export async function getContactInquiries(): Promise<ContactInquiryRecord[]> {
  const map = new Map<string, ContactInquiryRecord>();

  // 1. Read local storage inquiries first
  try {
    const file = getStoragePath();
    if (fs.existsSync(file)) {
      const localList: ContactInquiryRecord[] = JSON.parse(fs.readFileSync(file, "utf-8"));
      if (Array.isArray(localList)) {
        localList.forEach(item => {
          if (item && item.id) map.set(item.id, item);
        });
      }
    }
  } catch (err) {
    console.error("[ContactDB] Error reading local inquiries:", err);
  }

  // 2. Read MongoDB inquiries and merge
  if (isMongoDbConfigured()) {
    try {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection<ContactInquiryRecord>(COLLECTION_NAME);
        const docs = await collection.find({}).sort({ submittedAt: -1 }).toArray();
        docs.forEach(doc => {
          if (doc && doc.id) {
            map.set(doc.id, doc);
          }
        });
      }
    } catch (err) {
      console.warn("⚠️ [MongoDB Warning] Failed to read contact inquiries from MongoDB:", err);
    }
  }

  const result = Array.from(map.values());
  result.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
  return result;
}
