"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Opportunity } from "@/lib/careers-data";
import { Briefcase, MapPin, Clock, Award, ArrowUpRight, Search, CheckCircle } from "lucide-react";

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
        <div className="text-center max-w-3xl mx-auto mb-14">
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
            We are constantly expanding our digital horizons. Browse our current open positions and take your first step toward building impactful solutions with DevTech.
          </motion.p>
        </div>

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
              <div className="col-span-2 py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                <p className="text-xl font-bold text-slate-800 mb-2">
                  {searchQuery ? "No Openings Match Your Search" : `No Active ${activeTab} Openings Posted`}
                </p>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  {searchQuery 
                    ? `We couldn't find any open positions matching "${searchQuery}". Try resetting your search filter.` 
                    : `There are currently no ${activeTab.toLowerCase()} positions posted. Log in to the Admin Dashboard to post new job or internship opportunities.`}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Reset Search Filter
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
      </div>
    </section>
  );
}
