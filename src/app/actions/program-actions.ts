"use server";

import { revalidatePath } from "next/cache";
import { checkAdminAuth } from "@/app/actions/admin-actions";
import {
  saveProgramApplication,
  getProgramApplications,
  deleteProgramApplication,
  getProgramSettings,
  updateProgramSettings,
  updateApplicationStatus,
  ProgramApplicationRecord,
  ProgramSettings
} from "@/lib/programs-db";
import { sanitizeString } from "@/lib/security";

export async function submitProgramApplicationAction(record: ProgramApplicationRecord) {
  try {
    const res = await saveProgramApplication(record);
    revalidatePath("/devtechprogramsadmin");
    revalidatePath("/devtechprograms-admin");
    return res;
  } catch (err: any) {
    console.error("[ProgramAction] Submit error:", err);
    return { success: false, error: err?.message || "Failed to submit application." };
  }
}

export async function getProgramAdminDashboardDataAction() {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) {
    return {
      success: false,
      error: "Unauthorized access. Please login as Admin.",
      applications: [],
      settings: null
    };
  }

  try {
    const applications = await getProgramApplications();
    const settings = await getProgramSettings();
    return { success: true, applications, settings };
  } catch (err) {
    console.error("[ProgramAction] Dashboard data error:", err);
    return { success: false, error: "Failed to load program applications.", applications: [], settings: null };
  }
}

export async function getPublicProgramSettingsAction() {
  try {
    const settings = await getProgramSettings();
    return { success: true, settings };
  } catch (err) {
    console.error("[ProgramAction] Get public settings error:", err);
    return { success: false, error: "Failed to load settings" };
  }
}

export async function updateProgramSettingsAction(settings: ProgramSettings) {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) return { success: false, error: "Unauthorized access." };

  try {
    const res = await updateProgramSettings(settings);
    revalidatePath("/devtechprograms");
    revalidatePath("/devtechprogramsadmin");
    revalidatePath("/devtechprograms-admin");
    return res;
  } catch (err: any) {
    console.error("[ProgramAction] Update settings error:", err);
    return { success: false, error: err?.message || "Failed to save settings." };
  }
}

export async function updateApplicationStatusAction(id: string, status: ProgramApplicationRecord["status"]) {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) return { success: false, error: "Unauthorized access." };

  const cleanId = sanitizeString(id);
  if (!cleanId) return { success: false, error: "Invalid application ID." };

  try {
    const res = await updateApplicationStatus(cleanId, status);
    revalidatePath("/devtechprogramsadmin");
    revalidatePath("/devtechprograms-admin");
    return res;
  } catch (err: any) {
    console.error("[ProgramAction] Update status error:", err);
    return { success: false, error: err?.message || "Failed to update status." };
  }
}

export async function deleteProgramApplicationAction(id: string) {
  const isAuthenticated = await checkAdminAuth();
  if (!isAuthenticated) return { success: false, error: "Unauthorized access." };

  const cleanId = sanitizeString(id);
  if (!cleanId) return { success: false, error: "Invalid application ID." };

  try {
    const res = await deleteProgramApplication(cleanId);
    revalidatePath("/devtechprogramsadmin");
    revalidatePath("/devtechprograms-admin");
    return { success: res.success, error: res.success ? undefined : "Failed to delete record." };
  } catch (err: any) {
    console.error("[ProgramAction] Delete error:", err);
    return { success: false, error: err?.message || "Failed to delete record." };
  }
}
