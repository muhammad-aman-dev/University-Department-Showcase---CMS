import { NextResponse } from "next/server";
import { getPrograms } from "@/lib/data/programs";

export async function GET() {
  try {
    const programs = await getPrograms();

    return NextResponse.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Public programs GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load programs",
      },
      { status: 500 }
    );
  }
}