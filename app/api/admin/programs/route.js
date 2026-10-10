import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Program from "@/models/Program";
import { getCurrentUser } from "@/lib/getCurrentUser";

const validDegreeTypes = [
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Diploma",
  "Certificate",
  "Other",
];

const validStatuses = ["active", "inactive"];

function normalizeSlug(slug) {
  return String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateProgram(body) {
  if (!body.name?.trim()) {
    return "Program name is required";
  }

  if (!normalizeSlug(body.slug)) {
    return "Program slug is required";
  }

  if (!validDegreeTypes.includes(body.degreeType)) {
    return "Invalid degree type";
  }

  if (
    body.status !== undefined &&
    !validStatuses.includes(body.status)
  ) {
    return "Invalid program status";
  }

  if (
    body.schemeOfStudies !== undefined &&
    !Array.isArray(body.schemeOfStudies)
  ) {
    return "Scheme of studies must be an array";
  }

  for (const scheme of body.schemeOfStudies || []) {
    if (
      !Number.isInteger(Number(scheme.year)) ||
      !Number.isFinite(Number(scheme.year))
    ) {
      return "Each scheme must have a valid year";
    }

    if (!scheme.fileUrl?.trim()) {
      return "Each scheme must have a file URL";
    }

    if (!scheme.fileName?.trim()) {
      return "Each scheme must have a file name";
    }
  }

  return null;
}

const allowedFields = [
  "name",
  "slug",
  "degreeType",
  "shortDescription",
  "duration",
  "eligibility",
  "image",
  "schemeOfStudies",
  "status",
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

    const programs = await Program.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Admin programs GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load programs",
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

    await connectDB();

    const body = await request.json();

    const validationError = validateProgram(body);

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const slug = normalizeSlug(body.slug);

    const existingProgram = await Program.findOne({ slug });

    if (existingProgram) {
      return NextResponse.json(
        {
          success: false,
          message: "A program with this slug already exists",
        },
        { status: 409 }
      );
    }

    const programData = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        programData[field] = body[field];
      }
    }

    programData.slug = slug;
    programData.name = body.name.trim();

    const program = await Program.create(programData);

    revalidateTag("programs", "max");
    revalidateTag(`program-${program.slug}`, "max");

    return NextResponse.json(
      {
        success: true,
        message: "Program created successfully",
        data: program.toObject(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin programs POST error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A program with this slug already exists",
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
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
        message: "Failed to create program",
      },
      { status: 500 }
    );
  }
}