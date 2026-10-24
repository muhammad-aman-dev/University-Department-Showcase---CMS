
import { unstable_cache } from "next/cache";
import { connectDB } from "../db";
import Publication from "@/models/Publication";
import {
  getPublicationTag,
} from "@/lib/data/publication-cache";

export async function getPublicationBySlug(slug) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();

  if (!normalizedSlug) return null;

  const getCachedPublication = unstable_cache(
    async () => {
      await connectDB();

      const publication = await Publication.findOne({
        slug: normalizedSlug,
        status: "published",
      })
        .lean()
        .exec();

      if (!publication) return null;

      return {
        ...publication,
        _id: publication._id.toString(),
        publicationDate: publication.publicationDate
          ? publication.publicationDate.toISOString()
          : null,
        createdAt: publication.createdAt
          ? publication.createdAt.toISOString()
          : null,
        updatedAt: publication.updatedAt
          ? publication.updatedAt.toISOString()
          : null,
      };
    },
    ["publication-by-slug", normalizedSlug],
    {
      revalidate: 60 * 60 * 24 * 3,
      tags: [getPublicationTag(normalizedSlug)],
    }
  );

  return getCachedPublication();
}
