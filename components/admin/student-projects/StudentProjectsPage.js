
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  Star,
  RefreshCw,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

const inputClass =
  "h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-gray-400";

const initialFilters = {
  search: "",
  category: "",
  status: "",
  year: "",
  featured: "",
  page: 1,
};

const initialPagination = {
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 0,
};

export default function StudentProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(initialPagination);

  const loadProjects = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.set(key, String(value));
        }
      });

      params.set("limit", "12");

      const response = await fetch(
        `/api/admin/student-projects?${params.toString()}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load student projects");
      }

      setProjects(Array.isArray(result.data) ? result.data : []);
      setPagination({
        ...initialPagination,
        ...(result.pagination || {}),
      });
    } catch (error) {
      console.error("Load student projects error:", error);
      toast.error(error.message || "Failed to load student projects");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  function updateFilter(field, value) {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  }

  function handleSearch(event) {
    event.preventDefault();
    updateFilter("search", searchInput.trim());
  }

  function resetFilters() {
    setSearchInput("");
    setFilters({ ...initialFilters });
  }

  async function deleteProject() {
    if (!projectToDelete || deletingId) return;

    const project = projectToDelete;
    setDeletingId(project._id);

    try {
      const response = await fetch(
        `/api/admin/student-projects/${project._id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete project");
      }

      toast.success("Project deleted successfully");
      setProjectToDelete(null);

      // If the last card on this page was deleted, go back one page.
      if (projects.length === 1 && filters.page > 1) {
        setFilters((prev) => ({
          ...prev,
          page: prev.page - 1,
        }));
      } else {
        await loadProjects();
      }
    } catch (error) {
      console.error("Delete project error:", error);
      toast.error(error.message || "Failed to delete project");
    } finally {
      setDeletingId("");
    }
  }

  function changePage(page) {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }

  const currentPage = pagination.page || filters.page;
  const totalPages = pagination.totalPages || 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Page header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban size={20} className="text-blue-600" />

            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Student Projects
            </h1>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Manage student projects, teams, technologies, and project links.
          </p>

          <p className="mt-2 text-xs font-medium text-gray-600">
            {pagination.total}{" "}
            {pagination.total === 1 ? "project" : "projects"} total
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Project
        </Link>
      </div>

      {/* Filters */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="border-b border-gray-100 bg-gray-50/50 p-5">
          <form
            onSubmit={handleSearch}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6"
          >
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search projects..."
                aria-label="Search projects"
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className={inputClass}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>

            <input
              type="text"
              value={filters.category}
              onChange={(event) =>
                updateFilter("category", event.target.value)
              }
              placeholder="Category"
              aria-label="Filter by category"
              className={inputClass}
            />

            <input
              type="number"
              min="1900"
              max="9999"
              value={filters.year}
              onChange={(event) => updateFilter("year", event.target.value)}
              placeholder="Year"
              aria-label="Filter by year"
              className={inputClass}
            />

            <select
              value={filters.featured}
              onChange={(event) =>
                updateFilter("featured", event.target.value)
              }
              className={inputClass}
              aria-label="Filter by featured status"
            >
              <option value="">All projects</option>
              <option value="true">Featured</option>
              <option value="false">Not featured</option>
            </select>

            <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-6">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
              >
                <Search size={14} />
                Search
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <RefreshCw size={14} />
                Reset filters
              </button>
            </div>
          </form>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

              <p className="text-sm font-medium text-gray-600">
                Loading student projects...
              </p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          /* Empty state */
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <FolderKanban size={22} className="text-gray-500" />
            </div>

            <h2 className="text-sm font-semibold text-gray-900">
              No projects found
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Try changing your filters or create a new project.
            </p>

            <Link
              href="/admin/projects/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={14} />
              Add Project
            </Link>
          </div>
        ) : (
          <>
            {/* Project cards */}
            <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-sm"
                >
                  {/* Cover image */}
                  <div className="relative aspect-video bg-gray-100">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} cover`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FolderKanban size={30} className="text-gray-300" />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                          project.status === "ongoing"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {project.status || "completed"}
                      </span>

                      {project.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-sm">
                          <Star
                            size={11}
                            className="text-amber-500"
                            fill="currentColor"
                          />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                        {project.category || "Uncategorized"} · {project.year}
                      </p>

                      <h2 className="line-clamp-1 text-sm font-bold text-gray-900">
                        {project.title}
                      </h2>

                      <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-relaxed text-gray-500">
                        {project.shortDescription ||
                          "No short description provided."}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div className="flex min-h-6 flex-wrap gap-1.5">
                      {(project.technologies || [])
                        .slice(0, 3)
                        .map((technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] text-gray-600"
                          >
                            {technology}
                          </span>
                        ))}

                      {(project.technologies || []).length > 3 && (
                        <span className="px-1 py-1 text-[10px] text-gray-500">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Card actions */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-[11px] text-gray-500">
                        {project.students?.length || 0} team member(s)
                      </span>

                      <div className="flex items-center gap-1">
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open live project"
                            aria-label={`Open live project: ${project.title}`}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}

                        <Link
                          href={`/admin/projects/${project._id}/edit`}
                          title="Edit project"
                          aria-label={`Edit ${project.title}`}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          title="Delete project"
                          aria-label={`Delete ${project.title}`}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                Page {currentPage} of {Math.max(totalPages, 1)}
                {" · "}
                {pagination.total} results
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => changePage(currentPage - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => changePage(currentPage + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* React delete confirmation modal */}
      {projectToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingId
            ) {
              setProjectToDelete(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            aria-describedby="delete-project-description"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <AlertTriangle size={21} className="text-red-600" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <h2
                id="delete-project-title"
                className="text-base font-bold text-gray-900"
              >
                Delete student project?
              </h2>

              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setProjectToDelete(null)}
                aria-label="Close confirmation"
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <p
              id="delete-project-description"
              className="mt-2 text-sm leading-relaxed text-gray-500"
            >
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {projectToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setProjectToDelete(null)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={deleteProject}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Trash2 size={15} />
                )}

                {deletingId ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
