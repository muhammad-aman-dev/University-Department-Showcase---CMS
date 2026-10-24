
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Publication from "@/models/Publication";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const noCacheHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Read and normalize query parameters.
    const search = (searchParams.get("search") || "").trim();
    const type = (searchParams.get("type") || "").trim();
    const area = (searchParams.get("area") || "").trim();
    const year = (searchParams.get("year") || "").trim();
    const featured = (searchParams.get("featured") || "").trim();

    const requestedPage = Number.parseInt(
      searchParams.get("page") || "1",
      10
    );

    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || "9",
      10
    );

    const page =
      Number.isFinite(requestedPage) && requestedPage > 0
        ? requestedPage
        : 1;

    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 50)
        : 9;

    // Only published publications are visible on the public website.
    const baseFilter = { status: "published" };

    // Load filter options and the total published count.
    const [totalPublished, areas, yearResults, types] =
      await Promise.all([
        Publication.countDocuments(baseFilter),

        Publication.distinct("researchArea", {
          ...baseFilter,
          researchArea: { $nin: ["", null] },
        }),

        Publication.aggregate([
          {
            $match: {
              ...baseFilter,
              publicationDate: { $type: "date" },
            },
          },
          {
            $project: {
              year: { $year: "$publicationDate" },
            },
          },
          {
            $group: {
              _id: "$year",
            },
          },
          {
            $sort: { _id: -1 },
          },
        ]),

        Publication.distinct("publicationType", baseFilter),
      ]);

    const availableAreas = areas
      .filter((item) => typeof item === "string" && item.trim())
      .sort((a, b) => a.localeCompare(b));

    const availableYears = yearResults.map((item) => item._id);

    const availableTypes = types
      .filter((item) => typeof item === "string" && item.trim())
      .sort((a, b) => a.localeCompare(b));

    // Return an empty result if no published records exist.
    if (totalPublished === 0) {
      return NextResponse.json(
        {
          success: true,
          data: {
            publications: [],
            total: 0,
            page,
            limit,
            totalPages: 0,
            totalPublished: 0,
            areas: [],
            years: [],
            types: [],
          },
        },
        { headers: noCacheHeaders }
      );
    }

    // Start with the published-only filter.
    const filter = { ...baseFilter };

    // Search publication fields.
    if (search) {
      const safeSearch = escapeRegex(search);

      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { abstract: { $regex: safeSearch, $options: "i" } },
        { authors: { $regex: safeSearch, $options: "i" } },
        { researchArea: { $regex: safeSearch, $options: "i" } },
        {
          journalOrConference: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        { publisher: { $regex: safeSearch, $options: "i" } },
      ];
    }

    // "all", empty, or missing means no publication type filter.
    if (type && type !== "all") {
      filter.publicationType = type;
    }

    // "all", empty, or missing means no research area filter.
    if (area && area !== "all") {
      filter.researchArea = area;
    }

    // IMPORTANT:
    // featured=true means featured publications only.
    // featured=false or missing means ALL published publications.
    // Do not set isFeatured=false for an unchecked checkbox.
    if (featured === "true") {
      filter.isFeatured = true;
    }

    // Filter by year only when a valid four-digit year is supplied.
    if (/^\d{4}$/.test(year)) {
      const numericYear = Number(year);

      if (numericYear >= 1000 && numericYear <= 9999) {
        const start = new Date(
          `${numericYear}-01-01T00:00:00.000Z`
        );

        const end = new Date(
          `${numericYear + 1}-01-01T00:00:00.000Z`
        );

        filter.publicationDate = {
          $gte: start,
          $lt: end,
        };
      }
    }

    // Count matching records and fetch the requested page.
    const [publications, total] = await Promise.all([
      Publication.find(filter)
        .sort({
          isFeatured: -1,
          order: 1,
          publicationDate: -1,
          createdAt: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .select(
          [
            "title",
            "slug",
            "authors",
            "publicationType",
            "journalOrConference",
            "publisher",
            "publicationDate",
            "abstract",
            "doi",
            "externalUrl",
            "pdfUrl",
            "researchArea",
            "isFeatured",
            "order",
          ].join(" ")
        )
        .lean(),

      Publication.countDocuments(filter),
    ]);

    // Serialize MongoDB documents for JSON.
    const serialized = publications.map((item) => ({
      ...item,
      _id: item._id.toString(),
      publicationDate: item.publicationDate
        ? new Date(item.publicationDate).toISOString()
        : null,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          publications: serialized,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalPublished,
          areas: availableAreas,
          years: availableYears,
          types: availableTypes,
        },
      },
      { headers: noCacheHeaders }
    );
  } catch (error) {
    console.error("Publications API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch publications.",
        ...(process.env.NODE_ENV === "development"
          ? { error: error.message }
          : {}),
      },
      {
        status: 500,
        headers: noCacheHeaders,
      }
    );
  }
}
