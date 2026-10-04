import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db";
import AboutPage from "@/models/AboutPage";
import { getCurrentUser } from "@/lib/getCurrentUser";

const allowedFields = [
  "title",
  "introduction",
  "history",
  "vision",
  "mission",
  "objectives",
  "scope",
  "facilities",
  "pageImage",
];

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

    let about = await AboutPage.findOne().lean();

    if (!about) {
      await AboutPage.create({});

      about = await AboutPage.findOne().lean();
    }

    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Admin about GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load about page",
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

    const updateData = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    let about = await AboutPage.findOne();

    if (!about) {
      about = new AboutPage();
    }

    Object.assign(about, updateData);

    await about.save();

    revalidateTag("about-page");

    return NextResponse.json({
      success: true,
      message: "About page updated successfully",
      data: about.toObject(),
    });
  } catch (error) {
    console.error("Admin about PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update about page",
      },
      { status: 500 }
    );
  }
}