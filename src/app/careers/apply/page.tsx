// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { motion } from "framer-motion";
// import { ArrowLeft, UploadCloud, CheckCircle2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// function ApplicationForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const roleFromUrl = searchParams.get("role") || "";
  
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Format slug to readable title (e.g., frontend-engineer -> Frontend Engineer)
//   const formatRole = (role: string) => {
//     if (!role) return "";
//     return role.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const formData = new FormData(e.currentTarget);
//     const name = formData.get("name");
//     const email = formData.get("email");
//     const phone = formData.get("phone");
//     const location = formData.get("location");
//     const role = formData.get("role");
//     const experience = formData.get("experience");
//     const linkedin = formData.get("linkedin");
//     const portfolio = formData.get("portfolio");
//     const coverLetter = formData.get("coverLetter");
//     const notes = formData.get("notes");

//     const subject = `New Job Application: ${name} - ${role}`;
//     const body = `Hello DevTech IT Solution Team,

// A new job application has been submitted.

// Applicant Details:
// - Name: ${name}
// - Email: ${email}
// - Phone: ${phone}
// - Location: ${location}
// - Position: ${role}
// - Experience: ${experience}
// - LinkedIn: ${linkedin}
// - Portfolio/GitHub: ${portfolio || "N/A"}

// Cover Letter:
// ${coverLetter}

// Additional Notes:
// ${notes || "N/A"}

// (Note: Please find the resume attached manually by the applicant if using an email client.)

// Thank you.`;

//     const mailto = `mailto:support@devtechitsolution.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
//     window.location.href = mailto;

//     setTimeout(() => {
//       setIsSubmitting(false);
//       setIsSubmitted(true);
//     }, 1000);
//   };

//   if (isSubmitted) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="max-w-2xl mx-auto bg-white p-10 lg:p-16 rounded-3xl shadow-sm border border-slate-100 text-center"
//       >
//         <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
//           <CheckCircle2 className="w-10 h-10 text-green-500" />
//         </div>
//         <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">
//           Application Submitted
//         </h2>
//         <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-10 mx-auto">
//           <p>
//             Thank you for your interest in DevTech IT Solution.
//           </p>
//           <p>
//             Your application has been received successfully. Our recruitment team will review your profile and contact you if your qualifications match our upcoming opportunities.
//           </p>
//         </div>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//           <Button 
//             onClick={() => router.push("/#careers")}
//             size="lg"
//             className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md shadow-primary/20"
//           >
//             Return to Careers
//           </Button>
//           <Button 
//             onClick={() => router.push("/")}
//             variant="outline"
//             size="lg"
//             className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
//           >
//             Back to Home
//           </Button>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
//     >
//       <div className="p-8 lg:p-12 border-b border-slate-100 bg-slate-50/50">
//         <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Submit Your Application</h1>
//         <p className="text-slate-500">Join our team of passionate tech innovators.</p>
//       </div>
      
//       <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal Information */}
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-slate-700">Full Name *</label>
//             <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John Doe" />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-slate-700">Email Address *</label>
//             <input name="email" required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="john@example.com" />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-slate-700">Phone Number *</label>
//             <input name="phone" required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="+1 (555) 000-0000" />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-slate-700">Current Location *</label>
//             <input name="location" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="City, Country" />
//           </div>

//           {/* Professional Information */}
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-sm font-semibold text-slate-700">Position Applying For *</label>
//             <select name="role" required defaultValue={formatRole(roleFromUrl)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
//               <option value="" disabled>Select a position</option>
//               <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
//               <option value="Lead DevOps Architect">Lead DevOps Architect</option>
//               <option value="Backend Systems Engineer">Backend Systems Engineer</option>
//               <option value="Other">Other / General Application</option>
//             </select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-slate-700">Years of Experience *</label>
//             <select name="experience" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
//               <option value="" disabled>Select experience</option>
//               <option value="0-2">0-2 years</option>
//               <option value="3-5">3-5 years</option>
//               <option value="5-8">5-8 years</option>
//               <option value="8+">8+ years</option>
//             </select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-semibold text-slate-700">LinkedIn Profile *</label>
//             <input name="linkedin" required type="url" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="https://linkedin.com/in/..." />
//           </div>
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-sm font-semibold text-slate-700">Portfolio / GitHub (Optional)</label>
//             <input name="portfolio" type="url" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="https://github.com/..." />
//           </div>

//           {/* Documents */}
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-sm font-semibold text-slate-700">Resume Upload (PDF/DOC/DOCX) *</label>
//             <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-slate-50 transition-colors cursor-pointer group block">
//               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
//                 <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-primary transition-colors" />
//               </div>
//               <p className="text-sm font-medium text-slate-700 mb-1">Click to upload or drag and drop</p>
//               <p className="text-xs text-slate-500">PDF, DOC, or DOCX</p>
//               <input required type="file" accept=".pdf,.doc,.docx" className="hidden" />
//             </label>
//           </div>
          
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-sm font-semibold text-slate-700">Cover Letter *</label>
//             <textarea name="coverLetter" required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Tell us why you're a great fit..."></textarea>
//           </div>
          
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-sm font-semibold text-slate-700">Additional Notes (Optional)</label>
//             <textarea name="notes" rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Any other details you'd like to share?"></textarea>
//           </div>
//         </div>

//         <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
//           <Button 
//             type="button"
//             onClick={() => router.push("/#careers")}
//             variant="outline" 
//             size="lg"
//             className="w-full sm:w-auto rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
//           >
//             Back to Careers
//           </Button>
//           <Button 
//             type="submit"
//             disabled={isSubmitting}
//             size="lg"
//             className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
//           >
//             {isSubmitting ? "Submitting..." : "Submit Application"}
//           </Button>
//         </div>
//       </form>
//     </motion.div>
//   );
// }

// export default function ApplyPage() {
//   const router = useRouter();
  
//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-slate-50 pt-28 pb-20">
//         <div className="container mx-auto px-4 lg:px-8">
          
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8 max-w-4xl mx-auto"
//           >
//             <button
//               onClick={() => router.back()}
//               className="flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer group"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//               Go Back
//             </button>
//           </motion.div>

//           <Suspense fallback={
//             <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 h-[600px] flex items-center justify-center">
//               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           }>
//             <ApplicationForm />
//           </Suspense>

//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }
