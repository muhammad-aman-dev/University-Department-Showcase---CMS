import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { revalidateTag } from "next/cache";

import { connectDB } from "@/lib/db";
import Publication from "@/models/Publication";
import { getCurrentUser } from "@/lib/getCurrentUser";   
import {
  PUBLICATIONS_TAG,
  getPublicationTag,
} from "@/lib/data/publication-cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TYPES = [
  "Journal Article",
  "Conference Paper",
  "Book Chapter",
  "Book",
  "Thesis",
  "Technical Report",
  "Other",
];

const STATUSES = ["published", "draft"];

/* -------------------------------------------------- */
/* Helpers                                            */
/* -------------------------------------------------- */

function jsonResponse(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      status: 401,
      message: "You are not authenticated. Please log in again.",
    };
  }

  if (user.role !== "admin") {
    return {
      authorized: false,
      status: 403,
      message: "You do not have permission to manage publications.",
    };
  }

  return { authorized: true, user };
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function invalidatePublicationCaches(...slugs) {
  revalidateTag(PUBLICATIONS_TAG, "max");

  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidateTag(getPublicationTag(slug), "max");
  }
}

function validatePublication(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Invalid request body.";
  }

  if (typeof body.title !== "string" || !body.title.trim()) {
    return "Title is required.";
  }

  if (!normalizeSlug(body.slug)) {
    return "A valid slug is required.";
  }

  if (
    body.publicationType !== undefined &&
    !TYPES.includes(body.publicationType)
  ) {
    return "Invalid publication type.";
  }

  if (
    body.status !== undefined &&
    !STATUSES.includes(body.status)
  ) {
    return "Invalid publication status.";
  }

  if (
    body.publicationDate !== undefined &&
    body.publicationDate !== null &&
    body.publicationDate !== "" &&
    Number.isNaN(Date.parse(body.publicationDate))
  ) {
    return "Invalid publication date.";
  }

  if (
    body.authors !== undefined &&
    (!Array.isArray(body.authors) ||
      body.authors.some((author) => typeof author !== "string"))
  ) {
    return "Authors must be an array of strings.";
  }

  if (
    body.isFeatured !== undefined &&
    ![true, false, "true", "false"].includes(body.isFeatured)
  ) {
    return "Featured must be a boolean.";
  }

  if (
    body.order !== undefined &&
    (body.order === "" || !Number.isFinite(Number(body.order)))
  ) {
    return "Order must be a number.";
  }

  return null;
}

function buildPayload(body) {
  return {
    title: String(body.title || "").trim(),

    slug: normalizeSlug(body.slug),

    authors: Array.isArray(body.authors)
      ? body.authors
          .map((author) => author.trim())
          .filter(Boolean)
      : [],

    publicationType: body.publicationType || "Other",

    journalOrConference: String(
      body.journalOrConference || ""
    ).trim(),

    publisher: String(body.publisher || "").trim(),

    publicationDate:
      body.publicationDate && body.publicationDate !== ""
        ? new Date(body.publicationDate)
        : null,

    abstract: String(body.abstract || "").trim(),

    doi: String(body.doi || "").trim(),

    externalUrl: String(body.externalUrl || "").trim(),

    pdfUrl: String(body.pdfUrl || "").trim(),

    researchArea: String(body.researchArea || "").trim(),

    status: body.status || "draft",

    isFeatured:
      body.isFeatured === true || body.isFeatured === "true",

    order:
      body.order !== undefined && body.order !== ""
        ? Number(body.order)
        : 0,
  };
}

/* -------------------------------------------------- */
/* GET: Fetch all publications for admin              */
/* -------------------------------------------------- */

export async function GET() {
  try {
    const user = await requireAdmin();

    if (!user) {
      return jsonResponse(
        { success: false, message: "Unauthorized." },
        401
      );
    }

    await connectDB();

    const publications = await Publication.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return jsonResponse({
      success: true,
      data: publications.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Admin publications GET error:", error);

    return jsonResponse(
      {
        success: false,
        message: "Failed to fetch publications.",
      },
      500
    );
  }
}

/* -------------------------------------------------- */
/* POST: Create publication                           */
/* -------------------------------------------------- */

export async function POST(request) {
  try {
    const user = await requireAdmin();

    if (!user) {
      return jsonResponse(
        { success: false, message: "Unauthorized." },
        401
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        { success: false, message: "Invalid JSON request body." },
        400
      );
    }

    const validationError = validatePublication(body);

    if (validationError) {
      return jsonResponse(
        { success: false, message: validationError },
        400
      );
    }

    await connectDB();

    const payload = buildPayload(body);

    const existing = await Publication.findOne({
      slug: payload.slug,
    }).lean();

    if (existing) {
      return jsonResponse(
        {
          success: false,
          message: "A publication with this slug already exists.",
        },
        409
      );
    }

    const publication = await Publication.create(payload);

    invalidatePublicationCaches(publication.slug);

    return jsonResponse(
      {
        success: true,
        message: "Publication created successfully.",
        data: publication,
      },
      201
    );
  } catch (error) {
    console.error("Admin publications POST error:", error);

    if (error?.code === 11000) {
      return jsonResponse(
        {
          success: false,
          message: "A publication with this slug already exists.",
        },
        409
      );
    }

    return jsonResponse(
      {
        success: false,
        message: "Failed to create publication.",
      },
      500
    );
  }
}

/* -------------------------------------------------- */
/* PUT: Update publication                            */
/* -------------------------------------------------- */

export async function PUT(request) {
  try {
    const user = await requireAdmin();

    if (!user) {
      return jsonResponse(
        { success: false, message: "Unauthorized." },
        401
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        { success: false, message: "Invalid JSON request body." },
        400
      );
    }

    const { id } = body || {};

    if (!id) {
      return jsonResponse(
        {
          success: false,
          message: "Publication ID is required.",
        },
        400
      );
    }

    if (!mongoose.isValidObjectId(id)) {
      return jsonResponse(
        {
          success: false,
          message: "Invalid publication ID.",
        },
        400
      );
    }

    const validationError = validatePublication(body);

    if (validationError) {
      return jsonResponse(
        { success: false, message: validationError },
        400
      );
    }

    await connectDB();

    const current = await Publication.findById(id);

    if (!current) {
      return jsonResponse(
        {
          success: false,
          message: "Publication not found.",
        },
        404
      );
    }

    const payload = buildPayload(body);

    const duplicate = await Publication.findOne({
      slug: payload.slug,
      _id: { $ne: current._id },
    }).lean();

    if (duplicate) {
      return jsonResponse(
        {
          success: false,
          message: "A publication with this slug already exists.",
        },
        409
      );
    }

    const oldSlug = current.slug;

    Object.assign(current, payload);

    await current.save();

    invalidatePublicationCaches(oldSlug, current.slug);

    return jsonResponse({
      success: true,
      message: "Publication updated successfully.",
      data: current,
    });
  } catch (error) {
    console.error("Admin publications PUT error:", error);

    if (error?.code === 11000) {
      return jsonResponse(
        {
          success: false,
          message: "A publication with this slug already exists.",
        },
        409
      );
    }

    return jsonResponse(
      {
        success: false,
        message: "Failed to update publication.",
      },
      500
    );
  }
}

/* -------------------------------------------------- */
/* DELETE: Delete publication                         */
/* -------------------------------------------------- */

export async function DELETE(request) {
  try {
    const user = await requireAdmin();

    if (!user) {
      return jsonResponse(
        { success: false, message: "Unauthorized." },
        401
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonResponse(
        {
          success: false,
          message: "Publication ID is required.",
        },
        400
      );
    }

    if (!mongoose.isValidObjectId(id)) {
      return jsonResponse(
        {
          success: false,
          message: "Invalid publication ID.",
        },
        400
      );
    }

    await connectDB();

    const publication = await Publication.findById(id);

    if (!publication) {
      return jsonResponse(
        {
          success: false,
          message: "Publication not found.",
        },
        404
      );
    }

    const slug = publication.slug;

    await publication.deleteOne();

    invalidatePublicationCaches(slug);

    return jsonResponse({
      success: true,
      message: "Publication deleted successfully.",
    });
  } catch (error) {
    console.error("Admin publications DELETE error:", error);

    return jsonResponse(
      {
        success: false,
        message: "Failed to delete publication.",
      },
      500
    );
  }
}