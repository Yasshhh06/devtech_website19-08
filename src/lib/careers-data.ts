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

export const CURRENT_OPPORTUNITIES: Opportunity[] = [];

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
