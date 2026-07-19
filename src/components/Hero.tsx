"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { scrollToElement } from "@/lib/utils";

export default function Hero() {
  const stats = [
    { value: "10+", label: "Clients" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Support" },
    { value: "Global", label: "Service Availability" },
  ];

  const handleWhatsApp = () => {
    const phoneNumber = "+919326093960";
    const message = "Hello DevTech IT Solution,\n\nI would like to book a free consultation regarding my project. Please let me know how we can get started.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id="home">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 w-full h-full z-0 bg-slate-900">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/3129977/3129977-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability (30%) */}
        <div className="absolute inset-0 bg-black/35"></div>
        {/* Bottom gradient to blend with the next section (white) */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8 mt-12 lg:mt-20">
        <div className="max-w-4xl mx-auto text-center">


          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
            className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-lg"
          >
            Your Vision. <br className="hidden md:block" />
            <span className="text-blue-400">Our Tech.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.2 }}
            className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
          >
            We build world-class, scalable software solutions that drive digital transformation for enterprise clients and ambitious startups globally.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className="w-full sm:w-auto">
              <Button onClick={handleWhatsApp} size="lg" className="w-full sm:w-auto cursor-pointer text-base h-14 px-8 rounded-full shadow-premium group bg-primary hover:bg-primary/90 text-white border-0">
                Get Free Consultation
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className="w-full sm:w-auto">
              <Button onClick={() => scrollToElement("portfolio")} size="lg" variant="outline" className="w-full sm:w-auto cursor-pointer text-base h-14 px-8 rounded-full border-white/20 text-white bg-black/20 hover:bg-white/10 hover:text-white backdrop-blur-md group">
                <PlayCircle className="mr-2 w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                View Our Work
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.8 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-6 bg-black/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/10">
              <div className="text-3xl md:text-4xl font-heading font-bold text-blue-400 mb-2 drop-shadow-sm">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium text-slate-200 text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
