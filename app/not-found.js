"use client";

import Link from "next/link";
import { GraduationCap, Home, ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-linear-to-b from-blue-50/50 via-white to-sky-50/40 font-sans relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 bg-white/85 backdrop-blur-xl border border-blue-100 shadow-2xl rounded-3xl p-8 sm:p-12">
        {/* Glowing Icon Header */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-[#0c3559] text-amber-400 flex items-center justify-center shadow-lg border border-blue-800 mb-6 relative group">
          <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-md opacity-0 group-hover:opacity-100 transition" />
          <SearchX size={36} className="relative z-10" />
        </div>

        {/* 404 Badge */}
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-900 font-mono text-xs font-bold tracking-widest uppercase border border-blue-200 mb-4">
          Error 404 • Page Not Found
        </span>

        {/* Title & Description */}
        <h1 className="text-3xl sm:text-4xl font-black text-[#0c3559] tracking-tight mb-3">
          Oops! Lost in Cyberspace
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0c3559] text-white font-medium text-sm shadow-lg hover:bg-blue-900 transition tracking-wide"
          >
            <Home size={16} className="text-amber-400" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition border border-gray-200 tracking-wide cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Previous Page</span>
          </button>
        </div>

        {/* Footer University Tag */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
          <GraduationCap size={16} className="text-[#0c3559]" />
          <span className="font-semibold text-blue-950">
            Department of Computer Science • MNSUAM
          </span>
        </div>
      </div>
    </div>
  );
}
