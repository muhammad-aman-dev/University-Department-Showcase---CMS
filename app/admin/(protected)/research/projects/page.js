
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Edit3,
  FileText,
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
import FileUploader from "@/components/admin/media/FileUploader";

const emptyForm = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  researchArea: "",
  principalInvestigator: "",
  teamMembersText: "",
  fundingOrganization: "",
  startDate: "",
  endDate: "",
  status: "ongoing",
  image: "",
  documentUrl: "",
  projectUrl: "",
  isFeatured: false,
  order: 0,
};

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

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function dateForInput(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function displayDate(value) {
  if (!value) return "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not specified";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || result.error || "Something went wrong."
    );
  }

  return result;
}

function statusClasses(status) {
  switch (status) {
    case "ongoing":
      return "bg-emerald-100 text-emerald-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "planned":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function ResearchProjectsAdminPage() {
  const [projects, setProjects] = useState([]);
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [projectToDelete, setProjectToDelete] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const [projectResponse, areaResponse] = await Promise.all([
        fetch("/api/admin/research/projects", { cache: "no-store" }),
        fetch("/api/admin/research/areas", { cache: "no-store" }),
      ]);

      const [projectResult, areaResult] = await Promise.all([
        readResponse(projectResponse),
        readResponse(areaResponse),
      ]);

      setProjects(
        Array.isArray(projectResult.data) ? projectResult.data : []
      );
      setAreas(Array.isArray(areaResult.data) ? areaResult.data : []);
    } catch (error) {
      setPageError(error.message || "Unable to load research data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEditing = (project) => {
    setEditingId(project._id);

    setForm({
      title: project.title || "",
      slug: project.slug || "",
      shortDescription: project.shortDescription || "",
      description: project.description || "",
      researchArea: project.researchArea || "",
      principalInvestigator: project.principalInvestigator || "",
      teamMembersText: Array.isArray(project.teamMembers)
        ? project.teamMembers.join("\n")
        : "",
      fundingOrganization: project.fundingOrganization || "",
      startDate: dateForInput(project.startDate),
      endDate: dateForInput(project.endDate),
      status: project.status || "ongoing",
      image: project.image || "",
      documentUrl: project.documentUrl || "",
      projectUrl: project.projectUrl || "",
      isFeatured: Boolean(project.isFeatured),
      order: Number(project.order) || 0,
    });

    document.getElementById("project-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a project title.");
      return;
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      toast.error("The end date cannot be earlier than the start date.");
      return;
    }

    setSaving(true);

    try {
      const teamMembers = form.teamMembersText
        .split("\n")
        .map((member) => member.trim())
        .filter(Boolean);

      const payload = {
        title: form.title.trim(),
        slug: slugify(form.slug || form.title),
        shortDescription: form.shortDescription.trim(),
        description: form.description,
        researchArea: form.researchArea.trim(),
        principalInvestigator: form.principalInvestigator.trim(),
        teamMembers,
        fundingOrganization: form.fundingOrganization.trim(),
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        status: form.status,
        image: form.image,
        documentUrl: form.documentUrl,
        projectUrl: form.projectUrl.trim(),
        isFeatured: form.isFeatured,
        order: Number(form.order) || 0,
      };

      const response = await fetch(
        editingId
          ? `/api/admin/research/projects/${editingId}`
          : "/api/admin/research/projects",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      await readResponse(response);

      toast.success(
        editingId ? "Research project updated." : "Research project created."
      );

      resetForm();
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to save research project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!projectToDelete) return;
  
    const project = projectToDelete;
    setDeletingId(project._id);
  
    try {
      const response = await fetch(
        `/api/admin/research/projects/${project._id}`,
        { method: "DELETE" }
      );
  
      await readResponse(response);
  
      toast.success("Research project deleted.");
  
      if (editingId === project._id) resetForm();
  
      setShowDeleteModal(false);
      setProjectToDelete(null);
  
      await loadData();
    } catch (error) {
      toast.error(error.message || "Unable to delete research project.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      const searchableText = [
        project.title,
        project.slug,
        project.shortDescription,
        project.researchArea,
        project.principalInvestigator,
        project.fundingOrganization,
        ...(Array.isArray(project.teamMembers) ? project.teamMembers : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchableText.includes(query));
    });
  }, [projects, search, statusFilter]);

  const ongoingCount = projects.filter(
    (project) => project.status === "ongoing"
  ).length;

  const completedCount = projects.filter(
    (project) => project.status === "completed"
  ).length;

  const featuredCount = projects.filter(
    (project) => project.isFeatured
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-blue-950 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                Research management
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Research Projects
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Manage research initiatives, investigators, funding, project
                timelines, and supporting documents.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                document.getElementById("project-form")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-amber-300"
            >
              <Plus size={18} />
              Add project
            </button>
          </div>
        </section>

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total projects", value: projects.length },
            { label: "Ongoing", value: ongoingCount },
            { label: "Completed", value: completedCount },
            { label: "Featured", value: featuredCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-950">
                {loading ? "—" : item.value}
              </p>
            </div>
          ))}
        </section>

        {/* Form */}
        <section
          id="project-form"
          className="scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-blue-950">
                {editingId ? "Edit research project" : "Create research project"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fields marked with * are required.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                <X size={16} />
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6">
            {/* General information */}
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-950">
                General information
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Project title *">
                  <input
                    required
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="Enter the research project title"
                    className={inputClass}
                  />
                </Field>

                <Field label="URL slug">
                  <input
                    value={form.slug}
                    onChange={(event) =>
                      updateField("slug", event.target.value)
                    }
                    placeholder={slugify(form.title) || "project-title"}
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Leave blank to generate it from the title.
                  </p>
                </Field>

                <Field label="Research area">
                  <select
                    value={form.researchArea}
                    onChange={(event) =>
                      updateField("researchArea", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Select a research area</option>
                    {form.researchArea &&
                      !areas.some(
                        (area) => area.name === form.researchArea
                      ) && (
                        <option value={form.researchArea}>
                          {form.researchArea} (existing value)
                        </option>
                      )}
                    {areas.map((area) => (
                      <option key={area._id} value={area.name}>
                        {area.name}
                        {area.status === "inactive" ? " (inactive)" : ""}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    Stored as a text value, matching your existing schema.
                  </p>
                </Field>

                <Field label="Project status">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="planned">Planned</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <Field label="Short description">
                    <textarea
                      rows={3}
                      value={form.shortDescription}
                      onChange={(event) =>
                        updateField("shortDescription", event.target.value)
                      }
                      placeholder="A concise summary for the project card."
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Full description">
                    <textarea
                      rows={6}
                      value={form.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      placeholder="Describe the research objectives, methodology, and expected outcomes."
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* People and funding */}
            <div className="border-t border-slate-100 pt-7">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-950">
                People and funding
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Principal investigator">
                  <input
                    value={form.principalInvestigator}
                    onChange={(event) =>
                      updateField(
                        "principalInvestigator",
                        event.target.value
                      )
                    }
                    placeholder="Lead researcher name"
                    className={inputClass}
                  />
                </Field>

                <Field label="Funding organization">
                  <input
                    value={form.fundingOrganization}
                    onChange={(event) =>
                      updateField("fundingOrganization", event.target.value)
                    }
                    placeholder="e.g. Research council or funding agency"
                    className={inputClass}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Team members">
                    <textarea
                      rows={4}
                      value={form.teamMembersText}
                      onChange={(event) =>
                        updateField("teamMembersText", event.target.value)
                      }
                      placeholder={"Enter one team member per line\nDr. A. Researcher\nM. Student"}
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Each non-empty line will be saved as one team member.
                    </p>
                  </Field>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t border-slate-100 pt-7">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-950">
                Project timeline
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Start date">
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(event) =>
                      updateField("startDate", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="End date">
                  <input
                    type="date"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={(event) =>
                      updateField("endDate", event.target.value)
                    }
                    className={inputClass}
                  />
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
                  <p className="mt-1 text-xs text-slate-500">
                    Used for manual ordering where supported.
                  </p>
                </Field>

                <div className="flex items-center">
                  <label className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
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
                        Featured project
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600">
                        Highlight this project on the public research page.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Media and links */}
            <div className="border-t border-slate-100 pt-7">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-950">
                Media and resources
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <ImageUploader
                    value={form.image}
                    onChange={(url) => updateField("image", url)}
                    folder="research/projects"
                    label="Project cover image"
                    description="Upload a cover image for the project."
                    aspect="video"
                  />
                </div>

                <div>
                  <FileUploader
                    value={form.documentUrl}
                    fileName=""
                    onChange={({ url }) => updateField("documentUrl", url)}
                    folder="research/projects/documents"
                    label="Project document"
                    description="Upload a project brief, report, or related PDF/document."
                  />
                  {form.documentUrl && (
                    <a
                      href={form.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:underline"
                    >
                      <FileText size={16} />
                      View uploaded document
                    </a>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Field label="External project URL">
                    <input
                      type="url"
                      value={form.projectUrl}
                      onChange={(event) =>
                        updateField("projectUrl", event.target.value)
                      }
                      placeholder="https://example.edu/project"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
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
                    : "Create project"}
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

        {/* Projects list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-blue-950">
                Existing projects
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredProjects.length} of {projects.length} projects
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
                  placeholder="Search projects..."
                  className={`${inputClass} pl-9 sm:w-56`}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`${inputClass} sm:w-40`}
                aria-label="Filter by project status"
              >
                <option value="all">All statuses</option>
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>

              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                aria-label="Refresh research projects"
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
                <p className="font-semibold">Could not load research projects</p>
                <p className="mt-1 text-sm">{pageError}</p>
                <button
                  type="button"
                  onClick={loadData}
                  className="mt-3 text-sm font-bold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-950">
                <Search size={24} />
              </div>
              <h3 className="mt-4 font-bold text-blue-950">
                {search || statusFilter !== "all"
                  ? "No matching projects"
                  : "No research projects yet"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {search || statusFilter !== "all"
                  ? "Try changing the search term or status filter."
                  : "Create your first research project using the form above."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <article
                  key={project._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="relative h-44 overflow-hidden bg-linear-to-br from-blue-950 to-blue-800">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl font-bold text-white/40">
                        {project.title?.charAt(0)?.toUpperCase() || "R"}
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClasses(project.status)}`}
                      >
                        {project.status || "unknown"}
                      </span>
                      {project.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-blue-950">
                          <Star size={12} fill="currentColor" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-blue-950">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      /{project.slug}
                    </p>

                    {project.researchArea && (
                      <span className="mt-3 inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                        {project.researchArea}
                      </span>
                    )}

                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                      {project.shortDescription ||
                        project.description ||
                        "No project description has been added."}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      {project.principalInvestigator && (
                        <p>
                          <span className="font-semibold text-slate-700">
                            Investigator:
                          </span>{" "}
                          {project.principalInvestigator}
                        </p>
                      )}

                      {project.fundingOrganization && (
                        <p>
                          <span className="font-semibold text-slate-700">
                            Funding:
                          </span>{" "}
                          {project.fundingOrganization}
                        </p>
                      )}

                      <p>
                        <span className="font-semibold text-slate-700">
                          Timeline:
                        </span>{" "}
                        {displayDate(project.startDate)} –{" "}
                        {displayDate(project.endDate)}
                      </p>

                      {project.documentUrl && (
                        <a
                          href={project.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-blue-800 hover:underline"
                        >
                          <FileText size={15} />
                          Project document
                        </a>
                      )}
                    </div>

                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => startEditing(project)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-950 transition hover:bg-blue-100"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        disabled={deletingId === project._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingId === project._id ? (
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
      
{/* Custom Delete Confirmation Modal */}
{showDeleteModal && projectToDelete && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    onClick={() => {
      if (!deletingId) {
        setShowDeleteModal(false);
        setProjectToDelete(null);
      }
    }}
  >
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-project-title"
      aria-describedby="delete-project-description"
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      {/* Warning icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle size={28} />
      </div>

      {/* Title */}
      <h2
        id="delete-project-title"
        className="mt-5 text-xl font-bold text-slate-900"
      >
        Are you sure you want to delete?
      </h2>

      {/* Description */}
      <p
        id="delete-project-description"
        className="mt-3 text-sm leading-6 text-slate-600"
      >
        You are about to delete the research project{" "}
        <span className="font-bold text-slate-900">
          "{projectToDelete.title}"
        </span>
        . This action cannot be undone.
      </p>

      {/* Warning message */}
      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
        <p className="text-xs leading-5 text-red-800">
          Deleting this project will permanently remove it from your
          research projects. Make sure you want to continue.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={Boolean(deletingId)}
          onClick={() => {
            setShowDeleteModal(false);
            setProjectToDelete(null);
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
