"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/careers/ApplicationForm";
import SuccessMessage from "@/components/careers/SuccessMessage";

import { 
  ArrowLeft, Briefcase, MapPin, Clock, Award, ShieldCheck, 
  Sparkles, Mail, Phone, HelpCircle, Zap, Lock, Users 
} from "lucide-react";

import { Opportunity } from "@/lib/careers-data";
import { useEffect } from "react";

function ApplicationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recordId, setRecordId] = useState<string | undefined>(undefined);
  const [matchingOp, setMatchingOp] = useState<Opportunity | null>(null);

  const roleParam = searchParams.get("role") || "";
  const typeParam = (searchParams.get("type") as "Job" | "Internship") || 
    (roleParam.toLowerCase().includes("intern") ? "Internship" : "Job");

  useEffect(() => {
    if (roleParam) {
      fetch("/api/opportunities")
        .then(res => res.json())
        .then((data: Opportunity[]) => {
          if (Array.isArray(data)) {
            const found = data.find(
              op => op.title.toLowerCase() === roleParam.toLowerCase() || op.slug === roleParam.toLowerCase()
            );
            if (found) setMatchingOp(found);
          }
        })
        .catch(() => {});
    }
  }, [roleParam]);

  const formattedRole = matchingOp ? matchingOp.title : (roleParam ? roleParam.replace(/-/g, " ") : "");

  return (
    <>
      {/* Dark Executive Header Band */}
      <section className="relative bg-[#080F23] pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#2563EB]/20 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-indigo-500/15 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={() => router.push("/careers#open-positions")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors mb-6 group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Open Opportunities</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-4">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Official DevTech Candidate Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight">
                Submit Your Application
              </h1>
              <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Take the decisive leap in your tech career. Complete your verifiable applicant profile below for immediate review by our talent engineering team.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-slate-200">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">256-Bit Encrypted Portal</div>
                <div className="text-sm font-medium text-slate-300">Direct transmission to hr@devtechitsolution.com</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Sidebar: Position Overview & HR Assurance */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            {/* Position Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-200/80">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
                <span className="text-xs font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Position Profile
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                  {typeParam}
                </span>
              </div>

              <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight mb-3">
                {formattedRole || "General Talent Application"}
              </h2>

              {matchingOp ? (
                <>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {matchingOp.description}
                  </p>

                  <div className="space-y-3.5 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-700 gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase">Department & Level</div>
                        <div className="font-semibold text-slate-800">{matchingOp.department} ({matchingOp.experience})</div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-slate-700 gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase">Employment Type</div>
                        <div className="font-semibold text-slate-800">{matchingOp.employmentType}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-slate-700 gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase">Location & Work Mode</div>
                        <div className="font-semibold text-slate-800">{matchingOp.location}</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Submit your detailed qualifications to enter our primary talent ecosystem. Our recruiting specialists match incoming portfolios against immediate and upcoming openings.
                </p>
              )}
            </div>

            {/* Applicant Assurance Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60">
              <h3 className="text-lg font-heading font-bold mb-5 flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Why Join DevTech?</span>
              </h3>
              
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Live Client Projects</strong>
                    <span className="text-slate-400 text-xs">Direct hands-on involvement with real enterprise software deployments.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Verified Privacy & Security</strong>
                    <span className="text-slate-400 text-xs">Your resumes, contact numbers, and GitHub links are kept strictly confidential.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Mentorship & Career Growth</strong>
                    <span className="text-slate-400 text-xs">Work closely with seasoned engineering leaders and domain architects.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* HR Support Direct Contact */}
            <div className="bg-blue-50/70 rounded-3xl p-6 border border-blue-100 text-slate-800">
              <div className="flex items-center gap-2 font-heading font-bold text-slate-900 mb-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span>Need Application Support?</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                If you encounter any difficulty attaching documents or have questions regarding recruitment cycles, reach out to our HR specialists directly:
              </p>
              <div className="space-y-2 text-xs font-semibold">
                <a href="mailto:hr@devtechitsolution.com" className="flex items-center gap-2 text-primary hover:underline">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>hr@devtechitsolution.com</span>
                </a>
                <a href="tel:+919326093960" className="flex items-center gap-2 text-slate-700 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>+91 9326093960</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Area: Main Application Form Container */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_20px_70px_rgba(0,0,0,0.07)] border border-slate-200/80">
              {isSubmitted ? (
                <SuccessMessage 
                  onBack={() => router.push("/careers")}
                  recordId={recordId}
                />
              ) : (
                <>
                  <div className="mb-8 border-b border-slate-100 pb-6">
                    <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight mb-2">
                      Applicant Dossier & Qualifications
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Please ensure all contact credentials and educational details are accurate before final submission. Fields marked with an asterisk (*) are mandatory.
                    </p>
                  </div>

                  <ApplicationForm
                    initialType={typeParam}
                    initialPosition={formattedRole}
                    onSuccess={(id) => {
                      setRecordId(id);
                      setIsSubmitted(true);
                      window.scrollTo({ top: 280, behavior: "smooth" });
                    }}
                  />
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-44 text-center text-slate-500 font-semibold text-lg animate-pulse">
            Loading DevTech Official Talent Portal...
          </div>
        }>
          <ApplicationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
