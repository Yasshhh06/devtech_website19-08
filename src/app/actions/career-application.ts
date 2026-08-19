"use server";

import { z } from "zod";
import { Resend } from "resend";
import { headers } from "next/headers";
import { saveCareerApplication, ApplicationRecord } from "@/lib/db";
import { storage, isFirebaseConfigured } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

// Rate Limiting Map
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Unified schema covering both full-time professional jobs and comprehensive internship submissions
const applicationSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().min(10, "Please enter a valid mobile number").max(20),
  city: z.string().min(1, "Please enter your current city"),
  position: z.string().min(1, "Please provide the target position"),
  employmentType: z.string().min(1, "Please provide employment type"),
  
  // Job specific vs Internship specific
  experience: z.string().optional(),
  totalExperience: z.string().optional(),
  currentCompany: z.string().optional(),
  currentDesignation: z.string().optional(),
  noticePeriod: z.string().optional(),
  currentCTC: z.string().optional(),
  expectedCTC: z.string().optional(),
  workMode: z.string().optional(),
  internshipMode: z.string().optional(),
  internshipDuration: z.string().optional(),
  mandatoryCollegeInternship: z.string().optional(),
  dedicateHours: z.string().optional(),
  
  highestQualification: z.string().optional(),
  college: z.string().optional(),
  graduationYear: z.string().optional(),
  currentSemester: z.string().optional(),
  cgpa: z.string().optional(),
  
  skills: z.string().optional(),
  rateSkills: z.string().optional(),
  
  gitHub: z.string().optional(),
  linkedIn: z.string().optional(),
  portfolioWebsite: z.string().optional(),
  codingProfile: z.string().optional(),

  aboutYourself: z.string().optional(),
  proudProject: z.string().optional(),
  whyJoinDevTech: z.string().optional(),
  whyHireYou: z.string().optional(),
  technologiesLearning: z.string().optional(),
  certifications: z.string().optional(),
  expectToLearn: z.string().optional(),
  hackathons: z.string().optional(),
  freelanceProjects: z.string().optional(),
  hearAboutUs: z.string().optional(),

  availability: z.string().min(1, "Please select availability"),
  declaration: z.string().refine((val) => val === "true", { 
    message: "You must confirm that all provided information is accurate." 
  }),
  digitalSignature: z.string().min(2, "Please type your full name as digital signature"),
});

