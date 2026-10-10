
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Faculty from "@/models/Faculty";

async function getFacultyFromDB() {
  await connectDB();

  const faculty = await Faculty.find({ status: "active" })
    .sort({ order: 1, name: 1 })
    .lean();

  return JSON.parse(JSON.stringify(faculty));
}

export const getFaculty = unstable_cache(
  getFacultyFromDB,
  ["faculty"],
  {
    revalidate: 60 * 60 * 24 * 3,
    tags: ["faculty"],
  }
);

async function getFacultyBySlugFromDB(slug) {
  await connectDB();

  const faculty = await Faculty.findOne({
    slug,
    status: "active",
  }).lean();

  if (!faculty) return null;

  return JSON.parse(JSON.stringify(faculty));
}

export const getFacultyBySlug = unstable_cache(
  getFacultyBySlugFromDB,
  ["faculty-by-slug"],
  {
    revalidate: 60 * 60 * 24 * 3,
    tags: ["faculty"],
  }
);
