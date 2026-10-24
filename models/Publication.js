
import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema(
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
    authors: {
      type: [String],
      default: [],
    },
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
      default: "Other",
      required: true,
    },
    journalOrConference: {
      type: String,
      trim: true,
      default: "",
    },
    publisher: {
      type: String,
      trim: true,
      default: "",
    },
    publicationDate: {
      type: Date,
      default: null,
    },
    abstract: {
      type: String,
      default: "",
      trim: true,
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
      trim: true,
    },
    researchArea: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
      required: true,
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
  { timestamps: true }
);

PublicationSchema.index({ status: 1, publicationDate: -1 });
PublicationSchema.index({ status: 1, publicationType: 1 });
PublicationSchema.index({ status: 1, researchArea: 1 });
PublicationSchema.index({ title: "text", abstract: "text" });

export default mongoose.models.Publication ||
  mongoose.model("Publication", PublicationSchema);
