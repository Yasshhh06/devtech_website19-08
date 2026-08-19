export interface Opportunity {
  id: string;
  title: string;
  department: string;
  type: "Job" | "Internship";
  employmentType: string;
  experience: string;
  location: string;
  description: string;
  slug: string;
  status?: "Active" | "Closed";
}

export const CURRENT_OPPORTUNITIES: Opportunity[] = [
  // Jobs
  {
    id: "job-1",
    title: "Frontend Developer",
    department: "Engineering",
    type: "Job",
    employmentType: "Full-Time",
    experience: "2+ Years",
    location: "Mumbai / Remote",
    description: "Build reactive, blazing-fast web applications using React, Next.js, TypeScript, and modern styling frameworks.",
    slug: "frontend-developer"
  },
  {
    id: "job-2",
    title: "Backend Developer",
    department: "Engineering",
    type: "Job",
    employmentType: "Full-Time",
    experience: "2–5 Years",
    location: "Remote",
    description: "Design and scale robust microservices, APIs, and cloud architecture using Node.js, Go, and PostgreSQL.",
    slug: "backend-developer"
  },
  {
    id: "job-3",
    title: "Full Stack Developer",
    department: "Engineering",
    type: "Job",
    employmentType: "Full-Time",
    experience: "3+ Years",
    location: "Hybrid (Mumbai)",
    description: "Own features end-to-end across frontend client interfaces and backend serverless computing infrastructure.",
    slug: "full-stack-developer"
  },
  {
    id: "job-4",
    title: "UI/UX Designer",
    department: "Design",
    type: "Job",
    employmentType: "Full-Time",
    experience: "2+ Years",
    location: "Remote / Mumbai",
    description: "Craft modern, breathtaking user interfaces, interactive wireframes, and intuitive design systems in Figma.",
    slug: "ui-ux-designer"
  },
  {
    id: "job-5",
    title: "Flutter Developer",
    department: "Mobile Engineering",
    type: "Job",
    employmentType: "Full-Time",
    experience: "1–3 Years",
    location: "Remote",
    description: "Develop seamless cross-platform iOS and Android mobile experiences with clean architecture and fluid animations.",
    slug: "flutter-developer"
  },
  {
    id: "job-6",
    title: "Cyber Security Analyst",
    department: "Security",
    type: "Job",
    employmentType: "Full-Time",
    experience: "2+ Years",
    location: "Mumbai",
    description: "Conduct security assessments, vulnerability assessments, penetration testing, and secure infrastructure auditing.",
    slug: "cyber-security-analyst"
  },
  {
    id: "job-7",
    title: "Digital Marketing Executive",
    department: "Marketing",
    type: "Job",
    employmentType: "Full-Time",
    experience: "1–3 Years",
    location: "Remote",
    description: "Drive digital growth strategies, organic SEO optimization, content campaigns, and performance analytics.",
    slug: "digital-marketing-executive"
  },
  {
    id: "job-8",
    title: "HR Executive",
    department: "Human Resources",
    type: "Job",
    employmentType: "Full-Time",
    experience: "1–3 Years",
    location: "Mumbai",
    description: "Manage talent acquisition, employee onboarding, culture engagement initiatives, and people operations.",
    slug: "hr-executive"
  },
  {
    id: "job-9",
    title: "Business Development Executive",
    department: "Sales",
    type: "Job",
    employmentType: "Full-Time",
    experience: "2+ Years",
    location: "Hybrid",
    description: "Identify global business opportunities, drive strategic IT consulting partnerships, and manage enterprise relationships.",
    slug: "business-development-executive"
  },
  {
    id: "job-10",
    title: "Software Testing Engineer",
    department: "Quality Assurance",
    type: "Job",
    employmentType: "Full-Time",
    experience: "1–4 Years",
    location: "Remote / Mumbai",
    description: "Execute rigorous automated and manual QA testing, integration testing, and performance stress testing.",
    slug: "software-testing-engineer"
  },

  // Internships
  {
    id: "intern-1",
    title: "Frontend Developer Intern",
    department: "Engineering",
    type: "Internship",
    employmentType: "Internship (3–6 Months)",
    experience: "Fresher / Enrolled",
    location: "Remote",
    description: "Get hands-on mentorship building real-world enterprise Next.js applications and responsive web animations.",
    slug: "frontend-developer-intern"
  },
  {
    id: "intern-2",
    title: "Backend Developer Intern",
    department: "Engineering",
    type: "Internship",
    employmentType: "Internship (3–6 Months)",
    experience: "Fresher / Enrolled",
    location: "Remote",
    description: "Learn API design, database management, authentication flows, and scalable server architectures.",
    slug: "backend-developer-intern"
  },
  {
    id: "intern-3",
    title: "Cyber Security Intern",
    department: "Security",
    type: "Internship",
    employmentType: "Internship (3–6 Months)",
    experience: "Fresher / Enrolled",
    location: "Mumbai",
    description: "Assist security experts in penetration testing, threat modeling, security monitoring, and ethical hacking.",
    slug: "cyber-security-intern"
  },
  {
    id: "intern-4",
    title: "UI/UX Intern",
    department: "Design",
    type: "Internship",
    employmentType: "Internship (3–6 Months)",
    experience: "Fresher / Portfolio",
    location: "Remote",
    description: "Collaborate on user journey research, modern visual UI design concepts, and interactive design prototypes.",
    slug: "ui-ux-intern"
  },
  {
    id: "intern-5",
    title: "Digital Marketing Intern",
    department: "Marketing",
    type: "Internship",
    employmentType: "Internship (3 Months)",
    experience: "Fresher",
    location: "Remote",
    description: "Work on social media branding, content strategy, campaign optimization, and growth analytics.",
    slug: "digital-marketing-intern"
  }
];

