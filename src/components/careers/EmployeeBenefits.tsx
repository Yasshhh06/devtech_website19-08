"use client";

import React from "react";
import { motion } from "framer-motion";
import { EMPLOYEE_BENEFITS } from "@/lib/careers-data";
import { TrendingUp, Globe, BookOpen, Users, Heart, Award, Layers, Sparkles, Check } from "lucide-react";

const benefitIcons: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-6 h-6 text-primary" />,
  Globe: <Globe className="w-6 h-6 text-blue-500" />,
  BookOpen: <BookOpen className="w-6 h-6 text-indigo-500" />,
  Users: <Users className="w-6 h-6 text-emerald-500" />,
  Heart: <Heart className="w-6 h-6 text-rose-500" />,
  Award: <Award className="w-6 h-6 text-amber-500" />,
  Layers: <Layers className="w-6 h-6 text-cyan-500" />,
  Sparkles: <Sparkles className="w-6 h-6 text-purple-500" />
};

export default function EmployeeBenefits() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Heading & Summary */}
          <motion.div 
            className="lg:col-span-4 lg:sticky lg:top-32 space-y-6 text-left"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 text-blue-300 font-semibold text-xs uppercase tracking-wider border border-primary/30">
              Employee Centric
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight">
              Comprehensive <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                Employee Benefits
              </span>
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              At DevTech IT Solution, our people are our strongest competitive advantage. We provide competitive compensation, continuous learning perks, and empathetic wellness programs so you can do your best work.
            </p>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span>100% Comprehensive Health & Wellness Support</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span>Generous Paid Time Off & Holidays</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span>Sponsored Certification & Training Budget</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Benefits Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EMPLOYEE_BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-7 border border-slate-700/80 hover:bg-slate-800 hover:border-primary/50 transition-all duration-300 flex items-start gap-5 group shadow-lg"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  {benefitIcons[benefit.icon] || <Sparkles className="w-6 h-6 text-primary" />}
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
