"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, Mail, Globe, ArrowLeft, Info, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const jobData = {
  "frontend-engineer": {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    type: "Full-Time",
    location: "Remote / Mumbai",
  },
  "devops-architect": {
    title: "Lead DevOps Architect",
    department: "Engineering",
    type: "Full-Time",
    location: "Mumbai, India",
  },
  "backend-systems-engineer": {
    title: "Backend Systems Engineer",
    department: "Engineering",
    type: "Full-Time",
    location: "Remote",
  },
};

export default function JobDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const resolvedParams = use(params);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const job = jobData[resolvedParams.slug as keyof typeof jobData];

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Hiring Soon</h1>
          <Button onClick={() => router.push("/#careers")}>Back to Careers</Button>
        </div>
      </div>
    );
  }



  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <button
              onClick={() => router.push("/#careers")}
              className="flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Careers
            </button>
          </motion.div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Header Section */}
            <div className="p-8 lg:p-12 border-b border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-xs uppercase tracking-wider mb-6 border border-amber-200"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Hiring Opens Soon
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight"
                  >
                    {job.title}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {job.location}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

              <div className="col-span-2 p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="mb-10 rounded-2xl overflow-hidden shadow-sm h-64 relative">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                      alt="Team collaborating"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/10"></div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">About This Opportunity</h3>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
                    <p className="text-lg">
                      We're growing our team and exciting opportunities will be available soon.
                    </p>
                    <p>
                      Although applications are not open yet, we're preparing to welcome talented professionals who are passionate about technology, innovation, and solving real-world challenges.
                    </p>
                    <p>
                      Stay connected with DevTech IT Solution and be among the first to know when this position becomes available.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar Section */}
              <div className="col-span-1 p-8 lg:p-12 bg-slate-50/50">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-8"
                >

                  {/* Info Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      What you can do today
                    </h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <Globe className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="mt-1.5">Follow us on LinkedIn</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <Briefcase className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="mt-1.5">Check our Careers page regularly</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div className="mt-1">
                          <span className="block mb-0.5">Send your resume to:</span>
                          <a href="mailto:hiring@devtechitsolution.com" className="font-semibold text-primary hover:underline">hiring@devtechitsolution.com</a>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-slate-900 p-8 rounded-2xl shadow-lg text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Ready to Apply?</h4>
                    <p className="text-slate-400 text-sm mb-6">Submit your application for this role.</p>

                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => router.push(`/careers/apply?role=${resolvedParams.slug}`)}
                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 cursor-pointer"
                      >
                        Apply Now
                      </Button>
                      <Button
                        onClick={() => router.push("/#careers")}
                        variant="outline"
                        className="w-full border-slate-700 text-white bg-transparent hover:bg-white/10 hover:text-white rounded-xl cursor-pointer"
                      >
                        Back to Careers
                      </Button>
                    </div>
                  </div>

                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
