"use client";

import React, { useState, useTransition } from "react";
import { loginAdmin } from "@/app/actions/admin-actions";
import { ShieldCheck, Lock, User, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from "lucide-react";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginAdmin(formData);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.error || "Authentication failed.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-blue-500/10 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-indigo-500/10 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 border border-blue-400/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            DevTech Admin Portal
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Careers CMS & Candidate Operations Center
          </p>
        </div>

        {/* Crisp White Card Container */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-200">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Username / Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Enter admin email..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-xl bg-primary hover:bg-blue-700 active:bg-blue-800 text-white font-heading font-bold text-sm shadow-xl shadow-primary/30 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Access CMS Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Info Hint Box */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Authorized DevTech Personnel Only</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Secure Cloud Database Connection Active (Firebase)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
