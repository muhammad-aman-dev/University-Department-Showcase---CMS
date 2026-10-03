import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    await connectDB();

    const settings = await SiteSettings.findOne().lean();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Site settings API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load site settings",
      },
      { status: 500 }
    );
  }
}