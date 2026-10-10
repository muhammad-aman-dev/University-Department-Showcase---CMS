
import mongoose from "mongoose";

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    authors: {
      type: String,
      default: "",
      trim: true,
    },
    journal: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: Number,
      default: null,
    },
    doi: {
      type: String,
      default: "",
      trim: true,
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "Journal Article",
        "Conference Paper",
        "Book Chapter",
        "Review Paper",
        "Other",
      ],
      default: "Journal Article",
    },
  },
  { _id: true }
);

const researchProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      default: "",
      trim: true,
    },
    fundingAgency: {
      type: String,
      default: "",
      trim: true,
    },
    startYear: {
      type: Number,
      default: null,
    },
    endYear: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Proposed"],
      default: "Completed",
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    authors: {
      type: String,
      default: "",
      trim: true,
    },
    publisher: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: Number,
      default: null,
    },
    isbn: {
      type: String,
      default: "",
      trim: true,
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["Book", "Book Chapter", "Edited Book"],
      default: "Book",
    },
  },
  { _id: true }
);

const facultySchema = new mongoose.Schema(
  {
    // Basic profile
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
    designation: {
      type: String,
      enum: [
        "Professor",
        "Associate Professor",
        "Assistant Professor",
        "Lecturer",
        "Research Officer",
        "Visiting Faculty",
        "Lab Engineer",
        "Lab Instructor",
        "Teaching Assistant",
        "Other",
      ],
      required: true,
    },

    // Academic details
    qualification: {
      type: String,
      default: "",
      trim: true,
    },
    specialization: {
      type: String,
      default: "",
      trim: true,
    },
    researchInterests: {
      type: [String],
      default: [],
    },

    // Contact and profile
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    office: {
      type: String,
      default: "",
      trim: true,
    },

    // Research output
    publications: {
      type: [publicationSchema],
      default: [],
    },
    researchProjects: {
      type: [researchProjectSchema],
      default: [],
    },
    books: {
      type: [bookSchema],
      default: [],
    },

    // Website display settings
    isHOD: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

facultySchema.index({
  status: 1,
  order: 1,
  name: 1,
});

const Faculty =
  mongoose.models.Faculty ||
  mongoose.model("Faculty", facultySchema);

export default Faculty;
