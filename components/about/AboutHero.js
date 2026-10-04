"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutHero({ title, image }) {
  return (
    <section className="relative overflow-hidden bg-[#0c3559]">
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

          <div className="absolute inset-0 bg-[#0c3559]/85" />
        </div>
      )}

      {!image && (
        <div className="absolute inset-0 bg-linear-to-br from-[#0c3559] to-[#082640]" />
      )}

      <div className="relative mx-auto flex min-h-70 max-w-7xl items-center px-4 py-16 sm:min-h-85 sm:px-8">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.p
  variants={{
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }}
  className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400 sm:text-base"
>
  Who We Are
</motion.p>

          {/* Main Heading */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: "easeOut",
                },
              },
            }}
            className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            {title || "About the Department"}
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: "easeOut",
                },
              },
            }}
            className="mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base"
          >
            Discover our academic journey, vision, mission, and commitment
            to excellence in computer science education, research, and
            innovation.
          </motion.p>

          {/* Accent Line */}
          <motion.div
            variants={{
              hidden: { opacity: 0, width: 0 },
              visible: {
                opacity: 1,
                width: "4rem",
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                },
              },
            }}
            className="mt-6 h-1 rounded-full bg-amber-400"
          />
        </motion.div>
      </div>
    </section>
  );
}