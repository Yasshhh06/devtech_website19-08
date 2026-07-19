"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Portfolio() {
  // Using high quality Unsplash placeholders for modern tech aesthetic
  const projects = [
    {
      title: "Fintech Core Banking Platform",
      category: "Finance",
      techStack: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
      description: "A highly secure, scalable core banking solution processing millions of transactions daily.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Healthcare Telemedicine App",
      category: "Healthcare",
      techStack: ["React Native", "WebRTC", "Firebase"],
      description: "An intuitive mobile app connecting patients with doctors via real-time video consultations.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Global Supply Chain Dashboard",
      category: "Logistics",
      techStack: ["Vue.js", "Python", "Docker", "GCP"],
      description: "Enterprise dashboard providing real-time visibility and predictive analytics for logistics.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "AI-Powered Retail Analytics",
      category: "Retail",
      techStack: ["React", "TensorFlow", "FastAPI"],
      description: "Machine learning platform analyzing consumer behavior to optimize inventory and sales.",
      image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "EdTech Learning Management",
      category: "Education",
      techStack: ["Next.js", "Prisma", "AWS S3"],
      description: "Scalable platform hosting thousands of courses with interactive assessments.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Travel Booking Engine",
      category: "Travel",
      techStack: ["Angular", "Spring Boot", "MongoDB"],
      description: "High-performance booking engine with complex pricing algorithms and third-party integrations.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Smart Manufacturing IoT Portal",
      category: "Manufacturing",
      techStack: ["React", "Node.js", "TimescaleDB"],
      description: "Real-time monitoring and predictive maintenance portal for factory equipment.",
      image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Hospitality Management Suite",
      category: "Hospitality",
      techStack: ["Next.js", "NestJS", "GraphQL"],
      description: "Comprehensive property management system for a global chain of luxury hotels.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Blockchain Identity Verification",
      category: "Cyber Security",
      techStack: ["React", "Solidity", "Go"],
      description: "Decentralized identity verification system ensuring privacy and compliance.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <section className="py-24 bg-white" id="portfolio">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight"
            >
              Featured <span className="text-primary">Projects</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-slate-500 leading-relaxed"
            >
              A glimpse into the digital solutions we've engineered for industry leaders around the globe.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold tracking-wide uppercase text-slate-900 rounded-full shadow-sm">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 mb-6 flex-grow leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>


              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
