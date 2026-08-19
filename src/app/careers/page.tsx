"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CareersHero from "@/components/careers/CareersHero";
import WhyJoinDevTech from "@/components/careers/WhyJoinDevTech";
import HiringProcess from "@/components/careers/HiringProcess";
import CurrentOpportunities from "@/components/careers/CurrentOpportunities";
import EmployeeBenefits from "@/components/careers/EmployeeBenefits";
import CareersFAQ from "@/components/careers/CareersFAQ";
import { Opportunity } from "@/lib/careers-data";

export default function CareersPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    // Dynamically fetch persistent opportunities if storage exists
    fetch("/api/opportunities")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOpportunities(data);
        }
      })
      .catch(() => {
        // Fallback to static seed
      });
  }, []);

  const handleApply = (type: "Job" | "Internship", position?: string) => {
    const queryParams = new URLSearchParams({ type });
    if (position) {
      queryParams.set("role", position);
    }
    router.push(`/careers/apply?${queryParams.toString()}`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Section 1: Hero Section */}
        <CareersHero onApply={handleApply} />

        {/* Section 2: Why Join DevTech */}
        <WhyJoinDevTech />

        {/* Section 3: Hiring Process */}
        <HiringProcess />

        {/* Section 4: Current Opportunities */}
        <CurrentOpportunities onApply={handleApply} opportunities={opportunities} />

        {/* Section 5: Employee Benefits */}
        <EmployeeBenefits />

        {/* Section 6: FAQ */}
        <CareersFAQ />
      </main>
      <Footer />
    </>
  );
}
