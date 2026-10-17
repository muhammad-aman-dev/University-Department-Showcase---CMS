
"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  FileText,
  History,
  Target,
  Building2,
  Eye,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "../media/ImageUploader";

const defaultData = {
  title: "About the Department",
  introduction: "",
  history: {
    title: "History",
    content: "",
    image: "",
  },
  vision: "",
  mission: "",
  objectives: [],
  scope: "",
  facilities: [],
  pageImage: "",
};

function SectionHeader({
  icon: Icon,
  title,
  description,
  open,
  onToggle,
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 bg-gray-50/50 px-6 py-4 text-left transition hover:bg-gray-50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-gray-900">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-xs text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:text-gray-700">
        {open ? (
          <ChevronUp size={17} />
        ) : (
          <ChevronDown size={17} />
        )}
      </div>
    </button>
  );
}

function FieldLabel({ children, optional = false }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
      {children}

      {optional && (
        <span className="ml-1 font-normal text-gray-400">
          (optional)
        </span>
      )}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 5,
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
    />
  );
}

export default function AboutEditor() {
  const [formData, setFormData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [openSections, setOpenSections] = useState({
    general: true,
    introduction: true,
    history: true,
    visionMission: true,
    objectives: true,
    scope: true,
    facilities: true,
  });

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/about", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to load About page"
        );
      }

      const data = result.data || {};

      setFormData({
        title: data.title || "About the Department",
        introduction: data.introduction || "",

        history: {
          title: data.history?.title || "History",
          content: data.history?.content || "",
          image: data.history?.image || "",
        },

        vision: data.vision || "",
        mission: data.mission || "",

        objectives: Array.isArray(data.objectives)
          ? data.objectives
          : [],

        scope: data.scope || "",

        facilities: Array.isArray(data.facilities)
          ? [...data.facilities]
              .sort(
                (a, b) =>
                  (a.order || 0) - (b.order || 0)
              )
              .map((facility, index) => ({
                title: facility.title || "",
                description: facility.description || "",
                image: facility.image || "",
                order:
                  typeof facility.order === "number"
                    ? facility.order
                    : index,
              }))
          : [],

        pageImage: data.pageImage || "",
      });
    } catch (error) {
      console.error("Load about page error:", error);

      toast.error(
        error.message || "Failed to load About page"
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleSection(section) {
    setOpenSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  }

  function updateField(field, value) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateHistory(field, value) {
    setFormData((previous) => ({
      ...previous,
      history: {
        ...previous.history,
        [field]: value,
      },
    }));
  }

  function addObjective() {
    setFormData((previous) => ({
      ...previous,
      objectives: [...previous.objectives, ""],
    }));
  }

  function updateObjective(index, value) {
    setFormData((previous) => {
      const objectives = [...previous.objectives];
      objectives[index] = value;

      return {
        ...previous,
        objectives,
      };
    });
  }

  function removeObjective(index) {
    setFormData((previous) => ({
      ...previous,
      objectives: previous.objectives.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  function addFacility() {
    setFormData((previous) => ({
      ...previous,
      facilities: [
        ...previous.facilities,
        {
          title: "",
          description: "",
          image: "",
          order: previous.facilities.length,
        },
      ],
    }));
  }

  function updateFacility(index, field, value) {
    setFormData((previous) => {
      const facilities = [...previous.facilities];

      facilities[index] = {
        ...facilities[index],
        [field]: value,
      };

      return {
        ...previous,
        facilities,
      };
    });
  }

  function removeFacility(index) {
    setFormData((previous) => ({
      ...previous,
      facilities: previous.facilities
        .filter((_, itemIndex) => itemIndex !== index)
        .map((facility, itemIndex) => ({
          ...facility,
          order: itemIndex,
        })),
    }));
  }

  function moveFacility(index, direction) {
    setFormData((previous) => {
      const facilities = [...previous.facilities];

      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= facilities.length
      ) {
        return previous;
      }

      [
        facilities[index],
        facilities[targetIndex],
      ] = [
        facilities[targetIndex],
        facilities[index],
      ];

      return {
        ...previous,
        facilities: facilities.map(
          (facility, itemIndex) => ({
            ...facility,
            order: itemIndex,
          })
        ),
      };
    });
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Page title is required.");
      return;
    }

    const objectives = formData.objectives
      .map((objective) => objective.trim())
      .filter(Boolean);

    const facilities = formData.facilities
      .map((facility, index) => ({
        title: facility.title?.trim() || "",
        description: facility.description?.trim() || "",
        image: facility.image?.trim() || "",
        order: index,
      }))
      .filter((facility) => facility.title);

    const payload = {
      title: formData.title.trim(),
      introduction: formData.introduction.trim(),

      history: {
        title: formData.history.title?.trim() || "History",
        content: formData.history.content?.trim() || "",
        image: formData.history.image?.trim() || "",
      },

      vision: formData.vision.trim(),
      mission: formData.mission.trim(),
      objectives,
      scope: formData.scope.trim(),
      facilities,
      pageImage: formData.pageImage.trim(),
    };

    try {
      setSaving(true);

      const response = await fetch("/api/admin/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to save About page"
        );
      }

      const saved = result.data || {};

      setFormData({
        title: saved.title || payload.title,
        introduction:
          saved.introduction || payload.introduction,

        history: {
          title:
            saved.history?.title || payload.history.title,
          content:
            saved.history?.content || payload.history.content,
          image:
            saved.history?.image || payload.history.image,
        },

        vision: saved.vision ?? payload.vision,
        mission: saved.mission ?? payload.mission,

        objectives: Array.isArray(saved.objectives)
          ? saved.objectives
          : objectives,

        scope: saved.scope ?? payload.scope,

        facilities: Array.isArray(saved.facilities)
          ? [...saved.facilities].sort(
              (a, b) =>
                (a.order || 0) - (b.order || 0)
            )
          : facilities,

        pageImage: saved.pageImage ?? payload.pageImage,
      });

      toast.success("About page updated successfully.");
    } catch (error) {
      console.error("Save about page error:", error);

      toast.error(
        error.message || "Failed to save About page."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl pb-12">
        <div className="flex min-h-100 items-center justify-center">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
            <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

            <p className="text-sm font-medium text-gray-600">
              Loading About page settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="mx-auto max-w-5xl space-y-6 pb-12"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-xl font-bold tracking-tight text-gray-900">
            About Page Management
          </h1>

          <p className="mt-0.5 text-xs text-gray-500">
            Manage the content and sections displayed on the
            public About Department page.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          <SectionHeader
            icon={FileText}
            title="General"
            description="Page title and main page image"
            open={openSections.general}
            onToggle={() => toggleSection("general")}
          />

          {openSections.general && (
            <div className="border-t border-gray-100 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel>Page Title</FieldLabel>

                  <TextInput
                    value={formData.title}
                    onChange={(value) =>
                      updateField("title", value)
                    }
                    placeholder="About the Department"
                  />
                </div>

                <ImageUploader
                  value={formData.pageImage}
                  onChange={(value) =>
                    updateField("pageImage", value)
                  }
                  folder="about/page"
                  label="Page Image"
                  description="Used as the main About page hero image."
                  aspect="aspect-[16/7]"
                />
              </div>
            </div>
          )}
        </section>

        {/* Introduction */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          <SectionHeader
            icon={FileText}
            title="Introduction"
            description="Main introductory content"
            open={openSections.introduction}
            onToggle={() => toggleSection("introduction")}
          />

          {openSections.introduction && (
            <div className="border-t border-gray-100 p-6">
              <FieldLabel>Introduction</FieldLabel>

              <TextArea
                value={formData.introduction}
                onChange={(value) =>
                  updateField("introduction", value)
                }
                placeholder="Write an introduction to the department..."
                rows={8}
              />

              <p className="mt-2 text-xs text-gray-400">
                This content appears near the beginning of the
                public About page.
              </p>
            </div>
          )}
        </section>

        {/* History */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          <SectionHeader
            icon={History}
            title="History"
            description="Department history and supporting image"
            open={openSections.history}
            onToggle={() => toggleSection("history")}
          />

          {openSections.history && (
            <div className="space-y-5 border-t border-gray-100 p-6">
              <div>
                <FieldLabel>Section Title</FieldLabel>

                <TextInput
                  value={formData.history.title}
                  onChange={(value) =>
                    updateHistory("title", value)
                  }
                  placeholder="History"
                />
              </div>

              <div>
                <FieldLabel>History Content</FieldLabel>

                <TextArea
                  value={formData.history.content}
                  onChange={(value) =>
                    updateHistory("content", value)
                  }
                  placeholder="Describe the history of the department..."
                  rows={10}
                />
              </div>

              <div className="max-w-md">
                <ImageUploader
                  value={formData.history.image}
                  onChange={(value) =>
                    updateHistory("image", value)
                  }
                  folder="about/history"
                  label="History Image"
                  description="Optional image displayed alongside the history."
                  aspect="aspect-[4/3]"
                />
              </div>
            </div>
          )}
        </section>

        {/* Vision & Mission */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          <SectionHeader
            icon={Compass}
            title="Vision & Mission"
            description="Department vision and mission"
            open={openSections.visionMission}
            onToggle={() => toggleSection("visionMission")}
          />

          {openSections.visionMission && (
            <div className="grid gap-5 border-t border-gray-100 p-6 md:grid-cols-2">
              <div>
                <FieldLabel>Vision</FieldLabel>

                <TextArea
                  value={formData.vision}
                  onChange={(value) =>
                    updateField("vision", value)
                  }
                  placeholder="Describe the department's vision..."
                  rows={8}
                />
              </div>

              <div>
                <FieldLabel>Mission</FieldLabel>

                <TextArea
                  value={formData.mission}
                  onChange={(value) =>
                    updateField("mission", value)
                  }
                  placeholder="Describe the department's mission..."
                  rows={8}
                />
              </div>
            </div>
          )}
        </section>

        {/* Objectives */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          <SectionHeader
            icon={Target}
            title="Objectives"
            description="Manage department objectives"
            open={openSections.objectives}
            onToggle={() => toggleSection("objectives")}
          />

          {openSections.objectives && (
            <div className="border-t border-gray-100 p-6">
              <div className="space-y-3">
                {formData.objectives.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                    <Target
                      size={28}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-2 text-sm font-medium text-gray-500">
                      No objectives added yet.
                    </p>
                  </div>
                )}

                {formData.objectives.map((objective, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4"
                  >
                    <div className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white font-mono text-xs font-bold text-gray-600 ring-1 ring-gray-200">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="mb-1.5 text-xs font-semibold text-gray-700">
                        Objective {index + 1}
                      </p>

                      <textarea
                        value={objective}
                        onChange={(event) =>
                          updateObjective(index, event.target.value)
                        }
                        rows={2}
                        placeholder="Enter objective..."
                        className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-relaxed outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      title="Remove objective"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addObjective}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Plus size={15} />
                Add Objective
              </button>
            </div>
          )}
        </section>

        {/* Scope */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          <SectionHeader
            icon={Eye}
            title="Scope"
            description="Department scope and academic reach"
            open={openSections.scope}
            onToggle={() => toggleSection("scope")}
          />

          {openSections.scope && (
            <div className="border-t border-gray-100 p-6">
              <FieldLabel>Scope</FieldLabel>

              <TextArea
                value={formData.scope}
                onChange={(value) =>
                  updateField("scope", value)
                }
                placeholder="Describe the scope of the department..."
                rows={8}
              />
            </div>
          )}
        </section>

        {/* Facilities */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
          <SectionHeader
            icon={Building2}
            title="Facilities"
            description="Manage department facilities and resources"
            open={openSections.facilities}
            onToggle={() => toggleSection("facilities")}
          />

          {openSections.facilities && (
            <div className="border-t border-gray-100 p-6">
              <div className="space-y-4">
                {formData.facilities.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
                    <Building2
                      size={30}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-2 text-sm font-medium text-gray-600">
                      No facilities added yet.
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Add facilities such as laboratories,
                      libraries, classrooms, or research centers.
                    </p>
                  </div>
                )}

                {formData.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    {/* Facility Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-xs font-bold text-blue-700">
                          {index + 1}
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            Facility {index + 1}
                          </h3>

                          <p className="text-xs text-gray-500">
                            Manage facility details and image
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveFacility(index, "up")}
                          disabled={index === 0}
                          className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => moveFacility(index, "down")}
                          disabled={
                            index === formData.facilities.length - 1
                          }
                          className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFacility(index)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          title="Remove facility"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
                      <div>
                        <FieldLabel>Facility Title</FieldLabel>

                        <TextInput
                          value={facility.title}
                          onChange={(value) =>
                            updateFacility(index, "title", value)
                          }
                          placeholder="e.g. Software Engineering Lab"
                        />
                      </div>

                      <ImageUploader
                        value={facility.image}
                        onChange={(value) =>
                          updateFacility(index, "image", value)
                        }
                        folder="about/facilities"
                        label="Facility Image"
                        aspect="aspect-[16/10]"
                      />

                      <div className="lg:col-span-2">
                        <FieldLabel>Description</FieldLabel>

                        <TextArea
                          value={facility.description}
                          onChange={(value) =>
                            updateFacility(
                              index,
                              "description",
                              value
                            )
                          }
                          placeholder="Describe this facility..."
                          rows={5}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addFacility}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Plus size={15} />
                Add Facility
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Bottom Save Bar */}
      <div className=" bottom-0 z-20 mt-6 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <p className="hidden text-xs text-gray-500 sm:block">
            Changes are saved to the public About page.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="ml-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
