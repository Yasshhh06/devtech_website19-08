"use client";

import React, { useState, useTransition, useEffect } from "react";
import { saveOpportunityAction } from "@/app/actions/admin-actions";
import { Opportunity } from "@/lib/opportunities-db";
import { X, Briefcase, Award, MapPin, Clock, FileText, Check, Loader2, AlertCircle } from "lucide-react";

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityToEdit?: Opportunity | null;
  onSaved: () => void;
}

export default function OpportunityModal({ isOpen, onClose, opportunityToEdit, onSaved }: OpportunityModalProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [type, setType] = useState<"Job" | "Internship">("Job");

  useEffect(() => {
    if (opportunityToEdit) {
      setType(opportunityToEdit.type || "Job");
    } else {
      setType("Job");
    }
  }, [opportunityToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveOpportunityAction(formData);
      if (res.success) {
        onSaved();
        onClose();
      } else {
        setErrorMessage(res.error || "Failed to save opening.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] border border-slate-200 overflow-hidden relative my-auto text-left animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#0b1329] text-white px-6 sm:px-8 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
              {type === "Internship" ? <Award className="w-5 h-5 text-indigo-400" /> : <Briefcase className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-white">
                {opportunityToEdit ? `Edit Position: ${opportunityToEdit.title}` : "Create New Opening"}
              </h2>
              <p className="text-xs text-slate-400">
                {opportunityToEdit ? "Update job details & instant website live status" : "Post a new professional job or student internship"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {opportunityToEdit?.id && <input type="hidden" name="id" value={opportunityToEdit.id} />}

          {/* Type Toggle: Job vs Internship */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Category *</label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setType("Job")}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === "Job" ? "bg-primary text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Professional Job</span>
              </button>
              <button
                type="button"
                onClick={() => setType("Internship")}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === "Internship" ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Internship</span>
              </button>
            </div>
            <input type="hidden" name="type" value={type} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Role Title *</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={opportunityToEdit?.title || ""}
                placeholder={type === "Internship" ? "e.g. React.js Developer Intern" : "e.g. Senior Frontend Developer"}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Department *</label>
              <select
                name="department"
                defaultValue={opportunityToEdit?.department || "Engineering"}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Mobile Engineering">Mobile Engineering</option>
                <option value="Design">Design / UI UX</option>
                <option value="Security">Cyber Security</option>
                <option value="Quality Assurance">Quality Assurance (QA)</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources (HR)</option>
                <option value="Sales">Business Development / Sales</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Employment Type *</label>
              <input
                type="text"
                name="employmentType"
                required
                defaultValue={opportunityToEdit?.employmentType || (type === "Internship" ? "Internship (3–6 Months)" : "Full-Time")}
                placeholder="e.g. Full-Time or Internship (3 Months)"
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Experience Required *</label>
              <input
                type="text"
                name="experience"
                required
                defaultValue={opportunityToEdit?.experience || (type === "Internship" ? "Fresher / Enrolled" : "2+ Years")}
                placeholder="e.g. 1–3 Years or Fresher"
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
              />
            </div>

            <div className="flex flex-col justify-end gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Location *</label>
              <input
                type="text"
                name="location"
                required
                defaultValue={opportunityToEdit?.location || "Remote / Mumbai"}
                placeholder="e.g. Remote, Hybrid, Mumbai"
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Status *</label>
            <select
              name="status"
              defaultValue={opportunityToEdit?.status || "Active"}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm cursor-pointer"
            >
              <option value="Active">Active (Visible & Accepting Applications)</option>
              <option value="Closed">Closed (Hidden / Inactive)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Role Summary & Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={opportunityToEdit?.description || ""}
              placeholder="Describe the responsibilities, key skills required, and project scope for this role..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm resize-y"
            ></textarea>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Opening...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{opportunityToEdit ? "Update Posting" : "Publish Opening"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
