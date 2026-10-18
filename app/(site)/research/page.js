import ResearchPageClient from "./ResearchPageClient";
import { getResearchAreas } from "@/lib/data/researchAreas";
import { getResearchProjects } from "@/lib/data/researchProjects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

const canonicalUrl = siteUrl ? `${siteUrl}/research` : undefined;

const pageTitle = "Research & Innovation | Department Research";

const pageDescription =
  "Explore research areas, ongoing projects, completed studies, and academic initiatives from our department.";

export const metadata = {
  title: "Research & Innovation",
  description: pageDescription,

  alternates: {
    canonical: canonicalUrl || "/research",
  },

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

  robots: {
    index: true,
    follow: true,
  },
};

function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function ResearchPage() {
  let areas = [];
  let initialResult = {
    projects: [],
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  };

  let areasLoadError = false;
  let projectsLoadError = false;

  // Fetch these independently so one failed request does not
  // prevent the other section from rendering.
  const [areasResult, projectsResult] = await Promise.allSettled([
    getResearchAreas(),
    getResearchProjects({
      page: 1,
      limit: 9,
      status: "all",
      sort: "newest",
    }),
  ]);

  if (areasResult.status === "fulfilled") {
    areas = areasResult.value || [];
  } else {
    areasLoadError = true;
    console.error("Failed to load research areas:", areasResult.reason);
  }

  if (projectsResult.status === "fulfilled") {
    initialResult = projectsResult.value || initialResult;
  } else {
    projectsLoadError = true;
    console.error("Failed to load research projects:", projectsResult.reason);
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
    inLanguage: "en",
    about: {
      "@type": "Thing",
      name: "Academic research and innovation",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          ...(siteUrl ? { item: siteUrl } : {}),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Research",
          ...(canonicalUrl ? { item: canonicalUrl } : {}),
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(structuredData),
        }}
      />

      <ResearchPageClient
        initialAreas={areas}
        initialResult={initialResult}
        initialAreasError={areasLoadError}
        initialProjectsError={projectsLoadError}
      />
    </>
  );
}