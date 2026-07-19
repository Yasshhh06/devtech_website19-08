"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Code, Terminal, Database, TrendingUp, Clock, BookOpen, Lightbulb, Users, Award, Heart, Globe, Cpu, Shield, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Careers() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const jobs = [
    { title: "Senior Frontend Engineer", type: "Full-Time", location: "Remote / Mumbai", icon: <Code className="w-5 h-5" />, slug: "frontend-engineer" },
    { title: "Lead DevOps Architect", type: "Full-Time", location: "Mumbai, India", icon: <Terminal className="w-5 h-5" />, slug: "devops-architect" },
    { title: "Backend Systems Engineer", type: "Full-Time", location: "Remote", icon: <Database className="w-5 h-5" />, slug: "backend-systems-engineer" },
  ];

  const benefits = [
    { title: "Career Growth", desc: "Clear progression paths tailored to your goals. We invest heavily in promoting from within.", icon: <TrendingUp className="w-5 h-5" /> },
    { title: "Flexible Work Culture", desc: "Choose where you work best. We support hybrid and fully remote setups based on role.", icon: <Clock className="w-5 h-5" /> },
    { title: "Continuous Learning", desc: "Access to premium courses, certifications, and dedicated time for skill development.", icon: <BookOpen className="w-5 h-5" /> },
    { title: "Innovation First", desc: "Experiment with cutting-edge tech. We encourage R&D and creative problem-solving.", icon: <Lightbulb className="w-5 h-5" /> },
    { title: "Supportive Team", desc: "Collaborate with talented, low-ego peers who are always willing to share knowledge.", icon: <Users className="w-5 h-5" /> },
    { title: "Performance Recognition", desc: "Competitive compensation and bonus structures rewarding exceptional contributions.", icon: <Award className="w-5 h-5" /> },
    { title: "Work–Life Balance", desc: "Generous PTO and wellness initiatives ensuring you recharge and maintain health.", icon: <Heart className="w-5 h-5" /> },
    { title: "Global Exposure", desc: "Work on international projects and gain experience across diverse global markets.", icon: <Globe className="w-5 h-5" /> },
    { title: "Modern Tech Stack", desc: "Build with Next.js, Go, AI, and Cloud architecture avoiding legacy constraints.", icon: <Cpu className="w-5 h-5" /> },
    { title: "Ownership & Responsibility", desc: "Take charge of entire systems and see the direct impact of your code in production.", icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white relative" id="careers">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/20 text-primary font-medium text-sm border border-primary/20">
              Join Our Team
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight">
              Build the Future <br />
              <span className="text-primary">With Us</span>
            </h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-lg">
              We're always looking for brilliant minds who are passionate about technology. Enjoy competitive benefits, remote flexibility, and a culture of continuous learning.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <div className="text-4xl font-heading font-bold text-white mb-2">Remote</div>
                <div className="text-sm font-medium text-slate-400">Flexible Working Hours</div>
              </div>
              <div>
                <div className="text-4xl font-heading font-bold text-white mb-2">100%</div>
                <div className="text-sm font-medium text-slate-400">Health Coverage</div>
              </div>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white border-0 shadow-lg shadow-primary/25 h-14 text-base font-semibold"
            >
              View All Benefits
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-2xl font-heading font-bold mb-6 text-white border-b border-slate-800 pb-4">Open Positions</h3>
            {jobs.map((job, index) => (
              <Link href={`/careers/${job.slug}`} key={index}>
                <div
                  className="group p-6 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800 hover:border-primary/50 transition-all duration-300 cursor-pointer flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/10 transition-colors shadow-inner border border-slate-700">
                      {job.icon}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-lg text-white group-hover:text-primary transition-colors">{job.title}</h4>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-400 mt-1">
                        <span>{job.type}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 pb-12 lg:p-8 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl relative mt-4 mb-auto"
            >
              {/* Modal Header */}
              <div className="bg-white px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Why Join DevTech IT Solution</h2>
                  <p className="text-slate-500 text-sm mt-1">Discover the benefits of building the future with us.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 lg:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefits.map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{benefit.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Modal Footer / CTA */}
              <div className="bg-white border-t border-slate-100 p-8 lg:p-10 text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Build the Future with Us?</h3>
                <p className="text-slate-500 max-w-xl mx-auto mb-6">
                  Join DevTech IT Solution and work on innovative projects that make a real impact.
                </p>
                {/* <Button 
                  onClick={() => router.push("/careers/apply")}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 shadow-lg shadow-primary/20"
                >
                  Apply Now
                </Button> */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
