"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Sparkles, ShieldCheck, Code, Terminal, Zap, ArrowDown } from "lucide-react";

interface CareersHeroProps {
  onApply?: (type: "Job" | "Internship", position?: string) => void;
}

export default function CareersHero({}: CareersHeroProps) {
  const handleScrollToOpportunities = () => {
    const el = document.getElementById("open-positions");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-900 via-[#0a1128] to-slate-900 text-white">
      {/* Background Animated Glows & Grids */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]"></div>
        
        {/* Subtle Tech Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)", 
            backgroundSize: "64px 64px" 
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <motion.div 
            className="lg:col-span-7 space-y-8 text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-blue-300 font-medium text-sm shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "6s" }} />
              <span>We Are Empowering Next-Gen Innovators</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight leading-[1.15]">
              Build Your Career with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 drop-shadow-sm">
                DevTech IT Solution
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
              Join our team of passionate developers, designers, cybersecurity professionals, and innovators. Whether you&apos;re an experienced professional or a student looking for an internship, we provide opportunities to learn, grow, and build impactful digital solutions.
            </p>

            {/* Single Prominent CTA Button */}
            <div className="flex items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleScrollToOpportunities}
                className="inline-flex items-center justify-center gap-3.5 px-9 py-4.5 rounded-2xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-base md:text-lg shadow-[0_10px_35px_rgba(37,99,235,0.45)] border border-blue-400/30 transition-all duration-300 cursor-pointer group/cta"
              >
                <Briefcase className="w-5 h-5 text-cyan-300 transition-transform duration-300 group-hover/cta:scale-110" />
                <span>Explore Current Opportunities</span>
                <ArrowDown className="w-5 h-5 ml-1 text-cyan-300 transition-transform duration-300 group-hover/cta:translate-y-1 animate-bounce" />
              </motion.button>
            </div>

            {/* Stats / Proof points */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl md:text-3xl font-heading font-extrabold text-white">100%</div>
                <div className="text-xs md:text-sm font-medium text-slate-400 mt-1">Live Projects</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-heading font-extrabold text-cyan-400">Remote & Hybrid</div>
                <div className="text-xs md:text-sm font-medium text-slate-400 mt-1">Flexible Culture</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-heading font-extrabold text-indigo-400">Fast-Track</div>
                <div className="text-xs md:text-sm font-medium text-slate-400 mt-1">Career Advancement</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Modern IT-Themed Animated Graphic */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div 
              className="w-full max-w-lg lg:max-w-none aspect-square relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Outer rotating orbit circle */}
              <div className="absolute w-80 h-80 md:w-96 md:h-96 border border-dashed border-primary/30 rounded-full animate-spin" style={{ animationDuration: "35s" }}></div>
              <div className="absolute w-64 h-64 border border-indigo-500/20 rounded-full animate-ping" style={{ animationDuration: "4s" }}></div>

              {/* Core Code Editor Mockup Card */}
              <div className="relative w-full bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 shadow-2xl overflow-hidden z-20">
                {/* Window header buttons */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-slate-400 ml-2 font-mono">devtech-career-engine.ts</span>
                  </div>
                  <Terminal className="w-4 h-4 text-slate-400" />
                </div>

                {/* Code content simulation */}
                <div className="font-mono text-xs md:text-sm space-y-2 text-slate-300 overflow-hidden leading-relaxed">
                  <div><span className="text-pink-400">import</span> {`{ Innovation, Talent, Excellence }`} <span className="text-pink-400">from</span> <span className="text-emerald-300">&quot;@devtech/core&quot;</span>;</div>
                  <div className="pt-1"><span className="text-blue-400">const</span> <span className="text-amber-300">futureCandidate</span> = <span className="text-pink-400">new</span> <span className="text-cyan-300">Talent</span>({`{`})</div>
                  <div className="pl-4">passion: <span className="text-emerald-300">&quot;High&quot;</span>,</div>
                  <div className="pl-4">mindset: <span className="text-emerald-300">&quot;Growth & Problem Solving&quot;</span>,</div>
                  <div className="pl-4">domains: [<span className="text-emerald-300">&quot;Full Stack&quot;</span>, <span className="text-emerald-300">&quot;UI/UX&quot;</span>, <span className="text-emerald-300">&quot;Cyber Security&quot;</span>],</div>
                  <div>{`}`});</div>
                  <div className="pt-2"><span className="text-purple-400">async function</span> <span className="text-blue-300">launchCareer</span>() {`{`}</div>
                  <div className="pl-4"><span className="text-pink-400">await</span> DevTech.<span className="text-amber-300">onboard</span>(futureCandidate);</div>
                  <div className="pl-4 text-emerald-400 font-bold">{"// 🚀 Result: Impactful Digital Solutions!"}</div>
                  <div>{`}`}</div>
                </div>

                {/* Bottom status badge */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-slate-300 font-medium">Hiring Actively for 2026</span>
                  </div>
                  <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-md font-semibold">Ready to deploy</span>
                </div>
              </div>

              {/* Floating Badge 1: Live Projects */}
              <motion.div 
                className="absolute -top-6 -left-6 md:-left-10 bg-slate-900/90 border border-slate-700 p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md z-30"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Live Client Projects</div>
                  <div className="text-[11px] text-slate-400">Global Tech Stack</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Cyber Security & Growth */}
              <motion.div 
                className="absolute -bottom-6 -right-4 md:-right-8 bg-slate-900/90 border border-slate-700 p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md z-30"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Secure & Flexible</div>
                  <div className="text-[11px] text-slate-400">Mentorship Driven</div>
                </div>
              </motion.div>

              {/* Floating Badge 3: Fast learning */}
              <motion.div 
                className="absolute top-1/2 -right-6 bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl shadow-xl hidden sm:flex items-center gap-2 backdrop-blur-md z-30"
                animate={{ x: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">Continuous Growth</span>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
