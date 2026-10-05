import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

const getSiteSettingsFromDB = async () => {
  console.log("🔥 DATABASE HIT: getSiteSettingsFromDB");
  await connectDB();

  const settings = await SiteSettings.findOne().lean();

  if (!settings) {
    return null;
  }

  return JSON.parse(JSON.stringify(settings));
};

export const getSiteSettings = unstable_cache(
  getSiteSettingsFromDB,
  ["site-settings"],
  {
    revalidate: 60 * 60 * 24 * 3,
    tags: ["site-settings"],
  }
);