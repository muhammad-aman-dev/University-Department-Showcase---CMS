"use client";

import { motion } from "framer-motion";

export default function StatisticsSection({ statistics }) {
  if (!statistics || statistics.length === 0) return null;

  return (
    <section className="bg-white py-12 border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {statistics.map((stat, idx) => (
            <motion.div
            key={idx}
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="text-center"
          >
              <p className="text-3xl font-extrabold text-blue-900 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-600 sm:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}