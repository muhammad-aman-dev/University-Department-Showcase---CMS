
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import ResearchArea from "@/models/ResearchArea";
import { getCurrentUser } from "@/lib/getCurrentUser";

const allowedFields = [
  "name",
  "slug",
  "shortDescription",
  "description",
  "image",
  "icon",
  "status",
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

function invalidId(id) {
  return !mongoose.isValidObjectId(id);
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

    if (invalidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid research area ID" },
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

    if (updateData.name !== undefined) {
      if (
        typeof updateData.name !== "string" ||
        !updateData.name.trim()
      ) {
        return NextResponse.json(
          { success: false, message: "Name cannot be empty" },
          { status: 400 }
        );
      }

      updateData.name = updateData.name.trim();
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

    const area = await ResearchArea.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!area) {
      return NextResponse.json(
        { success: false, message: "Research area not found" },
        { status: 404 }
      );
    }

    revalidateTag("research-areas", "max");

    return NextResponse.json({
      success: true,
      message: "Research area updated successfully",
      data: area.toObject(),
    });
  } catch (error) {
    console.error("Admin research area PUT error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "This slug is already in use" },
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
      { success: false, message: "Failed to update research area" },
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

    if (invalidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid research area ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const area = await ResearchArea.findByIdAndDelete(id);

    if (!area) {
      return NextResponse.json(
        { success: false, message: "Research area not found" },
        { status: 404 }
      );
    }

    revalidateTag("research-areas", "max");

    return NextResponse.json({
      success: true,
      message: "Research area deleted successfully",
    });
  } catch (error) {
    console.error("Admin research area DELETE error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete research area" },
      { status: 500 }
    );
  }
}
