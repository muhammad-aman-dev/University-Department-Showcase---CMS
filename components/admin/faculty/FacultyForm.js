
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  X,
  ChevronDown,
  Search,
  BookOpen,
  FolderKanban,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "../media/ImageUploader";

const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Research Officer",
  "Visiting Faculty",
  "Lab Engineer",
  "Lab Instructor",
  "Teaching Assistant",
  "Other",
];

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

const emptyPublication = () => ({
  title: "",
  authors: "",
  journal: "",
  year: "",
  doi: "",
  url: "",
  type: "Journal Article",
});

const emptyProject = () => ({
  title: "",
  description: "",
  role: "",
  fundingAgency: "",
  startYear: "",
  endYear: "",
  status: "Ongoing",
  url: "",
});

const emptyBook = () => ({
  title: "",
  authors: "",
  publisher: "",
  year: "",
  isbn: "",
  url: "",
  type: "Book",
});

const asArray = (value) => (Array.isArray(value) ? value : []);

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function yearValue(value) {
  if (value === "" || value == null) return null;

  const year = Number(value);

  return Number.isInteger(year) && year >= 1000 && year <= 3000
    ? year
    : null;
}

function normalizeFaculty(faculty) {
  const data =
    faculty && typeof faculty === "object" && !Array.isArray(faculty)
      ? faculty
      : {};

  return {
    name: "",
    slug: "",
    designation: "Lecturer",
    qualification: "",
    specialization: "",
    researchInterests: [],
    email: "",
    phone: "",
    image: "",
    bio: "",
    office: "",
    publications: [],
    researchProjects: [],
    books: [],
    isHOD: false,
    isFeatured: false,
    status: "active",
    order: 0,
    ...data,

    researchInterests: asArray(data.researchInterests).filter(
      (item) => typeof item === "string"
    ),

    publications: asArray(data.publications)
      .filter(
        (item) =>
          item && typeof item === "object" && !Array.isArray(item)
      )
      .map((item) => ({
        ...emptyPublication(),
        ...item,
        year: item.year ?? "",
      })),

    researchProjects: asArray(data.researchProjects)
      .filter(
        (item) =>
          item && typeof item === "object" && !Array.isArray(item)
      )
      .map((item) => ({
        ...emptyProject(),
        ...item,
        startYear: item.startYear ?? "",
        endYear: item.endYear ?? "",
      })),

    books: asArray(data.books)
      .filter(
        (item) =>
          item && typeof item === "object" && !Array.isArray(item)
      )
      .map((item) => ({
        ...emptyBook(),
        ...item,
        year: item.year ?? "",
      })),
  };
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </Field>
  );
}

