
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Faculty from "@/models/Faculty";

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
  if (value === undefined) return undefined;
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

  const stringFields = [
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

  for (const field of stringFields) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "string") {
        throw new Error(`${field} must be a string.`);
      }

      payload[field] = body[field].trim();
    }
  }

  if (payload.name !== undefined && !payload.name) {
    throw new Error("Name is required.");
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

  payload.publications = normalizeEntries(body.publications, [
    "title",
    "authors",
    "journal",
    "year",
    "doi",
    "url",
    "type",
  ]);

  payload.researchProjects = normalizeEntries(body.researchProjects, [
    "title",
    "description",
    "role",
    "fundingAgency",
    "startYear",
    "endYear",
    "status",
    "url",
  ]);

  payload.books = normalizeEntries(body.books, [
    "title",
    "authors",
    "publisher",
    "year",
    "isbn",
    "url",
    "type",
  ]);

  for (const field of ["publications", "researchProjects", "books"]) {
    if (payload[field] === undefined) {
      delete payload[field];
    }
  }

  return payload;
}

async function makeUniqueSlug(value) {
  const base = slugify(value) || "faculty";
  let slug = base;
  let counter = 1;

  while (await Faculty.exists({ slug })) {
    slug = `${base}-${counter++}`;
  }

  return slug;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const faculty = await Faculty.find({})
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(faculty)),
    });
  } catch (error) {
    console.error("Admin faculty GET error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const payload = buildPayload(body);

    if (!payload.name || !payload.designation) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and designation are required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    payload.slug = await makeUniqueSlug(payload.slug || payload.name);

    if (payload.isHOD) {
      await Faculty.updateMany(
        { isHOD: true },
        { $set: { isHOD: false } }
      );
    }

    const created = await Faculty.create(payload);

    revalidateTag("faculty", "max");

    return NextResponse.json(
      {
        success: true,
        data: JSON.parse(JSON.stringify(created)),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin faculty POST error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "That faculty slug already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create faculty member.",
      },
      { status: 400 }
    );
  }
}
