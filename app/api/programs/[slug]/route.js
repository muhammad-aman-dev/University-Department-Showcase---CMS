import { NextResponse } from "next/server";
import { getProgramBySlug } from "@/lib/data/programs";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const program = await getProgramBySlug(slug);

    if (!program) {
      return NextResponse.json(
        {
          success: false,
          message: "Program not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Public program GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load program",
      },
      { status: 500 }
    );
  }
}