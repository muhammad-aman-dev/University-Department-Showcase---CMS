import { NextResponse } from "next/server";
import { getDepartmentData } from "@/lib/data/homepage";

export async function GET() {
  try {
    const data = await getDepartmentData();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Homepage API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load homepage data",
      },
      {
        status: 500,
      }
    );
  }
}