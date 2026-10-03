"use client";
import { motion } from "framer-motion";

export default function IntroductionSection({ introduction, hodMessage }) {
  if (!introduction && !hodMessage) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        {introduction && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Overview</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {introduction.title}
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              {introduction.content}
            </p>
            {introduction.image && (
              <div className="mt-6 overflow-hidden rounded-2xl shadow-md">
                <img src={introduction.image} alt="Introduction" className="h-64 w-full object-cover transition hover:scale-105 duration-500" />
              </div>
            )}
          </motion.div>
        )}

        {hodMessage && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl sm:p-10"
          >
            <div className="flex items-center gap-4">
              {hodMessage.image && (
                <img src={hodMessage.image} alt={hodMessage.name} className="h-16 w-16 rounded-full border-2 border-blue-400 object-cover" />
              )}
              <div>
                <h3 className="text-lg font-bold">{hodMessage.name}</h3>
                <p className="text-xs text-blue-300">{hodMessage.designation}</p>
              </div>
            </div>
            <blockquote className="mt-6 text-slate-300 italic leading-relaxed text-sm">
              &ldquo;{hodMessage.message}&rdquo;
            </blockquote>
          </motion.div>
        )}
      </div>
    </section>
  );
}