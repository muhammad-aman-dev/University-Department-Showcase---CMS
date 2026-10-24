
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/admin/media/FileUploader";

const API_URL = "/api/admin/publications";

const PUBLICATION_TYPES = [
  "Journal Article",
  "Conference Paper",
  "Book Chapter",
  "Book",
  "Thesis",
  "Technical Report",
  "Other",
];

const INITIAL_FORM = {
  title: "",
  slug: "",
  authors: "",
  publicationType: "Journal Article",
  journalOrConference: "",
  publisher: "",
  publicationDate: "",
  abstract: "",
  doi: "",
  externalUrl: "",
  pdfUrl: "",
  researchArea: "",
  status: "draft",
  isFeatured: false,
  order: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(value) {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";

  return date.toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getErrorMessage(body, fallback) {
  return body?.message || body?.error || fallback;
}

async function readResponse(response) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    throw new Error(getErrorMessage(body, "Something went wrong."));
  }

  return body;
}

function normalizePublication(item) {
  return {
    ...item,
    id: String(item.id || item._id || ""),
    authors: Array.isArray(item.authors) ? item.authors : [],
    isFeatured: Boolean(item.isFeatured),
    order: Number(item.order || 0),
  };
}

function toForm(publication) {
  if (!publication) return { ...INITIAL_FORM };

  return {
    title: publication.title || "",
    slug: publication.slug || "",
    authors: (publication.authors || []).join("\n"),
    publicationType: publication.publicationType || "Journal Article",
    journalOrConference: publication.journalOrConference || "",
    publisher: publication.publisher || "",
    publicationDate: publication.publicationDate
      ? new Date(publication.publicationDate).toISOString().slice(0, 10)
      : "",
    abstract: publication.abstract || "",
    doi: publication.doi || "",
    externalUrl: publication.externalUrl || "",
    pdfUrl: publication.pdfUrl || "",
    researchArea: publication.researchArea || "",
    status: publication.status || "draft",
    isFeatured: Boolean(publication.isFeatured),
    order: Number(publication.order || 0),
  };
}

