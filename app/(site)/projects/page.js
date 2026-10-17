
import StudentProjectsDirectory from "@/components/student-projects/StudentProjectsDirectory";
import {
  GraduationCap,
  Code2,
  FolderOpen,
} from "lucide-react";

export const metadata = {
  title: "Student Projects",
  description:
    "Explore student projects, innovative ideas, technologies, and final-year projects developed by our students.",
  alternates: {
    canonical: "/projects",
  },
};

export default function StudentProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-blue-950 px-5 py-16 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom, black, transparent 95%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, transparent 95%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
        />

        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            Innovation & Research
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Student Projects
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Discover innovative ideas, practical solutions, and creative
            work developed by our students. Explore their projects,
            technologies, and academic achievements.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-amber-400" />
            <span className="h-px w-16 bg-white/20" />
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-blue-100">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <FolderOpen size={18} className="text-amber-400" />
              Browse Projects
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <GraduationCap size={18} className="text-amber-400" />
              Student Innovation
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <Code2 size={18} className="text-amber-400" />
              Practical Learning
            </div>
          </div>
        </div>
      </section>

      <StudentProjectsDirectory />
    </main>
  );
}
