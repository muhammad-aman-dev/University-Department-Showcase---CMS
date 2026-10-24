"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  CollaborationCTA,
  EmptyState,
  ErrorState,
  PageHero,
  ProjectSkeleton,
  ResearchProjectCard,
  readResponse,
} from "./ResearchUI";

const PAGE_SIZE = 9;

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500";
const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

export default function ResearchProjectsClient({
  initialResult,
  initialError = false,
}) {
  // Distinct area names come from the server render, so no extra request is needed.
  const areas = initialResult?.areas || [];

  const [projects, setProjects] = useState(initialResult?.projects || []);
  const [total, setTotal] = useState(initialResult?.total || 0);
  const [totalPages, setTotalPages] = useState(initialResult?.totalPages || 0);
  const [error, setError] = useState(
    initialError ? "Research projects could not be loaded from the server." : ""
  );
  const [loading, setLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [researchArea, setResearchArea] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const skipInitialFetch = useRef(true);

  useEffect(() => {
    // The first page of data is already rendered by the server.
    // Skip the initial fetch, but still allow Retry after a server error.
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    let cancelled = false;

    async function loadProjects() {
      setLoading(true);
      setError("");

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

        setProjects(result.projects || []);
        setTotal(result.total || 0);
        setTotalPages(result.totalPages || 0);
      } catch (err) {
        if (cancelled) return;

        setError(err.message || "Unable to load research projects.");
        setProjects([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [page, search, status, researchArea, sort, refreshCount]);

  const applySearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <PageHero
        crumb="Research Projects"
        eyebrow="Research portfolio"
        title="Research"
        highlight="projects"
        description="Explore ongoing initiatives, completed studies, and projects led by our researchers and collaborators."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {error ? (
            <ErrorState
              message={error}
              onRetry={() => setRefreshCount((count) => count + 1)}
            />
          ) : (
            <>
              {/* Filters */}
              <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(150px,1fr))]">
                  <div>
                    <label htmlFor="research-search" className={labelClass}>
                      Search projects
                    </label>

                    <div className="flex gap-2">
                      <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          id="research-search"
                          type="search"
                          value={searchInput}
                          onChange={(event) =>
                            setSearchInput(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") applySearch();
                          }}
                          placeholder="Search projects..."
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={applySearch}
                        disabled={loading}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Search className="h-4 w-4" />
                        Search
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="research-status" className={labelClass}>
                      Project status
                    </label>

                    <select
                      id="research-status"
                      value={status}
                      onChange={(event) => {
                        setStatus(event.target.value);
                        setPage(1);
                      }}
                      className={selectClass}
                    >
                      <option value="all">All statuses</option>
                      <option value="planned">Planned</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="research-area" className={labelClass}>
                      Research area
                    </label>

                    <select
                      id="research-area"
                      value={researchArea}
                      onChange={(event) => {
                        setResearchArea(event.target.value);
                        setPage(1);
                      }}
                      className={selectClass}
                    >
                      <option value="all">All research areas</option>
                      {areas.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="research-sort" className={labelClass}>
                      Sort by
                    </label>

                    <select
                      id="research-sort"
                      value={sort}
                      onChange={(event) => {
                        setSort(event.target.value);
                        setPage(1);
                      }}
                      className={selectClass}
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
              <p className="mb-6 text-sm text-slate-600">
                {loading ? (
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
                    of <span className="font-bold text-blue-950">{total}</span>{" "}
                    {total === 1 ? "project" : "projects"}
                  </>
                )}
              </p>

              {/* Results */}
              <div className="relative">
                {loading && projects.length > 0 ? (
                  <div className="absolute inset-0 z-10 rounded-2xl bg-slate-50/50 backdrop-blur-[1px]" />
                ) : null}

                {loading && projects.length === 0 ? (
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
                      total === 0 && !hasActiveFilters
                        ? "No projects to show yet"
                        : hasActiveFilters
                        ? "No matching projects"
                        : "No projects to show yet"
                    }
                    description={
                      total === 0 && !hasActiveFilters
                        ? "Projects will appear here once the department publishes them."
                        : hasActiveFilters
                        ? "Try changing your search terms or filters to find other research projects."
                        : "Projects will appear here once the department publishes them."
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
                    <span className="font-semibold text-slate-800">{page}</span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-800">
                      {totalPages}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1 || loading}
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
                      disabled={page >= totalPages || loading}
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
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

      <CollaborationCTA />
    </main>
  );
}
