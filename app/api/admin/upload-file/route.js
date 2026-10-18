import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";

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

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid, non-empty file",
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

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".txt",
    ];

    const extension = path.extname(file.name).toLowerCase();

    if (
      !allowedExtensions.includes(extension) ||
      !allowedTypes.includes(file.type)
    ) {
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

    const buffer = Buffer.from(await file.arrayBuffer());

    // Include the extension in the public ID for raw files.
    const publicId = `${uuidv4()}${extension}`;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `cs-department/${folder}`,
          public_id: publicId,
          resource_type: "raw",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (!result) {
            reject(new Error("Cloudinary returned no upload result"));
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
        originalName: path.basename(file.name),
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
