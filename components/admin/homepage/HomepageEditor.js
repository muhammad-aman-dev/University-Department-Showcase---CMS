"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import { toast } from "sonner";

import ImageUploader from "@/components/admin/media/ImageUploader";

const defaultData = {
  hero: {
    title: "",
    subtitle: "",
    description: "",
    images: [],
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
  },

  introduction: {
    title: "",
    content: "",
    image: "",
  },

  hodMessage: {
    name: "",
    designation: "Head of Department",
    image: "",
    message: "",
  },

  vision: "",
  mission: "",
  objectives: [],
  scope: "",

  statistics: [],

  showProjects: true,
  showAchievements: true,
  showNews: true,
  showEvents: true,
  showNotices: true,
};

export default function HomepageEditor() {
  const [formData, setFormData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHomepage();
  }, []);

  async function loadHomepage() {
    try {
      const response = await fetch("/api/admin/homepage", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load homepage"
        );
      }

      const data = result.data || {};

      setFormData({
        ...defaultData,
        ...data,

        hero: {
          ...defaultData.hero,
          ...(data.hero || {}),
          images: Array.isArray(data.hero?.images)
            ? data.hero.images
            : [],
        },

        introduction: {
          ...defaultData.introduction,
          ...(data.introduction || {}),
        },

        hodMessage: {
          ...defaultData.hodMessage,
          ...(data.hodMessage || {}),
        },

        objectives: Array.isArray(data.objectives)
          ? data.objectives
          : [],

        statistics: Array.isArray(data.statistics)
          ? data.statistics
          : [],

        showProjects:
          typeof data.showProjects === "boolean"
            ? data.showProjects
            : defaultData.showProjects,

        showAchievements:
          typeof data.showAchievements === "boolean"
            ? data.showAchievements
            : defaultData.showAchievements,

        showNews:
          typeof data.showNews === "boolean"
            ? data.showNews
            : defaultData.showNews,

        showEvents:
          typeof data.showEvents === "boolean"
            ? data.showEvents
            : defaultData.showEvents,

        showNotices:
          typeof data.showNotices === "boolean"
            ? data.showNotices
            : defaultData.showNotices,
      });
    } catch (error) {
      console.error("Load homepage error:", error);

      toast.error(
        error.message || "Failed to load homepage"
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateNestedField(section, field, value) {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }

  function addHeroImage() {
    setFormData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: [
          ...prev.hero.images,
          {
            url: "",
            order: prev.hero.images.length,
            isActive: true,
          },
        ],
      },
    }));
  }

  function updateHeroImage(index, field, value) {
    setFormData((prev) => {
      const images = [...prev.hero.images];

      images[index] = {
        ...images[index],
        [field]: value,
      };

      return {
        ...prev,
        hero: {
          ...prev.hero,
          images,
        },
      };
    });
  }

  function removeHeroImage(index) {
    setFormData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        images: prev.hero.images
          .filter((_, imageIndex) => imageIndex !== index)
          .map((image, newIndex) => ({
            ...image,
            order: newIndex,
          })),
      },
    }));
  }

  function addObjective() {
    setFormData((prev) => ({
      ...prev,
      objectives: [...prev.objectives, ""],
    }));
  }

  function updateObjective(index, value) {
    setFormData((prev) => {
      const objectives = [...prev.objectives];

      objectives[index] = value;

      return {
        ...prev,
        objectives,
      };
    });
  }

  function removeObjective(index) {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter(
        (_, objectiveIndex) => objectiveIndex !== index
      ),
    }));
  }

  function addStatistic() {
    setFormData((prev) => ({
      ...prev,
      statistics: [
        ...prev.statistics,
        {
          label: "",
          value: "",
          order: prev.statistics.length,
        },
      ],
    }));
  }

  function updateStatistic(index, field, value) {
    setFormData((prev) => {
      const statistics = [...prev.statistics];

      statistics[index] = {
        ...statistics[index],
        [field]: value,
      };

      return {
        ...prev,
        statistics,
      };
    });
  }

  function removeStatistic(index) {
    setFormData((prev) => ({
      ...prev,
      statistics: prev.statistics
        .filter((_, statisticIndex) => statisticIndex !== index)
        .map((statistic, newIndex) => ({
          ...statistic,
          order: newIndex,
        })),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    try {
      const cleanedData = {
        ...formData,

        hero: {
          ...formData.hero,

          images: formData.hero.images
            .filter((image) => image.url?.trim())
            .map((image, index) => ({
              ...image,
              order: index,
            })),
        },

        objectives: formData.objectives
          .map((objective) => objective.trim())
          .filter(Boolean),

        statistics: formData.statistics
          .filter(
            (statistic) =>
              statistic.label?.trim() &&
              statistic.value?.trim()
          )
          .map((statistic, index) => ({
            ...statistic,
            label: statistic.label.trim(),
            value: statistic.value.trim(),
            order: index,
          })),

        showProjects: Boolean(formData.showProjects),
        showAchievements: Boolean(
          formData.showAchievements
        ),
        showNews: Boolean(formData.showNews),
        showEvents: Boolean(formData.showEvents),
        showNotices: Boolean(formData.showNotices),
      };

      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save homepage"
        );
      }

      const savedData = result.data || cleanedData;

      setFormData({
        ...defaultData,
        ...savedData,

        hero: {
          ...defaultData.hero,
          ...(savedData.hero || {}),
          images: Array.isArray(savedData.hero?.images)
            ? savedData.hero.images
            : [],
        },

        introduction: {
          ...defaultData.introduction,
          ...(savedData.introduction || {}),
        },

        hodMessage: {
          ...defaultData.hodMessage,
          ...(savedData.hodMessage || {}),
        },

        objectives: Array.isArray(savedData.objectives)
          ? savedData.objectives
          : [],

        statistics: Array.isArray(savedData.statistics)
          ? savedData.statistics
          : [],

        showProjects:
          typeof savedData.showProjects === "boolean"
            ? savedData.showProjects
            : defaultData.showProjects,

        showAchievements:
          typeof savedData.showAchievements === "boolean"
            ? savedData.showAchievements
            : defaultData.showAchievements,

        showNews:
          typeof savedData.showNews === "boolean"
            ? savedData.showNews
            : defaultData.showNews,

        showEvents:
          typeof savedData.showEvents === "boolean"
            ? savedData.showEvents
            : defaultData.showEvents,

        showNotices:
          typeof savedData.showNotices === "boolean"
            ? savedData.showNotices
            : defaultData.showNotices,
      });

      toast.success("Homepage updated successfully");
    } catch (error) {
      console.error("Save homepage error:", error);

      toast.error(
        error.message || "Failed to save homepage"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-gray-600">
            Loading homepage settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 font-sans">
              Homepage Management
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage the content and sections displayed on the public homepage.
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
          <Section
            title="Hero Section"
            description="Manage the main homepage hero content and carousel images."
          >
            <div className="space-y-5">
              <Input
                label="Hero Title"
                value={formData.hero.title}
                onChange={(value) =>
                  updateNestedField("hero", "title", value)
                }
                placeholder="Department of Computer Science"
              />

              <Input
                label="Subtitle"
                value={formData.hero.subtitle}
                onChange={(value) =>
                  updateNestedField("hero", "subtitle", value)
                }
                placeholder="Innovating the Future Through Computing"
              />

              <Textarea
                label="Description"
                value={formData.hero.description}
                onChange={(value) =>
                  updateNestedField("hero", "description", value)
                }
                rows={4}
                placeholder="Enter the hero description..."
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Primary Button Text"
                  value={formData.hero.primaryButtonText}
                  onChange={(value) =>
                    updateNestedField("hero", "primaryButtonText", value)
                  }
                  placeholder="Explore Programs"
                />

                <Input
                  label="Primary Button URL"
                  value={formData.hero.primaryButtonUrl}
                  onChange={(value) =>
                    updateNestedField("hero", "primaryButtonUrl", value)
                  }
                  placeholder="/programs"
                />

                <Input
                  label="Secondary Button Text"
                  value={formData.hero.secondaryButtonText}
                  onChange={(value) =>
                    updateNestedField("hero", "secondaryButtonText", value)
                  }
                  placeholder="Contact Us"
                />

                <Input
                  label="Secondary Button URL"
                  value={formData.hero.secondaryButtonUrl}
                  onChange={(value) =>
                    updateNestedField("hero", "secondaryButtonUrl", value)
                  }
                  placeholder="/contact"
                />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Hero Carousel Images
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Upload multiple images for the hero carousel.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addHeroImage}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Plus size={15} />
                    Add Image
                  </button>
                </div>

                {formData.hero.images.length === 0 ? (
                  <EmptyState text="No hero images added yet." />
                ) : (
                  <div className="space-y-4">
                    {formData.hero.images.map((image, index) => (
                      <div
                        key={`${image.url}-${index}`}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical size={16} className="text-gray-400" />
                            <span className="text-xs font-semibold text-gray-800">
                              Slide {index + 1}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeHeroImage(index)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>

                        <div className="max-w-md">
                          <ImageUploader
                            label={`Hero Image ${index + 1}`}
                            description="Upload a high-quality image for the hero carousel."
                            value={image.url}
                            onChange={(value) =>
                              updateHeroImage(index, "url", value)
                            }
                            folder="homepage/hero"
                            aspect="aspect-video"
                          />
                        </div>

                        <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700">
                          <input
                            type="checkbox"
                            checked={image.isActive !== false}
                            onChange={(event) =>
                              updateHeroImage(
                                index,
                                "isActive",
                                event.target.checked
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          Active slide
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Section>

          <Section
            title="Department Introduction"
            description="Manage the department introduction displayed on the homepage."
          >
            <div className="space-y-5">
              <Input
                label="Title"
                value={formData.introduction.title}
                onChange={(value) =>
                  updateNestedField("introduction", "title", value)
                }
                placeholder="Welcome to the Department"
              />

              <Textarea
                label="Content"
                value={formData.introduction.content}
                onChange={(value) =>
                  updateNestedField("introduction", "content", value)
                }
                rows={6}
                placeholder="Write the department introduction..."
              />

              <div className="max-w-md">
                <ImageUploader
                  label="Introduction Image"
                  description="Upload an image for the department introduction section."
                  value={formData.introduction.image}
                  onChange={(value) =>
                    updateNestedField("introduction", "image", value)
                  }
                  folder="homepage/introduction"
                  aspect="aspect-[4/3]"
                />
              </div>
            </div>
          </Section>

          <Section
            title="Head of Department Message"
            description="Manage the HOD information and message displayed on the homepage."
          >
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Name"
                  value={formData.hodMessage.name}
                  onChange={(value) =>
                    updateNestedField("hodMessage", "name", value)
                  }
                  placeholder="Dr. John Doe"
                />

                <Input
                  label="Designation"
                  value={formData.hodMessage.designation}
                  onChange={(value) =>
                    updateNestedField("hodMessage", "designation", value)
                  }
                  placeholder="Head of Department"
                />
              </div>

              <div className="max-w-xs">
                <ImageUploader
                  label="HOD Image"
                  description="Upload the current Head of Department's photo."
                  value={formData.hodMessage.image}
                  onChange={(value) =>
                    updateNestedField("hodMessage", "image", value)
                  }
                  folder="homepage/hod"
                  aspect="aspect-square"
                />
              </div>

              <Textarea
                label="Message"
                value={formData.hodMessage.message}
                onChange={(value) =>
                  updateNestedField("hodMessage", "message", value)
                }
                rows={7}
                placeholder="Write the HOD message..."
              />
            </div>
          </Section>

          <Section
            title="Vision"
            description="Define the department's vision."
          >
            <Textarea
              label="Vision"
              value={formData.vision}
              onChange={(value) => updateField("vision", value)}
              rows={5}
              placeholder="Enter department vision..."
            />
          </Section>

          <Section
            title="Mission"
            description="Define the department's mission."
          >
            <Textarea
              label="Mission"
              value={formData.mission}
              onChange={(value) => updateField("mission", value)}
              rows={5}
              placeholder="Enter department mission..."
            />
          </Section>

          <Section
            title="Objectives"
            description="Add and manage the main objectives of the department."
            action={
              <button
                type="button"
                onClick={addObjective}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Plus size={15} />
                Add Objective
              </button>
            }
          >
            <div className="space-y-3">
              {formData.objectives.length === 0 ? (
                <EmptyState text="No objectives added yet." />
              ) : (
                formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 font-mono">
                      0{index + 1}
                    </div>

                    <input
                      type="text"
                      value={objective}
                      onChange={(event) =>
                        updateObjective(index, event.target.value)
                      }
                      placeholder="Enter objective..."
                      className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />

                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      title="Remove objective"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Section>

          <Section
            title="Scope"
            description="Describe the academic and professional scope of the department."
          >
            <Textarea
              label="Scope"
              value={formData.scope}
              onChange={(value) => updateField("scope", value)}
              rows={6}
              placeholder="Enter department scope..."
            />
          </Section>

          <Section
            title="Homepage Statistics"
            description="Manage statistics displayed on the homepage."
            action={
              <button
                type="button"
                onClick={addStatistic}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Plus size={15} />
                Add Statistic
              </button>
            }
          >
            <div className="space-y-3">
              {formData.statistics.length === 0 ? (
                <EmptyState text="No statistics added yet." />
              ) : (
                formData.statistics.map((statistic, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4"
                  >
                    <div className="grid flex-1 gap-3 md:grid-cols-2">
                      <Input
                        label="Value"
                        value={statistic.value}
                        onChange={(value) =>
                          updateStatistic(index, "value", value)
                        }
                        placeholder="500+"
                      />

                      <Input
                        label="Label"
                        value={statistic.label}
                        onChange={(value) =>
                          updateStatistic(index, "label", value)
                        }
                        placeholder="Students"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeStatistic(index)}
                      className="self-end mb-1 rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      title="Remove statistic"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Section>

          <Section
            title="Homepage Section Visibility"
            description="Choose which dynamic sections should appear on the public homepage."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <VisibilityToggle
                label="Student Projects"
                checked={formData.showProjects}
                onChange={(value) => updateField("showProjects", value)}
              />

              <VisibilityToggle
                label="Achievements"
                checked={formData.showAchievements}
                onChange={(value) => updateField("showAchievements", value)}
              />

              <VisibilityToggle
                label="News"
                checked={formData.showNews}
                onChange={(value) => updateField("showNews", value)}
              />

              <VisibilityToggle
                label="Events"
                checked={formData.showEvents}
                onChange={(value) => updateField("showEvents", value)}
              />

              <VisibilityToggle
                label="Notices"
                checked={formData.showNotices}
                onChange={(value) => updateField("showNotices", value)}
              />
            </div>
          </Section>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ title, description, action, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
        <div>
          <h2 className="text-sm font-bold text-gray-900 font-sans">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-gray-400"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder = "", rows = 5 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}
      </span>
      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 leading-relaxed outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-gray-400"
      />
    </label>
  );
}

function VisibilityToggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:bg-gray-50/50">
      <span className="text-xs font-semibold text-gray-800">
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-500 bg-gray-50/30">
      {text}
    </div>
  );
}