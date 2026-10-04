"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import ImageUploader from "@/components/admin/media/ImageUploader";

const defaultData = {
  universityName: "",
  departmentName: "Department of Computer Science",
  facultyName: "",

  logo: "",
  favicon: "",

  email: "",
  phone: "",
  address: "",
  websiteUrl: "",

  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    twitter: "",
  },

  footerDescription: "",
  copyrightText: "",

  seo: {
    title: "",
    description: "",
    keywords: [],
    ogImage: "",
  },
};

export default function SiteSettingsEditor() {
  const [formData, setFormData] = useState(defaultData);

  // Separate text state for the keyword input.
  // This is the important fix.
  const [keywordInput, setKeywordInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await fetch("/api/admin/settings", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load site settings"
        );
      }

      const data = result.data || {};

      const keywords = Array.isArray(data.seo?.keywords)
        ? data.seo.keywords
        : [];

      setFormData({
        ...defaultData,
        ...data,

        socialLinks: {
          ...defaultData.socialLinks,
          ...(data.socialLinks || {}),
        },

        seo: {
          ...defaultData.seo,
          ...(data.seo || {}),
          keywords,
        },
      });

      // Convert database array to text for the input.
      setKeywordInput(keywords.join(", "));
    } catch (error) {
      console.error("Load settings error:", error);

      toast.error(
        error.message || "Failed to load site settings"
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

  function updateSocial(field, value) {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value,
      },
    }));
  }

  function updateSeo(field, value) {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    try {
      // Convert keyword text into an array ONLY when saving.
      const keywords = keywordInput
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      const cleanedData = {
        ...formData,

        universityName: formData.universityName.trim(),
        departmentName: formData.departmentName.trim(),
        facultyName: formData.facultyName.trim(),

        logo: formData.logo.trim(),
        favicon: formData.favicon.trim(),

        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        websiteUrl: formData.websiteUrl.trim(),

        socialLinks: {
          facebook: formData.socialLinks.facebook.trim(),
          instagram: formData.socialLinks.instagram.trim(),
          linkedin: formData.socialLinks.linkedin.trim(),
          youtube: formData.socialLinks.youtube.trim(),
          twitter: formData.socialLinks.twitter.trim(),
        },

        footerDescription: formData.footerDescription.trim(),
        copyrightText: formData.copyrightText.trim(),

        seo: {
          title: formData.seo.title.trim(),
          description: formData.seo.description.trim(),
          keywords,
          ogImage: formData.seo.ogImage.trim(),
        },
      };

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save site settings"
        );
      }

      const savedData = result.data || cleanedData;

      const savedKeywords = Array.isArray(
        savedData.seo?.keywords
      )
        ? savedData.seo.keywords
        : keywords;

      setFormData({
        ...defaultData,
        ...savedData,

        socialLinks: {
          ...defaultData.socialLinks,
          ...(savedData.socialLinks || {}),
        },

        seo: {
          ...defaultData.seo,
          ...(savedData.seo || {}),
          keywords: savedKeywords,
        },
      });

      // Keep the input as normal text after saving.
      setKeywordInput(savedKeywords.join(", "));

      toast.success("Site settings updated successfully");
    } catch (error) {
      console.error("Save settings error:", error);

      toast.error(
        error.message || "Failed to save site settings"
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
            Loading site settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Site Settings
            </h1>

            <p className="mt-0.5 text-xs text-gray-500">
              Manage the global information used throughout the website.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />

            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </div>

        {/* Website Information */}
        <Section
          title="Website Information"
          description="Basic information about the university and department."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="University Name"
              value={formData.universityName}
              onChange={(value) =>
                updateField("universityName", value)
              }
              placeholder="MNS University of Agriculture"
            />

            <Input
              label="Department Name"
              value={formData.departmentName}
              onChange={(value) =>
                updateField("departmentName", value)
              }
              placeholder="Department of Computer Science"
            />

            <Input
              label="Faculty Name"
              value={formData.facultyName}
              onChange={(value) =>
                updateField("facultyName", value)
              }
              placeholder="Faculty of Computing"
            />
          </div>
        </Section>

        {/* Branding */}
        <Section
          title="Branding"
          description="Manage the website logo and favicon."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <ImageUploader
              label="Department Logo"
              description="Upload the main department logo."
              value={formData.logo}
              onChange={(value) =>
                updateField("logo", value)
              }
              folder="settings/logo"
              aspect="aspect-square"
            />

            <ImageUploader
              label="Favicon"
              description="Upload the browser favicon."
              value={formData.favicon}
              onChange={(value) =>
                updateField("favicon", value)
              }
              folder="settings/favicon"
              aspect="aspect-square"
            />
          </div>
        </Section>

        {/* Contact */}
        <Section
          title="Contact Information"
          description="Information displayed in the header, footer and contact pages."
        >
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(value) =>
                  updateField("email", value)
                }
                placeholder="cs@example.edu.pk"
              />

              <Input
                label="Phone"
                value={formData.phone}
                onChange={(value) =>
                  updateField("phone", value)
                }
                placeholder="+92 61 1234567"
              />
            </div>

            <Textarea
              label="Address"
              value={formData.address}
              onChange={(value) =>
                updateField("address", value)
              }
              placeholder="Department address..."
              rows={3}
            />

            <Input
              label="Website URL"
              type="url"
              value={formData.websiteUrl}
              onChange={(value) =>
                updateField("websiteUrl", value)
              }
              placeholder="https://example.edu.pk"
            />
          </div>
        </Section>

        {/* Social Links */}
        <Section
          title="Social Media"
          description="Add the official social media profiles."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Facebook"
              value={formData.socialLinks.facebook}
              onChange={(value) =>
                updateSocial("facebook", value)
              }
              placeholder="https://facebook.com/..."
            />

            <Input
              label="Instagram"
              value={formData.socialLinks.instagram}
              onChange={(value) =>
                updateSocial("instagram", value)
              }
              placeholder="https://instagram.com/..."
            />

            <Input
              label="LinkedIn"
              value={formData.socialLinks.linkedin}
              onChange={(value) =>
                updateSocial("linkedin", value)
              }
              placeholder="https://linkedin.com/..."
            />

            <Input
              label="YouTube"
              value={formData.socialLinks.youtube}
              onChange={(value) =>
                updateSocial("youtube", value)
              }
              placeholder="https://youtube.com/..."
            />

            <Input
              label="Twitter / X"
              value={formData.socialLinks.twitter}
              onChange={(value) =>
                updateSocial("twitter", value)
              }
              placeholder="https://x.com/..."
            />
          </div>
        </Section>

        {/* Footer */}
        <Section
          title="Footer"
          description="Manage the information displayed in the website footer."
        >
          <div className="space-y-4">
            <Textarea
              label="Footer Description"
              value={formData.footerDescription}
              onChange={(value) =>
                updateField("footerDescription", value)
              }
              rows={4}
              placeholder="Short description about the department..."
            />

            <Input
              label="Copyright Text"
              value={formData.copyrightText}
              onChange={(value) =>
                updateField("copyrightText", value)
              }
              placeholder="© 2026 Department of Computer Science"
            />
          </div>
        </Section>

        {/* SEO */}
        <Section
          title="SEO Defaults"
          description="Default metadata used when a page does not provide its own SEO information."
        >
          <div className="space-y-4">
            <Input
              label="SEO Title"
              value={formData.seo.title}
              onChange={(value) =>
                updateSeo("title", value)
              }
              placeholder="Department of Computer Science"
            />

            <Textarea
              label="SEO Description"
              value={formData.seo.description}
              onChange={(value) =>
                updateSeo("description", value)
              }
              rows={4}
              placeholder="Official website of the Department of Computer Science..."
            />

            {/* KEYWORDS */}
            <div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Keywords
                </span>

                <input
                  type="text"
                  value={keywordInput}
                  onChange={(event) => {
                    setKeywordInput(event.target.value);
                  }}
                  placeholder="computer science, university, research, BSCS"
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-gray-400"
                />
              </label>

              <p className="mt-1.5 text-xs text-gray-400">
                Separate keywords with commas.
              </p>
            </div>

            <ImageUploader
              label="Default Open Graph Image"
              description="Used when sharing pages that do not have their own social image."
              value={formData.seo.ogImage}
              onChange={(value) =>
                updateSeo("ogImage", value)
              }
              folder="settings/seo"
              aspect="aspect-video"
            />
          </div>
        </Section>

        {/* Bottom Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />

            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* --------------------------------
   Section
-------------------------------- */

function Section({
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-sm font-bold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

/* --------------------------------
   Input
-------------------------------- */

function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}
      </span>

      <input
        type={type}
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-gray-400"
      />
    </label>
  );
}

/* --------------------------------
   Textarea
-------------------------------- */

function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 5,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}
      </span>

      <textarea
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-gray-900 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-gray-400"
      />
    </label>
  );
}