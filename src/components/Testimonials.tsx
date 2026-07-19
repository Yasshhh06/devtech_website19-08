"use client";

import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Samrudhi Dere",
      role: "CTO, TechVision Global",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      text: "DevTech transformed our legacy systems into a modern, scalable architecture. Their team's technical depth and professional approach exceeded our expectations.",
    },
    {
      name: "Omkar Talekar",
      role: "Founder, FinTech Startup",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      text: "Choosing DevTech was the best technical decision we made. They delivered our core product 3 weeks ahead of schedule with zero critical bugs.",
    },
    {
      name: "Kajal Tambade",
      role: "VP of Engineering, EduCorp",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      text: "The UI/UX design they provided was stunning, and the subsequent development was flawless. A truly premium agency experience from start to finish.",
    },
    {
      name: "Nagesh Shejul",
      role: "Operations Director, Logistics Pro",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      text: "Their cloud infrastructure solutions saved us 40% in operational costs while improving system uptime to 99.99%. Incredible ROI.",
    }
  ];

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden" id="testimonials">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-white"
            >
              Client <span className="text-primary">Success Stories</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-slate-300 leading-relaxed"
            >
              Don't just take our word for it. Hear from the industry leaders who have partnered with us to accelerate their digital journey.
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl h-full flex flex-col">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8 flex-grow">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-700"
                      />
                      <div>
                        <h4 className="font-heading font-bold text-white">{testimonial.name}</h4>
                        <p className="text-sm text-slate-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-4 mt-8">
              <CarouselPrevious className="relative inset-0 translate-y-0 h-12 w-12 bg-slate-800 border-slate-700 text-white hover:bg-primary hover:text-white hover:border-primary transition-colors" />
              <CarouselNext className="relative inset-0 translate-y-0 h-12 w-12 bg-slate-800 border-slate-700 text-white hover:bg-primary hover:text-white hover:border-primary transition-colors" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
