
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import StudentProject from "@/models/StudentProject";

export const dynamic = "force-dynamic";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = (searchParams.get("search") || "").trim();
    const yearParam = searchParams.get("year") || "all";
    const statusParam = searchParams.get("status") || "all";
    const sortParam = searchParams.get("sort") || "newest";

    const requestedPage = Number.parseInt(
      searchParams.get("page") || "1",
      10
    );
    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || "9",
      10
    );

    const page = Number.isFinite(requestedPage)
      ? Math.max(1, requestedPage)
      : 1;

    // Cap page size to prevent unnecessarily large responses.
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(24, Math.max(1, requestedLimit))
      : 9;

    const publicFilter = {
      status: { $in: ["ongoing", "completed"] },
    };

    const filter = { ...publicFilter };

    if (yearParam !== "all") {
      const year = Number(yearParam);

      if (!Number.isInteger(year) || year < 1900 || year > 2200) {
        return NextResponse.json(
          { message: "Invalid year." },
          { status: 400 }
        );
      }

      filter.year = year;
    }

    if (statusParam !== "all") {
      if (!["ongoing", "completed"].includes(statusParam)) {
        return NextResponse.json(
          { message: "Invalid status." },
          { status: 400 }
        );
      }

      filter.status = statusParam;
    }

    if (search) {
      // Escape special regex characters so user input is treated literally.
      const searchRegex = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { title: searchRegex },
        { slug: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { supervisor: searchRegex },
        { "students.name": searchRegex },
        { "students.registrationNumber": searchRegex },
        { technologies: searchRegex },
      ];
    }

    let sort = { order: 1, year: -1, title: 1, _id: 1 };

    if (sortParam === "oldest") {
      sort = { year: 1, order: 1, title: 1, _id: 1 };
    } else if (sortParam === "title") {
      sort = { title: 1, _id: 1 };
    } else if (sortParam !== "newest") {
      return NextResponse.json(
        { message: "Invalid sort option." },
        { status: 400 }
      );
    }

    const [total, projects, yearValues] = await Promise.all([
      StudentProject.countDocuments(filter),

      StudentProject.find(filter)
        .select(
          "title slug image shortDescription description students supervisor category technologies projectUrl githubUrl year status isFeatured order"
        )
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      StudentProject.distinct("year", publicFilter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      projects: JSON.parse(JSON.stringify(projects)),
      total,
      page,
      limit,
      totalPages,
      years: yearValues
        .filter(
          (value) =>
            Number.isInteger(value) &&
            value >= 1900 &&
            value <= 2200
        )
        .sort((a, b) => b - a),
    });
  } catch (error) {
    console.error("Public student projects API error:", error);

    return NextResponse.json(
      { message: "Unable to load student projects." },
      { status: 500 }
    );
  }
}
