"use client";
import { motion } from "framer-motion";

export default function VisionMissionObjectivesSection({ vision, mission, objectives, scope }) {
  if (!vision && !mission && (!objectives || objectives.length === 0) && !scope) return null;

  return (
    <section className="bg-blue-50/40 py-20 border-y border-blue-100/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 space-y-8">
        
        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {vision && (
            <motion.div whileHover={{ y: -3 }} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
              <h3 className="text-xl font-bold text-blue-900">Our Vision</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{vision}</p>
            </motion.div>
          )}
          {mission && (
            <motion.div whileHover={{ y: -3 }} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
              <h3 className="text-xl font-bold text-blue-900">Our Mission</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{mission}</p>
            </motion.div>
          )}
        </div>

        {/* Objectives */}
        {objectives && objectives.length > 0 && (
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Department Objectives</h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    {idx + 1}
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scope */}
        {scope && (
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
            <h3 className="text-xl font-bold text-blue-900">Academic Scope</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{scope}</p>
          </div>
        )}

      </div>
    </section>
  );
}