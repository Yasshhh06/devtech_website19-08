"use client";

import React, { useState, useTransition } from "react";
import { submitCareerApplication } from "@/app/actions/career-application";
import InternshipApplicationForm from "./InternshipApplicationForm";
import { 
  User, GraduationCap, Globe, FileUp, FileCheck, 
  AlertCircle, Check, Loader2, Lock, Clock, Sparkles, Award,
  Briefcase, Code2, Search, X, Plus, Building2
} from "lucide-react";

interface ApplicationFormProps {
  initialType?: string;
  initialPosition?: string;
  onSuccess: (recordId?: string) => void;
}

const JOB_POSITIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Flutter Developer",
  "Cyber Security Analyst",
  "Digital Marketing Executive",
  "HR Executive",
  "Business Development Executive",
  "Software Testing Engineer",
  "General Talent Application",
  "Other"
];

const JOB_SKILLS = Array.from(new Set([
  // Frontend
  "Angular", "Bootstrap", "CSS3", "Framer Motion", "HTML5", "JavaScript", "jQuery", "Next.js", "Nuxt.js", "React Native", "React.js", "Redux", "Remix", "SASS/SCSS", "SolidJS", "Svelte", "Tailwind CSS", "TypeScript", "Vue.js", "Webpack", "Zod",
  // Backend & Databases
  ".NET / ASP.NET", "Apollo GraphQL", "C#", "C++", "Cassandra", "Django", "Docker", "Elixir", "Express.js", "FastAPI", "Firebase", "Flask", "Go / Golang", "GraphQL", "Hibernate", "Java", "Kotlin", "Laravel", "MongoDB", "MySQL", "NestJS", "Node.js", "PHP", "PostgreSQL", "Prisma", "Python", "Redis", "Ruby on Rails", "Rust", "Spring Boot", "SQL", "SQLite", "Supabase",
  // Cloud, DevOps & Security
  "Ansible", "AWS", "AWS Lambda", "Azure", "CI/CD Pipeline", "Cloudflare", "Cyber Security", "DevOps", "DigitalOcean", "GCP (Google Cloud)", "Git & GitHub", "GitLab CI", "Jenkins", "Kubernetes", "Linux / Bash", "Nginx", "Penetration Testing", "Terraform", "Web Security (OWASP)",
  // Mobile Development
  "Android (Kotlin/Java)", "Dart", "Expo", "Flutter", "iOS (Swift)", "SwiftUI",
  // AI, Data Science & ML
  "AI/ML", "Computer Vision (OpenCV)", "Deep Learning", "Google Cloud Vertex AI", "LangChain", "LLM Integration", "Natural Language Processing (NLP)", "NumPy", "OpenAI API", "Pandas", "PyTorch", "R Programming", "Scikit-Learn", "TensorFlow",
  // UI/UX, Design & Tools
  "Adobe Illustrator", "Adobe Photoshop", "Adobe XD", "Design Systems", "Figma", "Framer", "InVision", "Prototyping", "UI/UX Design", "Wireframing",
  // QA, Testing & Methodology
  "Agile / Scrum", "Cypress", "Jest", "Jira", "JUnit", "Mocha", "Playwright", "Postman", "QA Testing", "Selenium", "Vitest",
  // Marketing, Business & HR
  "Content Writing", "Copywriting", "Digital Marketing", "Google Analytics", "HR Management", "Lead Generation", "Market Research", "SEO / SEM", "Social Media Marketing", "Technical Writing"
])).sort((a, b) => a.localeCompare(b));

const GRADUATION_YEARS = Array.from({ length: 15 }, (_, i) => (2015 + i).toString());

export default function ApplicationForm(props: ApplicationFormProps) {
  if (props.initialType === "Internship") {
    return <InternshipApplicationForm initialPosition={props.initialPosition} onSuccess={props.onSuccess} />;
  }
  return <JobApplicationForm {...props} />;
}

