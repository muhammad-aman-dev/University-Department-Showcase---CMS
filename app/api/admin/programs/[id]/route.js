import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import Program from "@/models/Program";
import { getCurrentUser } from "@/lib/getCurrentUser";

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
  if (
    body.name !== undefined &&
    (typeof body.name !== "string" || !body.name.trim())
  ) {
    return "Program name is required";
  }

  if (
    body.slug !== undefined &&
    (typeof body.slug !== "string" || !normalizeSlug(body.slug))
  ) {
    return "A valid program slug is required";
  }

  if (
    body.degreeType !== undefined &&
    !validDegreeTypes.includes(body.degreeType)
  ) {
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
      !Number.isFinite(Number(scheme.year)) ||
      !scheme.fileUrl?.trim() ||
      !scheme.fileName?.trim()
    ) {
      return "Each scheme needs a valid year, file URL, and file name";
    }
  }

  return null;
}

async function authorizeAndConnect() {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  await connectDB();

  return true;
}

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

function invalidateProgramCache(oldSlug, newSlug) {
  revalidateTag("programs", "max");

  if (oldSlug) {
    revalidateTag(`program-${oldSlug}`, "max");
  }

  if (newSlug && newSlug !== oldSlug) {
    revalidateTag(`program-${newSlug}`, "max");
  }
}

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid program ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const program = await Program.findById(id).lean();

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Admin program GET error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load program" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid program ID" },
        { status: 400 }
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

    const program = await Program.findById(id);

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    const oldSlug = program.slug;
    const updateData = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (body.slug !== undefined) {
      updateData.slug = normalizeSlug(body.slug);
    }

    if (body.name !== undefined) {
      updateData.name = body.name.trim();
    }

    Object.assign(program, updateData);

    await program.save();

    invalidateProgramCache(oldSlug, program.slug);

    return NextResponse.json({
      success: true,
      message: "Program updated successfully",
      data: program.toObject(),
    });
  } catch (error) {
    console.error("Admin program PUT error:", error);

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
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update program" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid program ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const program = await Program.findById(id);

    if (!program) {
      return NextResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }

    const oldSlug = program.slug;

    await program.deleteOne();

    invalidateProgramCache(oldSlug);

    return NextResponse.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Admin program DELETE error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete program" },
      { status: 500 }
    );
  }
}