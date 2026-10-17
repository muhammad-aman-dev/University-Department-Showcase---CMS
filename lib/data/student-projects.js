
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import StudentProject from "@/models/StudentProject";

async function getStudentProjectsFromDB() {
  await connectDB();

  const projects = await StudentProject.find({
    status: { $in: ["ongoing", "completed"] },
  })
    .sort({ order: 1, year: -1, title: 1 })
    .lean();

  return JSON.parse(JSON.stringify(projects));
}

export const getStudentProjects = unstable_cache(
  getStudentProjectsFromDB,
  ["student-projects"],
  {
    revalidate: 60 * 60 * 24 * 3,
    tags: ["student-projects"],
  }
);

async function getStudentProjectBySlugFromDB(slug) {
  await connectDB();

  const project = await StudentProject.findOne({
    slug,
    status: { $in: ["ongoing", "completed"] },
  }).lean();

  if (!project) return null;

  return JSON.parse(JSON.stringify(project));
}

export const getStudentProjectBySlug = unstable_cache(
  getStudentProjectBySlugFromDB,
  ["student-project-by-slug"],
  {
    revalidate: 60 * 60 * 24 * 3,
    tags: ["student-projects"],
  }
);
