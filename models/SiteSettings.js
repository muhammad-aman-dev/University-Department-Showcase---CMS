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

    logo: {
      type: String,
      default: "",
    },

    favicon: {
      type: String,
      default: "",
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
      },

      instagram: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      youtube: {
        type: String,
        default: "",
      },

      twitter: {
        type: String,
        default: "",
      },
    },

    footerDescription: {
      type: String,
      default: "",
    },

    copyrightText: {
      type: String,
      default: "",
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