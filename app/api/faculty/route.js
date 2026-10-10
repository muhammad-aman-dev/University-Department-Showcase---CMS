
import { NextResponse } from "next/server";
import { getFaculty } from "@/lib/data/faculty";

export async function GET() {
  try {
    const faculty = await getFaculty();

    return NextResponse.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    console.error("Faculty API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load faculty",
      },
      { status: 500 }
    );
  }
}
