import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    universityName: {
      type: String,
      default: "",
      trim: true,
    },

    departmentName: {
      type: String,
      default: "Department of Computer Science",
      trim: true,
    },

    facultyName: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },

    favicon: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    websiteUrl: {
      type: String,
      default: "",
      trim: true,
    },

    socialLinks: {
      facebook: {
        type: String,
        default: "",
        trim: true,
      },

      instagram: {
        type: String,
        default: "",
        trim: true,
      },

      linkedin: {
        type: String,
        default: "",
        trim: true,
      },

      youtube: {
        type: String,
        default: "",
        trim: true,
      },

      twitter: {
        type: String,
        default: "",
        trim: true,
      },
    },

    footerDescription: {
      type: String,
      default: "",
      trim: true,
    },

    copyrightText: {
      type: String,
      default: "",
      trim: true,
    },

    seo: {
      title: {
        type: String,
        default: "",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      keywords: {
        type: [String],
        default: [],
      },

      ogImage: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;