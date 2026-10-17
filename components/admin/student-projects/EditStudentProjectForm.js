
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  X,
  Save,
  LoaderCircle,
} from "lucide-react";
import ImageUploader from "@/components/admin/media/ImageUploader";

const emptyFormData = {
  title: "",
  slug: "",
  image: "",
  shortDescription: "",
  description: "",
  students: [{ name: "", registrationNumber: "" }],
  supervisor: "",
  category: "",
  technologies: [],
  projectUrl: "",
  githubUrl: "",
  year: new Date().getFullYear(),
  status: "ongoing",
  isFeatured: false,
  order: 0,
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditStudentProjectForm({ projectId }) {
  const router = useRouter();

  const [formData, setFormData] = useState(emptyFormData);
  const [technologyInput, setTechnologyInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadProject = useCallback(async () => {
    if (!projectId) {
      setLoadError("Project ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");

    try {
      const response = await fetch(
        `/api/admin/student-projects/${encodeURIComponent(projectId)}`,
        { cache: "no-store" }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Failed to load project."
        );
      }

      const project = result.data ?? result.project ?? result;

      if (!project || !project._id) {
        throw new Error("The API response did not contain a project.");
      }

      setFormData({
        ...emptyFormData,
        ...project,
        students:
          Array.isArray(project.students) && project.students.length
            ? project.students.map((student) => ({
                name: student.name ?? "",
                registrationNumber: student.registrationNumber ?? "",
              }))
            : [{ name: "", registrationNumber: "" }],
        technologies: Array.isArray(project.technologies)
          ? project.technologies
          : [],
        year: project.year ?? new Date().getFullYear(),
        order: project.order ?? 0,
        isFeatured: Boolean(project.isFeatured),
        status: project.status ?? "ongoing",
      });
    } catch (error) {
      setLoadError(error.message || "Unable to load this project.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  function updateField(field, value) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleTitleChange(value) {
    setFormData((previous) => ({
      ...previous,
      title: value,
      // Keep the existing slug unless it is empty.
      slug: previous.slug || createSlug(value),
    }));
  }

  function addStudent() {
    setFormData((previous) => ({
      ...previous,
      students: [
        ...previous.students,
        { name: "", registrationNumber: "" },
      ],
    }));
  }

  function updateStudent(index, field, value) {
    setFormData((previous) => ({
      ...previous,
      students: previous.students.map((student, studentIndex) =>
        studentIndex === index
          ? { ...student, [field]: value }
          : student
      ),
    }));
  }

  function removeStudent(index) {
    setFormData((previous) => ({
      ...previous,
      students: previous.students.filter(
        (_, studentIndex) => studentIndex !== index
      ),
    }));
  }

  function addTechnology(event) {
    event?.preventDefault();

    const technology = technologyInput.trim();

    if (!technology) return;

    const alreadyExists = formData.technologies.some(
      (item) => item.toLowerCase() === technology.toLowerCase()
    );

    if (alreadyExists) {
      toast.info("This technology has already been added.");
      return;
    }

    updateField("technologies", [
      ...formData.technologies,
      technology,
    ]);
    setTechnologyInput("");
  }

  function removeTechnology(technologyToRemove) {
    updateField(
      "technologies",
      formData.technologies.filter(
        (technology) => technology !== technologyToRemove
      )
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Project title is required.");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Project slug is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/student-projects/${encodeURIComponent(projectId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            title: formData.title.trim(),
            slug: formData.slug.trim(),
            students: formData.students.filter(
              (student) =>
                student.name.trim() ||
                student.registrationNumber.trim()
            ),
            technologies: formData.technologies,
            year: Number(formData.year),
            order: Number(formData.order),
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Failed to update project."
        );
      }

      toast.success("Student project updated successfully.");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircle size={20} className="animate-spin" />
          Loading project...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="font-semibold text-red-700">
          Could not load project
        </h2>
        <p className="mt-2 text-sm text-gray-600">{loadError}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadProject}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic information */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Update the project title and descriptions.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Project Title *</label>
            <input
              className={inputClass}
              value={formData.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="e.g. Smart Attendance System"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Slug *</label>
            <input
              className={inputClass}
              value={formData.slug}
              onChange={(event) =>
                updateField("slug", createSlug(event.target.value))
              }
              placeholder="smart-attendance-system"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Used in the public project URL.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Short Description *</label>
            <textarea
              className={inputClass}
              rows={3}
              value={formData.shortDescription}
              onChange={(event) =>
                updateField("shortDescription", event.target.value)
              }
              placeholder="A short summary of the project..."
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Full Description *</label>
            <textarea
              className={inputClass}
              rows={7}
              value={formData.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe the project, its features, and purpose..."
              required
            />
          </div>
        </div>
      </section>

      {/* Project image */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Project Image
        </h2>
        <p className="mb-4 mt-1 text-sm text-gray-500">
          Change the main image or keep the existing one.
        </p>

        <ImageUploader
          value={formData.image}
          onChange={(value) => updateField("image", value)}
        />
      </section>

      {/* Students */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Students
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update the students who worked on this project.
            </p>
          </div>

          <button
            type="button"
            onClick={addStudent}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus size={16} />
            Add Student
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {formData.students.map((student, index) => (
            <div
              key={index}
              className="grid grid-cols-1 items-end gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-[1fr_1fr_auto]"
            >
              <div>
                <label className={labelClass}>Student Name</label>
                <input
                  className={inputClass}
                  value={student.name}
                  onChange={(event) =>
                    updateStudent(index, "name", event.target.value)
                  }
                  placeholder="Student name"
                />
              </div>

              <div>
                <label className={labelClass}>
                  Registration Number
                </label>
                <input
                  className={inputClass}
                  value={student.registrationNumber}
                  onChange={(event) =>
                    updateStudent(
                      index,
                      "registrationNumber",
                      event.target.value
                    )
                  }
                  placeholder="Registration number"
                />
              </div>

              <button
                type="button"
                onClick={() => removeStudent(index)}
                disabled={formData.students.length === 1}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Remove student ${index + 1}`}
              >
                <Trash2 size={16} />
                <span className="sm:hidden">Remove</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Project details */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Project Details
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Supervisor</label>
            <input
              className={inputClass}
              value={formData.supervisor}
              onChange={(event) =>
                updateField("supervisor", event.target.value)
              }
              placeholder="Supervisor name"
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <input
              className={inputClass}
              value={formData.category}
              onChange={(event) =>
                updateField("category", event.target.value)
              }
              placeholder="e.g. Web Development"
            />
          </div>

          <div>
            <label className={labelClass}>Project Year</label>
            <input
              type="number"
              className={inputClass}
              value={formData.year}
              onChange={(event) =>
                updateField("year", event.target.value)
              }
              min="1900"
              max="2200"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={formData.status}
              onChange={(event) =>
                updateField("status", event.target.value)
              }
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Project Website URL</label>
            <input
              type="url"
              className={inputClass}
              value={formData.projectUrl}
              onChange={(event) =>
                updateField("projectUrl", event.target.value)
              }
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className={labelClass}>GitHub URL</label>
            <input
              type="url"
              className={inputClass}
              value={formData.githubUrl}
              onChange={(event) =>
                updateField("githubUrl", event.target.value)
              }
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className={labelClass}>Display Order</label>
            <input
              type="number"
              className={inputClass}
              value={formData.order}
              onChange={(event) =>
                updateField("order", event.target.value)
              }
              min="0"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(event) =>
                  updateField("isFeatured", event.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Feature this project
            </label>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Technologies
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Add or remove technologies used in this project.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            className={inputClass}
            value={technologyInput}
            onChange={(event) => setTechnologyInput(event.target.value)}
            placeholder="e.g. React, Node.js, MongoDB"
            onKeyDown={(event) => {
              if (event.key === "Enter") addTechnology(event);
            }}
          />
          <button
            type="button"
            onClick={addTechnology}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {formData.technologies.map((technology) => (
            <span
              key={technology}
              className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
            >
              {technology}
              <button
                type="button"
                onClick={() => removeTechnology(technology)}
                className="rounded-full hover:text-blue-950"
                aria-label={`Remove ${technology}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}

          {formData.technologies.length === 0 && (
            <p className="text-sm text-gray-400">
              No technologies added yet.
            </p>
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
