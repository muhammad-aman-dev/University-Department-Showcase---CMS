import mongoose from "mongoose";

const researchProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    researchArea: {
      type: String,
      default: "",
      trim: true,
    },

    principalInvestigator: {
      type: String,
      default: "",
      trim: true,
    },

    teamMembers: [
      {
        type: String,
        trim: true,
      },
    ],

    fundingOrganization: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["planned", "ongoing", "completed"],
      default: "ongoing",
    },

    image: {
      type: String,
      default: "",
    },

    documentUrl: {
      type: String,
      default: "",
    },

    projectUrl: {
      type: String,
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ResearchProject =
  mongoose.models.ResearchProject ||
  mongoose.model("ResearchProject", researchProjectSchema);

export default ResearchProject;