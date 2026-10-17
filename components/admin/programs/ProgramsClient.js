
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  GraduationCap,
  RefreshCw,
  Star,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function ProgramsClient() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/programs", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load programs"
        );
      }

      setPrograms(result.data || []);
    } catch (error) {
      console.error("Fetch programs error:", error);
      toast.error(error.message || "Failed to load programs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const filteredPrograms = programs.filter((program) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      program.name?.toLowerCase().includes(query) ||
      program.slug?.toLowerCase().includes(query) ||
      program.degreeType?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" || program.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function handleDelete(program) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${program.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(program._id);

    try {
      const response = await fetch(
        `/api/admin/programs/${program._id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete program"
        );
      }

      setPrograms((current) =>
        current.filter((item) => item._id !== program._id)
      );

      toast.success("Program deleted successfully");
    } catch (error) {
      console.error("Delete program error:", error);
      toast.error(error.message || "Failed to delete program");
    } finally {
      setDeletingId(null);
    }
  }

  const activeCount = programs.filter(
    (program) => program.status === "active"
  ).length;

  const featuredCount = programs.filter(
    (program) => program.isFeatured
  ).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-xl font-bold tracking-tight text-gray-900">
            Programs Management
          </h1>

          <p className="mt-0.5 text-xs text-gray-500">
            Manage academic programs and schemes of studies.
          </p>
        </div>

        <Link
          href="/admin/programs/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Program
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Programs"
          value={programs.length}
          icon={GraduationCap}
        />

        <StatCard
          label="Active Programs"
          value={activeCount}
          icon={GraduationCap}
        />

        <StatCard
          label="Featured Programs"
          value={featuredCount}
          icon={Star}
        />
      </div>

      {/* Programs List */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search programs..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 min-w-36 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              type="button"
              onClick={fetchPrograms}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center p-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <RefreshCw
                size={24}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm font-medium text-gray-600">
                Loading programs...
              </p>
            </div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          /* Empty State */
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-400">
              <GraduationCap size={28} />
            </div>

            <h2 className="mt-4 text-base font-bold text-gray-900">
              {programs.length === 0
                ? "No programs yet"
                : "No matching programs"}
            </h2>

            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-gray-500">
              {programs.length === 0
                ? "Create your first academic program to get started."
                : "Try changing your search or status filter."}
            </p>

            {programs.length === 0 && (
              <Link
                href="/admin/programs/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Program
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Program
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Degree
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Duration
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Featured
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredPrograms.map((program) => (
                    <tr
                      key={program._id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {program.image ? (
                            <img
                              src={program.image}
                              alt=""
                              className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                              <GraduationCap size={21} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">
                              {program.name}
                            </p>

                            <p className="mt-1 max-w-52 truncate text-xs text-gray-500">
                              /{program.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {program.degreeType}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {program.duration || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={program.status} />
                      </td>

                      <td className="px-6 py-4">
                        {program.isFeatured ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                            <Star size={14} fill="currentColor" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <ProgramActions
                          program={program}
                          deleting={deletingId === program._id}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredPrograms.map((program) => (
                <div key={program._id} className="p-4">
                  <div className="flex gap-3">
                    {program.image ? (
                      <img
                        src={program.image}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-xl border border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                        <GraduationCap size={26} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {program.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        /{program.slug}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={program.status} />

                        {program.isFeatured && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <Star size={13} fill="currentColor" />
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        {program.degreeType}
                        {program.duration
                          ? ` · ${program.duration}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <ProgramActions
                      program={program}
                      deleting={deletingId === program._id}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 sm:px-6">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredPrograms.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {programs.length}
                </span>{" "}
                programs
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ProgramActions({ program, deleting, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/programs/${program._id}/edit`}
        title="Edit program"
        aria-label={`Edit ${program.name}`}
        className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        <Pencil size={15} />
      </Link>

      {program.status === "active" && (
        <Link
          href={`/programs/${program.slug}`}
          target="_blank"
          rel="noreferrer"
          title="View public page"
          aria-label={`View ${program.name} public page`}
          className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <ExternalLink size={15} />
        </Link>
      )}

      <button
        type="button"
        onClick={() => onDelete(program)}
        disabled={deleting}
        title="Delete program"
        aria-label={`Delete ${program.name}`}
        className="rounded-lg border border-red-100 bg-white p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-gray-500">
          {label}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-3 font-sans text-2xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "active";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-gray-400"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}
