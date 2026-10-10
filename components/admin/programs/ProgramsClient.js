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
        throw new Error(result.message || "Failed to load programs");
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
        throw new Error(result.message || "Failed to delete program");
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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Programs
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage academic programs and schemes of studies.
              </p>
            </div>
          </div>

          <Link
            href="/admin/programs/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            <Plus size={18} />
            Add Program
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Programs" value={programs.length} color="blue" />
          <StatCard label="Active Programs" value={activeCount} color="emerald" />
          <StatCard label="Featured Programs" value={featuredCount} color="amber" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search programs..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="min-w-36 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="button"
                onClick={fetchPrograms}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  size={26}
                  className="mx-auto animate-spin text-blue-800"
                />
                <p className="mt-3 text-sm text-slate-500">
                  Loading programs...
                </p>
              </div>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <GraduationCap size={38} className="mx-auto text-slate-300" />

              <h2 className="mt-4 text-lg font-semibold text-slate-800">
                {programs.length === 0
                  ? "No programs yet"
                  : "No matching programs"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {programs.length === 0
                  ? "Create your first academic program to get started."
                  : "Try changing your search or status filter."}
              </p>

              {programs.length === 0 && (
                <Link
                  href="/admin/programs/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  <Plus size={17} />
                  Add Program
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Program</th>
                      <th className="px-6 py-4 font-semibold">Degree</th>
                      <th className="px-6 py-4 font-semibold">Duration</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Featured</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredPrograms.map((program) => (
                      <tr key={program._id} className="transition hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {program.image ? (
                              <img
                                src={program.image}
                                alt=""
                                className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                                <GraduationCap size={22} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900">
                                {program.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                /{program.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {program.degreeType}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {program.duration || "—"}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={program.status} />
                        </td>

                        <td className="px-6 py-4">
                          {program.isFeatured ? (
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600">
                              <Star size={15} fill="currentColor" />
                              Featured
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">—</span>
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

              <div className="divide-y divide-slate-100 md:hidden">
                {filteredPrograms.map((program) => (
                  <div key={program._id} className="p-4">
                    <div className="flex gap-3">
                      {program.image ? (
                        <img
                          src={program.image}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                          <GraduationCap size={26} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {program.name}
                        </h3>
                        <p className="mt-1 truncate text-xs text-slate-500">
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

                        <p className="mt-2 text-xs text-slate-500">
                          {program.degreeType}
                          {program.duration ? ` · ${program.duration}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ProgramActions
                        program={program}
                        deleting={deletingId === program._id}
                        onDelete={handleDelete}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:px-6">
                Showing {filteredPrograms.length} of {programs.length} programs
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgramActions({ program, deleting, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/programs/${program._id}/edit`}
        title="Edit program"
        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
      >
        <Pencil size={16} />
      </Link>

      {program.status === "active" && (
        <Link
          href={`/programs/${program.slug}`}
          target="_blank"
          rel="noreferrer"
          title="View public page"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
        >
          <ExternalLink size={16} />
        </Link>
      )}

      <button
        type="button"
        onClick={() => onDelete(program)}
        disabled={deleting}
        title="Delete program"
        className="rounded-lg border border-red-100 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-800",
    emerald: "bg-emerald-50 text-emerald-800",
    amber: "bg-amber-50 text-amber-800",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-3 inline-flex rounded-lg px-3 py-1 text-2xl font-bold ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "active";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}