"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Mail } from "lucide-react";

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function About() {
  const values = [
    "Uncompromising Quality",
    "Radical Transparency",
    "Continuous Innovation",
    "Client-Centric Approach"
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden" id="about">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative z-10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
                alt="DevTech Team Collaboration"
                className="w-full h-auto object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute -bottom-10 -right-10 z-20 bg-white p-8 rounded-2xl shadow-xl max-w-xs border border-slate-100 hidden md:block"
            >
              <div className="text-4xl font-heading font-bold text-primary mb-2">10+</div>
              <div className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">Years of Excellence</div>
              <p className="text-slate-500 text-sm">Delivering premium enterprise solutions globally.</p>
            </motion.div>
          </div>

          <div className="lg:w-1/2 lg:pl-10">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight">
                Engineering the <span className="text-primary">Future</span>
              </h2>

              <div className="prose prose-lg text-slate-600 mb-8">
                <p className="mb-4">
                  Born in Kalyan, Mumbai as a growing startup, DevTech IT Solution has rapidly evolved into a trusted technology partner for global enterprises and ambitious startups.
                </p>
                <p>
                  Our mission is to bridge the gap between visionary ideas and robust technical execution. We believe that technology should be an enabler, not a bottleneck. That's why we combine deep engineering expertise with elegant design thinking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>


            </motion.div>
          </div>
        </div>

        {/* Company Commitment Section */}
        <div className="mt-32 border-t border-slate-200 pt-24">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4 tracking-tight"
            >
              Our Commitment to <span className="text-primary">Excellence</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-slate-600 font-medium"
            >
              Driven by Innovation. Focused on Building Digital Excellence.
            </motion.p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-5/12 w-full relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] group border border-blue-100/50 bg-slate-50"
              >
                <div className="aspect-[4/5] relative w-full h-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
                    alt="DevTech Team Excellence"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-blue-500/10 rounded-3xl pointer-events-none"></div>
                </div>
              </motion.div>
            </div>

            <div className="lg:w-7/12 w-full">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-primary font-semibold rounded-full text-sm mb-6 shadow-sm border border-blue-100/50">
                  Client-First Approach
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-2">
                  DevTech IT Solution
                </h3>
                <p className="text-xl text-slate-500 font-medium mb-4">
                  Transforming Visions into Reality
                </p>
                <div className="flex items-center gap-2 mb-8">
                  <div className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-md">
                    Trusted Global Technology Partner
                  </div>
                </div>

                <div className="space-y-4 text-lg text-slate-600 mb-10 leading-relaxed">
                  <p>
                    At DevTech IT Solution, our vision is to help businesses embrace technology through innovative, scalable, and future-ready digital solutions that drive real impact.
                  </p>
                  <p>
                    We believe technology should simplify business operations, improve customer experiences, and create measurable growth. Our core focus lies in delivering top-tier software solutions, maintaining radical transparency, and fostering long-term partnerships with clients worldwide.
                  </p>
                  <p>
                    Backed by a talented team of engineers and designers, we are committed to continuous learning, engineering excellence, and crafting digital products that push the boundaries of what's possible for startups, SMEs, and enterprises.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="mailto:support@devtechitsolution.com"
                    className="flex items-center gap-4 group p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300 shrink-0">
                      <Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm text-slate-500 mb-1">Support Email</div>
                      <div className="font-semibold text-slate-800 truncate">support@devtechitsolution.com</div>
                    </div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/devtech-it-solution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300 shrink-0">
                      <LinkedinIcon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">LinkedIn</div>
                      <div className="font-semibold text-slate-800">Company Profile</div>
                    </div>
                  </a>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl overflow-hidden"
                >
                  <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10">
                    <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24" className="text-white">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="relative z-10 text-xl font-medium text-white leading-relaxed italic">
                    "Technology is not just about building software. It is about creating opportunities, solving real problems, and empowering businesses to grow with confidence."
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
