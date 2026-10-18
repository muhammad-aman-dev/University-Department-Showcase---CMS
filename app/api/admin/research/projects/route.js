
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import ResearchProject from "@/models/ResearchProjects";
import { getCurrentUser } from "@/lib/getCurrentUser";

const slugify = (value = "") =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const allowedFields = [
  "title",
  "slug",
  "shortDescription",
  "description",
  "researchArea",
  "principalInvestigator",
  "teamMembers",
  "fundingOrganization",
  "startDate",
  "endDate",
  "status",
  "image",
  "documentUrl",
  "projectUrl",
  "isFeatured",
  "order",
];

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const projects = await ResearchProject.find()
      .sort({ order: 1, createdAt: -1, _id: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(projects)),
    });
  } catch (error) {
    console.error("Admin research projects GET error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load research projects" },
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

    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { success: false, message: "Project title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const slug = slugify(body.slug || body.title);

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "A valid slug is required" },
        { status: 400 }
      );
    }

    const data = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    data.title = body.title.trim();
    data.slug = slug;

    const project = await ResearchProject.create(data);

    revalidateTag("research-projects", "max");

    return NextResponse.json(
      {
        success: true,
        message: "Research project created successfully",
        data: project.toObject(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin research projects POST error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "This slug is already in use" },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create research project" },
      { status: 500 }
    );
  }
}
