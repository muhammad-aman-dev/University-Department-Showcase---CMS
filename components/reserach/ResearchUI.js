"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export async function readResponse(response) {
  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || "Something went wrong.");
  }

  return result;
}

export function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en", {
    month: "short",
    year: "numeric",
  });
}

export function statusStyle(status) {
  const styles = {
    planned: "bg-amber-50 text-amber-800 ring-amber-200",
    ongoing: "bg-blue-50 text-blue-800 ring-blue-200",
    completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  };

  return (
    styles[String(status || "").toLowerCase()] ||
    "bg-slate-100 text-slate-700 ring-slate-200"
  );
}


export function PageHero({
  crumb,
  eyebrow,
  title,
  highlight,
  description,
}) {
  return (
    <section className="relative isolate overflow-hidden bg-blue-950 px-5 py-12 text-white sm:py-16 lg:px-8 lg:py-20 xl:py-24">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, black, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, transparent 95%)",
        }}
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-y-2 text-xs text-blue-200 sm:mb-10 sm:text-sm"
        >
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>

          <span className="mx-2 text-white/40">/</span>

          <Link href="/research" className="transition hover:text-white">
            Research
          </Link>

          <span className="mx-2 text-white/40">/</span>

          <span className="font-semibold text-amber-300">{crumb}</span>
        </nav>

        {/* Hero content */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(250px,0.7fr)] lg:gap-12 xl:gap-16">
          {/* Text */}
          <div className="min-w-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-2 sm:mb-6">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300 sm:text-xs">
                {eyebrow}
              </p>
            </div>

            <h1 className="max-w-5xl text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              <span className="block">{title}</span>

              {highlight ? (
                <span className="mt-2 block text-amber-400">
                  {highlight}
                </span>
              ) : null}
            </h1>

            {description ? (
              <p className="mt-6 max-w-3xl text-sm leading-7 text-blue-100 sm:mt-7 sm:text-base sm:leading-8 lg:text-lg lg:leading-8">
                {description}
              </p>
            ) : null}

            <div className="mt-7 flex items-center gap-3 sm:mt-9">
              <span className="h-1 w-12 rounded-full bg-amber-400" />
              <span className="h-px w-20 bg-white/25" />
            </div>
          </div>

          {/* Decorative research visual — desktop only */}
          <div
            aria-hidden="true"
            className="relative hidden min-h-75 items-center justify-center lg:flex xl:min-h-87.5"
          >
            {/* Orbital rings */}
            <div className="absolute h-64 w-64 rounded-full border border-blue-300/20 xl:h-80 xl:w-80" />
            <div className="absolute h-48 w-48 rounded-full border border-amber-300/30 xl:h-60 xl:w-60" />
            <div className="absolute h-36 w-36 rounded-full bg-blue-400/10 blur-2xl xl:h-44 xl:w-44" />

            {/* Center icon */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border border-white/15 bg-white/[0.07] shadow-2xl shadow-black/20 backdrop-blur-sm xl:h-32 xl:w-32">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                className="h-16 w-16 text-amber-300 xl:h-18 xl:w-18"
              >
                <circle
                  cx="27"
                  cy="27"
                  r="17"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <path
                  d="m39 39 13 13M20 27h14M27 20v14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="48"
                  cy="15"
                  r="4"
                  fill="#60A5FA"
                />
                <circle
                  cx="12"
                  cy="48"
                  r="3"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Floating accent points */}
            <span className="absolute right-[18%] top-[18%] h-3 w-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/40" />
            <span className="absolute bottom-[20%] left-[16%] h-2.5 w-2.5 rounded-full bg-blue-300 shadow-lg shadow-blue-300/40" />
            <span className="absolute bottom-[18%] right-[24%] h-2 w-2 rounded-full bg-white/70" />

            {/* Small information panel */}
            <div className="absolute bottom-3 right-0 max-w-57.5 rounded-2xl border border-white/10 bg-blue-900/70 p-4 shadow-xl backdrop-blur-md xl:bottom-0 xl:right-2 xl:max-w-62.5 xl:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                Explore. Discover. Innovate.
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-100 xl:text-base">
                Research that connects ideas with real-world impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



