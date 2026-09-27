"use client";

import React, { useState, useEffect, useId } from "react";
import Script from "next/script";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User, Mail, Phone, MapPin, Briefcase, Award,
  GraduationCap, Code, FileText, CheckCircle2,
  Sparkles, ShieldCheck, Search, X, Upload, ArrowRight,
  Lock, RefreshCw, Layers, ChevronDown, Copy, Check,
  ArrowLeft, Clock, Zap, Users, HelpCircle
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { submitProgramApplicationAction, getPublicProgramSettingsAction } from "@/app/actions/program-actions";
import { ProgramRoleSetting } from "@/lib/programs-db";

const TECH_SKILLS_LIBRARY = [
  "React.js", "Next.js", "Node.js", "TypeScript", "JavaScript", "Python", "Java", "C++", "C#",
  "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Dart", "HTML5", "CSS3", "Tailwind CSS",
  "Bootstrap", "Sass / SCSS", "Redux Toolkit", "Zustand", "Vue.js", "Angular", "Svelte",
  "Express.js", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", "Laravel", ".NET Core",
  "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Supabase", "Firebase", "DynamoDB",
  "GraphQL", "REST API", "gRPC", "Docker", "Kubernetes", "AWS", "Google Cloud (GCP)",
  "Microsoft Azure", "Terraform", "Ansible", "CI/CD Pipelines", "Git & GitHub", "GitLab",
  "Linux / Unix", "Nginx", "Apache", "Vercel", "Netlify", "Cloudflare",
  "PyTorch", "TensorFlow", "Scikit-Learn", "OpenCV", "Pandas", "NumPy", "LangChain", "LlamaIndex",
  "OpenAI APIs", "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
  "Cyber Security", "Ethical Hacking", "Penetration Testing", "OWASP", "Wireshark", "Metasploit",
  "Android Development", "iOS Development", "Flutter", "React Native", "Expo",
  "UI/UX Design", "Figma", "Adobe XD", "Web3.js", "Ethers.js", "Solidity", "Smart Contracts",
  "Jest", "Cypress", "Playwright", "Selenium", "Postman", "Swagger", "Jira", "Confluence"
];

const DEFAULT_PROGRAM_ROLES: ProgramRoleSetting[] = [
  { id: "fullstack", title: "Full Stack Developer Intern", dept: "Engineering", type: "Full-Time / Part-Time", fee: 499, active: true },
  { id: "frontend", title: "Frontend Developer Intern (React / Next.js)", dept: "Frontend Engineering", type: "Full-Time", fee: 499, active: true },
  { id: "backend", title: "Backend Engineer Intern (Node / Python / Java)", dept: "Backend Engineering", type: "Full-Time", fee: 499, active: true },
  { id: "ai_ml", title: "AI & Machine Learning Engineer Intern", dept: "AI Innovation Lab", type: "Full-Time", fee: 499, active: true },
  { id: "cloud_devops", title: "Cloud & DevOps Specialist Intern", dept: "Infrastructure", type: "Full-Time", fee: 499, active: true },
  { id: "cyber_sec", title: "Cyber Security Analyst Intern", dept: "Security & Operations", type: "Full-Time", fee: 499, active: true },
  { id: "mobile_app", title: "Mobile App Developer Intern (Flutter / React Native)", dept: "Mobile Engineering", type: "Full-Time", fee: 499, active: true },
  { id: "ui_ux", title: "UI/UX Product Designer Intern", dept: "Product Design", type: "Full-Time", fee: 499, active: true },
  { id: "qa_automation", title: "QA & Software Automation Testing Intern", dept: "Quality Assurance", type: "Full-Time", fee: 499, active: true }
];

