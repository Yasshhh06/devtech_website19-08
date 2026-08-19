"use client";

import React, { useState } from "react";
import { logoutAdmin, toggleOpportunityStatusAction, deleteOpportunityAction } from "@/app/actions/admin-actions";
import { Opportunity } from "@/lib/opportunities-db";
import { ApplicationRecord } from "@/lib/db";
import { ContactInquiryRecord } from "@/lib/contact-db";
import OpportunityModal from "./OpportunityModal";
import { 
  Briefcase, Award, Plus, Search, Trash2, Edit3, Power, RefreshCw, 
  LogOut, ShieldCheck, Users, FileText, CheckCircle2, XCircle, ChevronRight, 
  ExternalLink, Mail, Phone, MapPin, GraduationCap, Code2, Sparkles, Lock, X, Download, FileUp, Star, User, Clock, Building2, Globe, MessageSquare
} from "lucide-react";

interface AdminDashboardProps {
  initialOpportunities: Opportunity[];
  initialApplications: ApplicationRecord[];
  initialInquiries?: ContactInquiryRecord[];
  onRefresh: () => void;
}

export default function AdminDashboard({ initialOpportunities, initialApplications, initialInquiries = [], onRefresh }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"opportunities" | "applications" | "inquiries" | "system">("opportunities");
  
  // Opportunities Filter & State
  const [oppSearch, setOppSearch] = useState("");
  const [oppFilterType, setOppFilterType] = useState<"ALL" | "Job" | "Internship">("ALL");
  const [oppFilterStatus, setOppFilterStatus] = useState<"ALL" | "Active" | "Closed">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  // Candidate Application Inbox Filter & State
  const [appSearch, setAppSearch] = useState("");
  const [appFilterType, setAppFilterType] = useState<"ALL" | "Full-Time" | "Internship">("ALL");
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  // Client Inquiries Search State
  const [inqSearch, setInqSearch] = useState("");

  // CSV Export for Candidates
  const exportApplicationsToCSV = () => {
    if (initialApplications.length === 0) return alert("No applications to export.");
    const headers = ["Ref ID", "Candidate Name", "Email", "Mobile", "City", "Role", "Type", "Qualification", "College", "Submitted Date"];
    const rows = initialApplications.map(app => [
      `"${app.id}"`,
      `"${app.personalInfo.fullName}"`,
      `"${app.personalInfo.email}"`,
      `"${app.personalInfo.mobile}"`,
      `"${app.personalInfo.city || ""}"`,
      `"${app.applicationInfo.position}"`,
      `"${app.applicationInfo.type}"`,
      `"${app.education.highestQualification || ""}"`,
      `"${app.education.college || ""}"`,
      `"${new Date(app.submittedAt).toLocaleDateString("en-IN")}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DevTech_Applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Actions
  const handleToggleStatus = async (id: string) => {
    await toggleOpportunityStatusAction(id);
    onRefresh();
  };

  const handleDeleteOpp = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete opening "${title}"? This cannot be undone.`)) {
      await deleteOpportunityAction(id);
      onRefresh();
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.reload();
  };

  // Filtered Opportunities
  const filteredOpps = initialOpportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(oppSearch.toLowerCase()) ||
      opp.department.toLowerCase().includes(oppSearch.toLowerCase()) ||
      opp.location.toLowerCase().includes(oppSearch.toLowerCase());
    const matchesType = oppFilterType === "ALL" || opp.type === oppFilterType;
    const matchesStatus = oppFilterStatus === "ALL" || (opp.status || "Active") === oppFilterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Filtered Applications
  const filteredApps = initialApplications.filter((app) => {
    const nameMatch = app.personalInfo.fullName.toLowerCase().includes(appSearch.toLowerCase());
    const emailMatch = app.personalInfo.email.toLowerCase().includes(appSearch.toLowerCase());
    const posMatch = app.applicationInfo.position.toLowerCase().includes(appSearch.toLowerCase());
    const idMatch = app.id.toLowerCase().includes(appSearch.toLowerCase());
    const matchesSearch = nameMatch || emailMatch || posMatch || idMatch;

    const matchesType = appFilterType === "ALL" || app.applicationInfo.type === appFilterType;
    return matchesSearch && matchesType;
  });

  const activeJobsCount = initialOpportunities.filter(o => o.type === "Job" && o.status !== "Closed").length;
  const activeInternsCount = initialOpportunities.filter(o => o.type === "Internship" && o.status !== "Closed").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top White Corporate Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20 border border-blue-400/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">DevTech Admin Portal</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200">
                  Live CMS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Target HR Email: <strong className="text-primary">hr@devtechitsolution.com</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
              title="Refresh Live Data"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold transition-colors cursor-pointer flex items-center gap-2 text-xs"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Top Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Jobs</div>
              <div className="text-3xl font-heading font-extrabold text-slate-900 mt-1">{activeJobsCount}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Internships</div>
              <div className="text-3xl font-heading font-extrabold text-indigo-600 mt-1">{activeInternsCount}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</div>
              <div className="text-3xl font-heading font-extrabold text-emerald-600 mt-1">{initialApplications.length}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Postings</div>
              <div className="text-3xl font-heading font-extrabold text-amber-600 mt-1">{initialOpportunities.length}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab("opportunities")}
            className={`px-6 py-3 rounded-xl font-heading font-bold text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "opportunities"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Opportunities CMS ({initialOpportunities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`px-6 py-3 rounded-xl font-heading font-bold text-sm flex items-center gap-2.5 transition-all cursor-pointer relative ${
              activeTab === "applications"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Dossiers Inbox ({initialApplications.length})</span>
            {initialApplications.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px]">
                {initialApplications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-6 py-3 rounded-xl font-heading font-bold text-sm flex items-center gap-2.5 transition-all cursor-pointer relative ${
              activeTab === "inquiries"
                ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Client Leads ({initialInquiries.length})</span>
            {initialInquiries.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-teal-500 text-white font-extrabold text-[10px]">
                {initialInquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`px-6 py-3 rounded-xl font-heading font-bold text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "system"
                ? "bg-slate-800 text-white shadow-md"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & HR Email Settings</span>
          </button>
        </div>

        {/* TAB 1: OPPORTUNITIES MANAGER */}
        {activeTab === "opportunities" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search roles, location or department..."
                  value={oppSearch}
                  onChange={(e) => setOppSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-slate-400 font-medium"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={oppFilterType}
                  onChange={(e) => setOppFilterType(e.target.value as any)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Job">Jobs Only</option>
                  <option value="Internship">Internships Only</option>
                </select>

                <select
                  value={oppFilterStatus}
                  onChange={(e) => setOppFilterStatus(e.target.value as any)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Closed">Closed Only</option>
                </select>

                <button
                  onClick={() => {
                    setEditingOpp(null);
                    setIsModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer ml-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Opening</span>
                </button>
              </div>
            </div>

            {/* Opportunities Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Role Title</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Experience</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredOpps.length > 0 ? (
                      filteredOpps.map((opp) => {
                        const isActive = opp.status !== "Closed";
                        return (
                          <tr key={opp.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">
                              {opp.title}
                              <div className="text-xs text-slate-500 font-normal line-clamp-1 max-w-xs">{opp.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                                opp.type === "Internship"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}>
                                {opp.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-700 font-semibold">{opp.department}</td>
                            <td className="px-6 py-4 text-slate-600">{opp.location}</td>
                            <td className="px-6 py-4 text-slate-600">{opp.experience}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleToggleStatus(opp.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border cursor-pointer transition-all ${
                                  isActive
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                                }`}
                                title="Click to toggle status"
                              >
                                {isActive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-slate-400" />}
                                <span>{isActive ? "Active" : "Closed"}</span>
                              </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingOpp(opp);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                                  title="Edit Posting"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOpp(opp.id, opp.title)}
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                  title="Delete Posting"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-semibold">
                          No openings found matching your criteria. Click &quot;Post New Opening&quot; to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CANDIDATE DOSSIERS INBOX */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidate name, email, position or Ref ID..."
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={appFilterType}
                  onChange={(e) => setAppFilterType(e.target.value as any)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Application Types</option>
                  <option value="Full-Time">Full-Time Jobs</option>
                  <option value="Internship">Internships</option>
                </select>

                <button
                  onClick={exportApplicationsToCSV}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  title="Export Applications to CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Ref ID & Candidate</th>
                      <th className="px-6 py-4">Applied Role</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Submitted Date</th>
                      <th className="px-6 py-4">Resume File</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredApps.length > 0 ? (
                      filteredApps.map((app, idx) => {
                        const resumeHref = app.documents.resumeUrl || app.documents.resumeDataUrl || `/api/resumes/${app.id}`;
                        return (
                          <tr key={`${app.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">
                              <div className="text-xs text-indigo-600 font-mono font-bold mb-0.5">{app.id}</div>
                              <div className="text-base text-slate-900">{app.personalInfo.fullName}</div>
                              <div className="text-xs text-slate-500 font-normal">{app.personalInfo.city || "City N/A"}</div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-800">
                              {app.applicationInfo.position}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                                app.applicationInfo.type === "Internship"
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}>
                                {app.applicationInfo.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs space-y-0.5">
                              <div className="text-slate-800 font-semibold">{app.personalInfo.email}</div>
                              <div className="text-slate-500">{app.personalInfo.mobile}</div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                              {new Date(app.submittedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={resumeHref}
                                download={app.documents.resumeName}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer"
                                title="Download Resume File"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{app.documents.resumeName}</span>
                              </a>
                            </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20 inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Full Dossier</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-semibold">
                          No candidate application records found in storage. When candidates submit via website forms, their complete records and resumes will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT INQUIRIES & PROJECT LEADS */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search client name, email or message..."
                  value={inqSearch}
                  onChange={(e) => setInqSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Client Name</th>
                      <th className="px-6 py-4">Work Email</th>
                      <th className="px-6 py-4">Project Inquiry Details</th>
                      <th className="px-6 py-4">Received Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {initialInquiries.filter(i => 
                      `${i.firstName} ${i.lastName}`.toLowerCase().includes(inqSearch.toLowerCase()) ||
                      i.email.toLowerCase().includes(inqSearch.toLowerCase()) ||
                      i.message.toLowerCase().includes(inqSearch.toLowerCase())
                    ).length > 0 ? (
                      initialInquiries.filter(i => 
                        `${i.firstName} ${i.lastName}`.toLowerCase().includes(inqSearch.toLowerCase()) ||
                        i.email.toLowerCase().includes(inqSearch.toLowerCase()) ||
                        i.message.toLowerCase().includes(inqSearch.toLowerCase())
                      ).map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">
                            {inq.firstName} {inq.lastName}
                            <div className="text-[11px] text-slate-400 font-mono">{inq.id}</div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-primary">
                            <a href={`mailto:${inq.email}`} className="hover:underline">{inq.email}</a>
                          </td>
                          <td className="px-6 py-4 max-w-md">
                            <p className="text-xs text-slate-700 leading-relaxed line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                              {inq.message}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                            {new Date(inq.submittedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <a
                              href={`mailto:${inq.email}?subject=RE: DevTech IT Solution Inquiry`}
                              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-md shadow-teal-500/20 inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply Client</span>
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-semibold">
                          No client inquiries found matching your filter. Incoming client project requests submitted via the Contact form will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM & HR SECURITY */}
        {activeTab === "system" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <span>HR Recipient Email Address</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All candidate applications and attached PDF resumes submitted through the website forms are transmitted directly to:
              </p>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-primary font-mono font-bold text-base flex items-center justify-between">
                <span>hr@devtechitsolution.com</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500">
                To change the destination address in production, configure the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">HR_EMAIL</code> environment variable on Vercel.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>Admin Credentials & Security</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The admin dashboard is protected with encrypted HTTP-Only session cookies.
              </p>
              <div className="space-y-2 text-xs text-slate-700 font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>ADMIN_USERNAME: <span className="text-primary font-bold">yashm@gmail.com</span></div>
                <div>ADMIN_PASSWORD: <span className="text-primary font-bold">••••••••</span> (Encrypted)</div>
              </div>
              <p className="text-xs text-slate-500">
                To override default login credentials, set <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">ADMIN_USERNAME</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">ADMIN_PASSWORD</code> in your environment configuration.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Opportunity Add/Edit Modal */}
      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOpp(null);
        }}
        opportunityToEdit={editingOpp}
        onSaved={onRefresh}
      />

      {/* Complete Candidate Dossier Modal (Executive White Theme) */}
      {selectedApp && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-white text-slate-800 w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative my-auto text-left max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-[#0b1329] text-white p-6 sm:px-8 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/30 text-blue-400 flex items-center justify-center font-bold">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-300">{selectedApp.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-extrabold uppercase tracking-wider">
                      {selectedApp.applicationInfo.type} Dossier
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">{selectedApp.personalInfo.fullName}</h2>
                  <p className="text-xs text-slate-300">{selectedApp.applicationInfo.position}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Content: Visible Candidate Details */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm text-slate-700 flex-1">
              
              {/* SECTION 1: Personal Info & Resume Download */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>Personal Credentials & Resume</span>
                  </h3>

                  {selectedApp.documents.resumeDataUrl ? (
                    <a
                      href={selectedApp.documents.resumeDataUrl}
                      download={selectedApp.documents.resumeName}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resume ({selectedApp.documents.resumeName})</span>
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      📄 {selectedApp.documents.resumeName}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</div>
                    <div className="font-semibold text-slate-900 text-base">{selectedApp.personalInfo.fullName}</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</div>
                    <a href={`mailto:${selectedApp.personalInfo.email}`} className="font-semibold text-primary hover:underline">{selectedApp.personalInfo.email}</a>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Phone</div>
                    <a href={`tel:${selectedApp.personalInfo.mobile}`} className="font-semibold text-slate-900">{selectedApp.personalInfo.mobile}</a>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Current City</div>
                    <div className="font-semibold text-slate-900">{selectedApp.personalInfo.city || "Not Specified"}</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Submission Timestamp</div>
                    <div className="font-semibold text-slate-900">
                      {new Date(selectedApp.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Role</div>
                    <div className="font-bold text-indigo-600">{selectedApp.applicationInfo.position}</div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Position Profile & Terms */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Employment Terms & Experience</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Employment Type</div>
                    <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.type}</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Work Mode Preferred</div>
                    <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.workMode || selectedApp.applicationInfo.internshipMode || "Work From Office / Flexible"}</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience Status</div>
                    <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.experience || "Fresher"} {selectedApp.applicationInfo.totalExperience ? `(${selectedApp.applicationInfo.totalExperience})` : ""}</div>
                  </div>

                  {selectedApp.applicationInfo.currentCompany && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Employer</div>
                      <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.currentCompany}</div>
                    </div>
                  )}

                  {selectedApp.applicationInfo.currentDesignation && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Designation</div>
                      <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.currentDesignation}</div>
                    </div>
                  )}

                  {selectedApp.applicationInfo.noticePeriod && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Notice Period</div>
                      <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.noticePeriod}</div>
                    </div>
                  )}

                  {selectedApp.applicationInfo.currentCTC && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Current CTC</div>
                      <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.currentCTC}</div>
                    </div>
                  )}

                  {selectedApp.applicationInfo.expectedCTC && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected CTC</div>
                      <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.expectedCTC}</div>
                    </div>
                  )}

                  {selectedApp.applicationInfo.internshipDuration && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Internship Duration</div>
                      <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.internshipDuration}</div>
                    </div>
                  )}

                  {selectedApp.applicationInfo.mandatoryCollegeInternship && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Mandatory College Internship</div>
                      <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.mandatoryCollegeInternship}</div>
                    </div>
                  )}

                  {selectedApp.applicationInfo.dedicateHours && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Dedicated Hours / Week</div>
                      <div className="font-semibold text-slate-900">{selectedApp.applicationInfo.dedicateHours}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: Academic Background */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <span>Academic Qualifications</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Highest Qualification</div>
                    <div className="font-semibold text-slate-900">{selectedApp.education.highestQualification || "Not Specified"}</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">College / University Name</div>
                    <div className="font-semibold text-slate-900">{selectedApp.education.college || "Not Specified"}</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Graduation Year</div>
                    <div className="font-semibold text-slate-900">{selectedApp.education.graduationYear || "Not Specified"}</div>
                  </div>

                  {selectedApp.education.currentSemester && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Semester / Status</div>
                      <div className="font-semibold text-slate-900">{selectedApp.education.currentSemester}</div>
                    </div>
                  )}

                  {selectedApp.education.cgpa && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">CGPA / Percentage</div>
                      <div className="font-bold text-slate-900">{selectedApp.education.cgpa}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: Technical Skills & Rating */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-600" />
                    <span>Technical Arsenal & Skills</span>
                  </h3>
                  {selectedApp.rateSkills && (
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-extrabold text-xs">
                      Proficiency: {selectedApp.rateSkills}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {selectedApp.skills && selectedApp.skills.length > 0 ? (
                    selectedApp.skills.map((skill) => (
                      <span key={skill} className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-primary border border-blue-200 font-bold text-xs shadow-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No skills listed</span>
                  )}
                </div>
              </div>

              {/* SECTION 5: Developer Profiles & Portfolio Links */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Globe className="w-4 h-4 text-teal-600" />
                  <span>Developer Profiles & Portfolio Links</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedApp.portfolioLinks.gitHub ? (
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">GitHub Profile</div>
                      <a href={selectedApp.portfolioLinks.gitHub} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline flex items-center gap-1 mt-0.5 text-xs truncate">
                        <span>{selectedApp.portfolioLinks.gitHub}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs font-medium">GitHub: Not Provided</div>
                  )}

                  {selectedApp.portfolioLinks.linkedIn ? (
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn Profile</div>
                      <a href={selectedApp.portfolioLinks.linkedIn} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline flex items-center gap-1 mt-0.5 text-xs truncate">
                        <span>{selectedApp.portfolioLinks.linkedIn}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs font-medium">LinkedIn: Not Provided</div>
                  )}

                  {selectedApp.portfolioLinks.portfolioWebsite ? (
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Portfolio Website</div>
                      <a href={selectedApp.portfolioLinks.portfolioWebsite} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline flex items-center gap-1 mt-0.5 text-xs truncate">
                        <span>{selectedApp.portfolioLinks.portfolioWebsite}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs font-medium">Portfolio Link: Not Provided</div>
                  )}

                  {selectedApp.portfolioLinks.codingProfile ? (
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Coding Contest Profile</div>
                      <a href={selectedApp.portfolioLinks.codingProfile} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline flex items-center gap-1 mt-0.5 text-xs truncate">
                        <span>{selectedApp.portfolioLinks.codingProfile}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs font-medium">Coding Profile: Not Provided</div>
                  )}
                </div>
              </div>

              {/* SECTION 6: Screening Questions & Essay Answers */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                <h3 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Screening Responses & Essay Answers</span>
                </h3>

                <div className="space-y-4">
                  {selectedApp.screeningQuestions.aboutYourself && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">1. About Yourself</div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">{selectedApp.screeningQuestions.aboutYourself}</div>
                    </div>
                  )}

                  {selectedApp.screeningQuestions.proudProject && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">2. Proudest Technical Project</div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">{selectedApp.screeningQuestions.proudProject}</div>
                    </div>
                  )}

                  {selectedApp.screeningQuestions.whyJoinDevTech && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">3. Why Join DevTech IT Solutions?</div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">{selectedApp.screeningQuestions.whyJoinDevTech}</div>
                    </div>
                  )}

                  {selectedApp.screeningQuestions.whyHireYou && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">4. Why Should We Hire You?</div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">{selectedApp.screeningQuestions.whyHireYou}</div>
                    </div>
                  )}

                  {selectedApp.screeningQuestions.technologiesLearning && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">5. Technologies Currently Learning</div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">{selectedApp.screeningQuestions.technologiesLearning}</div>
                    </div>
                  )}

                  {selectedApp.screeningQuestions.certifications && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">6. Completed Certifications</div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">{selectedApp.screeningQuestions.certifications}</div>
                    </div>
                  )}

                  {selectedApp.screeningQuestions.expectToLearn && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">7. Internship Learning Expectations</div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">{selectedApp.screeningQuestions.expectToLearn}</div>
                    </div>
                  )}

                  {selectedApp.screeningQuestions.hackathons && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">8. Hackathons & Competitions</div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">{selectedApp.screeningQuestions.hackathons}</div>
                    </div>
                  )}

                  {selectedApp.screeningQuestions.freelanceProjects && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">9. Live Client / Freelance Projects</div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed">{selectedApp.screeningQuestions.freelanceProjects}</div>
                    </div>
                  )}

                  {selectedApp.screeningQuestions.hearAboutUs && (
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-600">10. Discovery Source</div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs font-semibold">{selectedApp.screeningQuestions.hearAboutUs}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 7: Legal Declaration & Electronic Signature */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Applicant Legal Signoff</span>
                  </div>
                  <div className="mt-1 text-emerald-800">
                    Applicant declared accuracy of all history and signed electronically as: <strong className="text-slate-900">&ldquo;{selectedApp.digitalSignature || selectedApp.personalInfo.fullName}&rdquo;</strong>.
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Sticky Footer */}
            <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>DevTech IT Solutions Candidate Record ID: <strong>{selectedApp.id}</strong></span>
              
              <a
                href={selectedApp.documents.resumeUrl || selectedApp.documents.resumeDataUrl || `/api/resumes/${selectedApp.id}`}
                download={selectedApp.documents.resumeName}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume ({selectedApp.documents.resumeName})</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