function TextArea({ label, value, onChange, placeholder = "" }) {
  return (
    <Field label={label}>
      <textarea
        rows={3}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} resize-y`}
      />
    </Field>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {asArray(options).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function Section({
  title,
  description,
  onAdd,
  addLabel,
  children,
  count,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
              open
                ? "bg-blue-950 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <ChevronDown
              size={17}
              className={`transition-transform ${
                open ? "" : "-rotate-90"
              }`}
            />
          </span>

          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-900">
              {title}

              {typeof count === "number" && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-900">
                  {count}
                </span>
              )}
            </span>

            {description && (
              <span className="mt-1 block text-xs leading-5 text-gray-500">
                {description}
              </span>
            )}
          </span>
        </button>

        {onAdd && (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              onAdd();
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-blue-950 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900 sm:self-center"
          >
            <Plus size={14} />
            {addLabel || "Add item"}
          </button>
        )}
      </div>

      {open && (
        <div className="space-y-4 p-4 sm:p-5">{children}</div>
      )}
    </section>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
    >
      <Trash2 size={14} />
      Remove
    </button>
  );
}

function EntryCard({
  title,
  subtitle,
  number,
  icon: Icon,
  children,
  onRemove,
  defaultOpen = false,
}) {
  return (
    <details
      key={number}
      open={defaultOpen || undefined}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 p-3.5 transition hover:bg-gray-50 sm:p-4 [&::-webkit-details-marker]:hidden">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-950">
          <Icon size={18} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-gray-900">
            {title || `${number}`}
          </span>

          <span className="mt-1 block truncate text-xs text-gray-500">
            {subtitle || "Complete the details below"}
          </span>
        </span>

        <span className="hidden text-xs font-medium text-blue-800 sm:block">
          Edit
        </span>

        <ChevronDown
          size={17}
          className="shrink-0 text-gray-500 transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="space-y-4 border-t border-gray-100 bg-gray-50/60 p-3.5 sm:p-4">
        <div className="flex justify-end">
          {onRemove && onRemove}
        </div>

        {children}
      </div>
    </details>
  );
}

export default function FacultyForm({ faculty, onSaved, onCancel }) {
  const [form, setForm] = useState(() => normalizeFaculty(faculty));
  const [interestInput, setInterestInput] = useState("");
  const [publicationSearch, setPublicationSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(normalizeFaculty(faculty));
    setInterestInput("");
    setPublicationSearch("");
  }, [faculty]);

  function update(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateEntry(field, index, key, value) {
    setForm((previous) => {
      const entries = asArray(previous[field]);

      return {
        ...previous,
        [field]: entries.map((entry, i) =>
          i === index ? { ...entry, [key]: value } : entry
        ),
      };
    });
  }

  function addInterest() {
    const value = interestInput.trim();

    if (!value) return;

    const interests = asArray(form.researchInterests);

    if (
      interests.some(
        (item) => item.toLowerCase() === value.toLowerCase()
      )
    ) {
      toast.error("This research interest already exists.");
      return;
    }

    update("researchInterests", [...interests, value]);
    setInterestInput("");
  }

  function validateEntries(entries, label) {
    for (const item of asArray(entries)) {
      if (!item.title?.trim()) {
        throw new Error(
          `${label} titles are required. Fill in or remove blank entries.`
        );
      }
    }
  }

  async function submit(event) {
    event.preventDefault();

    if (saving) return;

    if (!form.name?.trim()) {
      toast.error("Faculty name is required.");
      return;
    }

    try {
      const publications = asArray(form.publications);
      const projects = asArray(form.researchProjects);
      const books = asArray(form.books);
      const interests = asArray(form.researchInterests);

      validateEntries(publications, "Publication");
      validateEntries(projects, "Project");
      validateEntries(books, "Book");

      for (const project of projects) {
        if (
          project.startYear &&
          project.endYear &&
          Number(project.startYear) > Number(project.endYear)
        ) {
          throw new Error(
            "A project's start year cannot be later than its end year."
          );
        }
      }

      const payload = {
        ...form,
        name: form.name.trim(),
        slug: slugify(form.slug || form.name),
        email: (form.email || "").trim().toLowerCase(),
        phone: (form.phone || "").trim(),
        order: Number(form.order) || 0,

        researchInterests: interests
          .map((item) => item.trim())
          .filter(Boolean),

        publications: publications.map((item) => ({
          ...item,
          title: item.title.trim(),
          year: yearValue(item.year),
        })),

        researchProjects: projects.map((item) => ({
          ...item,
          title: item.title.trim(),
          startYear: yearValue(item.startYear),
          endYear: yearValue(item.endYear),
        })),

        books: books.map((item) => ({
          ...item,
          title: item.title.trim(),
          year: yearValue(item.year),
        })),
      };

      setSaving(true);

      const editing = Boolean(faculty?._id);

      const response = await fetch(
        editing
          ? `/api/admin/faculty/${faculty._id}`
          : "/api/admin/faculty",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response. Please check your API route."
        );
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to save faculty profile."
        );
      }

      toast.success(
        editing
          ? "Faculty profile updated."
          : "Faculty profile created."
      );

      if (typeof onSaved === "function") {
        onSaved(result.data);
      }
    } catch (error) {
      console.error("Faculty form submission error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save faculty profile."
      );
    } finally {
      setSaving(false);
    }
  }

  const interests = asArray(form.researchInterests);
  const publications = asArray(form.publications);
  const projects = asArray(form.researchProjects);
  const books = asArray(form.books);

  const filteredPublications = useMemo(() => {
    const query = publicationSearch.trim().toLowerCase();

    if (!query) {
      return publications.map((item, index) => ({ item, index }));
    }

    return publications
      .map((item, index) => ({ item, index }))
      .filter(({ item }) =>
        [
          item.title,
          item.authors,
          item.journal,
          item.year,
          item.doi,
          item.type,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          )
      );
  }, [publications, publicationSearch]);

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {faculty?._id ? "Edit Faculty Profile" : "Add Faculty Member"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage profile details, academic work, and publication records.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1.5">
            {publications.length} publications
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5">
            {projects.length} projects
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1.5">
            {books.length} books
          </span>
        </div>
      </div>

      <Section
        title="Basic Information"
        description="Name, designation, qualification, and profile image."
      >
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <ImageUploader
            value={form.image || ""}
            onChange={(value) => update("image", value)}
            folder="faculty"
            label="Profile Image"
            description="Use a clear professional portrait."
            aspect="aspect-[3/4]"
          />

          <div className="grid content-start gap-4 sm:grid-cols-2">
            <TextInput
              label="Full name"
              value={form.name}
              onChange={(value) => update("name", value)}
              placeholder="Dr. Ahmed Khan"
            />

            <TextInput
              label="Profile slug"
              value={form.slug}
              onChange={(value) => update("slug", slugify(value))}
              placeholder="dr-ahmed-khan"
            />

            <SelectInput
              label="Designation"
              value={form.designation}
              onChange={(value) => update("designation", value)}
              options={DESIGNATIONS}
            />

            <TextInput
              label="Qualification"
              value={form.qualification}
              onChange={(value) => update("qualification", value)}
              placeholder="PhD in Computer Science"
            />

            <div className="sm:col-span-2">
              <TextInput
                label="Expertise / specialization"
                value={form.specialization}
                onChange={(value) => update("specialization", value)}
                placeholder="Machine Learning, Computer Vision"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Research Interests"
        description="Add individual topics and remove them when needed."
        count={interests.length}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={interestInput}
            onChange={(event) => setInterestInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addInterest();
              }
            }}
            placeholder="e.g. Deep Learning"
            className={inputClass}
          />

          <button
            type="button"
            onClick={addInterest}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
          >
            <Plus size={15} />
            Add interest
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={`${interest}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-medium text-blue-950"
            >
              {interest}

              <button
                type="button"
                onClick={() =>
                  update(
                    "researchInterests",
                    interests.filter((_, i) => i !== index)
                  )
                }
                aria-label={`Remove ${interest}`}
                className="rounded-full p-0.5 hover:bg-blue-100"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>

        {interests.length === 0 && (
          <p className="text-sm text-gray-500">
            No research interests added yet.
          </p>
        )}
      </Section>

      <Section
        title="Publications"
        description="Search and edit journal articles, conference papers, and book chapters."
        count={publications.length}
        defaultOpen={false}
        onAdd={() =>
          update("publications", [...publications, emptyPublication()])
        }
        addLabel="Add publication"
      >
        {publications.length > 0 && (
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={publicationSearch}
              onChange={(event) =>
                setPublicationSearch(event.target.value)
              }
              placeholder="Search title, author, journal, year..."
              className={`${inputClass} pl-9`}
            />
            {publicationSearch && (
              <p className="mt-2 text-xs text-gray-500">
                Showing {filteredPublications.length} of{" "}
                {publications.length} publications
              </p>
            )}
          </div>
        )}

        {filteredPublications.map(({ item, index }) => (
          <EntryCard
            key={item._id || `publication-${index}`}
            number={`Publication ${index + 1}`}
            title={item.title}
            subtitle={[item.authors, item.journal, item.year]
              .filter(Boolean)
              .join(" · ")}
            icon={FileText}
            onRemove={
              <RemoveButton
                onClick={() =>
                  update(
                    "publications",
                    publications.filter((_, i) => i !== index)
                  )
                }
              />
            }
          >
            <TextInput
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateEntry("publications", index, "title", value)
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Authors"
                value={item.authors}
                onChange={(value) =>
                  updateEntry("publications", index, "authors", value)
                }
              />

              <TextInput
                label="Journal / conference"
                value={item.journal}
                onChange={(value) =>
                  updateEntry("publications", index, "journal", value)
                }
              />

              <TextInput
                label="Year"
                type="number"
                value={item.year}
                onChange={(value) =>
                  updateEntry("publications", index, "year", value)
                }
              />

              <SelectInput
                label="Type"
                value={item.type}
                onChange={(value) =>
                  updateEntry("publications", index, "type", value)
                }
                options={[
                  "Journal Article",
                  "Conference Paper",
                  "Book Chapter",
                  "Review Paper",
                  "Other",
                ]}
              />

              <TextInput
                label="DOI"
                value={item.doi}
                onChange={(value) =>
                  updateEntry("publications", index, "doi", value)
                }
              />

              <TextInput
                label="Publication URL"
                value={item.url}
                onChange={(value) =>
                  updateEntry("publications", index, "url", value)
                }
                placeholder="https://..."
              />
            </div>
          </EntryCard>
        ))}

        {filteredPublications.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <Search size={22} className="mx-auto text-gray-400" />
            <p className="mt-3 text-sm font-semibold text-gray-800">
              No matching publications
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Try a different search term.
            </p>
          </div>
        )}

        {publications.length === 0 && (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            No publications added yet. Use “Add publication” to start.
          </p>
        )}
      </Section>

      <Section
        title="Project / Research Development"
        description="Research projects, software, prototypes, and applied development work."
        count={projects.length}
        defaultOpen={false}
        onAdd={() =>
          update("researchProjects", [...projects, emptyProject()])
        }
        addLabel="Add project"
      >
        {projects.map((item, index) => (
          <EntryCard
            key={item._id || `project-${index}`}
            number={`Project ${index + 1}`}
            title={item.title}
            subtitle={[item.status, item.startYear, item.endYear]
              .filter(Boolean)
              .join(" · ")}
            icon={FolderKanban}
            onRemove={
              <RemoveButton
                onClick={() =>
                  update(
                    "researchProjects",
                    projects.filter((_, i) => i !== index)
                  )
                }
              />
            }
          >
            <TextInput
              label="Project title"
              value={item.title}
              onChange={(value) =>
                updateEntry("researchProjects", index, "title", value)
              }
            />

            <TextArea
              label="Description"
              value={item.description}
              onChange={(value) =>
                updateEntry(
                  "researchProjects",
                  index,
                  "description",
                  value
                )
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Faculty role"
                value={item.role}
                onChange={(value) =>
                  updateEntry("researchProjects", index, "role", value)
                }
              />

              <TextInput
                label="Funding agency"
                value={item.fundingAgency}
                onChange={(value) =>
                  updateEntry(
                    "researchProjects",
                    index,
                    "fundingAgency",
                    value
                  )
                }
              />

              <TextInput
                label="Start year"
                type="number"
                value={item.startYear}
                onChange={(value) =>
                  updateEntry(
                    "researchProjects",
                    index,
                    "startYear",
                    value
                  )
                }
              />

              <TextInput
                label="End year"
                type="number"
                value={item.endYear}
                onChange={(value) =>
                  updateEntry(
                    "researchProjects",
                    index,
                    "endYear",
                    value
                  )
                }
              />

              <SelectInput
                label="Status"
                value={item.status}
                onChange={(value) =>
                  updateEntry("researchProjects", index, "status", value)
                }
                options={["Ongoing", "Completed", "Proposed"]}
              />

              <TextInput
                label="Project URL"
                value={item.url}
                onChange={(value) =>
                  updateEntry("researchProjects", index, "url", value)
                }
                placeholder="https://..."
              />
            </div>
          </EntryCard>
        ))}

        {projects.length === 0 && (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            No projects added yet.
          </p>
        )}
      </Section>

      <Section
        title="Books & Book Chapters"
        description="Books authored, edited books, and published chapters."
        count={books.length}
        defaultOpen={false}
        onAdd={() => update("books", [...books, emptyBook()])}
        addLabel="Add book"
      >
        {books.map((item, index) => (
          <EntryCard
            key={item._id || `book-${index}`}
            number={`Book ${index + 1}`}
            title={item.title}
            subtitle={[item.authors, item.publisher, item.year]
              .filter(Boolean)
              .join(" · ")}
            icon={BookOpen}
            onRemove={
              <RemoveButton
                onClick={() =>
                  update(
                    "books",
                    books.filter((_, i) => i !== index)
                  )
                }
              />
            }
          >
            <TextInput
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateEntry("books", index, "title", value)
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Authors"
                value={item.authors}
                onChange={(value) =>
                  updateEntry("books", index, "authors", value)
                }
              />

              <TextInput
                label="Publisher"
                value={item.publisher}
                onChange={(value) =>
                  updateEntry("books", index, "publisher", value)
                }
              />

              <TextInput
                label="Year"
                type="number"
                value={item.year}
                onChange={(value) =>
                  updateEntry("books", index, "year", value)
                }
              />

              <TextInput
                label="ISBN"
                value={item.isbn}
                onChange={(value) =>
                  updateEntry("books", index, "isbn", value)
                }
              />

              <SelectInput
                label="Type"
                value={item.type}
                onChange={(value) =>
                  updateEntry("books", index, "type", value)
                }
                options={["Book", "Book Chapter", "Edited Book"]}
              />

              <TextInput
                label="Book URL"
                value={item.url}
                onChange={(value) =>
                  updateEntry("books", index, "url", value)
                }
                placeholder="https://..."
              />
            </div>
          </EntryCard>
        ))}

        {books.length === 0 && (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            No books added yet.
          </p>
        )}
      </Section>

      <Section
        title="Contact & Biography"
        description="Optional public profile details."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => update("email", value)}
          />

          <TextInput
            label="Phone"
            value={form.phone}
            onChange={(value) => update("phone", value)}
          />

          <TextInput
            label="Office"
            value={form.office}
            onChange={(value) => update("office", value)}
          />

          <TextInput
            label="Display order"
            type="number"
            value={form.order}
            onChange={(value) => update("order", value)}
          />
        </div>

        <TextArea
          label="Biography"
          value={form.bio}
          onChange={(value) => update("bio", value)}
        />
      </Section>

      <Section title="Publication Settings" description="Visibility and faculty status.">
        <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(form.isHOD)}
            onChange={(event) => update("isHOD", event.target.checked)}
            className="h-4 w-4 accent-blue-950"
          />
          <span>
            <span className="block font-semibold text-gray-900">
              Head of Department
            </span>
            <span className="mt-0.5 block text-xs text-gray-500">
              Mark this faculty member as HOD.
            </span>
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(form.isFeatured)}
            onChange={(event) =>
              update("isFeatured", event.target.checked)
            }
            className="h-4 w-4 accent-blue-950"
          />
          <span>
            <span className="block font-semibold text-gray-900">
              Featured faculty
            </span>
            <span className="mt-0.5 block text-xs text-gray-500">
              Highlight this member where featured profiles are displayed.
            </span>
          </span>
        </label>

        <SelectInput
          label="Status"
          value={form.status}
          onChange={(value) => update("status", value)}
          options={["active", "inactive"]}
        />
      </Section>

      <div className="sticky z-10 -bottom-7 -mx-1 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white/95 px-1 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          <X size={16} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:opacity-60"
        >
          <Save size={16} />
          {saving
            ? "Saving..."
            : faculty?._id
              ? "Save Changes"
              : "Add Faculty Member"}
        </button>
      </div>
    </form>
  );
}