export async function submitCareerApplication(formData: FormData) {
  try {
    // Debug: Log invocation and high-level FormData contents
    try {
      console.log("[ServerAction] submitCareerApplication invoked");
      for (const pair of formData.entries()) {
        const key = pair[0];
        const value = pair[1];
        if (typeof (value as any)?.name === "string" && typeof (value as any)?.size === "number") {
          console.log(`[ServerAction] form key=${key} (file) name=${(value as any).name} size=${(value as any).size} bytes`);
        } else {
          const strVal = String(value).slice(0, 200);
          console.log(`[ServerAction] form key=${key} value=${strVal}${String(value).length > 200 ? '...' : ''}`);
        }
      }
    } catch (dbgErr) {
      console.warn("[ServerAction] failed to inspect FormData:", dbgErr);
    }
    // 1. IP & Rate Limiting Check
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "Unknown IP";

    const now = Date.now();
    const rateLimitInfo = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    if (now - rateLimitInfo.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitInfo.count = 0;
      rateLimitInfo.lastReset = now;
    }
    if (rateLimitInfo.count >= RATE_LIMIT_MAX) {
      return { success: false, error: "Too many submissions from your device. Please try again later." };
    }
    rateLimitInfo.count += 1;
    rateLimitMap.set(ip, rateLimitInfo);

    // 2. Extract Data from FormData
    const rawData: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string" && key !== "resume") {
        rawData[key] = value;
      }
    });

    // 3. Zod Validation
    const validation = applicationSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || "Invalid input provided";
      return { success: false, error: firstError, fieldErrors };
    }

    const data = validation.data;

    // 4. Handle Resume Upload Validation (< 5MB, PDF/Word)
    const resumeFile = formData.get("resume") as File | null;
    if (!resumeFile || resumeFile.size === 0) {
      return { success: false, error: "Please upload your resume (PDF)." };
    }
    if (resumeFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "Resume file size exceeds the 5 MB limit." };
    }
    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = resumeFile.name.substring(resumeFile.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      return { success: false, error: "Please upload a valid PDF, DOC, or DOCX document for your resume." };
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse skills array
    let parsedSkills: string[] = [];
    try {
      if (data.skills) {
        parsedSkills = JSON.parse(data.skills);
      }
    } catch {
      parsedSkills = data.skills ? data.skills.split(",").map(s => s.trim()) : [];
    }

    if (parsedSkills.length === 0) {
      parsedSkills = ["Not Specified / General Applicant"];
    }

    // 5. Construct Database Record & Save Resume File
    const isInternship = data.employmentType === "Internship";
    const recordId = `${isInternship ? "INTERN" : "DEVTECH"}-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Save resume file to local storage directory as fallback
    try {
      const fs = await import("fs");
      const path = await import("path");
      const resumesDir = path.join(process.cwd(), "data", "resumes");
      if (!fs.existsSync(resumesDir)) {
        fs.mkdirSync(resumesDir, { recursive: true });
      }
      const resumeFilePath = path.join(resumesDir, `${recordId}${fileExtension}`);
      fs.writeFileSync(resumeFilePath, buffer);
    } catch (saveErr) {
      console.warn("[CareerAction] Failed to save resume file to disk:", saveErr);
    }

    // Upload resume file directly to Firebase Storage if Firebase is configured
    let firebaseResumeUrl = "";
    if (storage && isFirebaseConfigured()) {
      try {
        const storageRef = ref(storage, `resumes/${recordId}${fileExtension}`);
        const uploadResult = await uploadBytes(storageRef, new Uint8Array(buffer), {
          contentType: resumeFile.type || "application/pdf"
        });
        firebaseResumeUrl = await getDownloadURL(uploadResult.ref);
        console.log(`🔥 [Firebase Storage] Resume uploaded successfully for ${recordId}: ${firebaseResumeUrl}`);
      } catch (fbStorageErr) {
        console.warn("⚠️ [Firebase Storage Warning] Could not upload resume to Firebase Storage, using fallback:", fbStorageErr);
      }
    }
    
    const applicationRecord: ApplicationRecord = {
      id: recordId,
      submittedAt: new Date().toISOString(),
      personalInfo: {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        city: data.city,
      },
      applicationInfo: {
        type: data.employmentType,
        position: data.position,
        experience: data.experience || (isInternship ? "Intern / Student" : "Fresher"),
        totalExperience: data.totalExperience,
        currentCompany: data.currentCompany,
        currentDesignation: data.currentDesignation,
        noticePeriod: data.noticePeriod,
        currentCTC: data.currentCTC,
        expectedCTC: data.expectedCTC,
        workMode: data.workMode,
        internshipMode: data.internshipMode,
        internshipDuration: data.internshipDuration,
        mandatoryCollegeInternship: data.mandatoryCollegeInternship,
        dedicateHours: data.dedicateHours,
      },
      education: {
        highestQualification: data.highestQualification,
        college: data.college,
        graduationYear: data.graduationYear,
        currentSemester: data.currentSemester,
        cgpa: data.cgpa,
      },
      skills: parsedSkills,
      rateSkills: data.rateSkills,
      portfolioLinks: {
        gitHub: data.gitHub,
        linkedIn: data.linkedIn,
        portfolioWebsite: data.portfolioWebsite,
        codingProfile: data.codingProfile,
      },
      documents: {
        resumeName: resumeFile.name,
        resumeSize: resumeFile.size,
        resumeType: resumeFile.type || "application/pdf",
        resumeUrl: firebaseResumeUrl || `/api/resumes/${recordId}`,
        resumeDataUrl: `data:${resumeFile.type || "application/pdf"};base64,${buffer.toString("base64")}`,
      },
      screeningQuestions: {
        aboutYourself: data.aboutYourself,
        proudProject: data.proudProject,
        whyJoinDevTech: data.whyJoinDevTech,
        whyHireYou: data.whyHireYou,
        technologiesLearning: data.technologiesLearning,
        certifications: data.certifications,
        expectToLearn: data.expectToLearn,
        hackathons: data.hackathons,
        freelanceProjects: data.freelanceProjects,
        hearAboutUs: data.hearAboutUs,
      },
      availability: data.availability,
      digitalSignature: data.digitalSignature,
    };

    await saveCareerApplication(applicationRecord);

    // 6. Build HR Notification Email HTML (tailored for Internship vs Full-Time)
    const hrEmailHtml = isInternship ? `
      <div style="font-family: Arial, sans-serif; max-width: 720px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e3a8a; padding: 26px; text-align: center;">
          <span style="display: inline-block; padding: 4px 12px; background-color: #3b82f6; color: #ffffff; font-size: 11px; font-weight: bold; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Internship Candidate Dossier</span>
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">${data.position} Application</h2>
          <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 14px;">Reference ID: ${recordId}</p>
        </div>
        <div style="padding: 28px; background-color: #ffffff; color: #334155; line-height: 1.6;">
          
          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0;">1. Personal & Contact Credentials</h3>
          <p><strong>Applicant Name:</strong> ${data.fullName}</p>
          <p><strong>Email Address:</strong> <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></p>
          <p><strong>Mobile Number:</strong> ${data.mobile}</p>
          <p><strong>Current City:</strong> ${data.city}</p>

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">2. Internship Engagement Terms</h3>
          <p><strong>Target Internship Position:</strong> <span style="color: #2563eb; font-weight: bold;">${data.position}</span></p>
          <p><strong>Preferred Work Mode:</strong> ${data.internshipMode || "Not specified"}</p>
          <p><strong>Preferred Duration:</strong> ${data.internshipDuration || "Not specified"}</p>
          <p><strong>Mandatory College Internship:</strong> ${data.mandatoryCollegeInternship || "No"}</p>
          <p><strong>Earliest Start Date:</strong> ${data.availability}</p>
          <p><strong>Weekly Dedicated Hours:</strong> ${data.dedicateHours || "Full Time"}</p>

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">3. Academic Background</h3>
          <p><strong>Current Qualification:</strong> ${data.highestQualification || "N/A"}</p>
          <p><strong>College / University Name:</strong> ${data.college || "N/A"}</p>
          <p><strong>Current Year / Semester:</strong> ${data.currentSemester || "N/A"}</p>
          <p><strong>Expected Graduation Year:</strong> ${data.graduationYear || "N/A"}</p>
          <p><strong>Current CGPA / Percentage:</strong> <span style="font-weight: bold; color: #0f172a;">${data.cgpa || "N/A"}</span></p>

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">4. Technical Arsenal & Competencies</h3>
          <p><strong>Self-Rated Technical Proficiency:</strong> <span style="display: inline-block; background: #ecfdf5; color: #047857; padding: 2px 10px; border-radius: 9999px; font-weight: bold; font-size: 13px;">${data.rateSkills || "Intermediate"}</span></p>
          <p><strong>Primary Technologies & Tools:</strong></p>
          <p>${parsedSkills.map(s => `<span style="display: inline-block; background: #eff6ff; color: #1d4ed8; padding: 4px 10px; margin: 2px 4px 2px 0; border-radius: 6px; font-size: 13px; font-weight: bold;">${s}</span>`).join(" ")}</p>

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">5. Developer Profiles & Repositories</h3>
          <ul>
            ${data.gitHub ? `<li><strong>GitHub Profile:</strong> <a href="${data.gitHub}" target="_blank" style="color: #2563eb;">${data.gitHub}</a></li>` : "<li><strong>GitHub Profile:</strong> Not provided</li>"}
            ${data.linkedIn ? `<li><strong>LinkedIn Profile:</strong> <a href="${data.linkedIn}" target="_blank" style="color: #2563eb;">${data.linkedIn}</a></li>` : "<li><strong>LinkedIn:</strong> Not provided</li>"}
            ${data.portfolioWebsite ? `<li><strong>Portfolio / Live Demo:</strong> <a href="${data.portfolioWebsite}" target="_blank" style="color: #2563eb;">${data.portfolioWebsite}</a></li>` : "<li><strong>Portfolio:</strong> Not provided</li>"}
            ${data.codingProfile ? `<li><strong>Competitive Coding Profile:</strong> <a href="${data.codingProfile}" target="_blank" style="color: #2563eb;">${data.codingProfile}</a></li>` : ""}
          </ul>

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">6. Projects, Certifications & Motivation</h3>
          
          <p><strong>Proudest Academic or Personal Project:</strong></p>
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-bottom: 16px;">${data.proudProject || "None listed"}</div>

          <p><strong>Currently Learning Technologies:</strong></p>
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-bottom: 16px;">${data.technologiesLearning || "None listed"}</div>

          ${data.certifications ? `
            <p><strong>Completed Certifications (AWS, Google, Coursera, etc.):</strong></p>
            <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #10b981; margin-bottom: 16px;">${data.certifications}</div>
          ` : ""}

          <p><strong>Why do you want to intern at DevTech IT Solutions?</strong></p>
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-bottom: 16px;">${data.whyJoinDevTech || "Not answered"}</div>

          <p><strong>What do you expect to learn during this internship?</strong></p>
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-bottom: 16px;">${data.expectToLearn || "Not answered"}</div>

          <p><strong>Why should we select you for this internship?</strong></p>
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #3b82f6; margin-bottom: 16px;">${data.whyHireYou || "Not answered"}</div>

          ${(data.hackathons || data.freelanceProjects || data.hearAboutUs) ? `
            <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">7. Optional HR Screening Insights</h3>
            ${data.hackathons ? `<p><strong>Hackathons & Coding Competitions:</strong> ${data.hackathons}</p>` : ""}
            ${data.freelanceProjects ? `<p><strong>Live Client or Freelance Exposure:</strong> ${data.freelanceProjects}</p>` : ""}
            ${data.hearAboutUs ? `<p><strong>Referral / Discovery Channel:</strong> ${data.hearAboutUs}</p>` : ""}
          ` : ""}

          <div style="margin-top: 32px; padding: 16px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; font-size: 13px; color: #065f46;">
            <p style="margin: 0; font-weight: bold;">✔ Student Accuracy Declaration & Signature</p>
            <p style="margin: 6px 0 0;">The student confirmed accuracy of academic history and signed electronically as: <strong>"${data.digitalSignature}"</strong>.</p>
          </div>

          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            <p>Attached Resume: <strong>${resumeFile.name}</strong> (${Math.round(resumeFile.size / 1024)} KB PDF/Word)</p>
            <p>Submitted On: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "medium" })}</p>
          </div>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">New Talent Application (${data.employmentType})</h2>
          <p style="color: #94a3b8; margin: 6px 0 0; font-size: 14px;">Reference ID: ${recordId}</p>
        </div>
        <div style="padding: 28px; background-color: #ffffff; color: #334155; line-height: 1.6;">
          
          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0;">1. Candidate Overview & Job Details</h3>
          <p><strong>Full Name:</strong> ${data.fullName}</p>
          <p><strong>Position Applying For:</strong> <span style="color: #2563eb; font-weight: bold;">${data.position}</span></p>
          <p><strong>Employment Type:</strong> ${data.employmentType}</p>
          <p><strong>Work Mode Preferred:</strong> ${data.workMode || "Flexible / Hybrid"}</p>
          <p><strong>Experience Status:</strong> ${data.experience} ${data.totalExperience ? `(${data.totalExperience})` : ""}</p>
          ${data.currentCompany ? `<p><strong>Current Employer:</strong> ${data.currentCompany} ${data.currentDesignation ? `(${data.currentDesignation})` : ""}</p>` : ""}
          ${data.noticePeriod ? `<p><strong>Notice Period / Joining:</strong> ${data.noticePeriod}</p>` : `<p><strong>Availability to Join:</strong> ${data.availability}</p>`}
          ${(data.currentCTC || data.expectedCTC) ? `<p><strong>Compensation Details:</strong> Current CTC: ${data.currentCTC || "N/A"} | Expected CTC: ${data.expectedCTC || "N/A"}</p>` : ""}

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">2. Contact Credentials</h3>
          <p><strong>Email Address:</strong> <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></p>
          <p><strong>Mobile Number:</strong> ${data.mobile}</p>
          <p><strong>Current City:</strong> ${data.city}</p>

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">3. Academic Profile</h3>
          <p><strong>Highest Qualification:</strong> ${data.highestQualification || "N/A"}</p>
          <p><strong>College / University Name:</strong> ${data.college || "N/A"}</p>
          <p><strong>Graduation Year:</strong> ${data.graduationYear || "N/A"}</p>

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">4. Primary Skills & Expertise</h3>
          ${data.rateSkills ? `<p><strong>Self-Rated Technical Proficiency:</strong> <span style="display: inline-block; background: #ecfdf5; color: #047857; padding: 2px 10px; border-radius: 9999px; font-weight: bold; font-size: 13px;">${data.rateSkills}</span></p>` : ""}
          <p>${parsedSkills.map(s => `<span style="display: inline-block; background: #eff6ff; color: #1d4ed8; padding: 4px 10px; margin: 2px 4px 2px 0; border-radius: 6px; font-size: 13px; font-weight: bold;">${s}</span>`).join(" ")}</p>

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">5. Portfolio & Profiles</h3>
          <ul>
            ${data.gitHub ? `<li><strong>GitHub Profile:</strong> <a href="${data.gitHub}" target="_blank" style="color: #2563eb;">${data.gitHub}</a></li>` : "<li><strong>GitHub Profile:</strong> Not specified</li>"}
            ${data.linkedIn ? `<li><strong>LinkedIn Profile:</strong> <a href="${data.linkedIn}" target="_blank" style="color: #2563eb;">${data.linkedIn}</a></li>` : "<li><strong>LinkedIn Profile:</strong> Not specified</li>"}
            ${data.portfolioWebsite ? `<li><strong>Portfolio / Live Project Link:</strong> <a href="${data.portfolioWebsite}" target="_blank" style="color: #2563eb;">${data.portfolioWebsite}</a></li>` : "<li><strong>Portfolio Link:</strong> Not specified</li>"}
          </ul>

          <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">6. Screening Responses</h3>
          
          <p><strong>Tell us about yourself in 2–3 sentences:</strong></p>
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #2563eb; margin-bottom: 16px;">${data.aboutYourself || "N/A"}</div>

          <p><strong>Describe one project you're proud of:</strong></p>
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #2563eb; margin-bottom: 16px;">${data.proudProject || "N/A"}</div>

          <p><strong>Why do you want to join DevTech IT Solutions Pvt. Ltd.?</strong></p>
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #2563eb; margin-bottom: 16px;">${data.whyJoinDevTech || "N/A"}</div>

          <p><strong>Why should we hire you?</strong></p>
          <div style="background: #f8fafc; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #2563eb; margin-bottom: 16px;">${data.whyHireYou || "N/A"}</div>

          <div style="margin-top: 32px; padding: 16px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; font-size: 13px; color: #065f46;">
            <p style="margin: 0; font-weight: bold;">✔ Candidate Declaration & Digital Signature</p>
            <p style="margin: 6px 0 0;">The applicant confirmed accuracy of all facts and electronically signed as: <strong>"${data.digitalSignature}"</strong>.</p>
          </div>

          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            <p>Attached Resume: <strong>${resumeFile.name}</strong> (${Math.round(resumeFile.size / 1024)} KB PDF/Word)</p>
            <p>Submitted On: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "medium" })}</p>
          </div>
        </div>
      </div>
    `;

    // 7. Build Candidate Confirmation Email HTML
    const candidateEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Application Successfully Received! 🎉</h2>
        </div>
        <div style="padding: 28px; background-color: #ffffff; color: #334155; line-height: 1.6;">
          <p>Dear <strong>${data.fullName}</strong>,</p>
          <p>Thank you for applying to <strong>DevTech IT Solutions Pvt. Ltd.</strong> for the role of <strong>${data.position}</strong> (${data.employmentType}).</p>
          <p>We have successfully registered your application profile and attached resume under Reference ID: <code>${recordId}</code>.</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #0f172a; font-weight: 500;">Our recruitment experts will carefully examine your academic background, coding portfolio, and enthusiasm to learn and innovate. We aim to respond to shortlisted candidates within <strong>3–7 working days</strong>.</p>
          </div>
          <p>We appreciate your drive to grow and innovate with DevTech!</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>Talent Acquisition Team</strong><br/>DevTech IT Solutions Pvt. Ltd.</p>
        </div>
      </div>
    `;

    // 6. Persist Candidate Profile & Resume to DB Storage (< 10ms execution)
    await saveCareerApplication(applicationRecord);

    // 7. Non-blocking Background Email Dispatch (Runs asynchronously in background so submit is INSTANT!)
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_dummy") {
      void (async () => {
        try {
          let senderEmail = process.env.RESEND_FROM_EMAIL || "DevTech Careers <onboarding@resend.dev>";
          if (senderEmail.includes("@devtechitsolution.com")) {
            senderEmail = "DevTech Careers <onboarding@resend.dev>";
          }
          const hrRecipient = process.env.HR_EMAIL || "hr@devtechitsolution.com";

          const { error: hrError } = await resend.emails.send({
            from: senderEmail,
            to: hrRecipient,
            replyTo: data.email,
            subject: `New ${data.employmentType} Application: ${data.fullName} – ${data.position}`,
            html: hrEmailHtml,
            attachments: [{ filename: resumeFile.name, content: buffer }],
          });

          if (hrError) {
            console.warn("⚠️ [Resend HR Dispatch Warning]:", hrError.message || hrError);
          } else {
            console.log(`✔ [Email Service] HR email dispatched to ${hrRecipient} for ${data.fullName} (${recordId})`);
          }

          await resend.emails.send({
            from: senderEmail,
            to: data.email,
            subject: `We've received your application for ${data.position} | DevTech IT Solutions`,
            html: candidateEmailHtml,
          }).catch(err => console.warn("⚠️ [Resend Candidate Dispatch Warning]:", err));

        } catch (emailErr) {
          console.warn("⚠️ [Background Email Dispatch Error]:", emailErr);
        }
      })();
    }

    // Always return success instantly to applicant since dossier & resume are saved in Admin DB
    return { success: true, recordId };
  } catch (error) {
    console.error("Server Action Submission Error:", error);
    return { success: false, error: "An unexpected system error occurred during submission. Please try again." };
  }
}
