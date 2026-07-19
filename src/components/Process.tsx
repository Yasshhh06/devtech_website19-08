"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Layout, Code, TestTube, Rocket, HeartHandshake } from "lucide-react";

export default function Process() {
  const steps = [
    { name: "Discovery", icon: <Search className="w-6 h-6" />, desc: "Understanding your vision, market, and core objectives." },
    { name: "Planning", icon: <PenTool className="w-6 h-6" />, desc: "Architecting the solution and defining the technical roadmap." },
    { name: "Design", icon: <Layout className="w-6 h-6" />, desc: "Crafting intuitive, premium UI/UX interfaces." },
    { name: "Development", icon: <Code className="w-6 h-6" />, desc: "Agile engineering using modern, scalable tech stacks." },
    { name: "Testing", icon: <TestTube className="w-6 h-6" />, desc: "Rigorous QA to ensure flawless performance and security." },
    { name: "Deployment", icon: <Rocket className="w-6 h-6" />, desc: "Seamless launch and infrastructure setup." },
    { name: "Support", icon: <HeartHandshake className="w-6 h-6" />, desc: "Continuous optimization and 24/7 maintenance." },
  ];

  return (
    <section className="py-24 bg-white" id="process">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight"
          >
            Our Proven <span className="text-primary">Process</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            A systematic, transparent approach that guarantees on-time delivery and uncompromising quality from concept to launch.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-8 left-[7%] w-[86%] h-[2px] bg-slate-100 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:text-primary group-hover:shadow-lg hover:-translate-y-1 transition-all duration-300 mb-6 relative z-10">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-2">{step.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