function StatCard({ label, value, description, icon, accent = false }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-blue-950">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
            accent
              ? "bg-amber-100 text-amber-700"
              : "bg-blue-50 text-blue-900"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const published = status === "published";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        published
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
      ★ Featured
    </span>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function PublicationsAdminClient() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  
const loadPublications = useCallback(async () => {
  setLoading(true);
  setLoadError("");

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok || body.success === false) {
      throw new Error(
        body.message || `Failed to load publications (${response.status}).`
      );
    }

    // Support both common API response formats.
    const records = Array.isArray(body.data)
      ? body.data
      : Array.isArray(body.data?.publications)
        ? body.data.publications
        : Array.isArray(body.publications)
          ? body.publications
          : [];

    console.log("Admin publications API response:", body);
    console.log("Admin publications loaded:", records.length, records);

    setPublications(records.map(normalizePublication));
  } catch (error) {
    console.error("Failed to load admin publications:", error);
    setLoadError(error.message || "Unable to load publications.");
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const stats = useMemo(
    () => ({
      total: publications.length,
      published: publications.filter((item) => item.status === "published")
        .length,
      drafts: publications.filter((item) => item.status === "draft").length,
      featured: publications.filter((item) => item.isFeatured).length,
    }),
    [publications],
  );

  const filteredPublications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return publications
      .filter((item) => {
        const searchable = [
          item.title,
          item.slug,
          item.abstract,
          item.journalOrConference,
          item.publisher,
          item.researchArea,
          item.doi,
          ...(item.authors || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = !query || searchable.includes(query);
        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;
        const matchesType =
          typeFilter === "all" || item.publicationType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort(
        (a, b) =>
          Number(b.isFeatured) - Number(a.isFeatured) ||
          Number(a.order || 0) - Number(b.order || 0) ||
          new Date(b.publicationDate || b.createdAt || 0) -
            new Date(a.publicationDate || a.createdAt || 0),
      );
  }, [publications, search, statusFilter, typeFilter]);

  function updateField(name, value) {
    setForm((current) => {
      const next = { ...current, [name]: value };

      if (name === "title" && !slugManuallyEdited) {
        next.slug = slugify(value);
      }

      return next;
    });
  }

  function openCreateForm() {
    setEditing(null);
    setForm({ ...INITIAL_FORM });
    setSlugManuallyEdited(false);
    setFormOpen(true);
  }

  function openEditForm(publication) {
    setEditing(publication);
    setForm(toForm(publication));
    setSlugManuallyEdited(true);
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditing(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a publication title.");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Please enter a publication slug.");
      return;
    }

    const authors = form.authors
      .split(/\n|,/)
      .map((author) => author.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: slugify(form.slug),
      authors,
      order: form.order === "" ? "" : Number(form.order),
      publicationDate: form.publicationDate || null,
      doi: form.doi.trim(),
      externalUrl: form.externalUrl.trim(),
      pdfUrl: form.pdfUrl.trim(),
      researchArea: form.researchArea.trim(),
      journalOrConference: form.journalOrConference.trim(),
      publisher: form.publisher.trim(),
      abstract: form.abstract.trim(),
    };

    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: editing ? "PUT" : "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing ? { id: editing.id, ...payload } : payload,
        ),
      });

      await readResponse(response);

      toast.success(
        editing
          ? "Publication updated successfully."
          : "Publication created successfully.",
      );

      setFormOpen(false);
      setEditing(null);
      await loadPublications();
    } catch (error) {
      toast.error(error.message || "Could not save publication.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_URL}?id=${encodeURIComponent(deleteTarget.id)}`,
        {
          method: "DELETE",
          cache: "no-store",
          headers: { Accept: "application/json" },
        },
      );

      await readResponse(response);

      toast.success("Publication deleted successfully.");
      setDeleteTarget(null);
      await loadPublications();
    } catch (error) {
      toast.error(error.message || "Could not delete publication.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="overflow-hidden rounded-3xl bg-blue-950 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                RESEARCH MANAGEMENT
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Publications
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Manage research papers, journal articles, conference papers,
                and other academic publications from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-blue-950 transition hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-200"
            >
              <span className="text-xl leading-none">+</span>
              Add publication
            </button>
          </div>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total publications"
            value={stats.total}
            description="All records in the system"
            icon="▤"
          />
          <StatCard
            label="Published"
            value={stats.published}
            description="Visible on the public website"
            icon="✓"
          />
          <StatCard
            label="Drafts"
            value={stats.drafts}
            description="Not visible publicly"
            icon="✎"
            accent
          />
          <StatCard
            label="Featured"
            value={stats.featured}
            description="Marked as featured"
            icon="★"
            accent
          />
        </section>

        {/* Main content */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-950">
                All publications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search, filter, edit, or remove publication records.
              </p>
            </div>

            <button
              type="button"
              onClick={loadPublications}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
            >
              <span className={loading ? "animate-spin" : ""}>↻</span>
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-2 lg:grid-cols-3 lg:p-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="publication-search" className={labelClass}>
                Search publications
              </label>
              <input
                id="publication-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Title, author, DOI, journal..."
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="publication-status" className={labelClass}>
                Publication status
              </label>
              <select
                id="publication-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={inputClass}
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label htmlFor="publication-type-filter" className={labelClass}>
                Publication type
              </label>
              <select
                id="publication-type-filter"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className={inputClass}
              >
                <option value="all">All types</option>
                {PUBLICATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-5 pt-5 sm:px-6">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredPublications.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {publications.length}
              </span>{" "}
              publications
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3 sm:p-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : loadError ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">
                !
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                Could not load publications
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                {loadError}
              </p>
              <button
                type="button"
                onClick={loadPublications}
                className="mt-5 rounded-xl bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
              >
                Try again
              </button>
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="px-5 py-16 text-center sm:px-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-600">
                ▤
              </div>
              <h3 className="mt-4 text-lg font-bold text-blue-950">
                {publications.length === 0
                  ? "No publications yet"
                  : "No matching publications"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {publications.length === 0
                  ? "Add your department’s first publication to get started."
                  : "Try a different search term or change your filters."}
              </p>
              {publications.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-blue-950 hover:bg-amber-300"
                >
                  Add first publication
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3 sm:p-6">
              {filteredPublications.map((publication) => (
                <article
                  key={publication.id}
                  className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={publication.status} />
                    {publication.isFeatured && <FeaturedBadge />}
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    {publication.publicationType || "Publication"}
                  </p>

                  <h3 className="mt-2 line-clamp-3 text-lg font-bold leading-7 text-blue-950">
                    {publication.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {publication.authors?.length
                      ? publication.authors.join(", ")
                      : "No authors added"}
                  </p>

                  {(publication.journalOrConference ||
                    publication.publisher) && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                      {publication.journalOrConference ||
                        publication.publisher}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                      {formatDate(publication.publicationDate)}
                    </span>
                    {publication.researchArea && (
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-blue-800">
                        {publication.researchArea}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 ">
                    <span className="text-xs text-slate-400">
                      Order: {publication.order}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(publication)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-blue-950 transition hover:border-blue-200 hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(publication)}
                        className="rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
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

      {/* Create / Edit modal */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-blue-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="publication-form-title"
            className="my-3 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-6"
          >
            <div className="flex items-start justify-between gap-4 bg-blue-950 px-5 py-5 text-white sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                  Publication management
                </p>
                <h2
                  id="publication-form-title"
                  className="mt-1 text-xl font-bold sm:text-2xl"
                >
                  {editing ? "Edit publication" : "Add publication"}
                </h2>
                <p className="mt-1 text-sm text-blue-100">
                  Enter the publication details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
                className="rounded-lg px-3 py-2 text-xl text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7">
                <Field label="Publication title *" className="sm:col-span-2">
                  <input
                    required
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="Enter the full publication title"
                    className={inputClass}
                  />
                </Field>

                <Field label="URL slug *">
                  <input
                    required
                    value={form.slug}
                    onChange={(event) => {
                      setSlugManuallyEdited(true);
                      updateField("slug", event.target.value);
                    }}
                    placeholder="publication-title"
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Used in the public publication URL.
                  </p>
                </Field>

                <Field label="Publication type *">
                  <select
                    required
                    value={form.publicationType}
                    onChange={(event) =>
                      updateField("publicationType", event.target.value)
                    }
                    className={inputClass}
                  >
                    {PUBLICATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Authors" className="sm:col-span-2">
                  <textarea
                    rows={3}
                    value={form.authors}
                    onChange={(event) =>
                      updateField("authors", event.target.value)
                    }
                    placeholder={"One author per line\nAnother author"}
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Enter one author per line. Comma-separated names are also
                    supported.
                  </p>
                </Field>

                <Field label="Journal / conference">
                  <input
                    value={form.journalOrConference}
                    onChange={(event) =>
                      updateField("journalOrConference", event.target.value)
                    }
                    placeholder="Journal or conference name"
                    className={inputClass}
                  />
                </Field>

                <Field label="Publisher">
                  <input
                    value={form.publisher}
                    onChange={(event) =>
                      updateField("publisher", event.target.value)
                    }
                    placeholder="Publisher name"
                    className={inputClass}
                  />
                </Field>

                <Field label="Publication date">
                  <input
                    type="date"
                    value={form.publicationDate}
                    onChange={(event) =>
                      updateField("publicationDate", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Research area">
                  <input
                    value={form.researchArea}
                    onChange={(event) =>
                      updateField("researchArea", event.target.value)
                    }
                    placeholder="e.g. Artificial Intelligence"
                    className={inputClass}
                  />
                </Field>

                <Field label="DOI">
                  <input
                    value={form.doi}
                    onChange={(event) => updateField("doi", event.target.value)}
                    placeholder="10.xxxx/xxxxx"
                    className={inputClass}
                  />
                </Field>

                <Field label="External publication URL">
                  <input
                    type="url"
                    value={form.externalUrl}
                    onChange={(event) =>
                      updateField("externalUrl", event.target.value)
                    }
                    placeholder="https://..."
                    className={inputClass}
                  />
                </Field>

                <Field label="Abstract" className="sm:col-span-2">
                  <textarea
                    rows={6}
                    value={form.abstract}
                    onChange={(event) =>
                      updateField("abstract", event.target.value)
                    }
                    placeholder="Write a short summary of the publication..."
                    className={inputClass}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <FileUploader
                    value={form.pdfUrl}
                    onChange={(result) =>
                      updateField("pdfUrl", result?.url || "")
                    }
                    folder="research/publications/pdfs"
                    label="Publication PDF"
                    description="Upload the paper PDF so visitors can read or download it."
                  />
                  {form.pdfUrl && (
                    <a
                      href={form.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-sm font-semibold text-blue-800 underline underline-offset-4"
                    >
                      Open current PDF
                    </a>
                  )}
                </div>

                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="draft">Draft — not public</option>
                    <option value="published">Published — public</option>
                  </select>
                </Field>

                <Field label="Display order">
                  <input
                    type="number"
                    value={form.order}
                    onChange={(event) =>
                      updateField("order", event.target.value)
                    }
                    className={inputClass}
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Lower numbers appear first where order is used.
                  </p>
                </Field>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) =>
                      updateField("isFeatured", event.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 accent-amber-500"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-blue-950">
                      Feature this publication
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-600">
                      Mark this record as featured so the public website can
                      highlight it.
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-blue-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Save changes"
                      : "Create publication"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-blue-950/60 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-publication-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600">
              !
            </div>
            <h2
              id="delete-publication-title"
              className="mt-4 text-xl font-bold text-blue-950"
            >
              Delete publication?
            </h2>
            <p className="mt-2 wrap-break-words text-sm leading-6 text-slate-600">
              You are about to delete{" "}
              <span className="font-semibold text-slate-900">
                “{deleteTarget.title}”
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete publication"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
