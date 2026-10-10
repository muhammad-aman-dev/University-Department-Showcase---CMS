import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Program from "@/models/Program";

const CACHE_DURATION = 60 * 60 * 24 * 3;

// Get all active programs
const getProgramsFromDB = async () => {
  await connectDB();

  const programs = await Program.find({
    status: "active",
  })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(programs));
};

export const getPrograms = unstable_cache(
  getProgramsFromDB,
  ["programs"],
  {
    revalidate: CACHE_DURATION,
    tags: ["programs"],
  }
);

// Get featured active programs
const getFeaturedProgramsFromDB = async () => {
  await connectDB();

  const programs = await Program.find({
    status: "active",
    isFeatured: true,
  })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(programs));
};

export const getFeaturedPrograms = unstable_cache(
  getFeaturedProgramsFromDB,
  ["featured-programs"],
  {
    revalidate: CACHE_DURATION,
    tags: ["programs"],
  }
);

// Get a single active program by slug
export async function getProgramBySlug(slug) {
  if (typeof slug !== "string" || !slug.trim()) {
    return null;
  }

  const normalizedSlug = slug.trim().toLowerCase();

  const getProgramFromDB = unstable_cache(
    async () => {
      await connectDB();

      const program = await Program.findOne({
        slug: normalizedSlug,
        status: "active",
      }).lean();

      if (!program) {
        return null;
      }

      return JSON.parse(JSON.stringify(program));
    },
    ["program-by-slug", normalizedSlug],
    {
      revalidate: CACHE_DURATION,
      tags: [
        "programs",
        `program-${normalizedSlug}`,
      ],
    }
  );

  return getProgramFromDB();
}