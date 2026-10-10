"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "../media/ImageUploader";
import FileUploader from "../media/FileUploader";

const DEGREE_TYPES = [
"Undergraduate",
"Graduate",
"Postgraduate",
"Diploma",
"Certificate",
"Other",
];

const EMPTY_FORM = {
name: "",
slug: "",
degreeType: "Undergraduate",
shortDescription: "",
duration: "",
eligibility: "",
image: "",
schemeOfStudies: [],
status: "active",
isFeatured: false,
order: 0,
};

function makeSlug(value) {
return value
.toLowerCase()
.trim()
.replace(/[^a-z0-9\s-]/g, "")
.replace(/\s+/g, "-")
.replace(/-+/g, "-");
}

export default function ProgramForm({ mode = "create", programId }) {
const router = useRouter();
const isEdit = mode === "edit";

const [form, setForm] = useState(EMPTY_FORM);
const [loading, setLoading] = useState(isEdit);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [slugEdited, setSlugEdited] = useState(false);

useEffect(() => {
if (!isEdit || !programId) return;

let cancelled = false;

async function loadProgram() {
  try {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/admin/programs/${programId}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not load the program.");
    }

    if (cancelled) return;

    const program = result.data;

    setForm({
      ...EMPTY_FORM,
      ...program,
      schemeOfStudies: Array.isArray(program.schemeOfStudies)
        ? program.schemeOfStudies.map((scheme) => ({
            year: scheme.year ?? "",
            fileUrl: scheme.fileUrl ?? "",
            fileName: scheme.fileName ?? "",
          }))
        : [],
    });
    setSlugEdited(true);
  } catch (err) {
    if (!cancelled) {
      setError(err.message || "Could not load the program.");
    }
  } finally {
    if (!cancelled) setLoading(false);
  }
}

loadProgram();

return () => {
  cancelled = true;
};

}, [isEdit, programId]);

function updateField(field, value) {
setForm((current) => ({ ...current, [field]: value }));
}

function handleNameChange(value) {
setForm((current) => ({
...current,
name: value,
...(!slugEdited ? { slug: makeSlug(value) } : {}),
}));
}

function addScheme() {
setForm((current) => ({
...current,
schemeOfStudies: [
...current.schemeOfStudies,
{ year: "", fileUrl: "", fileName: "" },
],
}));
}

function updateScheme(index, field, value) {
setForm((current) => ({
...current,
schemeOfStudies: current.schemeOfStudies.map((scheme, i) =>
i === index ? { ...scheme, [field]: value } : scheme
),
}));
}

function removeScheme(index) {
setForm((current) => ({
...current,
schemeOfStudies: current.schemeOfStudies.filter((_, i) => i !== index),
}));
}

