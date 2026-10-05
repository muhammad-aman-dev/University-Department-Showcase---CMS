import { unstable_cache } from "next/cache";

import { connectDB } from "@/lib/db";

import AboutPage from "@/models/AboutPage";

const getAboutPageFromDB = async () => {
  console.log("🔥 DATABASE HIT: getAboutpageDataFromDB");
  await connectDB();

  const about = await AboutPage.findOne().lean();

  if (!about) {
    return null;
  }

  return JSON.parse(JSON.stringify(about));
};

export const getAboutPage = unstable_cache(
  getAboutPageFromDB,
  ["about-page"],
  {
    revalidate: 60 * 60 * 24 * 3,
    tags: ["about-page"],
  }
);