import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { connectDB } from "@/lib/db";
import HomePage from "@/models/HomePage";
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

    let homePage = await HomePage.findOne();

    if (!homePage) {
      homePage = await HomePage.create({});
    }

    return NextResponse.json({
      success: true,
      data: homePage.toObject(),
    });
  } catch (error) {
    console.error("Admin homepage GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load homepage",
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

    let homePage = await HomePage.findOne();

    if (!homePage) {
      homePage = new HomePage();
    }

    Object.assign(homePage, body);

    await homePage.save();

    revalidateTag("homepage-data", "max");

    return NextResponse.json({
      success: true,
      message: "Homepage updated successfully",
      data: homePage.toObject(),
    });
  } catch (error) {
    console.error("Admin homepage PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update homepage",
      },
      { status: 500 }
    );
  }
}