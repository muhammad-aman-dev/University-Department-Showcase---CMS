
import { NextResponse } from "next/server";
import { getResearchAreas } from "@/lib/data/researchAreas";

export async function GET() {
  try {
    const areas = await getResearchAreas();

    return NextResponse.json({
      success: true,
      data: areas,
    });
  } catch (error) {
    console.error("Research areas API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load research areas",
      },
      { status: 500 }
    );
  }
}
