import { db, isFirebaseConfigured } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { CURRENT_OPPORTUNITIES } from "./careers-data";

export async function seedFirebaseCollections() {
  if (!db || !isFirebaseConfigured()) {
    console.log("⚠️ Firebase is not configured properly.");
    return { success: false, message: "Firebase not configured" };
  }

  try {
    console.log("🔥 Starting Firebase Firestore Data Seeding...");

    // 1. Seed Opportunities Collection
    for (const opp of CURRENT_OPPORTUNITIES) {
      const record = {
        ...opp,
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, "opportunities", opp.id), record);
      console.log(`✓ Seeded Opportunity: ${opp.id} (${opp.title})`);
    }

    // 2. Seed Sample Candidate Application Dossier
    const sampleApplication = {
      id: "DEVTECH-SAMPLE-101",
      submittedAt: new Date().toISOString(),
      personalInfo: {
        fullName: "Yash Bhavsar",
        email: "yashm@gmail.com",
        mobile: "+91 9326093960",
        city: "Mumbai"
      },
      applicationInfo: {
        type: "Full-Time",
        position: "Full Stack Developer",
        experience: "2+ Years",
        workMode: "Hybrid / Remote",
        expectedCTC: "12 LPA"
      },
      education: {
        highestQualification: "B.Tech Computer Engineering",
        college: "Mumbai University",
        graduationYear: "2024",
        cgpa: "9.2 / 10"
      },
      skills: ["React.js", "Next.js", "TypeScript", "Node.js", "Firebase", "Tailwind CSS"],
      rateSkills: "Expert / Advanced",
      portfolioLinks: {
        gitHub: "https://github.com/devtech-website",
        linkedIn: "https://www.linkedin.com/in/devtech-it-solution",
        portfolioWebsite: "https://devtechitsolution.com"
      },
      documents: {
        resumeName: "Yash_Bhavsar_Resume.pdf",
        resumeSize: 245120,
        resumeType: "application/pdf",
        resumeUrl: "#"
      },
      screeningQuestions: {
        aboutYourself: "Passionate Full Stack & Systems Engineer dedicated to building enterprise software.",
        proudProject: "DevTech Enterprise Website & Firebase Automated CMS Portal.",
        whyJoinDevTech: "To pioneer scalable modern software solutions for international client brands."
      },
      availability: "Immediate Joiner (0 Days)",
      digitalSignature: "Yash Bhavsar"
    };
    await setDoc(doc(db, "career_applications", sampleApplication.id), sampleApplication);
    console.log(`✓ Seeded Sample Candidate Application: ${sampleApplication.id}`);

    // 3. Seed Sample Client Project Inquiry
    const sampleInquiry = {
      id: "INQ-SAMPLE-201",
      submittedAt: new Date().toISOString(),
      firstName: "Yash",
      lastName: "Bhavsar",
      email: "yashm@gmail.com",
      message: "Hello DevTech Team! We need a full-stack web and mobile application with Firebase cloud database integration for our company.",
      status: "New"
    };
    await setDoc(doc(db, "contact_inquiries", sampleInquiry.id), sampleInquiry);
    console.log(`✓ Seeded Sample Client Project Inquiry: ${sampleInquiry.id}`);

    console.log("🎉 Firebase Firestore Seeding Successfully Completed!");
    return { success: true, message: "Firebase collections seeded successfully" };
  } catch (error) {
    console.error("❌ Error seeding Firebase collections:", error);
    return { success: false, error: String(error) };
  }
}
