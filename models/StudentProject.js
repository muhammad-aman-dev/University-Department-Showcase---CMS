import mongoose from "mongoose";

const studentProjectSchema = new mongoose.Schema(
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

    students: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        registrationNumber: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],

    supervisor: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    technologies: [
      {
        type: String,
        trim: true,
      },
    ],

    image: {
      type: String,
      default: "",
    },

    projectUrl: {
      type: String,
      default: "",
      trim: true,
    },

    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "completed",
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

const StudentProject =
  mongoose.models.StudentProject ||
  mongoose.model("StudentProject", studentProjectSchema);

export default StudentProject;