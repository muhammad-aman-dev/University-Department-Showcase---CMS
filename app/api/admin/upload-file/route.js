import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import cloudinary from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const runtime = "nodejs";

export async function POST(request) {
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

    const formData = await request.formData();

    const file = formData.get("file");
    const folder = formData.get("folder") || "documents";

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file provided",
        },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      "application/vnd.ms-excel",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "application/vnd.ms-powerpoint",

      "application/vnd.openxmlformats-officedocument.presentationml.presentation",

      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX and TXT files are allowed",
        },
        { status: 400 }
      );
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "File size must be less than 20MB",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `cs-department/${folder}`,
          public_id: uuidv4(),
          resource_type: "raw",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.name,
        format: result.format,
        size: file.size,
      },
    });
  } catch (error) {
    console.error("Cloudinary file upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file",
      },
      { status: 500 }
    );
  }
}