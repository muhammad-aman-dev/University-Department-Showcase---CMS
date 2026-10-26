
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/admin/media/ImageUploader";
import RichTextEditor from "@/components/shared/RichTextEditor";

const emptyForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  image: "",
  icon: "",
  status: "active",
  isFeatured: false,
  order: 0,
};

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || result.error || "Something went wrong.");
  }

  return result;
}

export default function ResearchAreasAdminPage() {
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [areaToDelete, setAreaToDelete] = useState(null);

  const loadAreas = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await fetch("/api/admin/research/areas", {
        cache: "no-store",
      });
      const result = await readResponse(response);
      setAreas(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setPageError(error.message || "Unable to load research areas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEditing = (area) => {
    setEditingId(area._id);
    setForm({
      name: area.name || "",
      slug: area.slug || "",
      shortDescription: area.shortDescription || "",
      description: area.description || "",
      image: area.image || "",
      icon: area.icon || "",
      status: area.status || "active",
      isFeatured: Boolean(area.isFeatured),
      order: Number(area.order) || 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter a research area name.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        slug: slugify(form.slug || form.name),
        order: Number(form.order) || 0,
      };

      const response = await fetch(
        editingId
          ? `/api/admin/research/areas/${editingId}`
          : "/api/admin/research/areas",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      await readResponse(response);
      toast.success(editingId ? "Research area updated." : "Research area created.");
      resetForm();
      await loadAreas();
    } catch (error) {
      toast.error(error.message || "Unable to save research area.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (area) => {
    setAreaToDelete(area);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!areaToDelete) return;
  
    const area = areaToDelete;
    setDeletingId(area._id);
  
    try {
      const response = await fetch(
        `/api/admin/research/areas/${area._id}`,
        { method: "DELETE" }
      );
  
      await readResponse(response);
  
      toast.success(
        "Research area deleted. Existing projects were left unchanged."
      );
  
      if (editingId === area._id) resetForm();
  
      setShowDeleteModal(false);
      setAreaToDelete(null);
  
      await loadAreas();
    } catch (error) {
      toast.error(error.message || "Unable to delete research area.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAreas = areas.filter((area) => {
    const query = search.toLowerCase().trim();

    return (
      !query ||
      area.name?.toLowerCase().includes(query) ||
      area.slug?.toLowerCase().includes(query) ||
      area.shortDescription?.toLowerCase().includes(query)
    );
  });

  const featuredCount = areas.filter((area) => area.isFeatured).length;
  const activeCount = areas.filter((area) => area.status === "active").length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page heading */}
        <section className="relative overflow-hidden rounded-3xl bg-blue-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                Research management
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Research Areas
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Organize the department&apos;s research disciplines and control
                how they appear on the public research page.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                document.getElementById("area-form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-amber-300"
            >
              <Plus size={18} />
              Add research area
            </button>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total areas", value: areas.length },
            { label: "Active areas", value: activeCount },
            { label: "Featured areas", value: featuredCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-blue-950">
                {loading ? "—" : item.value}
              </p>
            </div>
          ))}
        </section>

        {/* Create / edit form */}
        <section
          id="area-form"
          className="scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-blue-950">
                {editingId ? "Edit research area" : "Create research area"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add a discipline and its public-facing information.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                <X size={16} />
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Area name *">
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className={inputClass}
                />
              </Field>

              <Field label="URL slug">
                <input
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder={slugify(form.name) || "artificial-intelligence"}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Leave blank to generate from the area name.
                </p>
              </Field>

              <Field label="Short description">
                <textarea
                  rows={3}
                  value={form.shortDescription}
                  onChange={(event) =>
                    updateField("shortDescription", event.target.value)
                  }
                  placeholder="A concise introduction shown on area cards."
                  className={inputClass}
                />
              </Field>

              <Field label="Icon">
                <input
                  value={form.icon}
                  onChange={(event) => updateField("icon", event.target.value)}
                  placeholder="e.g. BrainCircuit"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Optional icon name or identifier for your frontend.
                </p>
              </Field>

              
<div className="md:col-span-2">
  <RichTextEditor
    label="Full description"
    value={form.description || ""}
    onChange={(value) => updateField("description", value)}
    placeholder="Describe the research area, focus, and objectives..."
  />
</div>


              <div className="md:col-span-2">
                <ImageUploader
                  value={form.image}
                  onChange={(url) => updateField("image", url)}
                  folder="research/areas"
                  label="Area image"
                  description="Upload an image representing this research discipline."
                  aspect="video"
                />
              </div>

              <Field label="Display order">
                <input
                  type="number"
                  value={form.order}
                  onChange={(event) =>
                    updateField("order", event.target.value)
                  }
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Lower numbers appear first.
                </p>
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  className={inputClass}
                >
                  <option value="active">Active — visible publicly</option>
                  <option value="inactive">Inactive — hidden publicly</option>
                </select>
              </Field>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) =>
                  updateField("isFeatured", event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-blue-950"
              />
              <span>
                <span className="block text-sm font-semibold text-blue-950">
                  Feature this research area
                </span>
                <span className="mt-1 block text-sm text-slate-600">
                  Mark this area for prominent placement on the public research
                  page, wherever featured areas are displayed.
                </span>
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Check size={17} />
                )}
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Create area"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Clear form
              </button>
            </div>
          </form>
        </section>

        {/* Areas list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-blue-950">
                Existing research areas
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredAreas.length} of {areas.length} areas
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search areas..."
                  className={`${inputClass} pl-9 sm:w-64`}
                />
              </div>
              <button
                type="button"
                onClick={loadAreas}
                disabled={loading}
                aria-label="Refresh research areas"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-slate-200 p-4"
                >
                  <div className="h-36 rounded-xl bg-slate-100" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
                  <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : pageError ? (
            <div className="m-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Could not load research areas</p>
                <p className="mt-1 text-sm">{pageError}</p>
                <button
                  type="button"
                  onClick={loadAreas}
                  className="mt-3 text-sm font-bold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : filteredAreas.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-950">
                <Search size={24} />
              </div>
              <h3 className="mt-4 font-bold text-blue-950">
                {search ? "No matching areas" : "No research areas yet"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? "Try a different search term."
                  : "Create your first research area using the form above."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
              {filteredAreas.map((area) => (
                <article
                  key={area._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="relative h-44 overflow-hidden bg-linear-to-br from-blue-950 to-blue-800">
                    {area.image ? (
                      <img
                        src={area.image}
                        alt={area.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl font-bold text-white/40">
                        {area.name?.charAt(0)?.toUpperCase() || "R"}
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          area.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {area.status === "active" ? "Active" : "Inactive"}
                      </span>
                      {area.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-blue-950">
                          <Star size={12} fill="currentColor" />
                          Featured
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-3 right-3 rounded-lg bg-blue-950/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                      Order: {area.order ?? 0}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-blue-950">
                      {area.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      /{area.slug}
                    </p>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                      {area.shortDescription ||
                        area.description ||
                        "No description has been added yet."}
                    </p>

                    {area.icon && (
                      <p className="mt-3 text-xs text-slate-500">
                        Icon: <span className="font-semibold">{area.icon}</span>
                      </p>
                    )}

                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => startEditing(area)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-950 transition hover:bg-blue-100"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(area)}
                        disabled={deletingId === area._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingId === area._id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      {showDeleteModal && areaToDelete && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    onClick={() => {
      if (!deletingId) {
        setShowDeleteModal(false);
        setAreaToDelete(null);
      }
    }}
  >
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle size={28} />
      </div>

      <h2
        id="delete-modal-title"
        className="mt-5 text-xl font-bold text-slate-900"
      >
        Are you sure you want to delete?
      </h2>

      <p
        id="delete-modal-description"
        className="mt-3 text-sm leading-6 text-slate-600"
      >
        You are about to delete{" "}
        <span className="font-bold text-slate-900">
          "{areaToDelete.name}"
        </span>
        . This action cannot be undone.
      </p>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs leading-5 text-amber-900">
          Existing research projects will not be deleted or changed.
          Their research area text will remain as it is.
        </p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={Boolean(deletingId)}
          onClick={() => {
            setShowDeleteModal(false);
            setAreaToDelete(null);
          }}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={Boolean(deletingId)}
          onClick={confirmDelete}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deletingId ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}

          {deletingId ? "Deleting..." : "Yes, delete"}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
