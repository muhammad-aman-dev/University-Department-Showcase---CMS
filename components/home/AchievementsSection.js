"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AchievementsSection({ achievements }) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <section className="bg-slate-900 py-24 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Recognition</span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">Department Achievements</h2>
          </div>
          <Link href="/achievements" className="text-sm font-semibold text-blue-300 hover:text-white transition">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {achievements.slice(0, 4).map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ x: idx % 2 === 0 ? -20 : 20 }}
whileInView={{ x: 0 }}
viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl bg-white/5 p-8 backdrop-blur-md ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between text-xs text-blue-300 font-medium mb-3">
                <span>{item.category}</span>
                <span>{item.organization}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">{item.shortDescription}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}