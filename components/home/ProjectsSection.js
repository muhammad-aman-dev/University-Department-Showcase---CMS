"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectsSection({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Portfolio</span>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Featured Student Projects</h2>
        </div>
        <Link href="/projects" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
          View All &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((proj, idx) => (
          <motion.div
            key={proj._id || idx}
            initial={{ y: 20 }}
whileInView={{ y: 0 }}
viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition hover:shadow-md"
          >
            <div>
              {proj.image && (
                <img src={proj.image} alt={proj.title} className="h-44 w-full rounded-2xl object-cover mb-4" />
              )}
              <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {proj.category || "General"}
              </span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{proj.title}</h3>
              <p className="mt-2 text-xs text-slate-600 line-clamp-2">{proj.shortDescription}</p>

              {proj.technologies && proj.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.technologies.map((tech, i) => (
                    <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span>By: {proj.students?.[0]?.name || "Student Team"}</span>
              <Link href={`/projects/${proj.slug}`} className="font-semibold text-blue-600 hover:underline">
                Details &rarr;
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}