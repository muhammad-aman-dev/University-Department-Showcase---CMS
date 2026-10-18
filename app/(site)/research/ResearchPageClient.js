"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  Layers3,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";

const PAGE_SIZE = 9;

async function readResponse(response) {
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

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en", {
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status) {
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

function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon = Layers3,
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-950">
          <Icon className="h-4 w-4 text-amber-600" />
          {eyebrow}
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ResearchAreaCard({ area }) {
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
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    );
  }


  function ResearchProjectCard({ project }) {
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
  
        <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6 pointer-events-none">
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
  

function ProjectSkeleton() {
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

function ErrorState({ message, onRetry }) {
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

function EmptyState({ title, description, onClear }) {
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

export default function ResearchPageClient({
  initialAreas = [],
  initialResult,
  initialAreasError = false,
  initialProjectsError = false,
}) {
  const [areas, setAreas] = useState(initialAreas);
  const [areasError, setAreasError] = useState(
    initialAreasError
      ? "Research areas could not be loaded from the server."
      : ""
  );
  const [areasRefreshCount, setAreasRefreshCount] = useState(0);

  const [projects, setProjects] = useState(initialResult?.projects || []);
  const [total, setTotal] = useState(initialResult?.total || 0);
  const [totalPages, setTotalPages] = useState(
    initialResult?.totalPages || 0
  );
  const [projectsError, setProjectsError] = useState(
    initialProjectsError
      ? "Research projects could not be loaded from the server."
      : ""
  );
  const [projectsRefreshCount, setProjectsRefreshCount] = useState(0);

  // Keep the Projects section visible when the database has projects,
  // even if the currently selected filters return zero matches.
  const [hasAnyProjects, setHasAnyProjects] = useState(
    (initialResult?.total || 0) > 0
  );

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [researchArea, setResearchArea] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showAllAreas, setShowAllAreas] = useState(false);

  const [areasLoading, setAreasLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const skipInitialAreasFetch = useRef(true);
  const skipInitialProjectsFetch = useRef(true);


  // Retry research areas only when the user requests it.
  useEffect(() => {
    if (skipInitialAreasFetch.current) {
      skipInitialAreasFetch.current = false;
      return;
    }

    let cancelled = false;

    async function loadAreas() {
      setAreasLoading(true);
      setAreasError("");

      try {
        const response = await fetch("/api/research/areas", {
          cache: "no-store",
        });
        const result = await readResponse(response);

        if (cancelled) return;

        const nextAreas = result.data || [];
        setAreas(nextAreas);
      } catch (error) {
        if (cancelled) return;
        setAreasError(error.message || "Unable to load research areas.");
      } finally {
        if (!cancelled) setAreasLoading(false);
      }
    }

    loadAreas();

    return () => {
      cancelled = true;
    };
  }, [areasRefreshCount]);

  // Initial project results come from the server. Subsequent requests
  // happen when filters, search, pagination, or retry state changes.
  useEffect(() => {
    if (skipInitialProjectsFetch.current) {
      skipInitialProjectsFetch.current = false;
      return;
    }

    let cancelled = false;

    async function loadProjects() {
      setProjectsLoading(true);
      setProjectsError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        search,
        status,
        researchArea,
        sort,
      });

      try {
        const response = await fetch(
          `/api/research/projects?${params.toString()}`,
          { cache: "no-store" }
        );

        const result = await readResponse(response);

        if (cancelled) return;

        const nextProjects = result.projects || [];

        setProjects(nextProjects);
        setTotal(result.total || 0);
        setTotalPages(result.totalPages || 0);

        if ((result.total || 0) > 0) {
          setHasAnyProjects(true);
        }
      } catch (error) {
        if (cancelled) return;

        setProjectsError(
          error.message || "Unable to load research projects."
        );
        setProjects([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    search,
    status,
    researchArea,
    sort,
    projectsRefreshCount,
  ]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("all");
    setResearchArea("all");
    setSort("newest");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    status !== "all" ||
    researchArea !== "all" ||
    sort !== "newest";

  const featuredAreas = areas.filter((area) => area.isFeatured);
  const otherAreas = areas.filter((area) => !area.isFeatured);

  const visibleAreas = showAllAreas
    ? areas
    : featuredAreas.length > 0
      ? featuredAreas
      : areas.slice(0, 3);

      const showAreasSection =
      areas.length > 0 || Boolean(areasError);
    
    const showProjectsSection =
      hasAnyProjects || Boolean(projectsError);
    
    const hasResearchContent =
      showAreasSection || showProjectsSection;

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
            {/* Hero */}
            <section className="relative isolate overflow-hidden bg-blue-950 px-5 py-16 text-white sm:py-20 lg:py-24">
        {/* Subtle grid */}
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

        {/* Glow effects */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                Innovation &amp; Research
              </p>

              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Advancing knowledge.
                <span className="mt-2 block text-amber-400">
                  Creating impact.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base sm:leading-8">
                Discover our research areas, academic collaborations, and
                projects advancing knowledge and addressing meaningful
                real-world challenges.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span className="h-1 w-12 rounded-full bg-amber-400" />
                <span className="h-px w-16 bg-white/20" />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {showAreasSection ? (
                  <a
                    href="#research-areas"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-bold text-blue-950 transition hover:bg-amber-300"
                  >
                    Explore research areas
                    <ArrowDown className="h-4 w-4" />
                  </a>
                ) : null}

                {showProjectsSection ? (
                  <a
                    href="#research-projects"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Browse projects
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Supporting information panel */}
{hasResearchContent ? (
  <div className="relative hidden lg:block">
              <div className="absolute -inset-5 rounded-4xl bg-linear-to-br from-amber-400/10 to-blue-400/10 blur-2xl" />

              <div className="relative rounded-2xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-blue-950">
                    <Layers3 className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="font-bold text-white">
                      Our research ecosystem
                    </h2>
                    <p className="mt-1 text-sm text-blue-200">
                      Discovery, expertise, collaboration
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    {
                      icon: FlaskConical,
                      title: "Research areas",
                      text: "Explore our specialist academic fields.",
                    },
                    {
                      icon: FolderOpen,
                      title: "Research projects",
                      text: "Discover ongoing and completed work.",
                    },
                    {
                      icon: Users,
                      title: "Research teams",
                      text: "Meet the people behind the research.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/4 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-amber-400">
                        <item.icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-blue-100/75">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Research Areas: omitted when there are no areas and no error */}
      {showAreasSection ? (
        <section
          id="research-areas"
          className="scroll-mt-20 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHeading
              eyebrow="Areas of expertise"
              title="Explore our research areas"
              description="Discover the themes and specialist areas guiding our department's research and academic inquiry."
              icon={FlaskConical}
            />

            {areasError ? (
              <ErrorState
                message={areasError}
                onRetry={() =>
                  setAreasRefreshCount((count) => count + 1)
                }
              />
            ) : areasLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <ProjectSkeleton key={item} />
                ))}
              </div>
            ) : areas.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleAreas.map((area) => (
                    <ResearchAreaCard
                      key={area._id || area.slug}
                      area={area}
                    />
                  ))}
                </div>

                {!showAllAreas && areas.length > visibleAreas.length ? (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAllAreas(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      View all research areas
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}

                {showAllAreas && areas.length > 3 ? (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAllAreas(false)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      Show featured areas
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Divider only when both sections are present */}
      {showAreasSection && showProjectsSection ? (
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
        </div>
      ) : null}

      {/* Projects: omitted when there are no projects and no error */}
      {showProjectsSection ? (
        <section
          id="research-projects"
          className="scroll-mt-20 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHeading
              eyebrow="Research portfolio"
              title="Research projects"
              description="Explore ongoing initiatives, completed studies, and projects led by our researchers and collaborators."
              icon={FolderOpen}
            />

            {projectsError ? (
              <ErrorState
                message={projectsError}
                onRetry={() =>
                  setProjectsRefreshCount((count) => count + 1)
                }
              />
            ) : (
              <>
                {/* Filters */}
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(150px,1fr))]">
<div>
  <label
    htmlFor="research-search"
    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
  >
    Search projects
  </label>

  <div className="flex gap-2">
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <input
        id="research-search"
        type="search"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setSearch(searchInput.trim());
            setPage(1);
          }
        }}
        placeholder="Search projects..."
        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </div>

    <button
      type="button"
      onClick={() => {
        setSearch(searchInput.trim());
        setPage(1);
      }}
      disabled={projectsLoading}
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Search className="h-4 w-4" />
      Search
    </button>
  </div>
</div>

                    <div>
                      <label
                        htmlFor="research-status"
                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                      >
                        Project status
                      </label>

                      <select
                        id="research-status"
                        value={status}
                        onChange={(event) => {
                          setStatus(event.target.value);
                          setPage(1);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="all">All statuses</option>
                        <option value="planned">Planned</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="research-area"
                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                      >
                        Research area
                      </label>

                      <select
                        id="research-area"
                        value={researchArea}
                        onChange={(event) => {
                          setResearchArea(event.target.value);
                          setPage(1);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="all">All research areas</option>
                        {areas.map((area) => (
                          <option
                            key={area._id || area.slug}
                            value={area.name}
                          >
                            {area.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="research-sort"
                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                      >
                        Sort by
                      </label>

                      <select
                        id="research-sort"
                        value={sort}
                        onChange={(event) => {
                          setSort(event.target.value);
                          setPage(1);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="title">Title A–Z</option>
                      </select>
                    </div>
                  </div>

                  {hasActiveFilters ? (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <p className="text-sm text-slate-500">
                        Filters are applied to the project list.
                      </p>

                      <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950"
                      >
                        <X className="h-4 w-4" />
                        Clear filters
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Results summary */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600">
                    {projectsLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-800 border-t-transparent" />
                        Updating projects...
                      </span>
                    ) : (
                      <>
                        Showing{" "}
                        <span className="font-bold text-blue-950">
                          {projects.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-blue-950">
                          {total}
                        </span>{" "}
                        {total === 1 ? "project" : "projects"}
                      </>
                    )}
                  </p>

                  {projectsLoading ? (
                    <span className="text-xs font-medium text-slate-400">
                      Loading results
                    </span>
                  ) : null}
                </div>

                {/* Project results */}
                <div className="relative">
                  {projectsLoading && projects.length > 0 ? (
                    <div className="absolute inset-0 z-10 rounded-2xl bg-slate-50/50 backdrop-blur-[1px]" />
                  ) : null}

                  {projectsLoading && projects.length === 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3].map((item) => (
                        <ProjectSkeleton key={item} />
                      ))}
                    </div>
                  ) : projects.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {projects.map((project) => (
                        <ResearchProjectCard
                          key={project._id || project.slug}
                          project={project}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title={
                        hasActiveFilters
                          ? "No matching projects"
                          : "No projects found"
                      }
                      description={
                        hasActiveFilters
                          ? "Try changing your search terms or filters to find other research projects."
                          : "There are no projects matching these criteria right now."
                      }
                      onClear={hasActiveFilters ? clearFilters : undefined}
                    />
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 ? (
                  <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                    <p className="text-sm text-slate-500">
                      Page{" "}
                      <span className="font-semibold text-slate-800">
                        {page}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-800">
                        {totalPages}
                      </span>
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={page <= 1 || projectsLoading}
                        onClick={() =>
                          setPage((current) => Math.max(1, current - 1))
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      <button
                        type="button"
                        disabled={page >= totalPages || projectsLoading}
                        onClick={() =>
                          setPage((current) =>
                            Math.min(totalPages, current + 1)
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      ) : null}

      {/* Closing call to action */}
{hasResearchContent ? (
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
      ) : null}
    </main>
  );
}