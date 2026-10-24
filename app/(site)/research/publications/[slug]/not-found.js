"use client"
import Link from "next/link";
import {
  GraduationCap,
  Home,
  ArrowLeft,
  SearchX,
  BookOpen,
} from "lucide-react";

export default function PublicationNotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-linear-to-b from-blue-50/50 via-white to-sky-50/40 px-4 py-16 font-sans">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute left-1/4 top-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-blue-100 bg-white/85 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        {/* Icon Header */}
        <div className="group relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-800 bg-[#0c3559] text-amber-400 shadow-lg">
          <div className="absolute inset-0 rounded-2xl bg-amber-400/20 opacity-0 blur-md transition group-hover:opacity-100" />
          <SearchX size={36} className="relative z-10" />
        </div>

        {/* Error Badge */}
        <span className="mb-4 inline-block rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-blue-900">
          Error 404 • Publication Not Found
        </span>

        {/* Title */}
        <h1 className="mb-3 text-3xl font-black tracking-tight text-[#0c3559] sm:text-4xl">
          Publication Not Found
        </h1>

        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
          This publication may have been removed, unpublished, or the link
          may be incorrect. Explore our research portfolio to discover other
          publications from the department.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/research"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0c3559] px-6 py-3 text-sm font-medium tracking-wide text-white shadow-lg transition hover:bg-blue-900 sm:w-auto"
          >
            <Home size={16} className="text-amber-400" />
            <span>Back to Research</span>
          </Link>

          <Link
            href="/research/publications"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-medium tracking-wide text-blue-950 transition hover:bg-blue-100 sm:w-auto"
          >
            <BookOpen size={16} />
            <span>Browse Publications</span>
          </Link>
        </div>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = "/research/publications";
            }
          }}
          className="mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition hover:text-blue-900"
        >
          <ArrowLeft size={16} />
          <span>Previous Page</span>
        </button>

        {/* University Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 border-t border-gray-100 pt-6 text-xs text-gray-500">
          <GraduationCap size={16} className="text-[#0c3559]" />
          <span className="font-semibold text-blue-950">
            Department of Computer Science • MNSUAM
          </span>
        </div>
      </div>
    </main>
  );
}
