import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data/site-settings";

export async function GET() {
  try {
    const settings = await getSiteSettings();

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
      {
        status: 500,
      }
    );
  }
}