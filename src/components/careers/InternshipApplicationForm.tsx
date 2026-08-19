"use client";

import React, { useState, useTransition } from "react";
import { submitCareerApplication } from "@/app/actions/career-application";
import { 
  User, Briefcase, GraduationCap, Code2, Globe, FileUp, FileCheck, 
  AlertCircle, Check, Plus, Loader2, Lock, Clock, Sparkles, Award, Star, Search, X 
} from "lucide-react";

interface InternshipFormProps {
  initialPosition?: string;
  onSuccess: (recordId?: string) => void;
}

const INTERNSHIP_POSITIONS = [
  "Frontend Development Intern",
  "Backend Development Intern",
  "Full Stack Development Intern",
  "React.js Intern",
  "Node.js Intern",
  "UI/UX Design Intern",
  "Graphic Design Intern",
  "Flutter Development Intern",
  "AI/ML Intern",
  "Cyber Security Intern",
  "QA Testing Intern",
  "Digital Marketing Intern",
  "HR Intern",
  "Business Development Intern",
  "Other"
];

const INTERN_SKILLS = Array.from(new Set([
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

const EXPECTED_GRAD_YEARS = Array.from({ length: 8 }, (_, i) => (2026 + i).toString());

export default function InternshipApplicationForm({ initialPosition = "", onSuccess }: InternshipFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interactive UI state controls
  const [position, setPosition] = useState<string>(
    INTERNSHIP_POSITIONS.find(p => p.toLowerCase().includes(initialPosition.toLowerCase())) || initialPosition || "Full Stack Development Intern"
  );
  const [internshipMode, setInternshipMode] = useState<string>("Work From Office");
  const [mandatoryInternship, setMandatoryInternship] = useState<string>("No");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["HTML5", "JavaScript", "React.js", "Git & GitHub"]);
  const [skillSearch, setSkillSearch] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const filteredSkills = INTERN_SKILLS.filter(
    skill => skill.toLowerCase().includes(skillSearch.trim().toLowerCase()) && !selectedSkills.includes(skill)
  ).slice(0, 12);

  const [skillRating, setSkillRating] = useState<string>("Intermediate");
  const [startSchedule, setStartSchedule] = useState<string>("Immediately");
  const [workedClientProjects, setWorkedClientProjects] = useState<string>("No");
  const [declarationChecked, setDeclarationChecked] = useState<boolean>(false);

  // File states
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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
        setErrorMessage("Please select a PDF, DOC, or DOCX formatted document.");
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
      setErrorMessage("Please add at least one Primary Skill using the search bar.");
      return;
    }

    if (!declarationChecked) {
      setErrorMessage("You must agree to the student accuracy declaration before submitting.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Bind controlled state directly to submission payload
    formData.set("employmentType", "Internship");
    formData.set("position", position);
    formData.set("internshipMode", internshipMode);
    formData.set("mandatoryCollegeInternship", mandatoryInternship);
    formData.set("skills", JSON.stringify(selectedSkills));
    formData.set("rateSkills", skillRating);
    formData.set("availability", startSchedule);
    formData.set("declaration", "true");

    if (resumeFile) formData.set("resume", resumeFile);

    startTransition(async () => {
      try {
        const res = await submitCareerApplication(formData);
        if (res && res.success) {
          form.reset();
          onSuccess(res.recordId);
        } else {
          setErrorMessage(res.error || "An error occurred while submitting your application.");
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

      {/* SECTION 1: Personal Information */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500">Your contact credentials and location details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">1. Full Name *</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              placeholder="e.g. Anaya Patel"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">2. Email Address *</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="e.g. anaya.patel@college.edu"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">3. Mobile Number *</label>
            <input 
              type="tel" 
              name="mobile" 
              required 
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">4. Current City *</label>
            <input 
              type="text" 
              name="city" 
              required 
              placeholder="e.g. Pune, Maharashtra"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Internship Details */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Internship Details</h3>
            <p className="text-xs text-slate-500">Specify your desired internship specialty, mode, and duration</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">5. Internship Position Applying For *</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              {INTERNSHIP_POSITIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">6. Internship Mode Preferred *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Work From Office", "Remote", "Hybrid"].map((mode) => {
                const isActive = internshipMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setInternshipMode(mode)}
                    className={`py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isActive 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 border-indigo-600" 
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{mode}</span>
                    {isActive && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">7. Preferred Internship Duration *</label>
              <select
                name="internshipDuration"
                required
                defaultValue="3 Months"
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">8. Are you looking for a mandatory college internship? *</label>
              <div className="grid grid-cols-2 gap-4">
                {["Yes", "No"].map((choice) => {
                  const isSelected = mandatoryInternship === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setMandatoryInternship(choice)}
                      className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-primary text-white shadow-md shadow-primary/30" 
                          : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span>{choice}</span>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Academic Information */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Academic Information</h3>
            <p className="text-xs text-slate-500">Your college studies, semester status, and scholastic records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">9. Current Qualification *</label>
            <select 
              name="highestQualification" 
              required
              defaultValue="B.Tech/B.E."
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <option value="Diploma">Diploma</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="B.Tech/B.E.">B.Tech/B.E.</option>
              <option value="M.Tech">M.Tech</option>
              <option value="B.Sc.">B.Sc.</option>
              <option value="M.Sc.">M.Sc.</option>
              <option value="MBA">MBA</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">10. College / University Name *</label>
            <input 
              type="text" 
              name="college" 
              required 
              placeholder="e.g. VIT / Mumbai University / IIT Delhi"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">11. Current Year / Semester *</label>
            <select 
              name="currentSemester" 
              required
              defaultValue="Third Year"
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <option value="First Year">First Year</option>
              <option value="Second Year">Second Year</option>
              <option value="Third Year">Third Year</option>
              <option value="Final Year">Final Year</option>
              <option value="Recently Graduated">Recently Graduated</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">12. Expected Graduation *</label>
              <select 
                name="graduationYear" 
                required
                defaultValue="2027"
                className="w-full px-3.5 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                {EXPECTED_GRAD_YEARS.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">13. CGPA / Percentage *</label>
              <input 
                type="text" 
                name="cgpa" 
                required 
                placeholder="e.g. 8.4 CGPA or 82%"
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Technical Skills */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Technical Skills</h3>
            <p className="text-xs text-slate-500">Check all languages, frameworks, and methodologies in your skillset</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">14. Primary Skills * (Search and add all that apply)</label>
              <p className="text-xs text-slate-500 mt-1">
                Type below to search our extensive library of over 120+ programming languages, frameworks, AI/ML tools, and design methodologies.
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
                  placeholder="Search skills (e.g. React, Python, Docker, Figma, Cyber Security, AWS)..."
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

              {/* Suggestions Dropdown Modal */}
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

            {/* Selected Skills Showcase (Display below search bar) */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                <span>Selected Expertise ({selectedSkills.length})</span>
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
                      className="inline-flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 transition-all hover:shadow-lg hover:scale-[1.02]"
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
                  No skills selected yet. Start searching above to showcase your technologies!
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200/60">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">15. Rate Your Technical Skills *</label>
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

      {/* SECTION 5: Resume & Portfolio */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Resume & Portfolio</h3>
            <p className="text-xs text-slate-500">Upload your PDF resume and link your developer profiles</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">16. Upload Your Resume / Academic CV (PDF) *</label>
            <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              resumeFile 
                ? "bg-emerald-50/50 border-emerald-300 text-emerald-800" 
                : "bg-white border-slate-300 hover:border-teal-500 text-slate-600 hover:bg-slate-50"
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
                    <p className="text-xs text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready for HR delivery</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-sm ml-auto">
                    Uploaded ✔
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-2">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-1">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">Click to attach or drag and drop your academic resume</p>
                  <p className="text-xs text-slate-400 font-medium">Supports PDF, DOC, DOCX (Max size: 5 MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">17. GitHub Profile *</label>
              <input 
                type="url" 
                name="gitHub" 
                required
                placeholder="https://github.com/yourusername"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">18. LinkedIn Profile</label>
              <input 
                type="url" 
                name="linkedIn" 
                placeholder="https://linkedin.com/in/yourusername"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">19. Portfolio / Live Project Link</label>
              <input 
                type="url" 
                name="portfolioWebsite" 
                placeholder="https://yourportfolio-demo.vercel.app"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">20. Coding Profile (Optional)</label>
              <input 
                type="url" 
                name="codingProfile" 
                placeholder="LeetCode, HackerRank, CodeChef, Codeforces URL"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Projects & Learning */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Projects & Learning</h3>
            <p className="text-xs text-slate-500">Showcase your hands-on coding milestones and continuous growth</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">21. Describe one academic or personal project you&apos;re most proud of. *</label>
            <textarea 
              name="proudProject" 
              required
              rows={3}
              placeholder="Detail the project objective, tech stack (React, Python, Node, AI, etc.), architecture, and your personal contributions..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">22. Which technologies are you currently learning? *</label>
            <textarea 
              name="technologiesLearning" 
              required
              rows={2}
              placeholder="e.g. Currently advancing in Next.js 15, TypeScript, Cloudflare Workers, and GenAI agent integration..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">23. Have you completed any certifications? If yes, mention them.</label>
            <textarea 
              name="certifications" 
              rows={2}
              placeholder="e.g. AWS Cloud Practitioner, Google Coursera Data Analytics, Udemy React Masterclass, Cisco Networking..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>
        </div>
      </div>

      {/* SECTION 7: Internship Motivation */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Internship Motivation</h3>
            <p className="text-xs text-slate-500">Why DevTech aligns with your learning aspirations and career kickstart</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">24. Why do you want to intern at DevTech IT Solutions Pvt. Ltd.? *</label>
            <textarea 
              name="whyJoinDevTech" 
              required
              rows={3}
              placeholder="What draws you to DevTech's dynamic client software deliverables and engineering mentorship culture?"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">25. What do you expect to learn during this internship? *</label>
            <textarea 
              name="expectToLearn" 
              required
              rows={2}
              placeholder="e.g. Real-world Agile teamwork, enterprise database optimization, production deployment workflows..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">26. Why should we select you for this internship? *</label>
            <textarea 
              name="whyHireYou" 
              required
              rows={3}
              placeholder="Highlight your dedication, fast problem-solving reflexes, curiosity, and value to our senior mentors..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>
        </div>
      </div>

      {/* SECTION 8: Availability */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Availability & Hours</h3>
            <p className="text-xs text-slate-500">Your potential joining date and weekly commitment capabilities</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">27. When can you start your internship? *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {["Immediately", "Within 7 Days", "Within 15 Days", "Within 30 Days"].map((opt) => {
                const isSelected = startSchedule === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStartSchedule(opt)}
                    className={`py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-amber-600 text-white shadow-md shadow-amber-500/30 border-amber-600" 
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">28. How many hours can you dedicate per week? *</label>
            <select
              name="dedicateHours"
              required
              defaultValue="Full Time"
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <option value="Less than 10 Hours">Less than 10 Hours</option>
              <option value="10–20 Hours">10–20 Hours (Part Time)</option>
              <option value="20–30 Hours">20–30 Hours</option>
              <option value="30–40 Hours">30–40 Hours</option>
              <option value="Full Time">Full Time (40+ Hours)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 9: ⭐ Optional HR Screening Questions */}
      <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-slate-50 p-7 md:p-8 rounded-3xl border-2 border-violet-200/80 shadow-md space-y-6">
        <div className="flex items-center gap-3 border-b border-violet-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-200/80 text-violet-700 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-current text-violet-600" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-violet-950 flex items-center gap-2">
              <span>⭐ Optional HR Screening Questions</span>
              <span className="text-[10px] bg-violet-600 text-white px-2.5 py-0.5 rounded-full uppercase font-bold">Highly Recommended</span>
            </h3>
            <p className="text-xs text-violet-700 font-medium">Answering these helps our talent managers shortlist candidates far more rapidly!</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">29. Have you participated in any hackathons or coding competitions?</label>
            <textarea 
              name="hackathons" 
              rows={2}
              placeholder="e.g. Smart India Hackathon finalist, SIH 2024, competitive coding contests, college tech fests..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-600 text-sm transition-all shadow-sm resize-y"
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">30. Have you worked on any live client or freelance projects?</label>
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              {["Yes", "No"].map((res) => {
                const active = workedClientProjects === res;
                return (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setWorkedClientProjects(res)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      active 
                        ? "bg-violet-600 text-white shadow-md shadow-violet-500/30" 
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{res}</span>
                    {active && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {workedClientProjects === "Yes" && (
            <div className="space-y-2 animate-fadeIn">
              <label className="block text-xs font-bold uppercase tracking-wider text-violet-900">31. If yes, briefly describe your role and responsibilities:</label>
              <textarea 
                name="freelanceProjects" 
                rows={2}
                placeholder="Explain the client deliverable, your specific module implementation, and end user impact..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-600 text-sm transition-all shadow-sm resize-y"
              ></textarea>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">32. How did you hear about DevTech IT Solutions Pvt. Ltd.?</label>
            <select 
              name="hearAboutUs" 
              defaultValue="Company Website"
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-600 text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <option value="Company Website">Company Website</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="College">College Placement / Campus</option>
              <option value="Friend/Referral">Friend / Referral</option>
              <option value="Google Search">Google Search</option>
              <option value="Job Portal">Job Portal (Internshala, Naukri, etc.)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 10: Declaration */}
      <div className="bg-slate-50/70 p-7 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">Declaration & Signoff</h3>
            <p className="text-xs text-slate-500">Student legal confirmation and verified electronic signature</p>
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
                <span className="text-sm font-bold text-slate-900 block">33. I confirm that all the information provided is accurate. * (☐ I Agree)</span>
                <span className="text-xs text-slate-500 mt-1 block">
                  I confirm that all academic percentages, university status, and project descriptions are truthful and correct. I understand any misrepresentation may result in disqualification from DevTech IT Solutions&apos; student internship onboarding.
                </span>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">34. Full Name (Digital Signature) *</label>
            <input 
              type="text" 
              name="digitalSignature" 
              required 
              placeholder="Type your full student name to serve as your electronic signature"
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm font-semibold transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* SUBMISSION ACTION */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 text-center sm:text-left">
          By clicking <strong className="text-slate-700">Submit Internship Application</strong>, your student profile and attached CV will be encrypted and transmitted to DevTech HR Specialists.
        </p>
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto min-w-[260px] px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:shadow-indigo-600/40 disabled:opacity-60 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Submitting your application...</span>
            </>
          ) : (
            <>
              <span>Submit Internship Application</span>
              <Check className="w-5 h-5 text-white" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
