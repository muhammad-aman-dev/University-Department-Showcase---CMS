"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  CollaborationCTA,
  EmptyState,
  ErrorState,
  PageHero,
  ProjectSkeleton,
  readResponse,
} from "@/components/research/ResearchUI";

const PAGE_SIZE = 9;

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500";

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

const INITIAL_DATA = {
  publications: [],
  total: 0,
  page: 1,
  limit: PAGE_SIZE,
  totalPages: 0,
  totalPublished: 0,
  areas: [],
  years: [],
  types: [],
};

export default function PublicationsClient({
  initialResult,
  initialError = false,
}) {
  const normalizedInitialResult =
    initialResult?.data || initialResult || {};

  const hasValidInitialData = Array.isArray(
    normalizedInitialResult.publications,
  );

  const [data, setData] = useState({
    ...INITIAL_DATA,
    ...normalizedInitialResult,
    publications: hasValidInitialData
      ? normalizedInitialResult.publications
      : [],
    areas: Array.isArray(normalizedInitialResult.areas)
      ? normalizedInitialResult.areas
      : [],
    years: Array.isArray(normalizedInitialResult.years)
      ? normalizedInitialResult.years
      : [],
    types: Array.isArray(normalizedInitialResult.types)
      ? normalizedInitialResult.types
      : [],
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [area, setArea] = useState("all");
  const [year, setYear] = useState("all");
  const [featured, setFeatured] = useState(false);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(
    initialError || !hasValidInitialData,
  );

  const [error, setError] = useState(
    initialError
      ? "Publications could not be loaded from the server."
      : "",
  );

  const [refreshCount, setRefreshCount] = useState(0);
  const skipInitialFetch = useRef(true);

  const areas = data.areas || [];
  const years = data.years || [];
  const types = data.types || [];
  const publications = data.publications || [];

  useEffect(() => {
    // Use valid server-provided data on the initial render.
    // If initial data is unavailable, fetch it from the API.
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;

      if (!initialError && hasValidInitialData) {
        return;
      }
    }

    let cancelled = false;

    async function loadPublications() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        search,
        type,
        area,
        year,
        featured: featured ? "true" : "false",
      });

      try {
        const response = await fetch(
          `/api/research/publications?${params.toString()}`,
          {
            cache: "no-store",
            headers: { Accept: "application/json" },
          },
        );

        const result = await readResponse(response);

        if (cancelled) return;

        const nextData = result.data || result;

        setData({
          ...INITIAL_DATA,
          ...nextData,
          publications: Array.isArray(nextData.publications)
            ? nextData.publications
            : [],
          areas: Array.isArray(nextData.areas)
            ? nextData.areas
            : [],
          years: Array.isArray(nextData.years)
            ? nextData.years
            : [],
          types: Array.isArray(nextData.types)
            ? nextData.types
            : [],
        });
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load public publications:", err);
        setError(err.message || "Unable to load publications.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPublications();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    search,
    type,
    area,
    year,
    featured,
    refreshCount,
    initialError,
    hasValidInitialData,
  ]);

  function applySearch() {
    const nextSearch = searchInput.trim();

    if (nextSearch === search && page === 1) {
      setRefreshCount((count) => count + 1);
      return;
    }

    setPage(1);
    setSearch(nextSearch);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setType("all");
    setArea("all");
    setYear("all");
    setFeatured(false);
    setPage(1);
    setRefreshCount((count) => count + 1);
  }

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  const hasActiveFilters =
    Boolean(search) ||
    type !== "all" ||
    area !== "all" ||
    year !== "all" ||
    featured;

  const hasAnyPublished = Number(data.totalPublished) > 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <PageHero
        crumb="Publications"
        eyebrow="Research portfolio"
        title="Research"
        highlight="publications"
        description="Explore journal articles, conference papers, books, and other academic work published by our department's researchers."
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
                    <label
                      htmlFor="publication-search"
                      className={labelClass}
                    >
                      Search publications
                    </label>

                    <div className="flex gap-2">
                      <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          id="publication-search"
                          type="search"
                          value={searchInput}
                          onChange={(event) =>
                            setSearchInput(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              applySearch();
                            }
                          }}
                          placeholder="Title, author, DOI..."
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
                    <label
                      htmlFor="publication-type"
                      className={labelClass}
                    >
                      Publication type
                    </label>

                    <select
                      id="publication-type"
                      value={type}
                      onChange={(event) =>
                        updateFilter(setType, event.target.value)
                      }
                      className={selectClass}
                    >
                      <option value="all">All publication types</option>
                      {types.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="publication-area"
                      className={labelClass}
                    >
                      Research area
                    </label>

                    <select
                      id="publication-area"
                      value={area}
                      onChange={(event) =>
                        updateFilter(setArea, event.target.value)
                      }
                      className={selectClass}
                    >
                      <option value="all">All research areas</option>
                      {areas.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="publication-year"
                      className={labelClass}
                    >
                      Publication year
                    </label>

                    <select
                      id="publication-year"
                      value={year}
                      onChange={(event) =>
                        updateFilter(setYear, event.target.value)
                      }
                      className={selectClass}
                    >
                      <option value="all">All years</option>
                      {years.map((item) => (
                        <option key={item} value={String(item)}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(event) =>
                        updateFilter(setFeatured, event.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 accent-blue-950"
                    />
                    Featured publications only
                  </label>

                  {hasActiveFilters || searchInput ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950"
                    >
                      <X className="h-4 w-4" />
                      Clear filters
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Results summary */}
              <p className="mb-6 text-sm text-slate-600" aria-live="polite">
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-800 border-t-transparent" />
                    Loading publications...
                  </span>
                ) : hasAnyPublished ? (
                  <>
                    Showing{" "}
                    <span className="font-bold text-blue-950">
                      {publications.length
                        ? (page - 1) * PAGE_SIZE + 1
                        : 0}
                      {publications.length
                        ? `–${Math.min(
                            (page - 1) * PAGE_SIZE + publications.length,
                            data.total,
                          )}`
                        : ""}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-blue-950">
                      {data.total}
                    </span>{" "}
                    {data.total === 1 ? "publication" : "publications"}
                  </>
                ) : (
                  "Publications"
                )}
              </p>

              {/* Results */}
              <div className="relative">
                {loading && publications.length > 0 ? (
                  <div className="absolute inset-0 z-10 rounded-2xl bg-slate-50/50 backdrop-blur-[1px]" />
                ) : null}

                {loading ? (
                  <div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    aria-label="Loading publications"
                    aria-busy="true"
                  >
                    {Array.from({ length: 6 }, (_, index) => (
                      <ProjectSkeleton key={index} />
                    ))}
                  </div>
                ) : publications.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {publications.map((publication) => (
                      <article
                        key={publication._id || publication.slug}
                        className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="mb-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">
                            {publication.publicationType || "Publication"}
                          </span>

                          {publication.isFeatured && (
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                              Featured
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg font-bold leading-snug text-slate-900">
                          <Link
                            href={`/research/publications/${publication.slug}`}
                            className="transition hover:text-blue-800"
                          >
                            {publication.title}
                          </Link>
                        </h2>

                        {publication.authors?.length > 0 && (
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                            {publication.authors.join(", ")}
                          </p>
                        )}

                        <div className="mt-4 space-y-2 text-sm text-slate-500">
                          {publication.journalOrConference && (
                            <p>{publication.journalOrConference}</p>
                          )}

                          {publication.publisher && (
                            <p>Publisher: {publication.publisher}</p>
                          )}

                          {publication.publicationDate && (
                            <p>
                              {new Date(
                                publication.publicationDate,
                              ).toLocaleDateString("en", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                timeZone: "UTC",
                              })}
                            </p>
                          )}

                          {publication.researchArea && (
                            <p>
                              Research area: {publication.researchArea}
                            </p>
                          )}
                        </div>

                        {publication.abstract && (
                          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                            {publication.abstract}
                          </p>
                        )}

                        <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
                          <Link
                            href={`/research/publications/${publication.slug}`}
                            className="text-sm font-bold text-blue-800 hover:text-blue-950"
                          >
                            Read details →
                          </Link>

                          {publication.pdfUrl && (
                            <a
                              href={publication.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                            >
                              View document
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title={
                      !hasAnyPublished
                        ? "No publications to show yet"
                        : "No matching publications"
                    }
                    description={
                      !hasAnyPublished
                        ? "The department hasn’t added any publications yet. Publications will appear here once the department publishes them."
                        : "No publications match your search or selected filters. Try changing your search terms or clearing the filters."
                    }
                    onClear={
                      hasActiveFilters || searchInput
                        ? clearFilters
                        : undefined
                    }
                  />
                )}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && !error ? (
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                  <p className="text-sm text-slate-500">
                    Page{" "}
                    <span className="font-semibold text-slate-800">
                      {page}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-800">
                      {data.totalPages}
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
                      disabled={page >= data.totalPages || loading}
                      onClick={() =>
                        setPage((current) =>
                          Math.min(data.totalPages, current + 1),
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

      <CollaborationCTA />
    </main>
  );
}
