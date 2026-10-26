import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  FolderOpen,
  GraduationCap,
  Handshake,
  Users,
} from "lucide-react";

import {
  getResearchProjectBySlug,
  getActiveResearchAreaByName,
} from "@/lib/data/researchDetails";

import BackButton from "@/components/BackButton";
import RichTextDisplay from "@/components/shared/RichTextDisplay";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");

function getCanonicalUrl(slug) {
  const path = `/research/projects/${encodeURIComponent(slug)}`;
  return siteUrl ? `${siteUrl}${path}` : path;
}

function safeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en", {
    day: "numeric",
    month: "long",
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

function DetailItem({ icon: Icon, label, children }) {
  if (
    children === null ||
    children === undefined ||
    children === ""
  ) {
    return null;
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <div className="mt-1 wrap-break-words text-sm font-medium leading-6 text-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getResearchProjectBySlug(slug);

  if (!project) {
    return {
      title: "Research Project Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${project.title} | Research`;
  const description =
    project.shortDescription ||
    project.description ||
    `Explore the research project ${project.title}, including its team, objectives, and outcomes.`;

  const canonical = getCanonicalUrl(project.slug);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
    twitter: {
      card: project.image ? "summary_large_image" : "summary",
      title,
      description,
      ...(project.image ? { images: [project.image] } : {}),
    },
  };
}

export default async function ResearchProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getResearchProjectBySlug(slug);

  if (!project) notFound();

  const area = await getActiveResearchAreaByName(project.researchArea);
  const canonical = getCanonicalUrl(project.slug);

  const startDate = formatDate(project.startDate);
  const endDate = formatDate(project.endDate);

  const description =
    project.shortDescription || project.description || "";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    name: project.title,
    description,
    url: canonical,
    ...(project.image ? { image: project.image } : {}),
    ...(project.principalInvestigator
      ? {
          creator: {
            "@type": "Person",
            name: project.principalInvestigator,
          },
        }
      : {}),
    ...(project.fundingOrganization
      ? {
          funder: {
            "@type": "Organization",
            name: project.fundingOrganization,
          },
        }
      : {}),
    ...(startDate
      ? { startDate: new Date(project.startDate).toISOString() }
      : {}),
    ...(endDate
      ? { endDate: new Date(project.endDate).toISOString() }
      : {}),
    ...(area
      ? {
          about: {
            "@type": "Thing",
            name: area.name,
            url: siteUrl
              ? `${siteUrl}/research/areas/${encodeURIComponent(area.slug)}`
              : `/research/areas/${encodeURIComponent(area.slug)}`,
          },
        }
      : {}),
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
        ...(area
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: area.name,
                item: siteUrl
                  ? `${siteUrl}/research/areas/${encodeURIComponent(area.slug)}`
                  : `/research/areas/${encodeURIComponent(area.slug)}`,
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: area ? 4 : 3,
          name: project.title,
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
  fallbackUrl="/research/projects"
  label="Research & Innovation"
/>

          <div className="mt-7 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-amber-400" />
            <span className="h-px w-16 bg-white/20" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Project details
            </span>
          </div>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${getStatusClass(
                    project.status
                  )}`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {project.status}
                </span>

                {project.isFeatured ? (
                  <span className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-blue-950">
                    Featured project
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                {project.title}
              </h1>

              {project.shortDescription || project.description ? (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base sm:leading-8">
                  {project.shortDescription || project.description}
                </p>
              ) : null}

              {area ? (
                <Link
                  href={`/research/areas/${area.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
                >
                  <FolderOpen className="h-4 w-4" />
                  {area.name}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-3">
                {project.documentUrl ? (
                  <a
                    href={project.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-blue-950 transition hover:bg-amber-300"
                  >
                    <FileText className="h-4 w-4" />
                    View project document
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}

                {project.projectUrl ? (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    External project link
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  fetchPriority="high"
                  className="aspect-16/10 w-full object-cover"
                />
              ) : (
                <div className="flex aspect-16/10 items-center justify-center bg-linear-to-br from-blue-900 to-blue-800">
                  <FolderOpen className="h-20 w-20 text-white/60" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project information */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            {project.description ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
                <h2 className="text-2xl font-bold text-blue-950">
                  About this project
                </h2>

                <div className="mt-6 text-base leading-8 text-slate-600">
  <RichTextDisplay
    content={project.description}
    className="text-base leading-8"
  />
</div>
              </article>
            ) : project.shortDescription ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
                <h2 className="text-2xl font-bold text-blue-950">
                  About this project
                </h2>
                <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">
                  {project.shortDescription}
                </p>
              </article>
            ) : null}

            {project.teamMembers?.length > 0 ? (
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-950">
                      Research team
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      People contributing to this project
                    </p>
                  </div>
                </div>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {project.teamMembers.map((member, index) => (
                    <li
                      key={`${member}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-900">
                        {String(member).trim().charAt(0).toUpperCase() || "R"}
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {member}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-bold text-blue-950">
              Project information
            </h2>

            <div className="mt-6 space-y-6">
              <DetailItem
                icon={GraduationCap}
                label="Principal investigator"
              >
                {project.principalInvestigator}
              </DetailItem>

              <DetailItem icon={Handshake} label="Funding organization">
                {project.fundingOrganization}
              </DetailItem>

              <DetailItem icon={FolderOpen} label="Research area">
                {area ? (
                  <Link
                    href={`/research/areas/${area.slug}`}
                    className="text-blue-800 hover:underline"
                  >
                    {area.name}
                  </Link>
                ) : (
                  project.researchArea
                )}
              </DetailItem>

              <DetailItem icon={CalendarDays} label="Start date">
                {startDate}
              </DetailItem>

              <DetailItem icon={Clock3} label="End date">
                {endDate}
              </DetailItem>

              <DetailItem icon={Users} label="Team members">
                {project.teamMembers?.length
                  ? project.teamMembers.length
                  : null}
              </DetailItem>
            </div>

            {project.documentUrl || project.projectUrl ? (
              <div className="mt-7 space-y-3 border-t border-slate-100 pt-6">
                {project.documentUrl ? (
                  <a
                    href={project.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
                  >
                    <FileText className="h-4 w-4" />
                    Open project document
                  </a>
                ) : null}

                {project.projectUrl ? (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-900"
                  >
                    Visit project website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <Link
          href={area ? `/research/areas/${area.slug}` : "/research"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950"
        >
          <ArrowLeft className="h-4 w-4" />
          {area ? `Back to ${area.name}` : "Browse all research"}
        </Link>
      </div>
    </main>
  );
}