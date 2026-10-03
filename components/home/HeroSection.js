"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HeroCarousel({ hero }) {
  const images = hero?.images?.filter((img) => img.isActive) || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="relative h-[70vh] w-full overflow-hidden bg-gray-900">
      {/* Background Image Stack with Next.js Image and Smooth Opacity Crossfade */}
      {images.map((img, index) => (
        <motion.div
          key={img._id || index}
          initial={false}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.05,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src={img.url}
            alt={hero.title || "Department Hero"}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      ))}

      {/* Dark Overlay matching university deep blue theme */}
      <div className="absolute inset-0 bg-linear-to-r from-[#1c295e]/90 via-[#1c295e]/75 to-transparent z-10" />

      {/* Content Layer */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <span className="mb-3 inline-block rounded-full bg-blue-600/30 px-3.5 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-blue-200 backdrop-blur-md">
            Official Department Portal
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            {hero.title}
          </h1>
          <p className="mt-2.5 text-base font-medium text-blue-100 sm:text-xl">
            {hero.subtitle}
          </p>
          <p className="mt-2.5 text-xs text-gray-300 sm:text-base leading-relaxed line-clamp-3">
            {hero.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {hero.primaryButtonText && (
              <Link
                href={hero.primaryButtonUrl || "#"}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-blue-500/25"
              >
                {hero.primaryButtonText}
              </Link>
            )}
            {hero.secondaryButtonText && (
              <Link
                href={hero.secondaryButtonUrl || "#"}
                className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                {hero.secondaryButtonText}
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Carousel Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index ? "w-6 bg-blue-500" : "w-2 bg-white/50"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}