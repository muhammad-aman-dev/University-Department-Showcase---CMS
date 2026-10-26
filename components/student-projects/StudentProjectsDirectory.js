
"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Code2,
  FolderOpen,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 9;

export default function StudentProjectsDirectory() {
  // Search typed by the user versus search applied to the API.
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [year, setYear] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  const [projects, setProjects] = useState([]);
  const [years, setYears] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch projects when an applied search, filter, page, or retry changes.
  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          search: appliedSearch,
          year,
          status,
          sort,
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        const response = await fetch(
          `/api/student-projects?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load student projects."
          );
        }

        setProjects(data.projects || []);
        setYears(data.years || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Something went wrong while loading projects."
          );
          setProjects([]);
          setTotal(0);
          setTotalPages(0);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => controller.abort();
  }, [appliedSearch, year, status, sort, page, retryCount]);

  // Apply the search only when the form is submitted.
  function handleSearchSubmit(event) {
    event.preventDefault();

    const nextSearch = search.trim();

    if (nextSearch === appliedSearch) {
      // If the same search is submitted from a later page,
      // return to page one without making an unnecessary request.
      if (page !== 1) {
        setPage(1);
      }
      return;
    }

    setPage(1);
    setAppliedSearch(nextSearch);
  }

  function handleYearChange(value) {
    setYear(value);
    setPage(1);
  }

  function handleStatusChange(value) {
    setStatus(value);
    setPage(1);
  }

  function handleSortChange(value) {
    setSort(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setAppliedSearch("");
    setYear("all");
    setStatus("all");
    setSort("newest");
    setPage(1);
  }

  // Keep pagination valid if filtering reduces the number of pages.
  const safeTotalPages = Math.max(0, totalPages);
  const currentPage =
    safeTotalPages > 0 ? Math.min(page, safeTotalPages) : 1;

  useEffect(() => {
    if (safeTotalPages > 0 && page > safeTotalPages) {
      setPage(safeTotalPages);
    }
  }, [page, safeTotalPages]);

  // Show first page, last page, and nearby pages only.
  // This avoids rendering hundreds of page buttons.
  function getVisiblePages() {
    if (safeTotalPages <= 0) {
      return [];
    }

    const pages = new Set([1, safeTotalPages]);

    for (
      let pageNumber = Math.max(1, currentPage - 1);
      pageNumber <= Math.min(safeTotalPages, currentPage + 1);
      pageNumber++
    ) {
      pages.add(pageNumber);
    }

    return [...pages].sort((a, b) => a - b);
  }

  const visiblePages = getVisiblePages();

  const hasActiveFilters =
    appliedSearch !== "" ||
    year !== "all" ||
    status !== "all" ||
    sort !== "newest";

  const firstResult =
    total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-12">
      {/* Search and filters */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-blue-950" />
          <h2 className="text-lg font-bold text-slate-900">
            Find a Project
          </h2>
        </div>

        <form onSubmit={handleSearchSubmit}>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects, students, technologies..."
                aria-label="Search student projects"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:px-6"
            >
              <Search size={17} />
              Search
            </button>
          </div>
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="project-year"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Academic Year
            </label>

            <select
              id="project-year"
              value={year}
              onChange={(event) => handleYearChange(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Years</option>
              {years.map((item) => (
                <option key={item} value={String(item)}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="project-status"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Project Status
            </label>

            <select
              id="project-status"
              value={status}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="project-sort"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Sort By
            </label>

            <select
              id="project-sort"
              value={sort}
              onChange={(event) => handleSortChange(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">Newest Year First</option>
              <option value="oldest">Oldest Year First</option>
              <option value="title">Project Title (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500" aria-live="polite">
            {loading ? (
              "Updating results..."
            ) : (
              <>
                <span className="font-semibold text-slate-900">
                  {total}
                </span>{" "}
                {total === 1 ? "project found" : "projects found"}
              </>
            )}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900 hover:text-blue-700"
            >
              <X size={15} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center"
        >
          <h2 className="text-lg font-bold text-slate-900">
            Unable to Load Projects
          </h2>
          <p className="mt-2 text-sm text-slate-600">{error}</p>

          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-5 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        /* Loading state */
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Loading projects"
          aria-busy="true"
        >
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-16/10 animate-pulse bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        /* Empty state */
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
          <FolderOpen size={36} className="mx-auto text-slate-400" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No Projects Found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Try a different search term or change your filters.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
            >
              Clear Search and Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Project cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const students = Array.isArray(project.students)
                ? project.students
                : [];

              const technologies = Array.isArray(project.technologies)
                ? project.technologies
                : [];

              return (
                <article
                  key={project._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="relative block aspect-16/10 overflow-hidden bg-linear-to-br from-blue-50 to-slate-100"
                    aria-label={`View ${project.title}`}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title || "Student project"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <img
                      src={`https://placehold.co/800x500/172554/FFFFFF?text=${encodeURIComponent(project.title)}`}
                        alt={project.title || "Student project"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      {project.isFeatured && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 shadow-sm">
                          Featured
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                          project.status === "completed"
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-blue-50 text-blue-900"
                        }`}
                      >
                        {project.status === "completed"
                          ? "Completed"
                          : "Ongoing"}
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CalendarDays size={14} />
                      <span>{project.year || "Year not specified"}</span>

                      {project.category && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="truncate">{project.category}</span>
                        </>
                      )}
                    </div>

                    <h2 className="mt-3 text-xl font-bold leading-snug text-slate-900 transition group-hover:text-blue-950">
                      {project.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                      {project.shortDescription ||
                        project.description ||
                        "Explore this student project and its implementation."}
                    </p>

                    {students.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          {students.length === 1 ? "Student" : "Students"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {students.slice(0, 3).map((student, index) => (
                            <span
                              key={`${
                                student.registrationNumber || student.name
                              }-${index}`}
                              className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700"
                            >
                              {student.name}
                            </span>
                          ))}

                          {students.length > 3 && (
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                              +{students.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {technologies.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Technologies
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {technologies.slice(0, 4).map((technology) => (
                            <span
                              key={technology}
                              className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-900"
                            >
                              {technology}
                            </span>
                          ))}

                          {technologies.length > 4 && (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                              +{technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-5">
                      {project.supervisor && (
                        <p className="mb-4 text-xs text-slate-500">
                          Supervisor:{" "}
                          <span className="font-medium text-slate-700">
                            {project.supervisor}
                          </span>
                        </p>
                      )}

                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        View Project
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Responsive server-side pagination */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
            <p className="text-center text-sm text-slate-500 sm:text-left">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {firstResult}–{lastResult}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">{total}</span>{" "}
              projects
            </p>

            {safeTotalPages > 1 && (
              <nav
                aria-label="Project pagination"
                className="flex max-w-full flex-wrap items-center justify-center gap-1 sm:gap-1.5"
              >
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden xs:inline">Previous</span>
                  <span className="xs:hidden">Prev</span>
                </button>

                {visiblePages.map((pageNumber, index) => {
                  const previousPage = visiblePages[index - 1];

                  const showEllipsis =
                    previousPage !== undefined &&
                    pageNumber - previousPage > 1;

                  return (
                    <Fragment key={pageNumber}>
                      {showEllipsis && (
                        <span
                          aria-hidden="true"
                          className="select-none px-1 text-sm text-slate-400 sm:px-2"
                        >
                          ...
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        disabled={loading}
                        aria-current={
                          currentPage === pageNumber ? "page" : undefined
                        }
                        aria-label={`Go to page ${pageNumber}`}
                        className={`min-w-9 rounded-lg border px-2.5 py-2 text-sm font-semibold transition sm:min-w-10 sm:px-3 ${
                          currentPage === pageNumber
                            ? "border-blue-950 bg-blue-950 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {pageNumber}
                      </button>
                    </Fragment>
                  );
                })}

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      Math.min(safeTotalPages, current + 1)
                    )
                  }
                  disabled={currentPage >= safeTotalPages || loading}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                >
                  <span className="hidden xs:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </div>
        </>
      )}
    </section>
  );
}
