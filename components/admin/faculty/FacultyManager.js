
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  Loader2,
  RefreshCw,
  X,
  Star,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import FacultyForm from "./FacultyForm";

export default function FacultyManager() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [deletingId, setDeletingId] = useState("");
  const [savingStatusId, setSavingStatusId] = useState("");

  const loadFaculty = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/faculty", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load faculty");
      }

      setFaculty(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Load faculty error:", error);
      toast.error(error.message || "Failed to load faculty");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaculty();
  }, [loadFaculty]);

  const filteredFaculty = faculty.filter((member) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      [
        member.name,
        member.designation,
        member.specialization,
        member.qualification,
        member.email,
      ].some((value) => value?.toLowerCase().includes(query));

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && member.status === "active") ||
      (filter === "inactive" && member.status === "inactive") ||
      (filter === "featured" && member.isFeatured) ||
      (filter === "hod" && member.isHOD);

    return matchesSearch && matchesFilter;
  });

  function openAddForm() {
    setEditingFaculty(null);
    setShowForm(true);
  }

  function openEditForm(member) {
    setEditingFaculty(member);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingFaculty(null);
  }

  async function deleteFaculty(member) {
    const confirmed = window.confirm(
      `Delete ${member.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(member._id);

      const response = await fetch(
        `/api/admin/faculty/${member._id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete faculty member");
      }

      setFaculty((previous) =>
        previous.filter((item) => item._id !== member._id)
      );

      toast.success("Faculty member deleted successfully");
    } catch (error) {
      console.error("Delete faculty error:", error);
      toast.error(error.message || "Failed to delete faculty member");
    } finally {
      setDeletingId("");
    }
  }

  async function toggleStatus(member) {
    const nextStatus =
      member.status === "active" ? "inactive" : "active";

    try {
      setSavingStatusId(member._id);

      const response = await fetch(
        `/api/admin/faculty/${member._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update status");
      }

      setFaculty((previous) =>
        previous.map((item) =>
          item._id === member._id
            ? { ...item, ...result.data }
            : item
        )
      );

      toast.success(`Faculty member marked ${nextStatus}`);
    } catch (error) {
      console.error("Update faculty status error:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setSavingStatusId("");
    }
  }

  function handleSaved(savedMember) {
    setFaculty((previous) => {
      const exists = previous.some(
        (item) => item._id === savedMember._id
      );

      if (exists) {
        return previous.map((item) =>
          item._id === savedMember._id ? savedMember : item
        );
      }

      return [savedMember, ...previous];
    });

    closeForm();
    loadFaculty();
  }

  const activeCount = faculty.filter(
    (item) => item.status === "active"
  ).length;

  const featuredCount = faculty.filter(
    (item) => item.isFeatured
  ).length;

  const hodCount = faculty.filter(
    (item) => item.isHOD
  ).length;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950 text-amber-400">
              <Users size={20} />
            </div>

            <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
              Faculty Management
            </h1>
          </div>

          <p className="mt-2 pl-12 text-sm text-gray-500">
            Manage faculty profiles, designations, and visibility.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadFaculty}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
          >
            <Plus size={17} />
            Add Faculty
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Total Faculty" value={faculty.length} />
        <SummaryCard label="Active" value={activeCount} />
        <SummaryCard label="Featured" value={featuredCount} />
        <SummaryCard label="HOD" value={hodCount} />
      </div>

      {/* Search and filters */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, designation, email..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-700"
        >
          <option value="all">All Faculty</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="featured">Featured</option>
          <option value="hod">Head of Department</option>
        </select>
      </div>

      {/* Faculty list */}
      {loading ? (
        <div className="flex min-h-60 items-center justify-center rounded-xl border border-gray-200 bg-white">
          <Loader2 size={28} className="animate-spin text-blue-950" />
        </div>
      ) : filteredFaculty.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
          <Users size={36} className="mx-auto text-gray-300" />

          <h2 className="mt-3 text-base font-bold text-gray-800">
            {faculty.length === 0
              ? "No faculty members yet"
              : "No matching faculty members"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {faculty.length === 0
              ? "Add your first faculty profile to get started."
              : "Try a different search or filter."}
          </p>

          {faculty.length === 0 && (
            <button
              type="button"
              onClick={openAddForm}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
            >
              <Plus size={16} />
              Add Faculty
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {filteredFaculty.map((member) => (
              <article
                key={member._id}
                className="flex flex-col gap-4 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:p-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-16 w-16 shrink-0 rounded-xl border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <UserRound size={28} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                        {member.name}
                      </h2>

                      {member.isHOD && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          HOD
                        </span>
                      )}

                      {member.isFeatured && (
                        <Star
                          size={15}
                          className="fill-amber-400 text-amber-500"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-600">
                      {member.designation}
                    </p>

                    {member.specialization && (
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>{member.publications?.length ?? 0} publications</span>
                      <span>·</span>
                      <span>{member.researchProjects?.length ?? 0} projects</span>
                      <span>·</span>
                      <span>{member.books?.length ?? 0} books</span>
                    </div>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          member.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {member.status === "active" ? "Active" : "Inactive"}
                      </span>

                      <span className="text-xs text-gray-400">
                        Order: {member.order ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => toggleStatus(member)}
                    disabled={savingStatusId === member._id}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-white disabled:opacity-50"
                  >
                    {savingStatusId === member._id
                      ? "Updating..."
                      : member.status === "active"
                        ? "Deactivate"
                        : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditForm(member)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-900"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteFaculty(member)}
                    disabled={deletingId === member._id}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === member._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
            Showing {filteredFaculty.length} of {faculty.length} faculty members
          </div>
        </div>
      )}

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {editingFaculty ? "Edit Faculty Member" : "Add Faculty Member"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Enter the faculty profile details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(100vh-130px)] overflow-y-auto p-5 sm:p-6">
              <FacultyForm
                faculty={editingFaculty}
                onSaved={handleSaved}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-gray-900">{value}</p>
    </div>
  );
}
