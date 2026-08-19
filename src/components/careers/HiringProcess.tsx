"use client";

import React from "react";
import { motion } from "framer-motion";
import { HIRING_PROCESS_STAGES } from "@/lib/careers-data";
import { Send, Search, PhoneCall, Code2, Users2, FileCheck, ArrowDown } from "lucide-react";

const stageIcons: Record<string, React.ReactNode> = {
  Send: <Send className="w-6 h-6 text-blue-400" />,
  Search: <Search className="w-6 h-6 text-indigo-400" />,
  PhoneCall: <PhoneCall className="w-6 h-6 text-emerald-400" />,
  Code2: <Code2 className="w-6 h-6 text-purple-400" />,
  Users2: <Users2 className="w-6 h-6 text-cyan-400" />,
  FileCheck: <FileCheck className="w-6 h-6 text-amber-400" />
};

export default function HiringProcess() {
  return (
    <section className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
      {/* Background radial highlights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] -translate-y-1/2"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 text-blue-300 font-semibold text-xs uppercase tracking-wider mb-4 border border-primary/30"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Streamlined Workflow
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our Simple & Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Hiring Process</span>
          </motion.h2>
          <motion.p 
            className="text-slate-300 text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We believe hiring should be transparent, prompt, and respectful of your time. Here is what to expect when you submit your application.
          </motion.p>
        </div>

        {/* Desktop & Tablet Timeline (Grid representation with arrows) */}
        <div className="hidden lg:grid grid-cols-6 gap-6 relative">
          {/* Connecting glowing timeline line */}
          <div className="absolute top-16 left-[8%] right-[8%] h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 opacity-60 z-0"></div>

          {HIRING_PROCESS_STAGES.map((stage, index) => (
            <motion.div
              key={stage.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="flex flex-col items-center text-center relative z-10 group"
            >
              {/* Step Circle & Icon */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 group-hover:border-primary shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center mb-6 transition-all duration-300 relative"
              >
                <span className="absolute -top-3 px-2 py-0.5 bg-primary text-white font-bold text-[10px] rounded-full shadow-sm">
                  STEP {stage.step}
                </span>
                {stageIcons[stage.icon]}
              </motion.div>

              <h4 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">
                {stage.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed px-2">
                {stage.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="lg:hidden flex flex-col items-center space-y-4 max-w-md mx-auto">
          {HIRING_PROCESS_STAGES.map((stage, index) => (
            <React.Fragment key={stage.step}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex items-start gap-4 shadow-lg relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  {stageIcons[stage.icon]}
                </div>
                <div>
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-primary mb-1">
                    Stage {stage.step}
                  </span>
                  <h4 className="font-heading font-bold text-lg text-white mb-1">
                    {stage.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </motion.div>
              {index < HIRING_PROCESS_STAGES.length - 1 && (
                <div className="flex justify-center text-primary py-1 animate-bounce">
                  <ArrowDown className="w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  );
}
