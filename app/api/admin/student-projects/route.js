
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import StudentProject from "@/models/StudentProject";
import { getCurrentUser } from "@/lib/getCurrentUser";

const allowedFields = [
  "title",
  "slug",
  "image",
  "shortDescription",
  "description",
  "students",
  "supervisor",
  "category",
  "technologies",
  "projectUrl",
  "githubUrl",
  "year",
  "status",
  "isFeatured",
  "order",
];

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pickAllowedFields(body) {
  const data = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  if (data.title !== undefined) {
    data.title = String(data.title).trim();
  }

  if (data.slug !== undefined) {
    data.slug = slugify(String(data.slug));
  }

  if (data.students !== undefined) {
    if (!Array.isArray(data.students)) {
      throw new Error("Students must be an array");
    }

    data.students = data.students.map((student) => ({
      name: String(student?.name ?? "").trim(),
      registrationNumber: String(
        student?.registrationNumber ?? ""
      ).trim(),
    }));
  }

  if (data.technologies !== undefined) {
    if (!Array.isArray(data.technologies)) {
      throw new Error("Technologies must be an array");
    }

    data.technologies = data.technologies
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return data;
}

export async function GET(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const status = searchParams.get("status") || "";
    const year = searchParams.get("year");
    const featured = searchParams.get("featured");
    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1", 10) || 1
    );
    const limit = Math.min(
      100,
      Math.max(
        1,
        parseInt(searchParams.get("limit") || "10", 10) || 10
      )
    );

    const filter = {};

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { title: regex },
        { slug: regex },
        { shortDescription: regex },
        { supervisor: regex },
        { category: regex },
        { "students.name": regex },
        { technologies: regex },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (["ongoing", "completed"].includes(status)) {
      filter.status = status;
    }

    if (year && Number.isInteger(Number(year))) {
      filter.year = Number(year);
    }

    if (featured === "true") {
      filter.isFeatured = true;
    } else if (featured === "false") {
      filter.isFeatured = false;
    }

    const [projects, total] = await Promise.all([
      StudentProject.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      StudentProject.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin student projects GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load student projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = pickAllowedFields(body);

    data.title = String(data.title || "").trim();

    if (!data.title) {
      return NextResponse.json(
        { success: false, message: "Project title is required" },
        { status: 400 }
      );
    }

    data.slug = slugify(data.slug || data.title);

    if (!data.slug) {
      return NextResponse.json(
        { success: false, message: "A valid project slug is required" },
        { status: 400 }
      );
    }

    if (
      data.year === undefined ||
      !Number.isInteger(Number(data.year)) ||
      Number(data.year) < 1900 ||
      Number(data.year) > 9999
    ) {
      return NextResponse.json(
        { success: false, message: "A valid project year is required" },
        { status: 400 }
      );
    }

    data.year = Number(data.year);

    if (
      data.students?.some((student) => !student.name)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Every student must have a name",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingProject = await StudentProject.findOne({
      slug: data.slug,
    }).lean();

    if (existingProject) {
      return NextResponse.json(
        {
          success: false,
          message: "A project with this slug already exists",
        },
        { status: 409 }
      );
    }

    const project = await StudentProject.create(data);

    revalidateTag("student-projects", "max");

    return NextResponse.json(
      {
        success: true,
        message: "Student project created successfully",
        data: project.toObject(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin student projects POST error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A project with this slug already exists",
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError" || error.message === "Students must be an array" || error.message === "Technologies must be an array") {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create student project",
      },
      { status: 500 }
    );
  }
}
