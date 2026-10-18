
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import ResearchArea from "@/models/ResearchArea";

const getResearchAreasFromDB = async () => {
  await connectDB();

  const areas = await ResearchArea.find({ status: "active" })
    .sort({ order: 1, name: 1, _id: 1 })
    .lean();

  return JSON.parse(JSON.stringify(areas));
};

export const getResearchAreas = unstable_cache(
  getResearchAreasFromDB,
  ["research-areas"],
  {
    revalidate: 60 * 60 * 24,
    tags: ["research-areas"],
  }
);
