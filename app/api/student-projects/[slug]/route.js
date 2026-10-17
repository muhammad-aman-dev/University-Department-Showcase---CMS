
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import StudentProject from "@/models/StudentProject";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Project slug is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await StudentProject.findOne({
      slug: slug.toLowerCase().trim(),
    }).lean();

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Public student project GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load project",
      },
      { status: 500 }
    );
  }
}
