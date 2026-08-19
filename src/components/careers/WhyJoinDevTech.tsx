"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { WHY_JOIN_DEVTECH_CARDS } from "@/lib/careers-data";
import { 
  Briefcase, TrendingUp, Cpu, Users, GraduationCap, Clock, 
  ChevronLeft, ChevronRight 
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="w-6 h-6 text-blue-600 transition-transform duration-300 group-hover:scale-110" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />,
  Cpu: <Cpu className="w-6 h-6 text-indigo-500 transition-transform duration-300 group-hover:scale-110" />,
  Users: <Users className="w-6 h-6 text-blue-500 transition-transform duration-300 group-hover:scale-110" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-purple-500 transition-transform duration-300 group-hover:scale-110" />,
  Clock: <Clock className="w-6 h-6 text-amber-500 transition-transform duration-300 group-hover:scale-110" />
};

export default function WhyJoinDevTech() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardsToShow, setCardsToShow] = useState<number>(3);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  const totalCards = WHY_JOIN_DEVTECH_CARDS.length;
  const maxIndex = Math.max(0, totalCards - cardsToShow);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive breakpoints: 3 on Desktop, 2 on Tablet, 1 on Mobile
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCardsToShow(1);
      } else if (width < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const safeIndex = Math.min(currentIndex, maxIndex);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay (every 5 seconds)
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Gentle ambient background depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full bg-radial-gradient from-blue-500/[0.03] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        
        {/* HEADING & SUBTITLE */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-4 border border-primary/20"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Us
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-5xl font-heading font-bold text-slate-900 tracking-tight mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Why Join <span className="text-primary">DevTech IT Solution</span>
          </motion.h2>
          <motion.p 
            className="text-slate-600 text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We don&apos;t just offer jobs; we cultivate a thriving ecosystem where your creativity is valued, your skills are sharpened, and your career achievements are celebrated.
          </motion.p>
        </div>

        {/* HARMONIOUS SAAS SLIDER TRACK */}
        <div 
          className="relative group/carousel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden py-6 -mx-4 px-4">
            <motion.div 
              className="flex cursor-grab active:cursor-grabbing select-none"
              animate={{ x: `-${safeIndex * (100 / cardsToShow)}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.x < -50 || velocity.x < -300) {
                  handleNext();
                } else if (offset.x > 50 || velocity.x > 300) {
                  handlePrev();
                }
              }}
            >
              {WHY_JOIN_DEVTECH_CARDS.map((card, idx) => (
                <div 
                  key={card.title}
                  style={{ width: `${100 / cardsToShow}%` }}
                  className="shrink-0 px-4 flex transition-all duration-300"
                >
                  <div className="w-full h-full min-h-[320px] rounded-3xl p-8 bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.09)] hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                    
                    {/* Top hover accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div>
                      {/* Icon container */}
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-blue-50/80 border border-slate-100 group-hover:border-blue-100 flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm">
                        {iconMap[card.icon] || <Briefcase className="w-6 h-6 text-primary" />}
                      </div>

                      <h3 className="text-xl font-heading font-bold text-slate-900 mb-3.5 group-hover:text-primary transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>DevTech Advantage</span>
                      <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase group-hover:text-primary transition-colors">
                        0{idx + 1} / 0{totalCards}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* UNIFIED CENTERED NAVIGATION CONSOLE */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="w-12 h-12 rounded-full bg-white text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 border border-slate-200 hover:border-transparent shadow-sm hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Pagination track */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-slate-200/60 border border-slate-300/40">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => {
                const isActive = dotIndex === safeIndex;
                return (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => setCurrentIndex(dotIndex)}
                    aria-label={`Jump to page ${dotIndex + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                      isActive 
                        ? "w-8 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm" 
                        : "w-2.5 bg-slate-400/60 hover:bg-slate-500"
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="w-12 h-12 rounded-full bg-white text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 border border-slate-200 hover:border-transparent shadow-sm hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
