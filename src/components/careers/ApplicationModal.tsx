"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApplicationForm from "./ApplicationForm";
import SuccessMessage from "./SuccessMessage";
import { X, Briefcase, ShieldCheck } from "lucide-react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "Job" | "Internship";
  initialPosition?: string;
}

export default function ApplicationModal({ isOpen, onClose, initialType = "Job", initialPosition = "" }: ApplicationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recordId, setRecordId] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setIsSubmitted(false);
    setRecordId(undefined);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 lg:p-10 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 25 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.5)] border border-slate-200 relative my-auto overflow-hidden text-left"
          >
            {/* Top Modal Header */}
            <div className="bg-[#0f172a] text-white px-6 sm:px-8 py-5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-white flex items-center gap-2">
                    <span>DevTech Talent Portal</span>
                    <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-sans font-semibold border border-emerald-500/30">
                      Secure Form
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isSubmitted ? "Application record created successfully" : `Applying for ${initialType === "Internship" ? "an Internship" : "a Professional Position"}`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Area */}
            <div className="p-4 sm:p-10 bg-white max-h-[85vh] overflow-y-auto">
              {isSubmitted ? (
                <SuccessMessage 
                  onBack={handleClose} 
                  recordId={recordId}
                />
              ) : (
                <div className="space-y-4">
                  {/* Security trust banner */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-3 text-xs text-slate-600 mb-6">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>
                      Your application data and attachments are securely transmitted directly to our talent team (<strong>hr@devtechitsolution.com</strong>) with encrypted protocols.
                    </span>
                  </div>

                  <ApplicationForm 
                    initialType={initialType} 
                    initialPosition={initialPosition}
                    onSuccess={(id) => {
                      setRecordId(id);
                      setIsSubmitted(true);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!isSubmitted && (
              <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                <span>DevTech IT Solution Careers</span>
                <span>All fields marked with (*) are mandatory</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
