"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { submitContactForm } from "@/app/actions/contact";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required").max(50),
  lastName: z.string().min(2, "Last name is required").max(50),
  email: z.string().email("Valid email is required").max(100),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  honeypot: z.string().max(0),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function FaqContact() {
  const faqs = [
    {
      question: "What is your typical project timeline?",
      answer: "Project timelines vary depending on scope and complexity. A standard MVP typically takes 8-12 weeks, while large-scale enterprise solutions can span 6-12 months. We provide a detailed roadmap during the discovery phase."
    },
    {
      question: "Do you provide post-launch support and maintenance?",
      answer: "Absolutely. We offer comprehensive SLA-based support packages ensuring your application remains secure, up-to-date, and fully optimized long after the initial launch."
    },
    {
      question: "What technologies do you specialize in?",
      answer: "We are framework-agnostic but specialize in modern, scalable tech stacks including React, Next.js, Node.js, Python, AWS, and GCP. Our architectural choices are driven by your specific business requirements."
    },
    {
      question: "How do you ensure the security of the applications you build?",
      answer: "Security is built into our SDLC from day one. We implement zero-trust architectures, conduct regular penetration testing, and adhere strictly to industry compliance standards like GDPR and HIPAA."
    }
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      honeypot: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const result = await submitContactForm(data);
      if (result.success) {
        toast.success("Thank you! Your message has been sent successfully. Our team will contact you shortly.");
        reset();
      } else {
        toast.error(result.error || "Something went wrong. Please try again later.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <section className="py-24 bg-slate-50" id="contact">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* FAQ Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4 tracking-tight">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <p className="text-slate-500 leading-relaxed text-lg">
                Common queries about our process, technology, and engagement models.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Accordion className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200 py-2">
                    <AccordionTrigger className="text-left font-heading font-semibold text-lg text-slate-800 hover:text-primary hover:no-underline transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-500 leading-relaxed text-base pt-2 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-slate-900">Email Us</h4>
                  <a href="mailto:support@devtechitsolution.com" className="text-slate-500 hover:text-primary transition-colors text-sm">support@devtechitsolution.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-slate-900">Visit Us</h4>
                  <p className="text-slate-500 text-sm">Kalyan, Mumbai, India</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px]"></div>

              <h3 className="text-2xl font-heading font-bold text-slate-900 mb-2">Ready to Innovate?</h3>
              <p className="text-slate-500 mb-8">Fill out the form below and our technical experts will get back to you within 24 hours.</p>

              <form className="space-y-5 relative z-10" onSubmit={handleSubmit(onSubmit)}>
                {/* Honeypot field (hidden) */}
                <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">First Name</label>
                    <Input
                      {...register("firstName")}
                      placeholder="John"
                      className={`h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary ${errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Name</label>
                    <Input
                      {...register("lastName")}
                      placeholder="Doe"
                      className={`h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary ${errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Work Email</label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="john@company.com"
                    className={`h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Project Details</label>
                  <Textarea
                    {...register("message")}
                    placeholder="Tell us about your project requirements..."
                    className={`min-h-[120px] bg-slate-50 border-slate-200 focus-visible:ring-primary resize-none ${errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-lg text-base font-semibold shadow-md hover:shadow-lg transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
