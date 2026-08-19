"use client";

import { motion } from "framer-motion";
import { Users, Cpu, MessageSquare, Globe, Maximize, HeartHandshake } from "lucide-react";

export default function WhyChooseUs() {
  const reasons = [
    {
      title: "Experienced Developers",
      description: "Our team consists of top-tier engineering talent with proven enterprise experience.",
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: "Modern Technologies",
      description: "We leverage the latest tech stacks to ensure your solutions are fast, secure, and scalable.",
      icon: <Cpu className="w-8 h-8" />,
    },
    {
      title: "Transparent Communication",
      description: "Clear, consistent, and honest communication throughout the entire project lifecycle.",
      icon: <MessageSquare className="w-8 h-8" />,
    },
    {
      title: "Global Delivery",
      description: "Seamless collaboration across time zones with a battle-tested distributed delivery model.",
      icon: <Globe className="w-8 h-8" />,
    },
    {
      title: "Scalable Solutions",
      description: "Architecture designed to grow seamlessly as your user base and data requirements expand.",
      icon: <Maximize className="w-8 h-8" />,
    },
    {
      title: "Client Focused",
      description: "Your success is our priority. We partner with you as an extension of your own team.",
      icon: <HeartHandshake className="w-8 h-8" />,
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center">

          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight">
                Why Industry Leaders <span className="text-primary">Choose Us</span>
              </h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                We don't just write code; we build strategic digital assets. Our commitment to excellence, transparency, and innovation makes us the preferred technology partner for growing startups and established enterprises alike.
              </p>

              <div className="flex items-center gap-4 text-slate-900 font-semibold mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  98%
                </div>
                Client Retention Rate
              </div>
            </motion.div>
          </div>

          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary shadow-sm border border-slate-100 relative group overflow-hidden">
                      <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <div className="relative z-10">{reason.icon}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
