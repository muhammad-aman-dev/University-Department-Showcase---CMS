"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function IntroductionSection({ introduction, hodMessage }) {
  if (!introduction && !hodMessage) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        {/* Introduction Overview */}
        {introduction && (
          <motion.div
          initial={{ x: -30 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Overview
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {introduction.title}
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              {introduction.content}
            </p>
            {introduction.image && (
              <div className="relative mt-6 h-64 w-full overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={introduction.image}
                  alt={introduction.title || "Introduction"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90} // Ensures high visual fidelity without compromising quality
                  className="object-contain transition duration-500 hover:scale-105"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* HOD Message */}
        {hodMessage && (
          <motion.div
          initial={{ x: 30 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl sm:p-10"
          >
            <div className="flex items-center gap-4">
              {hodMessage.image && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-blue-400">
                  <Image
                    src={hodMessage.image}
                    alt={hodMessage.name || "HOD"}
                    fill
                    quality={90}
                    className="object-contain"
                  />
                </div>
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