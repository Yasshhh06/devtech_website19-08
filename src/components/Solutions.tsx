"use client";

import { motion } from "framer-motion";
import { Activity, BookOpen, CircleDollarSign, ShoppingCart, Factory, Plane, Coffee, Truck } from "lucide-react";

export default function Solutions() {
  const industries = [
    { name: "Healthcare", icon: <Activity className="w-8 h-8" /> },
    { name: "Education", icon: <BookOpen className="w-8 h-8" /> },
    { name: "Finance", icon: <CircleDollarSign className="w-8 h-8" /> },
    { name: "Retail", icon: <ShoppingCart className="w-8 h-8" /> },
    { name: "Manufacturing", icon: <Factory className="w-8 h-8" /> },
    { name: "Travel", icon: <Plane className="w-8 h-8" /> },
    { name: "Hospitality", icon: <Coffee className="w-8 h-8" /> },
    { name: "Logistics", icon: <Truck className="w-8 h-8" /> },
  ];

  return (
    <section className="py-24 bg-slate-50" id="solutions">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight"
          >
            Solutions Across <span className="text-primary">Industries</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            We possess deep domain expertise across various sectors, enabling us to deliver purpose-built solutions that address industry-specific challenges.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="text-slate-400 group-hover:text-primary transition-colors duration-300 mb-4 relative z-10">
                {industry.icon}
              </div>
              <h3 className="text-lg font-heading font-semibold text-slate-800 group-hover:text-primary transition-colors relative z-10">
                {industry.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
