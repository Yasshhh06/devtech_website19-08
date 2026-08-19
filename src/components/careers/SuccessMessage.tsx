"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Search, Home, FileText, Mail, Clock, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";

interface SuccessMessageProps {
  onBack: () => void;
  recordId?: string;
}

export default function SuccessMessage({ onBack, recordId }: SuccessMessageProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }));
  }, []);

  // Subtle confetti particles
  const particles = Array.from({ length: 12 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl p-6 md:p-12 w-full mx-auto relative overflow-hidden my-4 border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
    >
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Confetti Animation Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-blue-400'}`}
            initial={{ 
              opacity: 1, 
              x: "50%", 
              y: "50%",
              scale: 0 
            }}
            animate={{
              opacity: 0,
              x: `${40 + (Math.random() * 20 - 10)}%`,
              y: `${20 + (Math.random() * 40)}%`,
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              ease: "easeOut",
              delay: 0.1
            }}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 30}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <motion.div 
          className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-8 border-4 border-emerald-100/50 shadow-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>

        <motion.h2 
          className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-4 tracking-tight"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          🎉 Application Submitted Successfully!
        </motion.h2>

        <motion.div
          className="space-y-4 text-slate-600 text-[15px] leading-relaxed max-w-2xl mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-semibold text-slate-800 text-lg">
            Thank you for your interest in joining DevTech IT Solution.
          </p>
          <p>
            We have successfully received your application, resume, and all the information you submitted.
          </p>
          <p>
            Our Talent Acquisition (HR) team will carefully review your profile, technical skills, experience, and resume.
          </p>
          <p>
            If your profile matches our current requirements, our HR team will contact you via email or phone within <strong className="text-slate-900 font-bold">5–7 business days</strong> regarding the next steps in the hiring process.
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div 
          className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Submission Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Application Status</span>
                <span className="text-slate-500">Submitted Successfully</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Resume</span>
                <span className="text-slate-500">Uploaded</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Email Confirmation</span>
                <span className="text-slate-500">Sent to your inbox</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Date & Time</span>
                <span className="text-slate-500">{currentTime || "Processing..."}</span>
              </div>
            </div>

            {recordId && (
              <div className="flex items-start gap-3 sm:col-span-2 mt-2 pt-4 border-t border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <span className="block font-semibold text-slate-900">Application Reference ID</span>
                  <span className="text-slate-500 font-mono tracking-tight">{recordId}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-6 max-w-2xl mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-3">
            Important Notes:
          </h4>
          <ul className="space-y-2 text-sm text-amber-800/80">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>Please keep your phone number and email active.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>Check your Inbox and Spam folder regularly.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>Only shortlisted candidates will be contacted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">•</span>
              <span>If you do not receive a response within the mentioned timeline, you are welcome to apply again in the future for suitable opportunities.</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Careers</span>
          </button>
          
          <Link
            href="/careers#open-positions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm shadow-sm transition-all duration-300"
          >
            <Search className="w-4 h-4" />
            <span>Explore Other Positions</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm shadow-sm transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
