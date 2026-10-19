import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  FolderOpen,
} from "lucide-react";

import {
  getResearchAreaBySlug,
  getProjectsForResearchArea,
} from "@/lib/data/researchDetails";
import BackButton from "@/components/BackButton";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");

function getCanonicalUrl(slug) {
  const path = `/research/areas/${encodeURIComponent(slug)}`;
  return siteUrl ? `${siteUrl}${path}` : path;
}

function safeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function getBackUrl() {
  if (window.history.back().includes(siteUrl)) {
    return window.history.back();
  } else {
    return "/reserach/areas";
  }
}

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en", {
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  const styles = {
    planned: "bg-amber-50 text-amber-800 ring-amber-200",
    ongoing: "bg-blue-50 text-blue-800 ring-blue-200",
    completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  };

  return (
    styles[String(status || "").toLowerCase()] ||
    "bg-slate-100 text-slate-700 ring-slate-200"
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const area = await getResearchAreaBySlug(slug);

  if (!area) {
    return {
      title: "Research Area Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${area.name} (Research)`;
  const description =
    area.shortDescription ||
    area.description ||
    `Explore research, expertise, and projects in ${area.name}.`;

  const canonical = getCanonicalUrl(area.slug);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      ...(area.image ? { images: [{ url: area.image }] } : {}),
    },
    twitter: {
      card: area.image ? "summary_large_image" : "summary",
      title,
      description,
      ...(area.image ? { images: [area.image] } : {}),
    },
  };
}

export default async function ResearchAreaDetailPage({ params }) {
  const { slug } = await params;
  const area = await getResearchAreaBySlug(slug);

  if (!area) notFound();

  const projects = await getProjectsForResearchArea(area.name);
  const canonical = getCanonicalUrl(area.slug);

  const description = area.shortDescription || area.description || "";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: area.name,
    description,
    url: canonical,
    ...(area.image ? { image: area.image } : {}),
    isPartOf: {
      "@type": "CollectionPage",
      name: "Research",
      url: siteUrl ? `${siteUrl}/research` : "/research",
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
          item: siteUrl ? `${siteUrl}/research` : "/research",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: area.name,
          item: canonical,
        },
      ],
    },
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(structuredData),
        }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-blue-950 px-5 py-12 text-white sm:px-8 sm:py-16 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom, black, transparent 95%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, transparent 95%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
        />

        <div className="mx-auto max-w-7xl">
          <BackButton
            fallbackUrl="/research/areas"
            label="Research & Innovation"
          />
          <div className="mt-7 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-amber-400" />
            <span className="h-px w-16 bg-white/20" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Research area
            </span>
          </div>

          <div className="mt-7 grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                {area.name}
              </h1>

              {area.shortDescription || area.description ? (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base sm:leading-8">
                  {area.shortDescription || area.description}
                </p>
              ) : null}

              {projects.length > 0 ? (
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="#area-projects"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-blue-950 transition hover:bg-amber-300"
                  >
                    Explore projects
                    <ArrowRight className="h-4 w-4" />
                  </a>

                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-blue-100">
                    <FolderOpen className="h-4 w-4 text-amber-400" />
                    {projects.length}{" "}
                    {projects.length === 1 ? "project" : "projects"}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl">
              {area.image ? (
                <img
                  src={area.image}
                  alt={area.name}
                  className="aspect-16/10 w-full object-cover"
                  fetchPriority="high"
                />
              ) : (
                <div className="flex aspect-16/10 items-center justify-center bg-linear-to-br from-blue-900 to-blue-800">
                  <FlaskConical className="h-20 w-20 text-white/60" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      {area.description ? (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-blue-950">
                  About this research area
                </h2>
              </div>

              <div className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
                {area.description}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Projects: do not render this section when there are no projects */}
      {projects.length > 0 ? (
        <section id="area-projects" className="scroll-mt-8 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                Research portfolio
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
                Projects in {area.name}
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Explore the projects associated with this research area.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const start = formatDate(project.startDate);
                const end = formatDate(project.endDate);

                return (
                  <article
                    key={project._id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link
                      href={`/research/projects/${project.slug}`}
                      className="block"
                      aria-label={`View ${project.title}`}
                    >
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          className="aspect-[16/9 w-full bg-slate-100 object-cover transition group-hover:brightness-95"
                        />
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-linear-to-br from-blue-950 to-blue-800">
                          <FolderOpen className="h-12 w-12 text-white/70" />
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-5">
                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ring-inset ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>

                      <h3 className="mt-4 text-xl font-bold text-blue-950 transition group-hover:text-blue-800">
                        <Link href={`/research/projects/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h3>

                      {project.shortDescription || project.description ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                          {project.shortDescription || project.description}
                        </p>
                      ) : null}

                      {project.principalInvestigator ? (
                        <p className="mt-4 text-sm text-slate-600">
                          <span className="font-semibold text-slate-800">
                            Principal Investigator:
                          </span>{" "}
                          {project.principalInvestigator}
                        </p>
                      ) : null}

                      {start || end ? (
                        <p className="mt-2 text-sm text-slate-500">
                          {start || "Start date unavailable"}
                          {end ? ` – ${end}` : ""}
                        </p>
                      ) : null}

                      <Link
                        href={`/research/projects/${project.slug}`}
                        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-blue-800 hover:text-blue-950"
                      >
                        View project
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse all research
        </Link>
      </div>
    </main>
  );
}