export function CollaborationCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-blue-950 py-16 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
            <CheckCircle2 className="h-4 w-4" />
            Research with purpose
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Interested in collaborating?
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
            We welcome academic partnerships, research collaboration, and
            opportunities to turn ideas into meaningful outcomes.
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-blue-950 transition hover:bg-amber-300 lg:self-center"
        >
          Contact our department
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export function ResearchAreaCard({ area }) {
  return (
    <Link
      href={`/research/areas/${area.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-blue-950 to-blue-800">
        {area.image ? (
          <img
            src={area.image}
            alt={area.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FlaskConical className="h-12 w-12 text-white/70" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-blue-950/70 via-transparent to-transparent" />

        {area.isFeatured ? (
          <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-blue-950">
            Featured
          </span>
        ) : null}

        {area.icon ? (
          <span className="absolute bottom-4 right-4 rounded-xl border border-white/20 bg-blue-950/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
            {area.icon}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl font-bold text-blue-950 transition group-hover:text-blue-800">
          {area.name}
        </h3>

        {area.shortDescription || area.description ? (
          <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
            {area.shortDescription || area.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-800">
          Explore research
          <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function ResearchProjectCard({ project }) {
  const startDate = formatDate(project.startDate);
  const endDate = formatDate(project.endDate);
  const projectHref = `/research/projects/${encodeURIComponent(project.slug)}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <Link
        href={projectHref}
        aria-label={`View research project: ${project.title}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amber-400"
      />

      <div className="pointer-events-none relative aspect-video overflow-hidden bg-slate-100">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title || "Research project"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-blue-950 to-blue-800">
            <FolderOpen className="h-12 w-12 text-white/70" />
          </div>
        )}

        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${statusStyle(
              project.status
            )}`}
          >
            {project.status || "Research"}
          </span>
        </div>

        {project.isFeatured ? (
          <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-blue-950">
            Featured
          </span>
        ) : null}
      </div>

      <div className="pointer-events-none relative z-10 flex flex-1 flex-col p-5 sm:p-6">
        {project.researchArea ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
            {project.researchArea}
          </p>
        ) : null}

        <h3 className="text-xl font-bold leading-snug text-blue-950 transition group-hover:text-blue-800">
          {project.title}
        </h3>

        {project.shortDescription || project.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
            {project.shortDescription || project.description}
          </p>
        ) : null}

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          {project.principalInvestigator ? (
            <div className="flex items-start gap-2.5 text-sm text-slate-600">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              <span>
                <span className="font-semibold text-slate-800">
                  Principal Investigator:
                </span>{" "}
                {project.principalInvestigator}
              </span>
            </div>
          ) : null}

          {project.teamMembers?.length > 0 ? (
            <div className="flex items-start gap-2.5 text-sm text-slate-600">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              <span>
                {project.teamMembers.length} team member
                {project.teamMembers.length === 1 ? "" : "s"}
              </span>
            </div>
          ) : null}

          {project.fundingOrganization ? (
            <div className="flex items-start gap-2.5 text-sm text-slate-600">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              <span>{project.fundingOrganization}</span>
            </div>
          ) : null}

          {startDate || endDate ? (
            <div className="flex items-start gap-2.5 text-sm text-slate-600">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
              <span>
                {startDate || "Start date unavailable"}
                {endDate ? ` – ${endDate}` : ""}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <Link
            href={projectHref}
            className="pointer-events-auto relative z-20 inline-flex items-center gap-2 rounded-xl bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            View details
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="pointer-events-auto relative z-20 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-900"
            >
              External site
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}

          {project.documentUrl ? (
            <a
              href={project.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="pointer-events-auto relative z-20 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-900"
            >
              <FileText className="h-4 w-4" />
              Document
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

export function ProjectSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-video animate-pulse bg-slate-200" />
      <div className="space-y-4 p-6">
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-6 w-4/5 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-600">
        <RefreshCw className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        We couldn&apos;t load this content
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {message || "Please check your connection and try again."}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

export function EmptyState({ title, description, onClear }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
        <Search className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-blue-950">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>

      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-900"
        >
          <X className="h-4 w-4" />
          Clear filters
        </button>
      ) : null}
    </div>
  );
}