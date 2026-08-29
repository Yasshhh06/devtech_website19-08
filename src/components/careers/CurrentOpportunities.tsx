"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Opportunity } from "@/lib/careers-data";
import { Briefcase, MapPin, Clock, Award, ArrowUpRight, Search, CheckCircle, FileUp, Sparkles } from "lucide-react";

interface CurrentOpportunitiesProps {
  onApply: (type: "Job" | "Internship", position?: string) => void;
  opportunities?: Opportunity[];
}

export default function CurrentOpportunities({ onApply, opportunities = [] }: CurrentOpportunitiesProps) {
  const [activeTab, setActiveTab] = useState<"Job" | "Internship">("Job");
  const [searchQuery, setSearchQuery] = useState("");

  const activeOpportunities = opportunities.filter(o => o.status !== "Closed");

  const filteredOpportunities = activeOpportunities.filter((opp) => {
    const matchesTab = opp.type === activeTab;
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <section className="py-24 bg-white relative" id="open-positions">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-4 border border-primary/20"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Explore Openings
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Current <span className="text-primary">Opportunities</span>
          </motion.h2>
          <motion.p 
            className="text-slate-600 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We are constantly expanding our digital horizons. Browse our current open positions or submit your resume for future opportunities.
          </motion.p>
        </div>

        {/* TOP FEATURED BANNER: Submit Resume for Future Openings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 p-7 md:p-9 rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#111c3a] to-[#0b1329] text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3 text-center lg:text-left relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/15 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Future Openings & General Talent Pool</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
              Submit Resume for Future Openings
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
              Don&apos;t see your specific role listed? Upload your profile into our priority database. Our recruitment team regularly evaluates candidates for new projects and upcoming roles!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0 relative z-10">
            <button
              onClick={() => onApply("Job", "General Application (Future Openings)")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileUp className="w-4 h-4 text-cyan-300" />
              <span>Submit Resume (Job)</span>
            </button>

            <button
              onClick={() => onApply("Internship", "General Internship (Future Openings)")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-heading font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-indigo-300" />
              <span>Submit Resume (Intern)</span>
            </button>
          </div>
        </motion.div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-slate-200">
          
          {/* Tabs */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full md:w-auto border border-slate-200/80">
            <button
              onClick={() => setActiveTab("Job")}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-heading font-bold text-sm transition-all duration-300 relative cursor-pointer ${
                activeTab === "Job" ? "text-white shadow-md" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {activeTab === "Job" && (
                <motion.div 
                  layoutId="activeTabBg" 
                  className="absolute inset-0 bg-primary rounded-xl z-0" 
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Professional Jobs</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] ml-1 font-extrabold ${
                  activeTab === "Job" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {activeOpportunities.filter(o => o.type === "Job").length}
                </span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("Internship")}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-heading font-bold text-sm transition-all duration-300 relative cursor-pointer ${
                activeTab === "Internship" ? "text-white shadow-md" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {activeTab === "Internship" && (
                <motion.div 
                  layoutId="activeTabBg" 
                  className="absolute inset-0 bg-primary rounded-xl z-0" 
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                <span>Internships</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] ml-1 font-extrabold ${
                  activeTab === "Internship" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {activeOpportunities.filter(o => o.type === "Internship").length}
                </span>
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search roles, location or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Opportunities Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opportunity: Opportunity) => (
                <motion.div
                  key={opportunity.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Top Header Row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs uppercase tracking-wide border border-slate-200">
                        {opportunity.department}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active Opening
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      {opportunity.title}
                    </h3>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-slate-600 font-medium mb-5">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span>{opportunity.employmentType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Exp: <strong className="text-slate-800">{opportunity.experience}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{opportunity.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {opportunity.description}
                    </p>
                  </div>

                  {/* Apply Button Footer */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Full career support included
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onApply(opportunity.type, opportunity.title)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 group-hover:bg-primary text-white font-heading font-bold text-sm shadow-md group-hover:shadow-primary/30 transition-all duration-300 cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 py-16 px-6 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-slate-900 mb-2">
                  {searchQuery ? "No Openings Match Your Search" : "New Opportunities & Internships Launching Soon"}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed">
                  {searchQuery 
                    ? `We couldn't find any positions matching "${searchQuery}". Try clearing your search.` 
                    : `We are currently preparing new career positions and internship programs. You can express your interest now by submitting your resume to our talent database!`}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  {searchQuery ? (
                    <button 
                      onClick={() => setSearchQuery("")} 
                      className="px-6 py-3 rounded-xl bg-blue-600 text-white font-heading font-bold text-sm hover:bg-blue-700 transition-all shadow-md cursor-pointer"
                    >
                      Reset Search Filter
                    </button>
                  ) : (
                    <button 
                      onClick={() => onApply(activeTab, `General Application (${activeTab})`)} 
                      className="px-7 py-3 rounded-xl bg-blue-600 text-white font-heading font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Submit Resume for Future Openings</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
      </div>
    </section>
  );
}
