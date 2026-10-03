import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: {
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

    degreeType: {
      type: String,
      enum: [
        "Undergraduate",
        "Graduate",
        "Postgraduate",
        "Diploma",
        "Certificate",
        "Other",
      ],
      required: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
      trim: true,
    },

    eligibility: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    schemeOfStudies: [
      {
        year: {
          type: Number,
          required: true,
        },

        fileUrl: {
          type: String,
          required: true,
        },

        fileName: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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

const Program =
  mongoose.models.Program ||
  mongoose.model("Program", programSchema);

export default Program;