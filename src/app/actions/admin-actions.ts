"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getOpportunities, saveOpportunity, toggleOpportunityStatus, deleteOpportunity, Opportunity } from "@/lib/opportunities-db";
import { getCareerApplications, ApplicationRecord } from "@/lib/db";
import { getContactInquiries, ContactInquiryRecord } from "@/lib/contact-db";
import { seedFirebaseCollections } from "@/lib/seed-firebase";

const TARGET_ADMIN_EMAIL = "yashm@gmail.com";
const TARGET_ADMIN_PASS = "Yash@#06";
const SESSION_COOKIE_NAME = "devtech_admin_session";
const SESSION_SECRET_TOKEN = "DEVTECH_SECURE_ADMIN_AUTH_TOKEN_2026_V1";

export async function loginAdmin(formData: FormData) {
  try {
    const username = (formData.get("username") as string || "").trim().toLowerCase();
    const password = (formData.get("password") as string || "").trim();

    const envUser = (process.env.ADMIN_USERNAME || TARGET_ADMIN_EMAIL).trim().toLowerCase();
    const envPass = (process.env.ADMIN_PASSWORD || TARGET_ADMIN_PASS).trim();

    const isValidUser = username === TARGET_ADMIN_EMAIL || username === envUser;
    const isValidPass = password === TARGET_ADMIN_PASS || password === envPass;

    if (isValidUser && isValidPass) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, SESSION_SECRET_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 Days
      });

      return { success: true };
    }

    return { success: false, error: "Invalid admin username or password. Access denied." };
  } catch (err) {
    console.error("[AdminAction] loginAdmin error:", err);
    return { success: false, error: "System error during authentication login." };
  }
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch (err) {
    console.error("[AdminAction] logoutAdmin error:", err);
    return { success: false };
  }
}

export async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return session === SESSION_SECRET_TOKEN;
  } catch {
    return false;
  }
}

export async function getAdminDashboardDataAction() {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) {
    return { success: false, error: "Unauthorized access. Please login as Admin.", opportunities: [], applications: [], inquiries: [] };
  }

  try {
    let opportunities = await getOpportunities();
    let applications = await getCareerApplications();
    let inquiries = await getContactInquiries();

    // Auto-seed Firebase Firestore if applications or inquiries are empty
    if (applications.length === 0 || inquiries.length === 0) {
      await seedFirebaseCollections();
      opportunities = await getOpportunities();
      applications = await getCareerApplications();
      inquiries = await getContactInquiries();
    }

    return { success: true, opportunities, applications, inquiries };
  } catch (err) {
    console.error("[AdminAction] getAdminDashboardData error:", err);
    return { success: false, error: "Failed to load dashboard data.", opportunities: [], applications: [], inquiries: [] };
  }
}

export async function saveOpportunityAction(formData: FormData) {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) return { success: false, error: "Unauthorized." };

  try {
    const id = (formData.get("id") as string) || undefined;
    const title = (formData.get("title") as string) || "";
    const department = (formData.get("department") as string) || "Engineering";
    const type = (formData.get("type") as "Job" | "Internship") || "Job";
    const employmentType = (formData.get("employmentType") as string) || "Full-Time";
    const experience = (formData.get("experience") as string) || "Fresher";
    const location = (formData.get("location") as string) || "Remote";
    const description = (formData.get("description") as string) || "";
    const status = (formData.get("status") as "Active" | "Closed") || "Active";

    if (!title.trim()) return { success: false, error: "Title is required." };
    if (!description.trim()) return { success: false, error: "Description is required." };

    const res = await saveOpportunity({
      id,
      title,
      department,
      type,
      employmentType,
      experience,
      location,
      description,
      status
    });

    revalidatePath("/careers");
    revalidatePath("/careers/apply");
    revalidatePath("/admin");

    return { success: true, opportunity: res.opportunity };
  } catch (err: any) {
    console.error("[AdminAction] saveOpportunityAction error:", err);
    return { success: false, error: err?.message || "Failed to save opportunity." };
  }
}

export async function toggleOpportunityStatusAction(id: string) {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) return { success: false, error: "Unauthorized." };

  try {
    const res = await toggleOpportunityStatus(id);
    if (res.success) {
      revalidatePath("/careers");
      revalidatePath("/careers/apply");
      revalidatePath("/admin");
    }
    return res;
  } catch (err) {
    console.error("[AdminAction] toggleOpportunityStatusAction error:", err);
    return { success: false, error: "Failed to toggle status." };
  }
}

export async function deleteOpportunityAction(id: string) {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) return { success: false, error: "Unauthorized." };

  try {
    const res = await deleteOpportunity(id);
    if (res.success) {
      revalidatePath("/careers");
      revalidatePath("/careers/apply");
      revalidatePath("/admin");
    }
    return res;
  } catch (err) {
    console.error("[AdminAction] deleteOpportunityAction error:", err);
    return { success: false, error: "Failed to delete opportunity." };
  }
}
