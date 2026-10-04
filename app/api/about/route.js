import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AboutPage from "@/models/AboutPage";

export async function GET() {
  try {
    await connectDB();

    const about = await AboutPage.findOne().lean();

    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("About page API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load about page",
      },
      { status: 500 }
    );
  }
}