export const WHY_JOIN_DEVTECH_CARDS = [
  {
    title: "Work on Live Client Projects",
    description: "Gain real industry experience by working on active client solutions deployed globally rather than isolated practice tasks.",
    icon: "Briefcase"
  },
  {
    title: "Learning & Career Growth",
    description: "Continuous learning, mentorship, certification opportunities, and career advancement to help you grow professionally.",
    icon: "TrendingUp"
  },
  {
    title: "Modern Technologies",
    description: "Work with modern technologies including React, Next.js, TypeScript, Node.js, Cloud, AI, Cyber Security, and scalable enterprise solutions.",
    icon: "Cpu"
  },
  {
    title: "Supportive Team Culture",
    description: "Join a collaborative environment where knowledge sharing, teamwork, innovation, and respect drive success.",
    icon: "Users"
  },
  {
    title: "Mentorship from Experienced Professionals",
    description: "Learn directly from experienced engineers through code reviews, technical guidance, architecture discussions, and real-world best practices.",
    icon: "GraduationCap"
  },
  {
    title: "Flexible Work Environment",
    description: "Enjoy a healthy work-life balance with flexible work arrangements, collaborative communication, and productivity-focused culture.",
    icon: "Clock"
  }
];


export const HIRING_PROCESS_STAGES = [
  {
    step: "01",
    title: "Application Submitted",
    description: "Submit your credentials, portfolio, and detailed application through our career portal.",
    icon: "Send"
  },
  {
    step: "02",
    title: "Application Review",
    description: "Our talent team reviews your technical background, skills, and past projects.",
    icon: "Search"
  },
  {
    step: "03",
    title: "HR Screening",
    description: "A preliminary introductory discussion to understand your career motivations and culture alignment.",
    icon: "PhoneCall"
  },
  {
    step: "04",
    title: "Technical Interview",
    description: "An in-depth assessment of your domain competencies, problem-solving, and code quality.",
    icon: "Code2"
  },
  {
    step: "05",
    title: "Final Discussion",
    description: "A collaborative conversation with leadership regarding team placement, projects, and goals.",
    icon: "Users2"
  },
  {
    step: "06",
    title: "Offer Letter",
    description: "Receive your official employment offer and welcome package to begin onboarding!",
    icon: "FileCheck"
  }
];

export const EMPLOYEE_BENEFITS = [
  {
    title: "Career Growth",
    description: "Clear promotion rubrics and skill pathways to transition from junior roles to tech leadership.",
    icon: "TrendingUp"
  },
  {
    title: "Hands-on Live Projects",
    description: "Direct ownership of impactful production code powering real enterprise clients globally.",
    icon: "Globe"
  },
  {
    title: "Learning Opportunities",
    description: "Access to online learning libraries, workshops, and industry conferences to stay ahead.",
    icon: "BookOpen"
  },
  {
    title: "Team Collaboration",
    description: "Work alongside exceptional peers in cross-functional agile pods designed for rapid delivery.",
    icon: "Users"
  },
  {
    title: "Flexible Work Culture",
    description: "Empathetic hybrid and remote policies supporting harmonious work-life balance.",
    icon: "Heart"
  },
  {
    title: "Recognition & Rewards",
    description: "Monthly spotlights, competitive performance bonuses, and peer-nominated awards.",
    icon: "Award"
  },
  {
    title: "Modern Technologies",
    description: "Zero legacy stagnation; leverage cloud-native tools, modern languages, and AI automation.",
    icon: "Layers"
  },
  {
    title: "Professional Development",
    description: "Regular 1-on-1 career coaching sessions and leadership mentorship to accelerate milestones.",
    icon: "Sparkles"
  }
];

export const CAREER_FAQS = [
  {
    question: "Can freshers apply?",
    answer: "Absolutely! We actively welcome passionate freshers and recent college graduates who display strong problem-solving skills, willingness to learn, and a solid academic or project foundation."
  },
  {
    question: "Do you offer internships?",
    answer: "Yes, we run structured internship programs in Software Engineering, UI/UX Design, Cybersecurity, and Digital Marketing. Interns gain direct mentorship working on live production applications."
  },
  {
    question: "Is remote work available?",
    answer: "Yes, depending on the position requirements and team structure, we offer fully remote and flexible hybrid setups for both experienced professionals and select internship roles."
  },
  {
    question: "Do interns receive certificates?",
    answer: "Yes, upon successful completion of the internship program, every intern receives an official completion certificate, detailed experience letter, and top performers are evaluated for permanent full-time conversion offers."
  },
  {
    question: "How long does the recruitment process take?",
    answer: "Our standardized recruitment workflow typically concludes within 7 to 14 working days from initial submission to official offer letter, ensuring transparent communication at every stage."
  }
];

export const POPULAR_SKILLS = [
  "React", "Next.js", "TypeScript", "JavaScript (ES6+)", "Node.js", "Express", "PostgreSQL",
  "MongoDB", "Tailwind CSS", "Redux Toolkit", "Framer Motion", "Python", "Go", "Docker",
  "AWS / Cloud", "Git / GitHub", "UI/UX Design", "Figma", "Wireframing", "Flutter",
  "Dart", "Cybersecurity", "Penetration Testing", "Vulnerability Assessment", "Network Security",
  "SEO / Google Analytics", "Social Media Marketing", "Content Strategy", "HR Management",
  "Talent Acquisition", "Business Development", "Client Communication", "Manual Testing",
  "Automated Testing", "Selenium / Cypress", "Agile / Scrum"
];
