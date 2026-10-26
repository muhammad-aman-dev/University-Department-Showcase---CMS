
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudentProjectBySlug } from "@/lib/data/student-projects";
import {
  ArrowLeft,
  ArrowUpRight,
  GraduationCap,
  CalendarDays,
  UserRound,
  Code2,
  GitBranch,
} from "lucide-react";
import RichTextDisplay from "@/components/shared/RichTextDisplay";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getStudentProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description:
      project.shortDescription ||
      project.description?.slice(0, 160) ||
      "Explore this student project.",
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description:
        project.shortDescription || project.description,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function StudentProjectDetailsPage({ params }) {
  const { slug } = await params;
  const project = await getStudentProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const students = Array.isArray(project.students)
    ? project.students
    : [];

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-blue-950 px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 95%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, transparent 95%)",
          }}
        />

        {/* Blue glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl"
        />

        {/* Amber glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
        />

        <div className="mx-auto max-w-7xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-100 transition hover:text-amber-400"
          >
            <ArrowLeft size={16} />
            All Student Projects
          </Link>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              {project.status === "completed"
                ? "Completed"
                : "Ongoing"}
            </span>

            {project.isFeatured && (
              <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                Featured Project
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-5xl text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          {project.shortDescription && (
            <p className="mt-6 max-w-4xl text-sm leading-7 text-blue-100 sm:text-base sm:leading-8 lg:text-lg">
              {project.shortDescription}
            </p>
          )}

          {/* Project summary */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 text-sm text-blue-100">
            {project.year && (
              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  size={17}
                  className="text-amber-400"
                />
                {project.year}
              </span>
            )}

            {project.category && (
              <span className="inline-flex items-center gap-2">
                <Code2 size={17} className="text-amber-400" />
                {project.category}
              </span>
            )}

            {students.length > 0 && (
              <span className="inline-flex items-center gap-2">
                <GraduationCap
                  size={18}
                  className="text-amber-400"
                />
                {students.length}{" "}
                {students.length === 1 ? "Student" : "Students"}
              </span>
            )}
          </div>

          {/* Decorative accent */}
          <div className="mt-8 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-amber-400" />
            <span className="h-px w-20 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Project content */}
      <section className="mx-auto grid max-w-screen-2xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:px-12 lg:py-14 xl:gap-12">
        {/* Main column */}
        <div className="min-w-0 space-y-8">
          {/* Project image */}
          {project.image ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img
                src={project.image}
                alt={project.title}
                className="max-h-162.5 min-h-75 w-full object-cover sm:min-h-100"
              />
            </div>
          ): (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img
                src={`https://placehold.co/800x500/172554/FFFFFF?text=${encodeURIComponent(project.title)}`}
                alt={project.title}
                className="max-h-162.5 min-h-75 w-full object-cover sm:min-h-100"
              />
            </div>
          )}

          {/* Description */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              About the Project
            </h2>

            <div className="mt-3 h-1 w-12 rounded-full bg-amber-400" />

            {project.description ? (
  <div className="mt-6">
    <RichTextDisplay
      content={project.description}
      className="text-sm leading-7 sm:text-base sm:leading-8"
    />
  </div>
) : (
  <p className="mt-5 text-sm text-slate-500">
    No detailed description is available for this
    project yet.
  </p>
)}
          </article>

          {/* Technologies */}
          {technologies.length > 0 && (
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Technologies Used
              </h2>

              <div className="mt-3 h-1 w-12 rounded-full bg-amber-400" />

              <div className="mt-6 flex flex-wrap gap-3">
                {technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-950"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </article>
          )}

          {/* Project team */}
          {students.length > 0 && (
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Project Team
              </h2>

              <div className="mt-3 h-1 w-12 rounded-full bg-amber-400" />

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {students.map((student, index) => (
                  <div
                    key={`${student.registrationNumber || student.name}-${index}`}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-950">
                      <UserRound size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {student.name || "Student"}
                      </p>

                      {student.registrationNumber && (
                        <p className="mt-1 wrap-break-words text-xs leading-5 text-slate-500">
                          Registration No:{" "}
                          {student.registrationNumber}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-bold text-slate-900">
              Project Information
            </h2>

            <div className="mt-3 h-1 w-10 rounded-full bg-amber-400" />

            <dl className="mt-6 space-y-5 text-sm">
              {project.category && (
                <div>
                  <dt className="text-slate-500">Category</dt>
                  <dd className="mt-1.5 font-semibold text-slate-900">
                    {project.category}
                  </dd>
                </div>
              )}

              {project.year && (
                <div>
                  <dt className="text-slate-500">Project Year</dt>
                  <dd className="mt-1.5 font-semibold text-slate-900">
                    {project.year}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-slate-500">Status</dt>
                <dd className="mt-1.5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      project.status === "completed"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-blue-50 text-blue-900"
                    }`}
                  >
                    {project.status === "completed"
                      ? "Completed"
                      : "Ongoing"}
                  </span>
                </dd>
              </div>

              {project.supervisor && (
                <div>
                  <dt className="text-slate-500">Project Supervisor</dt>
                  <dd className="mt-1.5 font-semibold text-slate-900">
                    {project.supervisor}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-slate-500">Team Size</dt>
                <dd className="mt-1.5 font-semibold text-slate-900">
                  {students.length}{" "}
                  {students.length === 1 ? "Member" : "Members"}
                </dd>
              </div>
            </dl>

            {(project.projectUrl || project.githubUrl) && (
              <div className="mt-7 space-y-3 border-t border-slate-100 pt-6">
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Live Project
                    <ArrowUpRight size={17} />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <GitBranch size={17} />
                    View Source Code
                    <ArrowUpRight size={17} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Back link */}
          <Link
            href="/projects"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-950"
          >
            <ArrowLeft size={16} />
            Back to All Projects
          </Link>
        </aside>
      </section>
    </main>
  );
}
