"use client";

import { motion } from "framer-motion";

export default function StatisticsSection({ statistics }) {
  if (!statistics || statistics.length === 0) return null;

  return (
    <section className="bg-white py-16 border-y border-gray-200">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {statistics.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
              className={`flex flex-col items-center justify-center text-center ${
                idx !== 0 ? "pt-8 sm:pt-0" : ""
              }`}
            >
              <span className="text-4xl font-extrabold tracking-tight text-blue-900 sm:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-medium tracking-wide text-gray-500 uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}