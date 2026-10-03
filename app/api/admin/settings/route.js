import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({});
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Admin settings GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load settings",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings();
    }

    Object.assign(settings, body);

    await settings.save();

    // Fresh data for the public website
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/programs");
    revalidatePath("/faculty");
    revalidatePath("/research");
    revalidatePath("/projects");
    revalidatePath("/news");
    revalidatePath("/events");
    revalidatePath("/contact");

    return NextResponse.json({
      success: true,
      message: "Site settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Admin settings PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update settings",
      },
      { status: 500 }
    );
  }
}