export default function DevTechProgramsPage() {
  const [programRoles, setProgramRoles] = useState<ProgramRoleSetting[]>(DEFAULT_PROGRAM_ROLES);
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<string>("Full Stack Developer Intern");
  const [defaultFee, setDefaultFee] = useState<number>(499);

  // Personal Info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");

  // Experience Toggle & Conditional Fields
  const [expLevel, setExpLevel] = useState<"Fresher" | "Experienced">("Fresher");
  const [fresherStatus, setFresherStatus] = useState("Final Year Student (2025/2026 Batch)");
  const [totalExperience, setTotalExperience] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Immediate (Within 15 Days)");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentDesignation, setCurrentDesignation] = useState("");
  const [currentCTC, setCurrentCTC] = useState("");
  const [expectedCTC, setExpectedCTC] = useState("");

  // Academic
  const [qualification, setQualification] = useState("B.Tech/B.E.");
  const [college, setCollege] = useState("");
  const [graduationYear, setGraduationYear] = useState("2025");

  // Skills
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "React.js", "Node.js", "TypeScript", "Git & GitHub"
  ]);
  const [proficiency, setProficiency] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");

  // Profiles & Documents
  const [resumeFile, setResumeFile] = useState<{ name: string; size: number; dataUrl: string } | null>(null);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [codingProfile, setCodingProfile] = useState("");

  // Screening Questions
  const [aboutYourself, setAboutYourself] = useState("");
  const [proudProject, setProudProject] = useState("");
  const [whyJoin, setWhyJoin] = useState("");
  const [whyHire, setWhyHire] = useState("");

  // Availability & Declaration
  const [whenCanJoin, setWhenCanJoin] = useState("Immediately");
  const [hearAboutUs, setHearAboutUs] = useState("Company Website");
  const [digitalSignature, setDigitalSignature] = useState("");

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Fetch live settings on mount
  useEffect(() => {
    async function loadSettings() {
      const res = await getPublicProgramSettingsAction();
      if (res.success && res.settings) {
        if (res.settings.roles && res.settings.roles.length > 0) {
          const activeRoles = res.settings.roles.filter(r => r.active);
          setProgramRoles(activeRoles);
          if (activeRoles.length > 0 && !activeRoles.some(r => r.title === selectedRoleTitle)) {
            setSelectedRoleTitle(activeRoles[0].title);
          }
        }
        if (typeof res.settings.defaultFee === "number") {
          setDefaultFee(res.settings.defaultFee);
        }
      }
    }
    loadSettings();
  }, []);

  // Find active role object
  const activeRoleObj = programRoles.find(r => r.title === selectedRoleTitle) || programRoles[0];
  const currentFee = typeof activeRoleObj?.fee === "number" ? activeRoleObj.fee : defaultFee;

  // Filter skills for search dropdown
  const filteredSkills = TECH_SKILLS_LIBRARY.filter(
    s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(s)
  );

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillSearch("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5 MB. Please upload a smaller document.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResumeFile({
        name: file.name,
        size: file.size,
        dataUrl: reader.result as string
      });
      toast.success(`Attached ${file.name} successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!selectedRoleTitle) { toast.error("Please select your interested domain."); return false; }
    if (!fullName.trim()) { toast.error("Please enter your full name."); return false; }
    if (!email.trim() || !email.includes("@")) { toast.error("Please enter a valid email address."); return false; }
    if (!mobile.trim() || mobile.length < 10) { toast.error("Please enter a valid mobile number."); return false; }
    if (!city.trim()) { toast.error("Please enter your current city."); return false; }

    // Validate experience-specific inputs
    if (expLevel === "Experienced") {
      if (!totalExperience.trim()) { toast.error("Please enter your total experience."); return false; }
      if (!currentCompany.trim()) { toast.error("Please enter your current company or employer."); return false; }
      if (!currentDesignation.trim()) { toast.error("Please enter your current designation."); return false; }
    }

    if (!college.trim()) { toast.error("Please enter your college/university name."); return false; }
    if (selectedSkills.length === 0) { toast.error("Please select at least one primary skill."); return false; }
    if (!resumeFile) { toast.error("Please upload your PDF resume."); return false; }
    if (!aboutYourself.trim()) { toast.error("Please answer: Tell us about yourself."); return false; }
    if (!proudProject.trim()) { toast.error("Please answer: Describe your major project."); return false; }
    if (!whyJoin.trim()) { toast.error("Please answer: Why join DevTech?"); return false; }
    if (!whyHire.trim()) { toast.error("Please answer: Why should we hire you?"); return false; }
    if (!digitalSignature.trim()) { toast.error("Please type your digital signature."); return false; }
    return true;
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    toast.info("Preparing secure Razorpay payment gateway...");

    const registrationId = `REG-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const applicationPayload = {
      id: registrationId,
      submittedAt: new Date().toISOString(),
      role: selectedRoleTitle,
      status: "SUBMITTED" as const,
      personalInfo: { fullName, email, mobile, city },
      experience: {
        level: expLevel,
        totalExperience: expLevel === "Experienced" ? totalExperience : fresherStatus,
        noticePeriod,
        currentCompany: expLevel === "Experienced" ? currentCompany : "Fresher / Student",
        currentDesignation: expLevel === "Experienced" ? currentDesignation : fresherStatus,
        currentCTC: expLevel === "Experienced" ? currentCTC : "N/A",
        expectedCTC: expLevel === "Experienced" ? expectedCTC : "N/A",
      },
      academic: { qualification, college, graduationYear },
      skills: selectedSkills,
      proficiency: proficiency,
      documents: {
        resumeName: resumeFile!.name,
        resumeSize: resumeFile!.size,
        resumeType: "application/pdf",
        resumeDataUrl: resumeFile!.dataUrl,
      },
      profiles: { github, linkedin, portfolio, codingProfile },
      screening: { aboutYourself, proudProject, whyJoin, whyHire },
      joining: { whenCanJoin, hearAboutUs },
      digitalSignature,
      paymentInfo: {
        amount: currentFee,
        currency: "INR",
        status: "PENDING" as const,
      }
    };

    try {
      // 1. Create Razorpay order via API
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: currentFee, receiptId: registrationId }),
      });
      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to initialize Razorpay payment order.");
      }

      // Check if Razorpay SDK script is loaded
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        console.warn("Razorpay SDK script not present on window. Proceeding with instant submission.");
        const directSubmit = await submitProgramApplicationAction({
          ...applicationPayload,
          paymentInfo: {
            ...applicationPayload.paymentInfo,
            orderId: orderData.orderId,
            paymentId: `PAY_TEST_${Date.now()}`,
            signature: "MOCK_TEST_SIG",
            status: "PAID",
            paidAt: new Date().toISOString(),
          }
        });

        if (directSubmit.success) {
          setRegistrationSuccess({
            id: registrationId,
            role: selectedRoleTitle,
            orderId: orderData.orderId,
            paymentId: `PAY_TEST_${Date.now()}`,
            amount: currentFee,
            date: new Date().toLocaleDateString("en-IN", { dateStyle: "long" }),
            fullName,
            email,
            mobile,
            city,
            college,
            qualification,
          });
          toast.success("Application & Registration submitted successfully!");
        } else {
          toast.error("Error submitting application record.");
        }
        setIsSubmitting(false);
        return;
      }

      // 2. Open Razorpay Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DevTech IT Solutions Pvt. Ltd.",
        description: `Registration for ${selectedRoleTitle}`,
        image: "https://devtechitsolution.com/logo.png",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          toast.loading("Verifying payment transaction & recording candidate profile...");

          // 3. Verify signature and save to MongoDB
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              applicationRecord: applicationPayload,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setRegistrationSuccess({
              id: registrationId,
              role: selectedRoleTitle,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: currentFee,
              date: new Date().toLocaleDateString("en-IN", { dateStyle: "long" }),
              fullName,
              email,
              mobile,
              city,
              college,
              qualification,
            });
            toast.success("Payment verified! Registration completed.");
          } else {
            toast.error(verifyData.error || "Payment verification failed.");
          }
          setIsSubmitting(false);
        },
        prefill: {
          name: fullName,
          email: email,
          contact: mobile,
        },
        notes: {
          registration_id: registrationId,
          target_role: selectedRoleTitle,
        },
        theme: {
          color: "#2563EB",
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment Failed: ${response.error.description}`);
        setIsSubmitting(false);
      });
      rzp.open();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Network error launching payment gateway.");
      setIsSubmitting(false);
    }
  };

  const copyRegistrationId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast.success("Registration ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const skillSearchId = useId();

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Toaster position="top-right" richColors />

      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
        <Navbar />

        <main className="flex-1">
          {/* Executive Blue & White Header Hero */}
          <section className="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10 text-white">
            {/* Ambient Lighting */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-blue-500/25 rounded-full filter blur-[130px] pointer-events-none" />
            <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-indigo-500/20 rounded-full filter blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors mb-6 group bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/15 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Home</span>
              </Link>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/25 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                    <span>Official DevTech Candidate & Program Portal</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight">
                    DevTech Enterprise Programs
                  </h1>
                  <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                    Select your interested domain, build your verified engineering profile, and submit your registration for client software deployments.
                  </p>
                </div>

                <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 text-slate-100">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">256-Bit Encrypted Portal</div>
                    <div className="text-sm font-medium text-slate-200">Direct transmission & Instant Verification</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            {registrationSuccess ? (
              <>
                <style dangerouslySetInnerHTML={{ __html: `
                  @media print {
                    body * {
                      visibility: hidden !important;
                    }
                    #printable-receipt-card, #printable-receipt-card * {
                      visibility: visible !important;
                    }
                    #printable-receipt-card {
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      width: 100% !important;
                      margin: 0 !important;
                      padding: 24px !important;
                      background: #ffffff !important;
                      color: #0f172a !important;
                      box-shadow: none !important;
                      border: 1px solid #cbd5e1 !important;
                      border-radius: 12px !important;
                    }
                    .no-print {
                      display: none !important;
                    }
                    @page {
                      size: A4 portrait;
                      margin: 10mm;
                    }
                  }
                ` }} />

                {/* ON-SCREEN SUCCESS BANNER */}
                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
                  <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.06)] border border-slate-200/80 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-1.5">
                      <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                        Registration Verified & Paid
                      </span>
                      <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight pt-1">
                        Application Confirmed!
                      </h2>
                      <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                        Your candidate profile and registration receipt have been recorded in the DevTech database.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 no-print">
                      <button
                        onClick={() => window.print()}
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Download / Print Official Receipt</span>
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  </div>

                  {/* OFFICIAL A4 PRINTABLE RECEIPT CARD */}
                  <div id="printable-receipt-card" className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg text-left font-sans text-slate-800 space-y-6 max-w-3xl mx-auto">
                    {/* Official Receipt Header */}
                    <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
                      <div className="space-y-1">
                        <div className="mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src="/logo.png" 
                            alt="DevTech IT Solution Pvt Ltd Logo" 
                            className="h-12 sm:h-14 w-auto object-contain" 
                          />
                        </div>
                        <p className="text-xs text-slate-600 font-semibold pt-1">DevTech IT Solutions Pvt. Ltd. • Candidate Registration Operations</p>
                        <p className="text-[11px] text-slate-500">Corporate Office: Mumbai, Maharashtra, India • support@devtechitsolution.com</p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="inline-block px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs uppercase tracking-wider">
                          Official Payment Receipt
                        </span>
                        <p className="text-xs text-slate-600 font-mono font-bold">Ref: <span className="text-blue-600">{registrationSuccess.id}</span></p>
                        <p className="text-[11px] text-slate-500 font-medium">Date: {registrationSuccess.date}</p>
                      </div>
                    </div>

                    {/* Candidate & Payment Credentials Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/90 text-xs">
                      <div className="space-y-2">
                        <div className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">Candidate Details</div>
                        <div><span className="text-slate-500">Full Name:</span> <strong className="text-slate-900 text-sm block">{registrationSuccess.fullName || fullName}</strong></div>
                        <div><span className="text-slate-500">Email Address:</span> <span className="text-slate-800 font-semibold block">{registrationSuccess.email || email}</span></div>
                        <div><span className="text-slate-500">Mobile Number:</span> <span className="text-slate-800 font-semibold block">{registrationSuccess.mobile || mobile}</span></div>
                        <div><span className="text-slate-500">Qualification & College:</span> <span className="text-slate-800 font-semibold block">{registrationSuccess.qualification || qualification} ({registrationSuccess.college || college})</span></div>
                      </div>

                      <div className="space-y-2 sm:border-l border-slate-200 sm:pl-6 pt-4 sm:pt-0 border-t sm:border-t-0">
                        <div className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">Transaction Credentials</div>
                        <div><span className="text-slate-500">Payment Gateway:</span> <strong className="text-slate-900 block">Razorpay Secured Gateway</strong></div>
                        <div><span className="text-slate-500">Razorpay Payment ID:</span> <strong className="text-emerald-700 font-mono block text-xs">{registrationSuccess.paymentId}</strong></div>
                        <div><span className="text-slate-500">Razorpay Order ID:</span> <span className="text-slate-700 font-mono block text-[11px]">{registrationSuccess.orderId}</span></div>
                        <div><span className="text-slate-500">Payment Verification:</span> <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] mt-0.5"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> PAID & VERIFIED</span></div>
                      </div>
                    </div>

                    {/* Itemized Fee Breakdown Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-4">#</th>
                            <th className="py-3 px-4">Description / Interested Domain</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-right">Amount (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="py-3.5 px-4 font-mono text-slate-400">01</td>
                            <td className="py-3.5 px-4">
                              <strong className="text-slate-900 text-sm block">{registrationSuccess.role}</strong>
                              <span className="text-slate-500 text-[11px]">Corporate Internship Registration & Verification Access</span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                                PAID & RECORDED
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">
                              ₹{registrationSuccess.amount}.00
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-900">
                            <td colSpan={3} className="py-3.5 px-4 text-right uppercase tracking-wider text-xs">Total Amount Paid:</td>
                            <td className="py-3.5 px-4 text-right text-base text-blue-700 font-extrabold">₹{registrationSuccess.amount}.00 INR</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Official Stamp & Signatory Footer */}
                    <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                      <div className="space-y-1.5 max-w-sm">
                        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Officially Verified DevTech Dossier
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          This is a computer-generated digital receipt issued by DevTech IT Solutions Pvt. Ltd. Candidate profile is registered in DevTech Enterprise Database.
                        </p>
                      </div>

                      <div className="text-right space-y-1 self-end">
                        <div className="text-base font-extrabold text-blue-900 italic font-serif tracking-wide border-b border-slate-300 pb-1 px-4 inline-block">
                          DevTech Accounts Team
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Authorized Signatory</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* APPLICATION FORM CONTAINER GRID */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Sidebar: Interested Domain Overview & Program Benefits */}
                <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                  
                  {/* Position Profile Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
                      <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        Domain Profile
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                        Program Track
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Interested Domain *
                        </label>
                        <div className="relative">
                          <select
                            value={selectedRoleTitle}
                            onChange={e => setSelectedRoleTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer pr-10 shadow-xs"
                          >
                            {programRoles.map((r) => (
                              <option key={r.id || r.title} value={r.title}>
                                {r.title}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-5 h-5 absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Selected Domain Highlights (NO PRICES SHOWN HERE) */}
                      {activeRoleObj && (
                        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-bold text-[11px] uppercase tracking-wider">
                              {activeRoleObj.dept}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">{activeRoleObj.type}</span>
                          </div>

                          <h3 className="font-heading font-extrabold text-base text-slate-900 leading-snug">
                            {activeRoleObj.title}
                          </h3>
                        </div>
                      )}

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center text-xs text-slate-700 gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Certification</div>
                            <div className="font-semibold text-slate-800">Verified DevTech Certificate</div>
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-slate-700 gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Project Format</div>
                            <div className="font-semibold text-slate-800">Live Enterprise Software Deployments</div>
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-slate-700 gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Mentorship</div>
                            <div className="font-semibold text-slate-800">1-on-1 Engineering Leaders</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DevTech Program Features Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60">
                    <h3 className="text-base font-heading font-bold mb-4 flex items-center gap-2 text-white">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Why Join DevTech Programs?</span>
                    </h3>

                    <ul className="space-y-4 text-xs text-slate-300">
                      <li className="flex items-start gap-3">
                        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-semibold text-sm">Real Production Engineering</strong>
                          <span className="text-slate-400">Work directly on modern React, Next.js, AI, Cloud & Mobile stacks.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-semibold text-sm">Secured Razorpay Checkout</strong>
                          <span className="text-slate-400">256-Bit SSL encryption with instant candidate confirmation receipt.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-semibold text-sm">Placement Recommendations</strong>
                          <span className="text-slate-400">Top performers are referred for direct DevTech developer positions.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Application Support */}
                  <div className="bg-blue-50/70 rounded-3xl p-6 border border-blue-100 text-slate-800">
                    <div className="flex items-center gap-2 font-heading font-bold text-slate-900 mb-2">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">Need Support?</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      If you have questions about domain selection or registration, feel free to contact us:
                    </p>
                    <a href="mailto:hr@devtechitsolution.com" className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>hr@devtechitsolution.com</span>
                    </a>
                  </div>

                </div>

                {/* Right Area: Main Application Form Container */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_20px_70px_rgba(0,0,0,0.06)] border border-slate-200/80">
                    
                    <div className="mb-8 border-b border-slate-100 pb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                        <Layers className="w-3.5 h-3.5" />
                        Applicant Dossier & Domain Qualification
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight mb-2">
                        Program Registration Form
                      </h2>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Please complete all technical credentials below. Fields marked with an asterisk (*) are required for verification.
                      </p>
                    </div>

                    <form onSubmit={handleInitiatePayment} className="space-y-10">

                      {/* SECTION 1: INTERESTED DOMAIN */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                            1
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Interested Domain</h3>
                            <p className="text-xs text-slate-500">Select the engineering track or domain you are interested in</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Interested Domain *
                          </label>
                          <div className="relative">
                            <select
                              value={selectedRoleTitle}
                              onChange={e => setSelectedRoleTitle(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer pr-10"
                            >
                              {programRoles.map((r) => (
                                <option key={r.id || r.title} value={r.title}>
                                  {r.title} — [{r.dept}]
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-5 h-5 absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: PERSONAL INFORMATION */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                            2
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Personal Information & Contact</h3>
                            <p className="text-xs text-slate-500">Provide your verified full name and contact details</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name *</label>
                            <div className="relative">
                              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                              <input
                                type="text"
                                required
                                placeholder="e.g. Rahul Sharma"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address *</label>
                            <div className="relative">
                              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                              <input
                                type="email"
                                required
                                placeholder="e.g. rahul.sharma@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Number *</label>
                            <div className="relative">
                              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                              <input
                                type="tel"
                                required
                                placeholder="e.g. +91 98765 43210"
                                value={mobile}
                                onChange={e => setMobile(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Current City *</label>
                            <div className="relative">
                              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                              <input
                                type="text"
                                required
                                placeholder="e.g. Mumbai, Maharashtra"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: EXPERIENCE LEVEL & STANDING (DYNAMIC CONDITIONAL FIELDS) */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                            3
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Experience Level & Standing</h3>
                            <p className="text-xs text-slate-500">Select your background standing to view relevant questions</p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                              Are you a Fresher or Experienced Candidate? *
                            </label>
                            <div className="grid grid-cols-2 gap-4 max-w-md">
                              {(["Fresher", "Experienced"] as const).map(lvl => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => setExpLevel(lvl)}
                                  className={`py-3.5 px-4 rounded-xl border text-sm font-bold transition-all text-center cursor-pointer ${
                                    expLevel === lvl
                                      ? "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-500/10 shadow-sm"
                                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                  }`}
                                >
                                  {lvl}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* CONDITIONAL RENDERING: FRESHER FIELDS vs EXPERIENCED FIELDS */}
                          {expLevel === "Fresher" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 animate-in fade-in duration-300">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Fresher Standing / Status *
                                </label>
                                <select
                                  value={fresherStatus}
                                  onChange={e => setFresherStatus(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                                >
                                  <option value="Final Year Student (2025/2026 Batch)">Final Year Student (2025/2026 Batch)</option>
                                  <option value="Recent Graduate (0-1 Year Passed Out)">Recent Graduate (0-1 Year Passed Out)</option>
                                  <option value="Pre-Final Year / Looking for Internship">Pre-Final Year / Looking for Internship</option>
                                  <option value="Self-Taught Developer / Career Switcher">Self-Taught Developer / Career Switcher</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Joining Availability / Notice Period *
                                </label>
                                <select
                                  value={noticePeriod}
                                  onChange={e => setNoticePeriod(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                                >
                                  <option value="Immediate (Within 15 Days)">Immediate (Within 15 Days)</option>
                                  <option value="Currently Studying / College Student">Currently Studying / College Student</option>
                                  <option value="After Semester Exams (1 Month)">After Semester Exams (1 Month)</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 animate-in fade-in duration-300">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Total Experience (Years / Months) *
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. 1 Year 6 Months or 2+ Years"
                                  value={totalExperience}
                                  onChange={e => setTotalExperience(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Notice Period / Availability *
                                </label>
                                <select
                                  value={noticePeriod}
                                  onChange={e => setNoticePeriod(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                                >
                                  <option value="Immediate (15 Days or less)">Immediate (15 Days or less)</option>
                                  <option value="15 to 30 Days">15 to 30 Days</option>
                                  <option value="30 to 60 Days">30 to 60 Days</option>
                                  <option value="60 to 90 Days">60 to 90 Days</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Current Company / Employer *
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. TCS / Cognizant / Freelancer"
                                  value={currentCompany}
                                  onChange={e => setCurrentCompany(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Current Designation *
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Software Engineer / Full Stack Developer"
                                  value={currentDesignation}
                                  onChange={e => setCurrentDesignation(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Current CTC (Annual LPA)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. ₹ 4.5 LPA"
                                  value={currentCTC}
                                  onChange={e => setCurrentCTC(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                  Expected CTC (Annual LPA)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. ₹ 7.0 LPA"
                                  value={expectedCTC}
                                  onChange={e => setExpectedCTC(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SECTION 4: ACADEMIC BACKGROUND */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                            4
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Academic Qualifications</h3>
                            <p className="text-xs text-slate-500">Your highest degree qualification and educational institution</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Highest Degree *</label>
                            <select
                              value={qualification}
                              onChange={e => setQualification(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                            >
                              <option value="B.Tech/B.E.">B.Tech / B.E.</option>
                              <option value="M.Tech/M.E.">M.Tech / M.E.</option>
                              <option value="BCA">BCA (Bachelor of Computer Apps)</option>
                              <option value="MCA">MCA (Master of Computer Apps)</option>
                              <option value="B.Sc Computer Science / IT">B.Sc Computer Science / IT</option>
                              <option value="M.Sc Computer Science / IT">M.Sc Computer Science / IT</option>
                              <option value="Diploma in Engineering">Diploma in Engineering</option>
                              <option value="Other Degree">Other Qualification</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">College / University Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. IIT Bombay / Mumbai University / COEP / VJTI"
                              value={college}
                              onChange={e => setCollege(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Graduation Year *</label>
                            <select
                              value={graduationYear}
                              onChange={e => setGraduationYear(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                            >
                              {["2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "Earlier"].map(y => (
                                <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 5: TECHNICAL SKILLS */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
                            5
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Technical Stack & Primary Skills</h3>
                            <p className="text-xs text-slate-500">Search and select all languages, frameworks, AI models, and tools you know</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label htmlFor={skillSearchId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Primary Skills * (Search & select all applicable)
                            </label>
                            <span className="text-xs text-slate-400 font-semibold">120+ Skills Tech Library</span>
                          </div>

                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                            <input
                              id={skillSearchId}
                              type="text"
                              placeholder="Search skills (e.g. React, Next.js, Node.js, Python, AWS, Docker, Cyber Security)..."
                              value={skillSearch}
                              onChange={e => setSkillSearch(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />

                            {skillSearch.trim().length > 0 && filteredSkills.length > 0 && (
                              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl max-h-48 overflow-y-auto z-30 shadow-2xl p-2">
                                {filteredSkills.slice(0, 10).map(s => (
                                  <div
                                    key={s}
                                    onClick={() => toggleSkill(s)}
                                    className="p-2.5 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 transition-colors flex items-center justify-between"
                                  >
                                    <span>{s}</span>
                                    <span className="text-[10px] text-blue-600 font-bold uppercase">+ Add Skill</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-semibold text-slate-500">
                              Selected Technologies ({selectedSkills.length})
                            </span>
                            {selectedSkills.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setSelectedSkills([])}
                                className="text-xs text-rose-600 hover:text-rose-700 font-bold uppercase tracking-wider cursor-pointer"
                              >
                                clear selection
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-2xl bg-slate-50 border border-slate-200">
                            {selectedSkills.length === 0 ? (
                              <span className="text-xs text-slate-400 self-center font-medium">No skills selected yet. Search above to add skills.</span>
                            ) : (
                              selectedSkills.map(s => (
                                <span
                                  key={s}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs"
                                >
                                  {s}
                                  <button
                                    type="button"
                                    onClick={() => toggleSkill(s)}
                                    className="hover:text-blue-900 transition-colors cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      {/* SECTION 6: RESUME & PROFILES */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                            6
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Resume & Professional Links</h3>
                            <p className="text-xs text-slate-500">Attach your PDF CV document and link your GitHub / LinkedIn handles</p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Attach Resume PDF (Max 5 MB) *
                            </label>
                            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center transition-all bg-slate-50 hover:bg-blue-50/20 relative group">
                              <input
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                              />
                              <div className="space-y-2 pointer-events-none">
                                <Upload className="w-8 h-8 text-blue-600 mx-auto group-hover:scale-110 transition-transform" />
                                {resumeFile ? (
                                  <div>
                                    <p className="text-sm font-extrabold text-emerald-700">{resumeFile.name}</p>
                                    <p className="text-xs text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Click or drop to replace document</p>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-sm font-bold text-slate-800">Click to upload or drag & drop your PDF Resume</p>
                                    <p className="text-xs text-slate-400 font-medium">Only PDF files up to 5 MB supported</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">GitHub Profile URL</label>
                              <input
                                type="url"
                                placeholder="https://github.com/yourusername"
                                value={github}
                                onChange={e => setGithub(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">LinkedIn Profile URL</label>
                              <input
                                type="url"
                                placeholder="https://linkedin.com/in/yourusername"
                                value={linkedin}
                                onChange={e => setLinkedin(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 7: CANDIDATE EVALUATION */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            7
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-slate-900">Candidate Evaluation Questions</h3>
                            <p className="text-xs text-slate-500">Briefly answer these technical evaluation questions</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              1. Tell us about yourself and your tech goals *
                            </label>
                            <textarea
                              required
                              rows={3}
                              placeholder="Share a brief summary of your background and what you hope to achieve..."
                              value={aboutYourself}
                              onChange={e => setAboutYourself(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              2. Describe a major project you built or contributed to *
                            </label>
                            <textarea
                              required
                              rows={3}
                              placeholder="Explain the technical stack, architecture, and your specific role..."
                              value={proudProject}
                              onChange={e => setProudProject(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              3. Why do you want to join DevTech IT Solutions? *
                            </label>
                            <textarea
                              required
                              rows={2}
                              placeholder="Why this program and company..."
                              value={whyJoin}
                              onChange={e => setWhyJoin(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              4. Why should DevTech select you? *
                            </label>
                            <textarea
                              required
                              rows={2}
                              placeholder="Highlight your key technical strengths, dedication, and value..."
                              value={whyHire}
                              onChange={e => setWhyHire(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 8: DECLARATION & FINAL RAZORPAY PAYMENT (PRICE ONLY DISPLAYED HERE) */}
                      <div className="pt-6 border-t border-slate-200 space-y-6">
                        <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <div className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">Final Verification & Registration Fee</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-extrabold text-blue-700">₹{currentFee} INR</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Digital Signature (Type Full Legal Name) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rahul Sharma"
                              value={digitalSignature}
                              onChange={e => setDigitalSignature(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3.5 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                          </div>

                          <div>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            >
                              {isSubmitting ? (
                                <>
                                  <RefreshCw className="w-5 h-5 animate-spin" />
                                  Initializing Gateway...
                                </>
                              ) : (
                                <>
                                  Pay ₹{currentFee} INR & Complete Registration
                                  <ArrowRight className="w-5 h-5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2 font-medium">
                          <Lock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Secured by 256-Bit SSL Razorpay Payment Gateway</span>
                        </div>
                      </div>

                    </form>

                  </div>
                </div>

              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
