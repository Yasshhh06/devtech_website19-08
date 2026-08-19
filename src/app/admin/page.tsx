"use client";

import React, { useState, useEffect, useTransition } from "react";
import { checkAdminAuth, getAdminDashboardDataAction } from "@/app/actions/admin-actions";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Opportunity } from "@/lib/opportunities-db";
import { ApplicationRecord } from "@/lib/db";
import { ContactInquiryRecord } from "@/lib/contact-db";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiryRecord[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      const auth = await checkAdminAuth();
      setIsAuthenticated(auth);
      if (auth) {
        const data = await getAdminDashboardDataAction();
        if (data.success) {
          setOpportunities(data.opportunities || []);
          setApplications(data.applications || []);
          setInquiries(data.inquiries || []);
        }
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isAuthenticated === null || isPending) {
    return (
      <div className="min-h-screen bg-[#080F23] text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-semibold text-slate-400">Loading DevTech Admin Security Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={loadData} />;
  }

  return (
    <AdminDashboard
      initialOpportunities={opportunities}
      initialApplications={applications}
      initialInquiries={inquiries}
      onRefresh={loadData}
    />
  );
}
