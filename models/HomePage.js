import mongoose from "mongoose";

const homePageSchema = new mongoose.Schema(
  {
    // =========================
    // Hero Section
    // =========================
    hero: {
      title: {
        type: String,
        default: "",
        trim: true,
      },

      subtitle: {
        type: String,
        default: "",
        trim: true,
      },

      description: {
        type: String,
        default: "",
      },

      // Hero carousel photos
      images: [
        {
          url: {
            type: String,
            required: true,
          },

          order: {
            type: Number,
            default: 0,
          },

          isActive: {
            type: Boolean,
            default: true,
          },
        },
      ],

      primaryButtonText: {
        type: String,
        default: "",
        trim: true,
      },

      primaryButtonUrl: {
        type: String,
        default: "",
        trim: true,
      },

      secondaryButtonText: {
        type: String,
        default: "",
        trim: true,
      },

      secondaryButtonUrl: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // =========================
    // Department Introduction
    // =========================
    introduction: {
      title: {
        type: String,
        default: "",
        trim: true,
      },

      content: {
        type: String,
        default: "",
      },

      image: {
        type: String,
        default: "",
      },
    },

    // =========================
    // HOD Message
    // =========================
    hodMessage: {
      name: {
        type: String,
        default: "",
        trim: true,
      },

      designation: {
        type: String,
        default: "Head of Department",
        trim: true,
      },

      image: {
        type: String,
        default: "",
      },

      message: {
        type: String,
        default: "",
      },
    },

    // =========================
    // Vision
    // =========================
    vision: {
      type: String,
      default: "",
    },

    // =========================
    // Mission
    // =========================
    mission: {
      type: String,
      default: "",
    },

    // =========================
    // Objectives
    // =========================
    objectives: [
      {
        type: String,
        trim: true,
      },
    ],

    // =========================
    // Scope
    // =========================
    scope: {
      type: String,
      default: "",
    },

    // =========================
    // Homepage Statistics
    // =========================
    statistics: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },

        value: {
          type: String,
          required: true,
          trim: true,
        },

        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // =========================
    // Homepage Section Visibility
    // =========================
    showProjects: {
      type: Boolean,
      default: true,
    },

    showAchievements: {
      type: Boolean,
      default: true,
    },

    showNews: {
      type: Boolean,
      default: true,
    },

    showEvents: {
      type: Boolean,
      default: true,
    },

    showNotices: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const HomePage =
  mongoose.models.HomePage ||
  mongoose.model("HomePage", homePageSchema);

export default HomePage;