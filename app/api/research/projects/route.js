import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ResearchProject from "@/models/ResearchProjects";

export const dynamic = "force-dynamic";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safePositiveInteger(value, fallback, maximum = 100) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) return fallback;

  return Math.min(parsed, maximum);
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = (searchParams.get("search") || "").trim();
    const status = (searchParams.get("status") || "all").trim().toLowerCase();
    const researchArea = (searchParams.get("researchArea") || "all").trim();
    const sort = (searchParams.get("sort") || "newest").trim().toLowerCase();

    const page = safePositiveInteger(searchParams.get("page"), 1);
    const limit = safePositiveInteger(searchParams.get("limit"), 9, 100);

    const filter = {};

    // Apply status only when a specific valid status is selected.
    const validStatuses = ["planned", "ongoing", "completed"];

    if (validStatuses.includes(status)) {
      filter.status = status;
    } else if (status !== "all") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid project status filter.",
        },
        { status: 400 }
      );
    }

    // researchArea is a STRING in the current schema, not an ObjectId.
    if (researchArea && researchArea.toLowerCase() !== "all") {
      filter.researchArea = {
        $regex: `^${escapeRegex(researchArea)}$`,
        $options: "i",
      };
    }

    if (search) {
      const searchRegex = {
        $regex: escapeRegex(search),
        $options: "i",
      };

      filter.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { researchArea: searchRegex },
        { principalInvestigator: searchRegex },
        { fundingOrganization: searchRegex },
        { teamMembers: searchRegex },
      ];
    }

    let sortOption;

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1, _id: 1 };
        break;
      case "title":
        sortOption = { title: 1, _id: 1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1, _id: -1 };
        break;
    }

    const total = await ResearchProject.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;

    const projects = await ResearchProject.find(filter)
      .sort(sortOption)
      .skip((safePage - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      projects: JSON.parse(JSON.stringify(projects)),
      total,
      page: safePage,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("GET /api/research/projects failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load research projects.",
      },
      { status: 500 }
    );
  }
}
