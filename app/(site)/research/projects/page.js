import ResearchProjectsClient from "@/components/reserach/ResearchProjectsClient";
import { getResearchProjects } from "@/lib/data/researchProjects";
import { buildCollectionJsonLd, serializeJsonLd } from "@/lib/researchSeo";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
const path = "/research/projects";
const canonicalUrl = siteUrl ? `${siteUrl}${path}` : undefined;

const pageName = "Research Projects";
const pageTitle = "Research Projects | Department Research";
const pageDescription =
  "Browse ongoing, planned, and completed research projects led by our researchers and collaborators.";

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

export default async function ResearchProjectsPage() {
  let initialResult = {
    projects: [],
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
    areas: [],
  };
  let loadError = false;

  try {
    initialResult =
      (await getResearchProjects({
        page: 1,
        limit: 9,
        status: "all",
        sort: "newest",
      })) || initialResult;
  } catch (error) {
    loadError = true;
    console.error("Failed to load research projects:", error);
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
      <ResearchProjectsClient
        initialResult={initialResult}
        initialError={loadError}
      />
    </>
  );
}