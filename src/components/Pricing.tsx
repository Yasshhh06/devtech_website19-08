"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const handleRequestQuote = (planName: string) => {
    const phoneNumber = "+919326093960";
    const message = `Hello DevTech IT Solution,

I am interested in the ${planName} package displayed on your website.

I would like to request a quotation and discuss my project requirements.

Please contact me at your earliest convenience.

Thank you.`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };
  const plans = [
    {
      name: "Starter",
      desc: "Perfect for growing startups needing a solid technical foundation.",
      price: "Custom",
      features: [
        "UI/UX Design MVP",
        "Frontend Development",
        "Basic API Integration",
        "Standard QA Testing",
        "1 Month Post-Launch Support"
      ],
      popular: false
    },
    {
      name: "Professional",
      desc: "Ideal for established businesses scaling their operations.",
      price: "Custom",
      features: [
        "Comprehensive UI/UX Design",
        "Full-Stack Development",
        "Complex Backend Architecture",
        "Automated QA & Security Testing",
        "Cloud Infrastructure Setup",
        "3 Months SLA Support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      desc: "For large organizations requiring bespoke, highly scalable solutions.",
      price: "Custom",
      features: [
        "Enterprise Architecture Design",
        "Microservices & Legacy Migration",
        "AI & Machine Learning Integration",
        "Advanced Security & Compliance",
        "Dedicated Engineering Team",
        "24/7 Priority Support SLA"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-slate-50" id="pricing">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight"
          >
            Transparent <span className="text-primary">Partnership Models</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            We don't do cookie-cutter pricing. We architect solutions tailored to your scale, ensuring maximum ROI at every stage of your growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col h-full bg-white transition-all duration-500 ${plan.popular
                ? "border-2 border-primary shadow-xl md:scale-105 z-10"
                : "border border-slate-100 shadow-sm hover:shadow-md"
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-heading font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm h-10">{plan.desc}</p>
              </div>

              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="text-4xl font-heading font-bold text-slate-900">
                  {plan.price}
                </div>
                <div className="text-slate-400 text-sm mt-1 font-medium">Quoted per project requirements</div>
              </div>

              <ul className="flex flex-col gap-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-slate-600 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleRequestQuote(plan.name)}
                variant={plan.popular ? "default" : "outline"}
                className={`w-full h-12 rounded-full text-base font-semibold cursor-pointer ${!plan.popular && "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
              >
                Request a Quote
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
