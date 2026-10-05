import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";

import HomePage from "@/models/HomePage";
import StudentProject from "@/models/StudentProject";
import Achievement from "@/models/Achievement";
import News from "@/models/News";
import Event from "@/models/Event";
import Notice from "@/models/Notice";

const HOMEPAGE_LIMIT = 4;

const getHomepageDataFromDB = async () => {
  console.log("🔥 DATABASE HIT: getHomepageDataFromDB");
  await connectDB();

  const homePage = await HomePage.findOne().lean();

  const showProjects = homePage?.showProjects ?? true;
  const showAchievements = homePage?.showAchievements ?? true;
  const showNews = homePage?.showNews ?? true;
  const showEvents = homePage?.showEvents ?? true;
  const showNotices = homePage?.showNotices ?? true;

  const [
    projects,
    achievements,
    news,
    events,
    notices,
  ] = await Promise.all([
    showProjects
      ? StudentProject.find({
          isFeatured: true,
        })
          .sort({
            order: 1,
            createdAt: -1,
          })
          .limit(HOMEPAGE_LIMIT)
          .lean()
      : [],

    showAchievements
      ? Achievement.find({
          status: "published",
          isFeatured: true,
        })
          .sort({
            achievementDate: -1,
            order: 1,
            createdAt: -1,
          })
          .limit(HOMEPAGE_LIMIT)
          .lean()
      : [],

    showNews
      ? News.find({
          status: "published",
          isFeatured: true,
        })
          .sort({
            publishedAt: -1,
            createdAt: -1,
          })
          .limit(HOMEPAGE_LIMIT)
          .lean()
      : [],

    showEvents
      ? Event.find({
          status: {
            $in: ["upcoming", "ongoing"],
          },
          isFeatured: true,
        })
          .sort({
            eventDate: 1,
            startTime: 1,
            createdAt: -1,
          })
          .limit(HOMEPAGE_LIMIT)
          .lean()
      : [],

    showNotices
      ? Notice.find({
          status: "published",
        })
          .sort({
            publishedAt: -1,
            createdAt: -1,
          })
          .limit(HOMEPAGE_LIMIT)
          .lean()
      : [],
  ]);

  return JSON.parse(
    JSON.stringify({
      homePage: homePage || null,
      projects: projects || [],
      achievements: achievements || [],
      news: news || [],
      events: events || [],
      notices: notices || [],
    })
  );
};

export const getDepartmentData = unstable_cache(
  getHomepageDataFromDB,
  ["homepage-data"],
  {
    revalidate: 60 * 60 * 24 * 3,
    tags: ["homepage-data"],
  }
);