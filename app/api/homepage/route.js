import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import HomePage from "@/models/HomePage";
import StudentProject from "@/models/StudentProject";
import Achievement from "@/models/Achievement";
import News from "@/models/News";
import Event from "@/models/Event";
import Notice from "@/models/Notice";

const HOMEPAGE_LIMIT = 4;

export async function GET() {
    console.log("Request")
  try {
    await connectDB();

    const homePage = await HomePage.findOne().lean();

    const showProjects = homePage?.showProjects ?? true;
    const showAchievements =
      homePage?.showAchievements ?? true;
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

    return NextResponse.json({
      success: true,
      data: {
        homePage: homePage || null,
        projects: projects || [],
        achievements: achievements || [],
        news: news || [],
        events: events || [],
        notices: notices || [],
      },
    });
  } catch (error) {
    console.error("Homepage API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load homepage data",
      },
      {
        status: 500,
      }
    );
  }
}