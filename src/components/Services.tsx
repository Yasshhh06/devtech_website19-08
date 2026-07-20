"use client";

import { motion, Variants } from "framer-motion";
import { Monitor, Smartphone, PenTool, ShieldCheck, Briefcase, TrendingUp, BrainCircuit, ArrowRight } from "lucide-react";

export default function Services() {
  const handleWhatsApp = () => {
    const phoneNumber = "919326093960";
    const message = `Hello DevTech IT Solution Team,

I came across your website and I'm interested in discussing a custom software solution for my business.

Here are a few details about my requirements:

• Business/Company Name: 
• Industry: 
• Project Type: 
• Brief Project Description: 
• Estimated Budget: 
• Expected Timeline: 

I would appreciate it if someone from your team could get in touch with me to discuss the project further.

Thank you.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const services = [
    {
      title: "Website Development",
      description: "High-performance, scalable web applications tailored to your business needs.",
      icon: <Monitor className="w-6 h-6" />,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile experiences that users love.",
      icon: <Smartphone className="w-6 h-6" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "UI/UX Design",
      description: "Intuitive, engaging, and beautiful interfaces designed for conversion.",
      icon: <PenTool className="w-6 h-6" />,
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    },
    {
      title: "Cyber Security",
      description: "Enterprise-grade security solutions to protect your digital assets.",
      icon: <ShieldCheck className="w-6 h-6" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "IT Consulting",
      description: "Strategic guidance to align your technology with business goals.",
      icon: <Briefcase className="w-6 h-6" />,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Digital Marketing",
      description: "Data-driven marketing strategies to accelerate your growth.",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
    {
      title: "AI Solutions",
      description: "Intelligent automation and machine learning models for your enterprise.",
      icon: <BrainCircuit className="w-6 h-6" />,
      color: "text-violet-600",
      bg: "bg-violet-50"
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 bg-slate-50" id="services">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight"
          >
            Premium Services for <span className="text-primary">Global Brands</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            We deliver end-to-end technology solutions designed to solve complex business challenges and drive sustainable growth.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${service.bg} ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-heading font-semibold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 mb-8 flex-grow leading-relaxed">
                {service.description}
              </p>

            </motion.div>
          ))}

          {/* CTA Card for the 8th slot */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-900 rounded-2xl p-8 shadow-md flex flex-col justify-center items-center text-center h-full text-white relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-2xl font-heading font-bold mb-4 relative z-10">
              Need a Custom Solution?
            </h3>
            <p className="text-slate-300 mb-8 relative z-10">
              Let's discuss how our technology can accelerate your business vision.
            </p>
            <motion.button
              onClick={handleWhatsApp}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-slate-100 hover:-translate-y-1 transition-all flex items-center shadow-sm relative z-10 cursor-pointer"
            >
              Contact Us <ArrowRight className="ml-2 w-4 h-4" />
            </motion.button>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
