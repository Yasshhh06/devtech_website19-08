"use client";

import React from "react";
import { motion } from "framer-motion";
import { CAREER_FAQS } from "@/lib/careers-data";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle, Sparkles } from "lucide-react";

export default function CareersFAQ() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        
        <div className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-4 border border-primary/20"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight mb-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Frequently Asked <span className="text-primary">Questions</span>
          </motion.h2>
          <motion.p 
            className="text-slate-600 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find quick answers about our recruitment process, internship opportunities, and workplace flexibility.
          </motion.p>
        </div>

        {/* Accordion Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-200/80"
        >
          <Accordion defaultValue={["item-0"]} className="space-y-4">
            {CAREER_FAQS.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-slate-200/80 rounded-2xl px-6 py-2 transition-colors duration-200 data-[open=true]:bg-slate-50/70 data-[open=true]:border-primary/30"
              >
                <AccordionTrigger className="text-base md:text-lg font-heading font-bold text-slate-900 py-4 hover:text-primary transition-colors cursor-pointer text-left">
                  <span className="pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm md:text-base leading-relaxed pt-2 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Still have questions banner */}
        <motion.div 
          className="mt-12 p-8 rounded-2xl bg-[#0f172a] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-1 text-center sm:text-left z-10">
            <h4 className="text-xl font-heading font-bold flex items-center justify-center sm:justify-start gap-2 text-white">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              Still have questions about a role?
            </h4>
            <p className="text-sm text-slate-300">
              Reach out to our talent team directly and we will be happy to assist you.
            </p>
          </div>

          <a
            href="mailto:hr@devtechitsolution.com"
            className="px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 font-heading font-bold text-sm text-white shadow-lg shadow-primary/30 transition-all duration-300 z-10 shrink-0"
          >
            Contact HR Support
          </a>
        </motion.div>

      </div>
    </section>
  );
}
