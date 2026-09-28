"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, Mail, Globe, ArrowLeft, CheckCircle, Bell, Loader2, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Opportunity } from "@/lib/opportunities-db";

export default function JobDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [job, setJob] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/opportunities?slug=${encodeURIComponent(resolvedParams.slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            setJob(data);
            setIsLoading(false);
            return;
          }
        }
        setNotFound(true);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-500">Loading DevTech Career Opportunity...</p>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-28 pb-20">
          <div className="text-center max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Opportunity Not Found</h1>
            <p className="text-sm text-slate-600 mb-6">
              The position you are looking for may have been updated or filled. Explore our current open positions!
            </p>
            <Button onClick={() => router.push("/careers")} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer">
              Browse All Career Opportunities
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <button
              onClick={() => router.push("/careers")}
              className="flex items-center text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Careers
            </button>
          </motion.div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

            {/* Header Section */}
            <div className="p-8 lg:p-12 border-b border-slate-100 relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B132B] to-slate-900 text-white">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs uppercase tracking-wider mb-5 border border-emerald-500/30"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Active Position – DevTech Careers
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 tracking-tight"
                  >
                    {job.title}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      {job.employmentType}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Exp: <strong className="text-white">{job.experience}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {job.location}
                    </div>
                  </motion.div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Button
                    onClick={() => router.push(`/careers/apply?type=${encodeURIComponent(job.type)}&role=${encodeURIComponent(job.title)}`)}
                    className="px-8 py-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-base shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

              <div className="col-span-2 p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">
                    Position Description & Requirements
                  </h3>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                    {job.description || "Detailed role overview and project requirements will be shared during screening."}
                  </div>

                  <div className="mt-12 p-6 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Why Apply at DevTech IT Solutions?
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      At DevTech, you get direct hands-on experience with live enterprise products, cloud platforms, modern engineering frameworks, and dedicated mentorship from industry veterans.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar Section */}
              <div className="col-span-1 p-8 lg:p-12 bg-slate-50/50">
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="space-y-8"
                >

                  {/* Info Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base border-b border-slate-100 pb-3">
                      Recruitment Process
                    </h4>
                    <ul className="space-y-3.5 text-sm text-slate-600">
                      <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">1</span>
                        <span>Online Profile & Resume Submission</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">2</span>
                        <span>Technical Background Review</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">3</span>
                        <span>HR & Technical Discussion</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">4</span>
                        <span>Official Offer Letter & Onboarding</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-slate-900 p-8 rounded-2xl shadow-lg text-center relative overflow-hidden text-white">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                      <Bell className="w-5 h-5" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Ready to Apply?</h4>
                    <p className="text-slate-400 text-sm mb-6">Submit your candidate profile and resume today.</p>

                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => router.push(`/careers/apply?type=${encodeURIComponent(job.type)}&role=${encodeURIComponent(job.title)}`)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer font-bold py-5"
                      >
                        Apply for this Role
                      </Button>
                      <Button
                        onClick={() => router.push("/careers")}
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
