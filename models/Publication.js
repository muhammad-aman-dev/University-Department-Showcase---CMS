import mongoose from "mongoose";

const publicationSchema = new mongoose.Schema(
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

    authors: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    publicationType: {
      type: String,
      enum: [
        "Journal Article",
        "Conference Paper",
        "Book Chapter",
        "Book",
        "Thesis",
        "Technical Report",
        "Other",
      ],
      default: "Journal Article",
    },

    journalOrConference: {
      type: String,
      default: "",
      trim: true,
    },

    publisher: {
      type: String,
      default: "",
      trim: true,
    },

    publicationDate: {
      type: Date,
      default: null,
    },

    abstract: {
      type: String,
      default: "",
    },

    doi: {
      type: String,
      default: "",
      trim: true,
    },

    externalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    researchArea: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
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

const Publication =
  mongoose.models.Publication ||
  mongoose.model("Publication", publicationSchema);

export default Publication;