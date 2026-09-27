"use client";

import React, { useState, useEffect, useTransition } from "react";
import { checkAdminAuth, logoutAdmin } from "@/app/actions/admin-actions";
import {
  getProgramAdminDashboardDataAction,
  deleteProgramApplicationAction,
  updateProgramSettingsAction,
  updateApplicationStatusAction
} from "@/app/actions/program-actions";
import AdminLogin from "@/components/admin/AdminLogin";
import { ProgramApplicationRecord, ProgramSettings, ProgramRoleSetting } from "@/lib/programs-db";
import {
  Loader2, Search, Download, Trash2, Eye, ShieldCheck,
  CreditCard, User, Layers, RefreshCw, LogOut, CheckCircle2,
  Clock, XCircle, Database, ExternalLink, Filter, Settings,
  Check, Copy, Edit2, Plus, Save, Sparkles, AlertCircle
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function DevTechProgramsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [applications, setApplications] = useState<ProgramApplicationRecord[]>([]);
  const [settings, setSettings] = useState<ProgramSettings | null>(null);
  const [isPending, startTransition] = useTransition();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"APPLICATIONS" | "FEE_SETTINGS">("APPLICATIONS");

  // Candidate Application Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [candidateStatusFilter, setCandidateStatusFilter] = useState<string>("ALL");
  const [selectedApp, setSelectedApp] = useState<ProgramApplicationRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Settings & Positions Management State
  const [editableDefaultFee, setEditableDefaultFee] = useState<number>(499);
  const [editableRoles, setEditableRoles] = useState<ProgramRoleSetting[]>([]);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Add / Edit Role Modal State
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<ProgramRoleSetting | null>(null);
  const [roleTitle, setRoleTitle] = useState("");
  const [roleDept, setRoleDept] = useState("Engineering");
  const [roleType, setRoleType] = useState("Full-Time");
  const [roleFee, setRoleFee] = useState<number>(499);
  const [roleActive, setRoleActive] = useState(true);

  const loadData = () => {
    startTransition(async () => {
      const auth = await checkAdminAuth();
      setIsAuthenticated(auth);
      if (auth) {
        const data = await getProgramAdminDashboardDataAction();
        if (data.success) {
          setApplications(data.applications || []);
          if (data.settings) {
            setSettings(data.settings);
            setEditableDefaultFee(data.settings.defaultFee || 499);
            setEditableRoles(data.settings.roles || []);
          }
        } else {
          toast.error(data.error || "Failed to load dashboard data.");
        }
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    toast.success("Logged out of DevTech Admin.");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteApplication = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete application for ${name}?`)) return;

    const res = await deleteProgramApplicationAction(id);
    if (res.success) {
      toast.success(`Deleted application for ${name}`);
      setApplications(applications.filter(a => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    } else {
      toast.error(res.error || "Failed to delete record.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: ProgramApplicationRecord["status"]) => {
    const res = await updateApplicationStatusAction(id, newStatus);
    if (res.success) {
      toast.success(`Candidate status updated to ${newStatus}`);
      setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } else {
      toast.error(res.error || "Failed to update candidate status.");
    }
  };

  const handleSaveFeeSettings = async (rolesToSave = editableRoles) => {
    setIsSavingSettings(true);

    const updatedSettings: ProgramSettings = {
      defaultFee: Number(editableDefaultFee),
      currency: "INR",
      roles: rolesToSave.map(r => ({
        ...r,
        fee: Number(r.fee || editableDefaultFee)
      }))
    };

    const res = await updateProgramSettingsAction(updatedSettings);
    if (res.success) {
      setSettings(updatedSettings);
      setEditableRoles(updatedSettings.roles);
      toast.success("Program positions & registration fees saved live on site!");
    } else {
      toast.error(res.error || "Failed to save fee settings.");
    }
    setIsSavingSettings(false);
  };

  // Create or Update Role
  const handleSaveRoleModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) {
      toast.error("Please enter position title.");
      return;
    }

    if (editingRole) {
      // Edit mode
      const updated = editableRoles.map(r => r.id === editingRole.id ? {
        ...r,
        title: roleTitle.trim(),
        dept: roleDept.trim(),
        type: roleType.trim(),
        fee: Number(roleFee),
        active: roleActive
      } : r);
      setEditableRoles(updated);
      toast.success(`Updated ${roleTitle}`);
      handleSaveFeeSettings(updated);
    } else {
      // Create mode
      const newId = `role_${Date.now()}`;
      const newRole: ProgramRoleSetting = {
        id: newId,
        title: roleTitle.trim(),
        dept: roleDept.trim(),
        type: roleType.trim(),
        fee: Number(roleFee),
        active: roleActive
      };
      const updated = [...editableRoles, newRole];
      setEditableRoles(updated);
      toast.success(`Added new position: ${roleTitle}`);
      handleSaveFeeSettings(updated);
    }

    // Reset Modal State
    setIsAddRoleModalOpen(false);
    setEditingRole(null);
    setRoleTitle("");
    setRoleDept("Engineering");
    setRoleType("Full-Time");
    setRoleFee(editableDefaultFee);
    setRoleActive(true);
  };

  const openAddRoleModal = () => {
    setEditingRole(null);
    setRoleTitle("");
    setRoleDept("Engineering");
    setRoleType("Full-Time");
    setRoleFee(editableDefaultFee);
    setRoleActive(true);
    setIsAddRoleModalOpen(true);
  };

  const openEditRoleModal = (role: ProgramRoleSetting) => {
    setEditingRole(role);
    setRoleTitle(role.title);
    setRoleDept(role.dept);
    setRoleType(role.type);
    setRoleFee(role.fee || editableDefaultFee);
    setRoleActive(role.active);
    setIsAddRoleModalOpen(true);
  };

  const handleDeleteRole = (roleId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete position "${title}"?`)) return;
    const updated = editableRoles.filter(r => r.id !== roleId);
    setEditableRoles(updated);
    toast.success(`Deleted position: ${title}`);
    handleSaveFeeSettings(updated);
  };

  const handleRoleToggleActive = (roleId: string) => {
    const updated = editableRoles.map(r => r.id === roleId ? { ...r, active: !r.active } : r);
    setEditableRoles(updated);
    handleSaveFeeSettings(updated);
  };

  const handleExportCSV = () => {
    if (applications.length === 0) {
      toast.info("No applications to export.");
      return;
    }

    const headers = [
      "Registration ID", "Submitted At", "Status", "Interested Domain", "Full Name", "Email", "Mobile", "City",
      "Exp Level", "Total Exp / Standing", "Notice Period", "Company", "Designation",
      "Qualification", "College", "Grad Year", "Skills", "Proficiency",
      "GitHub", "LinkedIn", "Portfolio",
      "Payment Status", "Payment ID", "Order ID", "Amount INR", "Payment Date",
      "Digital Signature"
    ];

    const csvRows = applications.map(app => [
      `"${app.id}"`,
      `"${app.submittedAt}"`,
      `"${app.status || "SUBMITTED"}"`,
      `"${app.role}"`,
      `"${app.personalInfo.fullName}"`,
      `"${app.personalInfo.email}"`,
      `"${app.personalInfo.mobile}"`,
      `"${app.personalInfo.city}"`,
      `"${app.experience.level}"`,
      `"${app.experience.totalExperience || ""}"`,
      `"${app.experience.noticePeriod}"`,
      `"${app.experience.currentCompany || ""}"`,
      `"${app.experience.currentDesignation || ""}"`,
      `"${app.academic.qualification}"`,
      `"${app.academic.college}"`,
      `"${app.academic.graduationYear}"`,
      `"${(app.skills || []).join(", ")}"`,
      `"${app.proficiency}"`,
      `"${app.profiles.github || ""}"`,
      `"${app.profiles.linkedin || ""}"`,
      `"${app.profiles.portfolio || ""}"`,
      `"${app.paymentInfo?.status || "PENDING"}"`,
      `"${app.paymentInfo?.paymentId || ""}"`,
      `"${app.paymentInfo?.orderId || ""}"`,
      `"${app.paymentInfo?.amount || 499}"`,
      `"${app.paymentInfo?.paidAt || ""}"`,
      `"${app.digitalSignature || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DevTech_Programs_Applications_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV candidate report downloaded successfully!");
  };

  // List of unique roles present in applications for filter dropdown
  const uniqueRoles = Array.from(new Set(applications.map(a => a.role)));

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.personalInfo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.personalInfo.mobile.includes(searchQuery) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.paymentInfo?.paymentId && app.paymentInfo.paymentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.paymentInfo?.orderId && app.paymentInfo.orderId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPaymentStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PAID" && app.paymentInfo?.status === "PAID") ||
      (statusFilter === "PENDING" && app.paymentInfo?.status !== "PAID");

    const matchesRole =
      roleFilter === "ALL" || app.role === roleFilter;

    const matchesCandidateStatus =
      candidateStatusFilter === "ALL" || (app.status || "SUBMITTED") === candidateStatusFilter;

    return matchesSearch && matchesPaymentStatus && matchesRole && matchesCandidateStatus;
  });

  const totalRevenue = applications
    .filter(a => a.paymentInfo?.status === "PAID")
    .reduce((sum, a) => sum + (a.paymentInfo?.amount || 499), 0);

  const paidCount = applications.filter(a => a.paymentInfo?.status === "PAID").length;

  if (isAuthenticated === null || isPending) {
    return (
      <div className="min-h-screen bg-[#070B19] text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-semibold text-slate-400">Loading DevTech Programs Admin Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={loadData} />;
  }

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
      <Toaster position="top-right" richColors />

      {/* Corporate Admin Top Header */}
      <header className="border-b border-slate-800 bg-[#0A1026] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              DP
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                DevTech Programs Admin
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  MongoDB Connected
                </span>
              </h1>
              <p className="text-xs text-slate-400">Corporate Internship & Candidate Registration Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Buttons */}
            <button
              onClick={() => setActiveTab("APPLICATIONS")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "APPLICATIONS"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <User className="w-4 h-4" /> Applications ({applications.length})
            </button>

            <button
              onClick={() => setActiveTab("FEE_SETTINGS")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "FEE_SETTINGS"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Settings className="w-4 h-4 text-emerald-400" /> Manage Domain Positions ({editableRoles.length})
            </button>

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-2"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-6">

        {/* TAB 1: APPLICATIONS DASHBOARD */}
        {activeTab === "APPLICATIONS" && (
          <>
            {/* Executive Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Registrations</span>
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-extrabold text-white">{applications.length}</p>
                <p className="text-[11px] text-slate-400">Total onboarded candidate profiles</p>
              </div>

              <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-400">₹{totalRevenue.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-slate-400">Verified Razorpay payments</p>
              </div>

              <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Paid Registrations</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-3xl font-extrabold text-white">{paidCount} <span className="text-xs text-slate-400 font-normal">/ {applications.length}</span></p>
                <p className="text-[11px] text-slate-400">Success conversion rate: {applications.length ? Math.round((paidCount / applications.length) * 100) : 0}%</p>
              </div>

              <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Domain Positions</span>
                  <Layers className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">{editableRoles.filter(r => r.active).length} <span className="text-xs text-slate-400 font-normal">Tracks</span></p>
                <p className="text-[11px] text-blue-400 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab("FEE_SETTINGS")}>
                  Manage Positions & Fees →
                </p>
              </div>
            </div>

            {/* Comprehensive Search & Filter Toolbar */}
            <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                {/* Live Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ID, Name, Email, Phone, Pay ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#080E20] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Domain Filter Dropdown */}
                {uniqueRoles.length > 0 && (
                  <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="w-full sm:w-auto bg-[#080E20] border border-slate-800 rounded-xl px-3 py-2 text-xs text-blue-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ALL">All Interested Domains ({applications.length})</option>
                    {uniqueRoles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                )}

                {/* Candidate Hiring Status Filter */}
                <select
                  value={candidateStatusFilter}
                  onChange={e => setCandidateStatusFilter(e.target.value)}
                  className="w-full sm:w-auto bg-[#080E20] border border-slate-800 rounded-xl px-3 py-2 text-xs text-purple-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Hiring Statuses</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="ENROLLED">Enrolled</option>
                  <option value="REJECTED">Rejected</option>
                </select>

                {/* Payment Status Filter Buttons */}
                <div className="flex items-center gap-1 bg-[#080E20] border border-slate-800 rounded-xl p-1 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${statusFilter === "ALL" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    All Payments
                  </button>
                  <button
                    onClick={() => setStatusFilter("PAID")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${statusFilter === "PAID" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => setStatusFilter("PENDING")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${statusFilter === "PENDING" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Pending
                  </button>
                </div>
              </div>

              <button
                onClick={handleExportCSV}
                className="w-full lg:w-auto px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                Export CSV Report
              </button>
            </div>

            {/* Corporate Applications Table */}
            <div className="bg-[#0B132B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080E20] border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Registration ID</th>
                      <th className="p-4">Applicant & Contact</th>
                      <th className="p-4">Interested Domain</th>
                      <th className="p-4">Standing & Experience</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4">Candidate Status</th>
                      <th className="p-4 text-center">Resume</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                          No candidate records found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map(app => {
                        const isPaid = app.paymentInfo?.status === "PAID";
                        return (
                          <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                            
                            {/* Registration ID */}
                            <td className="p-4 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-lg text-xs tracking-wider">
                                  {app.id}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(app.id, "Registration ID")}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                  title="Copy Registration ID"
                                >
                                  {copiedId === app.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                {new Date(app.submittedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                              </div>
                            </td>

                            {/* Applicant Info */}
                            <td className="p-4 space-y-0.5">
                              <div className="font-bold text-white text-sm">{app.personalInfo.fullName}</div>
                              <div className="text-slate-400">{app.personalInfo.email}</div>
                              <div className="text-[11px] text-blue-400 font-mono">{app.personalInfo.mobile} • {app.personalInfo.city}</div>
                            </td>

                            {/* Interested Domain */}
                            <td className="p-4">
                              <span className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 font-bold text-xs inline-block shadow-xs">
                                {app.role}
                              </span>
                            </td>

                            {/* Academic & Standing */}
                            <td className="p-4 space-y-0.5">
                              <div className="font-semibold text-slate-200">{app.academic.qualification} ({app.academic.graduationYear})</div>
                              <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{app.academic.college}</div>
                              <div className="text-[11px] text-amber-400 font-medium">{app.experience.level} ({app.experience.totalExperience || "Fresher"})</div>
                            </td>

                            {/* Payment Status */}
                            <td className="p-4 space-y-1">
                              <div className="flex items-center gap-1.5">
                                {isPaid ? (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> PAID ₹{app.paymentInfo?.amount || 499}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-[10px] flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> PENDING
                                  </span>
                                )}
                              </div>
                              {app.paymentInfo?.paymentId && (
                                <div className="text-[10px] font-mono text-slate-400">
                                  Pay ID: <span className="text-emerald-400 font-semibold">{app.paymentInfo.paymentId}</span>
                                </div>
                              )}
                            </td>

                            {/* Hiring Status Dropdown */}
                            <td className="p-4">
                              <select
                                value={app.status || "SUBMITTED"}
                                onChange={e => handleStatusChange(app.id, e.target.value as any)}
                                className="bg-[#080E20] border border-slate-700 text-[11px] font-bold px-2.5 py-1.5 rounded-lg text-indigo-300 focus:outline-none cursor-pointer"
                              >
                                <option value="SUBMITTED">SUBMITTED</option>
                                <option value="SHORTLISTED">SHORTLISTED</option>
                                <option value="INTERVIEW_SCHEDULED">INTERVIEW</option>
                                <option value="ENROLLED">ENROLLED</option>
                                <option value="REJECTED">REJECTED</option>
                              </select>
                            </td>

                            {/* Resume Download */}
                            <td className="p-4 text-center">
                              {app.documents?.resumeDataUrl ? (
                                <a
                                  href={app.documents.resumeDataUrl}
                                  download={app.documents.resumeName || `Resume_${app.personalInfo.fullName}.pdf`}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" /> PDF
                                </a>
                              ) : (
                                <span className="text-slate-500 text-[11px]">No file</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                                title="View Dossier Modal"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteApplication(app.id, app.personalInfo.fullName)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                title="Delete Application"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: MANAGE DOMAIN POSITIONS & REGISTRATION FEES */}
        {activeTab === "FEE_SETTINGS" && (
          <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-blue-400" />
                  Domain Position Tracks & Registration Fees Manager
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add new internship positions, set custom registration fees, and manage active domain listings live on candidate portal.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openAddRoleModal}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Domain Position
                </button>

                <button
                  onClick={() => handleSaveFeeSettings(editableRoles)}
                  disabled={isSavingSettings}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingSettings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving Settings...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Live Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Global Default Registration Fee Settings Box */}
            <div className="bg-[#080E20] border border-slate-800 rounded-2xl p-5 max-w-lg space-y-3">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Default Fallback Registration Fee (INR)
              </label>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={editableDefaultFee}
                  onChange={e => setEditableDefaultFee(Number(e.target.value))}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-2.5 text-base font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
                />
                <span className="text-slate-400 text-xs font-semibold">INR</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Applied automatically for any position track without custom pricing.
              </p>
            </div>

            {/* Position Roles Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Active Domain Positions ({editableRoles.length})
                </h4>
                <span className="text-xs text-slate-400">Click Edit to modify fee or domain title</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {editableRoles.map(role => (
                  <div
                    key={role.id}
                    className={`p-5 rounded-2xl border transition-all space-y-4 ${
                      role.active
                        ? "bg-[#080E20] border-slate-800 hover:border-slate-700 shadow-md"
                        : "bg-[#080E20]/40 border-slate-800/40 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                          {role.dept} • {role.type}
                        </span>
                        <h5 className="font-extrabold text-sm text-white mt-0.5">{role.title}</h5>
                      </div>

                      <button
                        onClick={() => handleRoleToggleActive(role.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer ${
                          role.active ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {role.active ? "Active" : "Disabled"}
                      </button>
                    </div>

                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Registration Fee</span>
                        <span className="text-base font-extrabold text-emerald-400">₹{role.fee ?? editableDefaultFee} INR</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditRoleModal(role)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors cursor-pointer"
                          title="Edit Position"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id, role.title)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          title="Delete Position"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* MODAL: ADD / EDIT DOMAIN POSITION */}
        {isAddRoleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B132B] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsAddRoleModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-400" />
                  {editingRole ? "Edit Domain Position Track" : "Add New Domain Position Track"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure title, department, employment track, and registration fee.
                </p>
              </div>

              <form onSubmit={handleSaveRoleModal} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Position / Domain Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI & Machine Learning Engineer Intern"
                    value={roleTitle}
                    onChange={e => setRoleTitle(e.target.value)}
                    className="w-full bg-[#080E20] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Department / Lab *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI Innovation Lab"
                      value={roleDept}
                      onChange={e => setRoleDept(e.target.value)}
                      className="w-full bg-[#080E20] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Employment Track Type *
                    </label>
                    <select
                      value={roleType}
                      onChange={e => setRoleType(e.target.value)}
                      className="w-full bg-[#080E20] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Full-Time / Part-Time">Full-Time / Part-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Remote Internship">Remote Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Custom Registration Fee (INR) *
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold text-base">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="50"
                      value={roleFee}
                      onChange={e => setRoleFee(Number(e.target.value))}
                      className="w-full bg-[#080E20] border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400 font-medium">INR</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="roleActiveCheck"
                    checked={roleActive}
                    onChange={e => setRoleActive(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#080E20] border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="roleActiveCheck" className="text-slate-300 font-semibold cursor-pointer">
                    Enable & List this position live on candidate portal
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddRoleModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Position
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: FULL CANDIDATE DOSSIER DETAIL */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B132B] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-400 font-extrabold uppercase tracking-wider">{selectedApp.role}</span>
                  
                  {/* Hiring Status Selector */}
                  <select
                    value={selectedApp.status || "SUBMITTED"}
                    onChange={e => handleStatusChange(selectedApp.id, e.target.value as any)}
                    className="bg-[#080E20] border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl text-emerald-400 focus:outline-none cursor-pointer"
                  >
                    <option value="SUBMITTED">Status: SUBMITTED</option>
                    <option value="SHORTLISTED">Status: SHORTLISTED</option>
                    <option value="INTERVIEW_SCHEDULED">Status: INTERVIEW_SCHEDULED</option>
                    <option value="ENROLLED">Status: ENROLLED</option>
                    <option value="REJECTED">Status: REJECTED</option>
                  </select>
                </div>

                <h3 className="text-2xl font-bold text-white">{selectedApp.personalInfo.fullName}</h3>
                
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400">Registration ID:</span>
                  <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30 text-xs">
                    {selectedApp.id}
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedApp.id, "Registration ID")}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy Registration ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Razorpay Payment Details Box */}
              <div className="p-4 rounded-2xl bg-[#080E20] border border-slate-800 space-y-2 font-mono text-xs">
                <div className="font-sans font-bold text-slate-200 border-b border-slate-800 pb-2 mb-2">Razorpay Payment Gateway Summary</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className={selectedApp.paymentInfo?.status === "PAID" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {selectedApp.paymentInfo?.status || "PENDING"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment ID:</span>
                  <span className="text-emerald-400 font-semibold">{selectedApp.paymentInfo?.paymentId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="text-slate-300">{selectedApp.paymentInfo?.orderId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="text-white font-bold">₹{selectedApp.paymentInfo?.amount || 499} INR</span>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Contact Information</span>
                  <p>Email: <span className="text-white font-medium">{selectedApp.personalInfo.email}</span></p>
                  <p>Phone: <span className="text-white font-medium">{selectedApp.personalInfo.mobile}</span></p>
                  <p>City: <span className="text-white font-medium">{selectedApp.personalInfo.city}</span></p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Standing & Academic</span>
                  <p>Degree: <span className="text-white font-medium">{selectedApp.academic.qualification} ({selectedApp.academic.graduationYear})</span></p>
                  <p>College: <span className="text-white font-medium">{selectedApp.academic.college}</span></p>
                  <p>Standing: <span className="text-amber-400 font-bold">{selectedApp.experience.level} ({selectedApp.experience.totalExperience || "Fresher"})</span></p>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Technical Stack ({selectedApp.proficiency})</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedApp.skills || []).map(s => (
                    <span key={s} className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-500/30">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Screening Answers */}
              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-blue-400 font-bold block mb-1">Tell us about yourself:</span>
                  <p className="text-slate-300 bg-[#080E20] p-3 rounded-xl border border-slate-800">{selectedApp.screening.aboutYourself}</p>
                </div>
                <div>
                  <span className="text-blue-400 font-bold block mb-1">Proud major project:</span>
                  <p className="text-slate-300 bg-[#080E20] p-3 rounded-xl border border-slate-800">{selectedApp.screening.proudProject}</p>
                </div>
              </div>

              {/* Links & Signature */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Digital Signature:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedApp.digitalSignature}</span>
                </div>
                {selectedApp.documents?.resumeDataUrl && (
                  <a
                    href={selectedApp.documents.resumeDataUrl}
                    download={selectedApp.documents.resumeName}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Download className="w-4 h-4" /> Download PDF Resume
                  </a>
                )}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
