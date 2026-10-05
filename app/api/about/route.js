import { NextResponse } from "next/server";
import { getAboutPage } from "@/lib/data/about";

export async function GET() {
  try {
    const about = await getAboutPage();

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
      {
        status: 500,
      }
    );
  }
}