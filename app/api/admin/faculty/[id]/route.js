
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Faculty from "@/models/Faculty";

// Keep this validation consistent with the collection route.
const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Research Officer",
  "Visiting Faculty",
  "Lab Engineer",
  "Lab Instructor",
  "Teaching Assistant",
  "Other",
];

const STRING_FIELDS = [
  "name",
  "slug",
  "designation",
  "qualification",
  "specialization",
  "email",
  "phone",
  "image",
  "bio",
  "office",
  "status",
];

const RESEARCH_FIELDS = {
  publications: [
    "title",
    "authors",
    "journal",
    "year",
    "doi",
    "url",
    "type",
  ],
  researchProjects: [
    "title",
    "description",
    "role",
    "fundingAgency",
    "startYear",
    "endYear",
    "status",
    "url",
  ],
  books: [
    "title",
    "authors",
    "publisher",
    "year",
    "isbn",
    "url",
    "type",
  ],
};

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeEntries(value, fields) {
  if (!Array.isArray(value)) {
    throw new Error("Research fields must be arrays.");
  }

  return value.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Invalid research entry.");
    }

    const result = {};

    for (const field of fields) {
      if (entry[field] !== undefined) {
        result[field] =
          typeof entry[field] === "string"
            ? entry[field].trim()
            : entry[field];
      }
    }

    if (!result.title || typeof result.title !== "string") {
      throw new Error("Every research entry requires a title.");
    }

    return result;
  });
}

function buildPayload(body) {
  const payload = {};

  for (const field of STRING_FIELDS) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "string") {
        throw new Error(`${field} must be a string.`);
      }

      payload[field] = body[field].trim();
    }
  }

  if (payload.name !== undefined && !payload.name) {
    throw new Error("Name cannot be empty.");
  }

  if (
    payload.designation !== undefined &&
    !DESIGNATIONS.includes(payload.designation)
  ) {
    throw new Error("Invalid designation.");
  }

  if (
    payload.status !== undefined &&
    !["active", "inactive"].includes(payload.status)
  ) {
    throw new Error("Invalid faculty status.");
  }

  if (payload.email) {
    payload.email = payload.email.toLowerCase();
  }

  if (payload.slug !== undefined) {
    payload.slug = slugify(payload.slug);

    if (!payload.slug) {
      throw new Error("Slug cannot be empty.");
    }
  }

  if (body.order !== undefined) {
    const order = Number(body.order);

    if (!Number.isInteger(order)) {
      throw new Error("Order must be an integer.");
    }

    payload.order = order;
  }

  for (const field of ["isHOD", "isFeatured"]) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "boolean") {
        throw new Error(`${field} must be a boolean.`);
      }

      payload[field] = body[field];
    }
  }

  if (body.researchInterests !== undefined) {
    if (
      !Array.isArray(body.researchInterests) ||
      !body.researchInterests.every(
        (item) => typeof item === "string"
      )
    ) {
      throw new Error("Research interests must be an array of strings.");
    }

    payload.researchInterests = [
      ...new Set(
        body.researchInterests.map((item) => item.trim()).filter(Boolean)
      ),
    ];
  }

  for (const [field, allowedFields] of Object.entries(RESEARCH_FIELDS)) {
    if (body[field] !== undefined) {
      payload[field] = normalizeEntries(body[field], allowedFields);
    }
  }

  return payload;
}


export async function PUT(request, { params }) {
    try {
      const user = await getCurrentUser();
  
      if (!user) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
  
      const { id } = await params;
  
      if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid faculty ID." },
          { status: 400 }
        );
      }
  
      const body = await request.json();
  
      await connectDB();
  
      // Validate and normalize the incoming fields.
      const payload = buildPayload(body);
  
      console.log("Faculty update request:", {
        id,
        fields: Object.keys(payload),
        publications: payload.publications?.length,
        researchProjects: payload.researchProjects?.length,
        books: payload.books?.length,
      });
  
      const existing = await Faculty.findById(id);
  
      if (!existing) {
        return NextResponse.json(
          { success: false, message: "Faculty member not found." },
          { status: 404 }
        );
      }
  
      // Only one faculty member can be HOD.
      if (payload.isHOD === true) {
        await Faculty.updateMany(
          { _id: { $ne: id }, isHOD: true },
          { $set: { isHOD: false } }
        );
      }
  
      // Explicitly assign submitted fields.
      for (const [field, value] of Object.entries(payload)) {
        existing.set(field, value);
      }
  
      // Save the updated document.
      await existing.save();
  
      // Fetch the persisted document again.
      const savedFaculty = await Faculty.findById(id).lean();
  
      if (!savedFaculty) {
        throw new Error("Faculty was updated but could not be retrieved.");
      }
  
      console.log("Faculty saved successfully:", {
        id: savedFaculty._id.toString(),
        publications: savedFaculty.publications?.length,
        researchProjects: savedFaculty.researchProjects?.length,
        books: savedFaculty.books?.length,
      });
  
      revalidateTag("faculty", "max");
  
      return NextResponse.json({
        success: true,
        message: "Faculty profile updated successfully.",
        data: savedFaculty,
      });
    } catch (error) {
      console.error("Admin faculty PUT error:", error);
  
      if (error.code === 11000) {
        return NextResponse.json(
          {
            success: false,
            message: "That faculty slug already exists.",
          },
          { status: 409 }
        );
      }
  
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to update faculty member.",
        },
        { status: 400 }
      );
    }
  }
  

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid faculty ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await Faculty.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Faculty member not found." },
        { status: 404 }
      );
    }

    revalidateTag("faculty", "max");

    return NextResponse.json({
      success: true,
      message: "Faculty member deleted successfully.",
    });
  } catch (error) {
    console.error("Admin faculty DELETE error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete faculty member." },
      { status: 500 }
    );
  }
}
