
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import ResearchArea from "@/models/ResearchArea";
import { getCurrentUser } from "@/lib/getCurrentUser";

const slugify = (value = "") =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

    const areas = await ResearchArea.find()
      .sort({ order: 1, createdAt: -1, _id: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(areas)),
    });
  } catch (error) {
    console.error("Admin research areas GET error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load research areas" },
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

    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Research area name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const slug = slugify(body.slug || body.name);

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "A valid slug is required" },
        { status: 400 }
      );
    }

    const area = await ResearchArea.create({
      name: body.name.trim(),
      slug,
      shortDescription: body.shortDescription ?? "",
      description: body.description ?? "",
      image: body.image ?? "",
      icon: body.icon ?? "",
      status: body.status ?? "active",
      isFeatured: body.isFeatured ?? false,
      order: body.order ?? 0,
    });

    revalidateTag("research-areas", "max");

    return NextResponse.json(
      {
        success: true,
        message: "Research area created successfully",
        data: area.toObject(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin research areas POST error:", error);

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
      { success: false, message: "Failed to create research area" },
      { status: 500 }
    );
  }
}
