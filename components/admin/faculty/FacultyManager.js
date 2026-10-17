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

      const response = await fetch(`/api/admin/faculty/${member._id}`, {
        method: "DELETE",
      });

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

      const response = await fetch(`/api/admin/faculty/${member._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update status");
      }

      setFaculty((previous) =>
        previous.map((item) =>
          item._id === member._id ? { ...item, ...result.data } : item
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
      const exists = previous.some((item) => item._id === savedMember._id);

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

  const hodCount = faculty.filter((item) => item.isHOD).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <Users size={20} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Faculty Management
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Manage faculty profiles, designations, and visibility.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadFaculty}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <Plus size={16} />
            Add Faculty
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Total Faculty" value={faculty.length} />
        <SummaryCard label="Active" value={activeCount} />
        <SummaryCard label="Featured" value={featuredCount} />
        <SummaryCard label="HOD" value={hodCount} />
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:p-5">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, designation, email..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
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
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-xs">
          <Loader2 size={26} className="animate-spin text-blue-600" />
        </div>
      ) : filteredFaculty.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
            <Users size={24} />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-gray-900">
            {faculty.length === 0
              ? "No faculty members yet"
              : "No matching faculty members"}
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {faculty.length === 0
              ? "Add your first faculty profile to get started."
              : "Try a different search or filter."}
          </p>

          {faculty.length === 0 && (
            <button
              type="button"
              onClick={openAddForm}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={15} />
              Add Faculty
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          <div className="divide-y divide-gray-100">
            {filteredFaculty.map((member) => (
              <article
                key={member._id}
                className="flex flex-col gap-4 p-4 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:p-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-14 w-14 shrink-0 rounded-xl border border-gray-200 object-cover sm:h-16 sm:w-16"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400 sm:h-16 sm:w-16">
                      <UserRound size={26} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                        {member.name}
                      </h2>

                      {member.isHOD && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          HOD
                        </span>
                      )}

                      {member.isFeatured && (
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-500"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                      {member.designation}
                    </p>

                    {member.specialization && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>
                          {member.publications?.length ?? 0} publications
                        </span>
                        <span className="text-gray-300">·</span>
                        <span>
                          {member.researchProjects?.length ?? 0} projects
                        </span>
                        <span className="text-gray-300">·</span>
                        <span>{member.books?.length ?? 0} books</span>
                      </div>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          member.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
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
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteFaculty(member)}
                    disabled={deletingId === member._id}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === member._id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="border-t border-gray-200 bg-gray-50/70 px-4 py-3 text-xs text-gray-500 sm:px-5">
            Showing {filteredFaculty.length} of {faculty.length} faculty
            members
          </div>
        </div>
      )}

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-900/40 p-3 backdrop-blur-sm sm:p-6">
          <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-gray-900">
                  {editingFaculty
                    ? "Edit Faculty Member"
                    : "Add Faculty Member"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Enter the faculty profile details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-transparent p-2 text-gray-500 transition hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                aria-label="Close form"
              >
                <X size={18} />
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs sm:p-5">
      <p className="text-xs font-semibold text-gray-600">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}