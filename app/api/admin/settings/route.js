import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
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

    let settings = await SiteSettings.findOne().lean();

    if (!settings) {
      settings = await SiteSettings.create({});
      settings = settings.toObject();
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

    /*
     * Only accept fields that belong to SiteSettings.
     * This prevents arbitrary request fields from being saved.
     */
    const allowedFields = [
      "universityName",
      "departmentName",
      "facultyName",
      "logo",
      "favicon",
      "email",
      "phone",
      "address",
      "websiteUrl",
      "socialLinks",
      "footerDescription",
      "copyrightText",
      "seo",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        settings[field] = body[field];
      }
    }

    await settings.save();

    /*
     * Invalidate the cached public SiteSettings response.
     */
    revalidateTag("site-settings");

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