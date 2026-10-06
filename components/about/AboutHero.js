"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutHero({ title, image }) {
  return (
    <section className="relative h-[55vh] sm:h-[70vh] overflow-hidden bg-[#0c3559]">
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title || "About the Department"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-[#0c3559]/85 via-[#0c3559]/60 to-transparent" />
        </div>
      )}

      {!image && (
        <div className="absolute inset-0 bg-linear-to-br from-[#0c3559] to-[#082640]" />
      )}

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-8">
        <motion.div
          className="max-w-3xl"
          initial={{ y: 18, scale: 0.99 }}
          animate={{ y: 0, scale: 1 }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.p
            initial={{ y: 15 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400 sm:text-base"
          >
            Who We Are
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            {title || "About the Department"}
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ y: 15 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base"
          >
            Discover our academic journey, vision, mission, and commitment to
            excellence in computer science education, research, and innovation.
          </motion.p>

          {/* Accent Line */}
          <motion.div
  initial={{ width: 0 }}
  animate={{ width: "4rem" }}
  transition={{
    duration: 0.6,
    ease: "easeOut",
    delay: 0.4,
  }}
  className="mt-6 h-1 rounded-full bg-amber-400"
/>
        </motion.div>
      </div>
    </section>
  );
}