function JobApplicationForm({ initialType = "Job", initialPosition = "", onSuccess }: ApplicationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interactive state controls
  const [position, setPosition] = useState<string>(
    JOB_POSITIONS.find(p => p.toLowerCase() === initialPosition.toLowerCase() || p.toLowerCase().includes(initialPosition.toLowerCase())) || initialPosition || "General Talent Application"
  );
  const [workMode, setWorkMode] = useState<string>("Work From Office");
  const [experienceStatus, setExperienceStatus] = useState<string>("Experienced");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React.js", "Node.js", "TypeScript", "Git & GitHub"]);
  const [skillSearch, setSkillSearch] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [skillRating, setSkillRating] = useState<string>("Intermediate");
  const [availability, setAvailability] = useState<string>("Immediately");
  const [declarationChecked, setDeclarationChecked] = useState<boolean>(false);

  // File states
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const filteredSkills = JOB_SKILLS.filter(
    skill => skill.toLowerCase().includes(skillSearch.trim().toLowerCase()) && !selectedSkills.includes(skill)
  ).slice(0, 12);

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size cannot exceed 5 MB. Please select a lighter PDF document.");
        e.target.value = "";
        return;
      }
      if (!file.name.toLowerCase().endsWith(".pdf") && !file.name.toLowerCase().endsWith(".doc") && !file.name.toLowerCase().endsWith(".docx")) {
        setErrorMessage("Please select a PDF, DOC, or DOCX formatted file.");
        e.target.value = "";
        return;
      }
      setErrorMessage(null);
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedSkills.length === 0) {
      setErrorMessage("Please select or search at least one Primary Technical Skill.");
      return;
    }

    if (!declarationChecked) {
      setErrorMessage("You must agree to the accuracy declaration before submitting.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Bind state & inherited position directly to formData
    formData.set("position", position);
    formData.set("employmentType", initialType === "Internship" ? "Internship" : "Full-Time");
    formData.set("workMode", workMode);
    formData.set("experience", experienceStatus);
    formData.set("skills", JSON.stringify(selectedSkills));
    formData.set("rateSkills", skillRating);
    formData.set("availability", availability);
    formData.set("declaration", "true");

    if (resumeFile) formData.set("resume", resumeFile);

    startTransition(async () => {
      try {
        const res = await submitCareerApplication(formData);
        if (res && res.success) {
          form.reset();
          onSuccess(res.recordId);
        } else {
          const msg = res?.error || "An error occurred while submitting your application.";
          setErrorMessage(msg);
          window.scrollTo({ top: 280, behavior: "smooth" });
        }
      } catch (err: any) {
        console.error("submitCareerApplication error:", err);
        const message = err?.message || String(err) || "Network error: Failed to submit application.";
        setErrorMessage(message);
        window.scrollTo({ top: 280, behavior: "smooth" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 text-slate-800" noValidate={false}>
      {errorMessage && (
        <div className="bg-rose-50 p-8 md:p-10 rounded-3xl border border-rose-200/80 shadow-sm flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-2 border border-rose-200">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl md:text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Submission Failed</h3>
          <p className="text-slate-600 text-sm max-w-lg leading-relaxed">{errorMessage}</p>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              window.scrollTo({ top: 280, behavior: "smooth" });
            }}
            className="mt-4 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            Review Form & Retry
          </button>
        </div>
      )}

      {/* SECTION 1: Target Position & Work Preferences */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Position Profile</h3>
            <p className="text-xs text-slate-500">Select target role and your work mode preference</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">1. Target Position *</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              {JOB_POSITIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">2. Preferred Work Mode *</label>
            <div className="grid grid-cols-3 gap-3">
              {["Work From Office", "Remote", "Hybrid"].map((mode) => {
                const isActive = workMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setWorkMode(mode)}
                    className={`py-3 px-2 text-xs sm:text-sm rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isActive 
                        ? "bg-primary text-white shadow-md shadow-primary/30" 
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{mode}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Personal Information */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500">Your official contact details and location</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">3. Full Name *</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">4. Email Address *</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="e.g. rahul.sharma@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">5. Mobile Number *</label>
            <input 
              type="tel" 
              name="mobile" 
              required 
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">6. Current City *</label>
            <input 
              type="text" 
              name="city" 
              required 
              placeholder="e.g. Mumbai, Maharashtra"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Professional Experience */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Professional Experience</h3>
            <p className="text-xs text-slate-500">Your career trajectory, current role, and domain seniority</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">7. Experience Level *</label>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {["Fresher", "Experienced"].map((status) => {
                const isSelected = experienceStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setExperienceStatus(status)}
                    className={`py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30" 
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{status}</span>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">8. Total Experience (Years / Months)</label>
              <input 
                type="text" 
                name="totalExperience" 
                placeholder={experienceStatus === "Fresher" ? "Fresher (0 Years)" : "e.g. 3 Years 4 Months"}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">9. Notice Period / Availability *</label>
              <select
                name="noticePeriod"
                defaultValue="Immediate (15 Days)"
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <option value="Immediate (15 Days)">Immediate (15 Days or less)</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="Currently Serving Notice">Currently Serving Notice</option>
              </select>
            </div>
          </div>

          {experienceStatus === "Experienced" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-fadeIn">
              <div className="flex flex-col justify-end gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">10. Current Company / Employer</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    name="currentCompany" 
                    placeholder="e.g. TCS / Infosys / Tech Mahindra / Startup"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">11. Current Designation</label>
                <input 
                  type="text" 
                  name="currentDesignation" 
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col justify-end gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">12. Current CTC (LPA - Optional)</label>
                <input 
                  type="text" 
                  name="currentCTC" 
                  placeholder="e.g. 6.5 LPA"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col justify-end gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">13. Expected CTC (LPA - Optional)</label>
                <input 
                  type="text" 
                  name="expectedCTC" 
                  placeholder="e.g. 9.0 LPA"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: Academic Information */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Academic Background</h3>
            <p className="text-xs text-slate-500">Your highest degree qualification and institution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">14. Highest Qualification *</label>
            <select 
              name="highestQualification" 
              required
              defaultValue="B.Tech/B.E."
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <option value="Diploma">Diploma</option>
              <option value="B.Tech/B.E.">B.Tech/B.E.</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="M.Tech">M.Tech</option>
              <option value="B.Sc.">B.Sc.</option>
              <option value="M.Sc.">M.Sc.</option>
              <option value="MBA">MBA</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col justify-end gap-2 md:col-span-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">15. College / University Name *</label>
            <input 
              type="text" 
              name="college" 
              required 
              placeholder="e.g. IIT Bombay / Mumbai University / COEP"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">16. Graduation Year *</label>
            <select 
              name="graduationYear" 
              required
              defaultValue="2024"
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              {GRADUATION_YEARS.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 5: Technical Skills & Arsenal */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Technical Arsenal & Skills</h3>
            <p className="text-xs text-slate-500">Search and select all languages, frameworks, and technologies in your stack</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">17. Primary Skills * (Search & select all applicable)</label>
              <p className="text-xs text-slate-500 mt-1">
                Type below to search our extensive library of over 120+ languages, frameworks, AI models, cloud, and dev tools.
              </p>
            </div>

            {/* Search Bar with Autocomplete */}
            <div className="relative z-20">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={skillSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      if (skillSearch.trim()) {
                        const skillToAdd = filteredSkills.length > 0 ? filteredSkills[0] : skillSearch.trim();
                        if (!selectedSkills.includes(skillToAdd)) {
                          setSelectedSkills([...selectedSkills, skillToAdd]);
                        }
                        setSkillSearch("");
                      }
                    }
                  }}
                  placeholder="Search skills (e.g. React, Next.js, Node.js, Python, AWS, Docker, Cyber Security)..."
                  className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 text-sm font-semibold text-slate-800 shadow-sm transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
                {skillSearch && (
                  <button
                    type="button"
                    onClick={() => setSkillSearch("")}
                    className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {(isSearchFocused || skillSearch) && (filteredSkills.length > 0 || skillSearch.trim().length > 0) && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl max-h-64 overflow-y-auto overflow-x-hidden z-30 divide-y divide-slate-100">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        if (!selectedSkills.includes(skill)) {
                          setSelectedSkills([...selectedSkills, skill]);
                        }
                        setSkillSearch("");
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-purple-500" />
                        {skill}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100/80 px-2 py-0.5 rounded-md">
                        + Add Skill
                      </span>
                    </button>
                  ))}
                  
                  {skillSearch.trim().length > 0 && !selectedSkills.some(s => s.toLowerCase() === skillSearch.trim().toLowerCase()) && (
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        const customSkill = skillSearch.trim();
                        if (!selectedSkills.includes(customSkill)) {
                          setSelectedSkills([...selectedSkills, customSkill]);
                        }
                        setSkillSearch("");
                      }}
                      className="w-full text-left px-4 py-3.5 text-sm font-bold text-purple-700 bg-purple-50/70 hover:bg-purple-100 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Add custom skill: <span className="underline">&ldquo;{skillSearch.trim()}&rdquo;</span></span>
                      </span>
                      <span className="text-xs font-bold text-purple-600 bg-purple-200/60 px-2.5 py-1 rounded-lg shrink-0">Press Enter</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Selected Skills Showcase */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                <span>Selected Skills ({selectedSkills.length})</span>
                {selectedSkills.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSkills([])}
                    className="text-[11px] font-bold text-rose-500 hover:text-rose-600 hover:underline transition-colors cursor-pointer lowercase"
                  >
                    clear all
                  </button>
                )}
              </div>
              
              {selectedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill}
                      className="inline-flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:scale-[1.02]"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className="p-1 rounded-lg bg-white/20 hover:bg-rose-500 text-white transition-colors cursor-pointer ml-0.5"
                        title={`Remove ${skill}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-center text-slate-400 text-xs font-semibold">
                  No skills selected yet. Search above to highlight your technical expertise!
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200/60">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">18. Self-Rated Technical Proficiency *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg">
              {["Beginner", "Intermediate", "Advanced"].map((level) => {
                const isCurrent = skillRating === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSkillRating(level)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCurrent 
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/30 border-purple-600" 
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{level}</span>
                    {isCurrent && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Resume & Developer Profiles */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Resume & Developer Profiles</h3>
            <p className="text-xs text-slate-500">Upload your PDF resume and attach your professional links</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">19. Upload Your Resume / CV (PDF) *</label>
            <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              resumeFile 
                ? "bg-emerald-50/50 border-emerald-300 text-emerald-800" 
                : "bg-white border-slate-300 hover:border-primary/50 text-slate-600 hover:bg-slate-50"
            }`}>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                required
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {resumeFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">{resumeFile.name}</p>
                    <p className="text-xs text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready for HR evaluation</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-sm ml-auto">
                    Uploaded ✔
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">Click to attach or drag and drop your resume document</p>
                  <p className="text-xs text-slate-400 font-medium">Supports PDF, DOC, DOCX (Max size: 5 MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">20. GitHub Profile</label>
              <input 
                type="url" 
                name="gitHub" 
                placeholder="https://github.com/yourusername"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">21. LinkedIn Profile</label>
              <input 
                type="url" 
                name="linkedIn" 
                placeholder="https://linkedin.com/in/yourusername"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">22. Portfolio / Live Project Link</label>
              <input 
                type="url" 
                name="portfolioWebsite" 
                placeholder="https://yourportfolio.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">23. Coding Profile (Optional)</label>
              <input 
                type="url" 
                name="codingProfile" 
                placeholder="LeetCode, HackerRank, CodeChef URL"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7: Screening Questions */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Screening Questions</h3>
            <p className="text-xs text-slate-500">Help our hiring leaders understand your technical vision and drive</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">24. Tell us about yourself in 2–3 sentences. *</label>
            <textarea 
              name="aboutYourself" 
              required
              rows={3}
              placeholder="Summarize your engineering background, core technical strengths, and professional ambitions..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">25. Describe one major project you&apos;re proud of. *</label>
            <textarea 
              name="proudProject" 
              required
              rows={3}
              placeholder="Explain the problem solved, tech stack used (React, Node, Python, AWS, Docker, etc.), and your direct contributions..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">26. Why do you want to join DevTech IT Solutions Pvt. Ltd.? *</label>
            <textarea 
              name="whyJoinDevTech" 
              required
              rows={3}
              placeholder="What attracts you to DevTech's enterprise client projects, modern architecture, and engineering culture?"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">27. Why should we hire you for this position? *</label>
            <textarea 
              name="whyHireYou" 
              required
              rows={3}
              placeholder="Detail your unique technical capabilities, speed of execution, team collaboration, and value creation..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>
        </div>
      </div>

      {/* SECTION 8: Joining Schedule & Discovery */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Joining Availability & Discovery</h3>
            <p className="text-xs text-slate-500">Your potential start timeline and referral source</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">28. When can you join? *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {["Immediately", "Within 15 Days", "Within 30 Days", "More than 30 Days"].map((option) => {
                const isActive = availability === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAvailability(option)}
                    className={`py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isActive 
                        ? "bg-primary text-white shadow-md shadow-primary/30 border-primary" 
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{option}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">29. How did you hear about DevTech IT Solutions?</label>
            <select 
              name="hearAboutUs" 
              defaultValue="Company Website"
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <option value="Company Website">Company Website</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Friend/Referral">Friend / Referral</option>
              <option value="Google Search">Google Search</option>
              <option value="Job Portal">Job Portal (Naukri, Indeed, Glassdoor)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 9: Declaration & Digital Signature */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Declaration & Signoff</h3>
            <p className="text-xs text-slate-500">Legal confirmation and applicant digital verification</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary/40 cursor-pointer shrink-0 border-slate-300" 
              />
              <div>
                <span className="text-sm font-bold text-slate-900 block">30. I confirm that all the information provided is accurate. * (☐ I Agree)</span>
                <span className="text-xs text-slate-500 mt-1 block">
                  I understand that any discrepancy or intentional misrepresentation in academic scores, work history, or project links may result in disqualification from DevTech IT Solutions&apos; recruitment process.
                </span>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">31. Full Name (Digital Signature) *</label>
            <input 
              type="text" 
              name="digitalSignature" 
              required 
              placeholder="Type your full name exactly as above to serve as your verified electronic signature"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SUBMISSION ACTION */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 text-center sm:text-left">
          By clicking <strong className="text-slate-700">Submit Application</strong>, your application profile and attached CV will be securely transmitted to DevTech HR Specialists via encrypted HTTPS.
        </p>
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto min-w-[240px] px-8 py-4 rounded-2xl bg-primary hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-xl shadow-primary/30 hover:shadow-primary/40 disabled:opacity-60 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Submitting your application...</span>
            </>
          ) : (
            <>
              <span>Submit Application</span>
              <Check className="w-5 h-5 text-white" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
