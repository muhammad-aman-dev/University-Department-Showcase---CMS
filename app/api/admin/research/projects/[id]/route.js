
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import ResearchProject from "@/models/ResearchProjects";
import { getCurrentUser } from "@/lib/getCurrentUser";

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

const slugify = (value = "") =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function authorize() {
  return Boolean(await getCurrentUser());
}

export async function PUT(request, { params }) {
  try {
    if (!(await authorize())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid research project ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (updateData.title !== undefined) {
      if (
        typeof updateData.title !== "string" ||
        !updateData.title.trim()
      ) {
        return NextResponse.json(
          { success: false, message: "Project title cannot be empty" },
          { status: 400 }
        );
      }

      updateData.title = updateData.title.trim();
    }

    if (updateData.slug !== undefined) {
      updateData.slug = slugify(updateData.slug);

      if (!updateData.slug) {
        return NextResponse.json(
          { success: false, message: "A valid slug is required" },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const project = await ResearchProject.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Research project not found" },
        { status: 404 }
      );
    }

    revalidateTag("research-projects", "max");

    return NextResponse.json({
      success: true,
      message: "Research project updated successfully",
      data: project.toObject(),
    });
  } catch (error) {
    console.error("Admin research project PUT error:", error);

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
      { success: false, message: "Failed to update research project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await authorize())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid research project ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await ResearchProject.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Research project not found" },
        { status: 404 }
      );
    }

    revalidateTag("research-projects", "max");

    return NextResponse.json({
      success: true,
      message: "Research project deleted successfully",
    });
  } catch (error) {
    console.error("Admin research project DELETE error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete research project" },
      { status: 500 }
    );
  }
}
