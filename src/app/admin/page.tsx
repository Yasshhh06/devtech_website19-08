"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { checkAdminAuth } from "@/app/actions/admin-actions";
import AdminLogin from "@/components/admin/AdminLogin";
import { Briefcase, Layers, ArrowRight, ShieldCheck, Database, CreditCard } from "lucide-react";

export default function CentralAdminLauncherPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then(res => setIsAuthenticated(res));
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#070B19] text-white flex items-center justify-center">
        <p className="text-slate-400 text-sm">Authenticating DevTech Security System...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-100 font-sans flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            DevTech IT Solutions Central Security Portal
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Admin Control Panel
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Choose which administrative management portal you would like to launch.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          
          {/* 1. Careers Admin Card */}
          <Link
            href="/carreradmin"
            className="group bg-[#0B132B] hover:bg-[#0E1838] border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                Careers Admin Portal
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage job vacancies, career application submissions, hiring pipelines, and direct candidate inquiries.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-indigo-400">
              <span>Open /carreradmin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. DevTech Programs Admin Card */}
          <Link
            href="/devtechprogramsadmin"
            className="group bg-[#0B132B] hover:bg-[#0E1838] border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 transition-all shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                DevTech Programs Admin
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                View student internship registrations, MongoDB database records, Razorpay payment transaction IDs, and CSV report export.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-purple-400">
              <span>Open /devtechprogramsadmin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        <div className="text-center pt-6">
          <p className="text-xs text-slate-500 font-mono">
            Direct URLs: devtechitsolution.com/carreradmin • devtechitsolution.com/devtechprogramsadmin
          </p>
        </div>

      </div>
    </div>
  );
}
