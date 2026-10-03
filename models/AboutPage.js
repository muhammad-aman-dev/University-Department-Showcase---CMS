import mongoose from "mongoose";

const aboutPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "About the Department",
      trim: true,
    },

    introduction: {
      type: String,
      default: "",
    },

    history: {
      title: {
        type: String,
        default: "History",
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

    vision: {
      type: String,
      default: "",
    },

    mission: {
      type: String,
      default: "",
    },

    objectives: [
      {
        type: String,
        trim: true,
      },
    ],

    scope: {
      type: String,
      default: "",
    },

    facilities: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },

        description: {
          type: String,
          default: "",
        },

        image: {
          type: String,
          default: "",
        },

        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    pageImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AboutPage =
  mongoose.models.AboutPage ||
  mongoose.model("AboutPage", aboutPageSchema);

export default AboutPage;