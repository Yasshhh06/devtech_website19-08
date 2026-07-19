"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Blog() {
  const posts = [
    {
      title: "The Future of AI in Enterprise Software Development",
      category: "Artificial Intelligence",
      date: "Oct 24, 2026",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      title: "Zero-Trust Architecture: A Practical Guide",
      category: "Cyber Security",
      date: "Oct 18, 2026",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
      featured: false
    },
    {
      title: "Migrating Monoliths to Microservices",
      category: "Development",
      date: "Oct 12, 2026",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=600",
      featured: false
    }
  ];

  return (
    <section className="py-24 bg-white" id="blog">
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
              Latest <span className="text-primary">Insights</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-slate-500 leading-relaxed"
            >
              Expert perspectives on technology trends, software engineering, and digital strategy.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button className="text-slate-900 font-semibold hover:text-primary transition-colors flex items-center group">
              View All Articles
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer relative"
          >
            <div className="h-72 sm:h-96 w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={posts[0].image} 
                alt={posts[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            <div className="p-8 md:p-10 flex flex-col flex-grow bg-white">
              <div className="flex items-center gap-4 mb-4 text-sm font-medium">
                <span className="text-primary">{posts[0].category}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{posts[0].date}</span>
              </div>
              <h3 className="text-3xl font-heading font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                {posts[0].title}
              </h3>
              <p className="text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                Discover how artificial intelligence is reshaping the landscape of enterprise software development, bringing unprecedented automation and efficiency to complex engineering workflows.
              </p>
              <div className="mt-auto flex items-center text-primary font-semibold group/btn">
                Read Article
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Secondary Posts */}
          <div className="flex flex-col gap-8">
            {posts.slice(1).map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row h-full cursor-pointer"
              >
                <div className="w-full sm:w-2/5 h-48 sm:h-auto relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3 text-sm font-medium">
                    <span className="text-primary">{post.category}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="mt-auto flex items-center text-slate-900 font-semibold group-hover:text-primary transition-colors">
                    Read Article
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
