"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutHistory({ history }) {
  if (!history) {
    return null;
  }

  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-2 md:items-center md:py-20">
        
        {/* Left Column: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            Our Background
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl">
            {history.title || "History"}
          </h2>

          <div className="mt-6 text-sm leading-8 text-gray-600 sm:text-base">
            {history.content}
          </div>
        </motion.div>

        {/* Right Column: Image */}
        {history.image && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="relative aspect-4/3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <Image
              src={history.image}
              alt={history.title || "Department history"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}