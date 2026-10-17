
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

function validateProjectData(data) {
  if (data.title !== undefined && !data.title) {
    return "Project title cannot be empty";
  }

  if (data.slug !== undefined && !data.slug) {
    return "Project slug cannot be empty";
  }

  if (
    data.year !== undefined &&
    (
      !Number.isInteger(Number(data.year)) ||
      Number(data.year) < 1900 ||
      Number(data.year) > 9999
    )
  ) {
    return "A valid project year is required";
  }

  if (
    data.students?.some((student) => !student.name)
  ) {
    return "Every student must have a name";
  }

  if (
    data.status !== undefined &&
    !["ongoing", "completed"].includes(data.status)
  ) {
    return "Invalid project status";
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

export async function GET(request, { params }) {
  try {
    if (!(await authorizeAndConnect())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await StudentProject.findById(id).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Admin student project GET error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load project" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await authorizeAndConnect())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const data = pickAllowedFields(body);

    if (data.year !== undefined) {
      data.year = Number(data.year);
    }

    const validationError = validateProjectData(data);

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const currentProject = await StudentProject.findById(id);

    if (!currentProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    if (data.slug !== undefined) {
      const duplicate = await StudentProject.findOne({
        slug: data.slug,
        _id: { $ne: id },
      }).lean();

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "A project with this slug already exists",
          },
          { status: 409 }
        );
      }
    }

    Object.assign(currentProject, data);
    await currentProject.save();

    revalidateTag("student-projects", "max");

    return NextResponse.json({
      success: true,
      message: "Student project updated successfully",
      data: currentProject.toObject(),
    });
  } catch (error) {
    console.error("Admin student project PUT error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A project with this slug already exists",
        },
        { status: 409 }
      );
    }

    if (
      error.name === "ValidationError" ||
      error.message === "Students must be an array" ||
      error.message === "Technologies must be an array"
    ) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await authorizeAndConnect())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await StudentProject.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    revalidateTag("student-projects", "max");

    return NextResponse.json({
      success: true,
      message: "Student project deleted successfully",
    });
  } catch (error) {
    console.error("Admin student project DELETE error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
