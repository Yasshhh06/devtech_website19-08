"use server";

import { z } from "zod";
import { Resend } from "resend";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

// Rate Limiting Setup
// Using a global map to track requests per IP.
// Note: In a serverless environment (like Vercel), this state is lost on cold boots,
// but it still provides basic protection against rapid, consecutive spam from a single instance.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 5; // Max 5 requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address").max(100),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  honeypot: z.string().max(0, "Invalid submission"), // Must be empty
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactForm(data: ContactFormData) {
  try {
    // 1. Get request headers for IP and User Agent
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "Unknown IP";
    const userAgent = headersList.get("user-agent") || "Unknown Browser";

    // 2. Rate Limiting Check
    const now = Date.now();
    const rateLimitInfo = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - rateLimitInfo.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitInfo.count = 0;
      rateLimitInfo.lastReset = now;
    }

    if (rateLimitInfo.count >= RATE_LIMIT_MAX) {
      return { success: false, error: "Too many requests. Please try again later." };
    }

    rateLimitInfo.count += 1;
    rateLimitMap.set(ip, rateLimitInfo);

    // 3. Validation
    const validatedData = contactSchema.safeParse(data);

    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Invalid form data. Please check your inputs.",
        fieldErrors: validatedData.error.flatten().fieldErrors
      };
    }

    // 4. Honeypot check (Bot protection)
    if (validatedData.data.honeypot.length > 0) {
      // Silently reject if honeypot is filled
      return { success: true }; 
    }

    const { firstName, lastName, email, message } = validatedData.data;
    const currentDateTime = new Date().toLocaleString("en-US", { 
      timeZone: "Asia/Kolkata",
      dateStyle: "full", 
      timeStyle: "long" 
    });

    // 5. Build HTML Email Template
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Form Submission</h2>
        </div>
        <div style="padding: 32px; background-color: #ffffff;">
          <p style="color: #475569; font-size: 16px; margin-top: 0;">You have received a new inquiry from the DevTech IT Solution website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 140px;"><strong>Name</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;"><strong>Work Email</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; vertical-align: top;"><strong>Project Details</strong></td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #0f172a; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8;">
            <p style="margin: 4px 0;"><strong>Submitted On:</strong> ${currentDateTime}</p>
            <p style="margin: 4px 0;"><strong>Visitor IP:</strong> ${ip}</p>
            <p style="margin: 4px 0;"><strong>Browser:</strong> ${userAgent}</p>
            <p style="margin: 4px 0;"><strong>Source:</strong> Website Contact Form</p>
          </div>
        </div>
      </div>
    `;

    // 6. Send Email using Resend
    if (process.env.RESEND_API_KEY) {
      const { error } = await resend.emails.send({
        from: "DevTech Website <onboarding@resend.dev>", // Needs verified domain in prod, onboarding@resend.dev works for testing to your own email
        to: "support@devtechitsolution.com",
        replyTo: email,
        subject: "New Business Inquiry – DevTech IT Solution",
        html: htmlEmail,
      });

      if (error) {
        console.error("Resend Error:", error);
        return { success: false, error: "Failed to send message. Please try again later." };
      }
    } else {
      // For testing without API key, just log
      console.log("Mock Email Sent. API Key missing.");
      console.log(htmlEmail);
    }

    return { success: true };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
