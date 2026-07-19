"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { scrollToElement } from "@/lib/utils";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 60) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  // Track active section via hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#home";
      const link = links.find((l) => l.href === hash);
      if (link) setActiveSection(link.name);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const links = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Solutions", href: "#solutions" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "About", href: "#about" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-500 ease-in-out h-[64px] md:h-[72px] lg:h-[84px] ${isScrolled
        ? "bg-white/95 backdrop-blur-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-gray-100"
        : "bg-gradient-to-b from-[rgba(8,15,35,0.65)] to-[rgba(8,15,35,0)] border-b border-transparent"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 2.2 }} // Delay to sync with page loader
    >
      <div className="w-full max-w-[1280px] mx-auto px-8 flex items-center justify-between h-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 relative z-50"
          onClick={() => {
            setActiveSection("Home");
            setMobileMenuOpen(false);
          }}
        >
          <div
            className={`text-2xl font-heading font-extrabold tracking-tight transition-colors duration-500 ${isScrolled ? "text-[#111827]" : "text-white drop-shadow-md"
              }`}
          >
            DevTech <span className="text-[#2563EB]">IT Solution</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 h-full">
          {links.map((link) => {
            const isActive = activeSection === link.name;
            return (
              <div key={link.name} className="relative h-full flex items-center px-4">
                <Link
                  href={link.href}
                  onClick={() => setActiveSection(link.name)}
                  className={`relative text-sm font-semibold transition-colors duration-300 group ${isActive
                    ? "text-[#2563EB]"
                    : isScrolled
                      ? "text-[#374151] hover:text-[#2563EB]"
                      : "text-white/90 hover:text-white drop-shadow-sm"
                    }`}
                >
                  {/* Hover Lift Animation wrapper */}
                  <motion.span
                    className="inline-block relative z-10"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {link.name}

                    {/* Standard Hover Underline (Hidden when active) */}
                    {!isActive && (
                      <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#2563EB] rounded-full transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    )}
                  </motion.span>
                </Link>

                {/* Animated Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-[calc(50%-16px)] left-0 right-0 mx-auto w-6 h-[2px] bg-[#2563EB] rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <motion.button
            onClick={() => scrollToElement("pricing")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-2.5 rounded-[12px] text-sm font-semibold transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] border border-blue-500/50 cursor-pointer"
          >
            Get Quote
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 relative z-50 rounded-lg hover:bg-black/5 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-[#111827]" />
          ) : (
            <Menu
              className={`w-6 h-6 transition-colors duration-500 ${isScrolled ? "text-[#111827]" : "text-white"
                }`}
            />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-[20px] shadow-2xl pt-24 pb-8 px-8 flex flex-col gap-6 border-b border-gray-100 min-h-[400px] z-40"
        >
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-lg font-semibold transition-colors flex items-center justify-between border-b border-gray-100 pb-4 ${activeSection === link.name
                ? "text-[#2563EB]"
                : "text-[#374151] hover:text-[#2563EB]"
                }`}
              onClick={() => {
                setActiveSection(link.name);
                setMobileMenuOpen(false);
              }}
            >
              {link.name}
              {activeSection === link.name && (
                <motion.div
                  layoutId="mobileActive"
                  className="w-2 h-2 rounded-full bg-[#2563EB]"
                />
              )}
            </Link>
          ))}
          <motion.button
            onClick={() => {
              scrollToElement("pricing");
              setMobileMenuOpen(false);
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 bg-[#2563EB] text-white rounded-[12px] py-3.5 font-semibold shadow-lg shadow-blue-500/30 active:bg-blue-700 cursor-pointer"
          >
            Get Quote
          </motion.button>
        </motion.div>
      )}
    </motion.header>
  );
}
