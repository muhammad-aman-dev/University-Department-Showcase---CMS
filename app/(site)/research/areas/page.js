import ResearchAreasClient from "@/components/research/ResearchAreasClient";
import { getResearchAreas } from "@/lib/data/researchAreas";
import { buildCollectionJsonLd, serializeJsonLd } from "@/lib/researchSeo";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
const path = "/research/areas";
const canonicalUrl = siteUrl ? `${siteUrl}${path}` : undefined;

const pageName = "Research Areas";
const pageTitle = "Research Areas | Department Research";
const pageDescription =
  "Explore the specialist research areas and academic themes guiding our department's research and inquiry.";

export const metadata = {
  title: pageName,
  description: pageDescription,
  alternates: { canonical: canonicalUrl || path },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
    siteName: "Department Research",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
  robots: { index: true, follow: true },
};

export default async function ResearchAreasPage() {
  let areas = [];
  let loadError = false;

  try {
    areas = (await getResearchAreas()) || [];
  } catch (error) {
    loadError = true;
    console.error("Failed to load research areas:", error);
  }

  const structuredData = buildCollectionJsonLd({
    siteUrl,
    path,
    name: pageName,
    description: pageDescription,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <ResearchAreasClient initialAreas={areas} initialError={loadError} />
    </>
  );
}