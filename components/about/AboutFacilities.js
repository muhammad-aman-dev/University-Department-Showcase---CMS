"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutFacilities({
  facilities,
}) {
  if (!facilities?.length) {
    return null;
  }

  const sortedFacilities = [...facilities].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-20">

        {/* Section Header with Motion */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            Campus Resources
          </p>

          <h2 className="mt-2 text-2xl font-black text-blue-950 sm:text-3xl">
            Facilities
          </h2>
        </motion.div>

        {/* Grid Container with Staggered Children Animation */}
        <motion.div 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {sortedFacilities.map((facility, index) => (
            <motion.article
              key={`${facility.title}-${index}`}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md"
            >
              {facility.image && (
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <Image
                    src={facility.image}
                    alt={facility.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-lg font-black text-blue-950">
                  {facility.title}
                </h3>

                {facility.description && (
                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {facility.description}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}