async function handleSubmit(event) {
event.preventDefault();
setError("");

if (!form.name.trim()) {
  setError("Program name is required.");
  return;
}

if (!form.slug.trim()) {
  setError("Program slug is required.");
  return;
}

const schemes = form.schemeOfStudies.map((scheme) => ({
  year: Number(scheme.year),
  fileUrl: scheme.fileUrl.trim(),
  fileName: scheme.fileName.trim(),
}));

const hasInvalidScheme = schemes.some(
  (scheme) =>
    !Number.isInteger(scheme.year) ||
    scheme.year < 1 ||
    !scheme.fileUrl ||
    !scheme.fileName
);

if (hasInvalidScheme) {
  setError(
    "For each scheme, enter a valid year and upload a file before saving."
  );
  return;
}

const payload = {
  ...form,
  name: form.name.trim(),
  slug: makeSlug(form.slug),
  order: Number(form.order) || 0,
  schemeOfStudies: schemes,
};

try {
  setSaving(true);

  const response = await fetch(
    isEdit ? `/api/admin/programs/${programId}` : "/api/admin/programs",
    {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not save the program.");
  }

  router.push("/admin/programs");
  router.refresh();
} catch (err) {
  setError(err.message || "Something went wrong while saving.");
} finally {
  setSaving(false);
}

}

if (loading) {
return <div className="p-8 text-sm text-gray-500">Loading program...</div>;
}

return (
<div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
<div className="mb-8">
<button
type="button"
onClick={() => router.push("/admin/programs")}
className="mb-3 text-sm font-medium text-gray-600 hover"
>
← Back to programs
</button>

    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
      {isEdit ? "Edit Program" : "Create Program"}
    </h1>
    <p className="mt-1 text-sm text-gray-500">
      Manage program details, its public listing, and scheme-of-studies
      documents.
    </p>
  </div>

  {error && (
    <div
      role="alert"
      className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {error}
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-8">
    <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Basic information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          These details identify the program on your website.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Program name *
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="e.g. Bachelor of Computer Science"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-gray-700">
            URL slug *
          </label>
          <input
            id="slug"
            required
            value={form.slug}
            onChange={(event) => {
              setSlugEdited(true);
              updateField("slug", makeSlug(event.target.value));
            }}
            placeholder="bachelor-of-computer-science"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            Public URL: /programs/{form.slug || "your-program-slug"}
          </p>
        </div>

        <div>
          <label htmlFor="degreeType" className="mb-1.5 block text-sm font-medium text-gray-700">
            Degree type *
          </label>
          <select
            id="degreeType"
            required
            value={form.degreeType}
            onChange={(event) => updateField("degreeType", event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {DEGREE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="mb-1.5 block text-sm font-medium text-gray-700">
            Duration
          </label>
          <input
            id="duration"
            value={form.duration}
            onChange={(event) => updateField("duration", event.target.value)}
            placeholder="e.g. 4 years"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label htmlFor="order" className="mb-1.5 block text-sm font-medium text-gray-700">
            Display order
          </label>
          <input
            id="order"
            type="number"
            value={form.order}
            onChange={(event) => updateField("order", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            Lower numbers appear first.
          </p>
        </div>

        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="shortDescription" className="mb-1.5 block text-sm font-medium text-gray-700">
          Short description
        </label>
        <textarea
          id="shortDescription"
          rows={3}
          value={form.shortDescription}
          onChange={(event) =>
            updateField("shortDescription", event.target.value)
          }
          placeholder="A short introduction to this program..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label htmlFor="eligibility" className="mb-1.5 block text-sm font-medium text-gray-700">
          Eligibility requirements
        </label>
        <textarea
          id="eligibility"
          rows={4}
          value={form.eligibility}
          onChange={(event) => updateField("eligibility", event.target.value)}
          placeholder="Enter admission and eligibility requirements..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => updateField("isFeatured", event.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          Feature this program
        </label>
      </div>
    </section>

    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Program image
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload or select the image used for this program.
        </p>
      </div>

      <ImageUploader
        value={form.image}
        onChange={(url) => updateField("image", url)}
        folder="programs"
      />
    </section>

    <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Scheme of studies
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add a year and upload its corresponding document for each entry.
          </p>
        </div>
        <button
          type="button"
          onClick={addScheme}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          + Add scheme
        </button>
      </div>

      {form.schemeOfStudies.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
          No schemes added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {form.schemeOfStudies.map((scheme, index) => (
            <div
              key={index}
              className="space-y-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">
                  Scheme {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeScheme(index)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <div>
                <label
                  htmlFor={`scheme-year-${index}`}
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Year *
                </label>
                <input
                  id={`scheme-year-${index}`}
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={scheme.year}
                  onChange={(event) =>
                    updateScheme(index, "year", event.target.value)
                  }
                  placeholder="e.g. 1"
                  className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Scheme document *
                </label>
                <FileUploader
                  value={scheme.fileUrl}
                  fileName={scheme.fileName}
                  folder="programs/schemes"
                  onChange={({ url, fileName }) => {
                    updateScheme(index, "fileUrl", url || "");
                    updateScheme(index, "fileName", fileName || "");
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        disabled={saving}
        onClick={() => router.push("/admin/programs")}
        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : isEdit
            ? "Save changes"
            : "Create program"}
      </button>
    </div>
  </form>
</div>

);
}