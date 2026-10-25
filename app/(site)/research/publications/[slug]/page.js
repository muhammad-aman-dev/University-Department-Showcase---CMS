import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  FileText,
  FolderOpen,
  GraduationCap,
  BookOpen,
  Users,
  Fingerprint,
  Building2,
  Star,
} from "lucide-react";

import { getPublicationBySlug } from "@/lib/data/publications";
import BackButton from "@/components/BackButton";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");

export const revalidate = 259200;

function getCanonicalUrl(slug) {
  const path = `/publications/${encodeURIComponent(slug)}`;
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
    timeZone: "UTC",
  });
}

function getDoiUrl(doi) {
  if (!doi) return null;

  const normalized = String(doi)
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");

  return normalized ? `https://doi.org/${normalized}` : null;
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
  const publication = await getPublicationBySlug(slug);

  if (!publication) {
    return {
      title: "Publication Not Found | Department",
      robots: { index: false, follow: false },
    };
  }

  const title = `${publication.title} | Department Publications`;

  const description =
    publication.abstract?.slice(0, 155) ||
    `Read ${publication.title}, a research publication from the department.`;

  const canonical = getCanonicalUrl(publication.slug);

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
      ...(publication.publicationDate
        ? {
            publishedTime: new Date(
              publication.publicationDate
            ).toISOString(),
          }
        : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PublicationDetailPage({ params }) {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);

  if (!publication) notFound();

  const canonical = getCanonicalUrl(publication.slug);
  const publicationDate = formatDate(publication.publicationDate);
  const doiUrl = getDoiUrl(publication.doi);

  const authors = Array.isArray(publication.authors)
    ? publication.authors.filter(Boolean)
    : [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: publication.title,
    name: publication.title,
    url: canonical,

    ...(publication.abstract
      ? { description: publication.abstract }
      : {}),

    ...(publicationDate
      ? {
          datePublished: new Date(
            publication.publicationDate
          ).toISOString(),
        }
      : {}),

    ...(authors.length
      ? {
          author: authors.map((author) => ({
            "@type": "Person",
            name: author,
          })),
        }
      : {}),

    ...(publication.publisher
      ? {
          publisher: {
            "@type": "Organization",
            name: publication.publisher,
          },
        }
      : {}),

    ...(publication.journalOrConference
      ? {
          isPartOf: {
            "@type": "Periodical",
            name: publication.journalOrConference,
          },
        }
      : {}),

    ...(doiUrl ? { identifier: doiUrl } : {}),

    ...(publication.externalUrl
      ? { sameAs: publication.externalUrl }
      : {}),

    ...(publication.researchArea
      ? {
          about: {
            "@type": "Thing",
            name: publication.researchArea,
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
          name: "Publications",
          item: siteUrl
            ? `${siteUrl}/publications`
            : "/publications",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: publication.title,
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
            fallbackUrl="/research/publications"
            label="All Publications"
          />

          <div className="mt-7 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-amber-400" />
            <span className="h-px w-16 bg-white/20" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Publication details
            </span>
          </div>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {publication.publicationType ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-950">
                    <BookOpen className="h-3.5 w-3.5" />
                    {publication.publicationType}
                  </span>
                ) : null}

                {publication.isFeatured ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-blue-950">
                    <Star className="h-3.5 w-3.5" />
                    Featured publication
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                {publication.title}
              </h1>

              {authors.length > 0 ? (
                <div className="mt-6 flex items-start gap-3">
                  <Users className="mt-1 h-5 w-5 shrink-0 text-amber-400" />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Authors
                    </p>
                    <p className="mt-1 leading-7 text-white">
                      {authors.join(", ")}
                    </p>
                  </div>
                </div>
              ) : null}

              {publication.abstract ? (
                <p className="mt-5 max-w-3xl text-sm leading-7 text-blue-100 sm:text-base sm:leading-8">
                  {publication.abstract.length > 280
                    ? `${publication.abstract.slice(0, 280).trimEnd()}…`
                    : publication.abstract}
                </p>
              ) : null}

              {publication.researchArea ? (
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400">
                  <FolderOpen className="h-4 w-4" />
                  {publication.researchArea}
                </div>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-3">
                {publication.pdfUrl ? (
                  <a
                    href={publication.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-blue-950 transition hover:bg-amber-300"
                  >
                    <FileText className="h-4 w-4" />
                    View / Download Publication File
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}

                {publication.externalUrl ? (
                  <a
                    href={publication.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    View Original Publication
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Publication summary panel */}
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl backdrop-blur-sm">
              <div className="flex min-h-64 flex-col justify-between bg-linear-to-br from-blue-900/80 to-blue-950 p-7 sm:p-9">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-amber-400">
                  <GraduationCap className="h-9 w-9" />
                </div>

                <div className="mt-10">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                    Research & Innovation
                  </p>

                  <h2 className="mt-3 text-2xl font-bold leading-snug text-white">
                    Department Publications
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-blue-100">
                    Discover research, scholarly contributions, and academic
                    work produced by the department.
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {publicationDate ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-blue-100">
                      <CalendarDays className="h-4 w-4 text-amber-400" />
                      {publicationDate}
                    </span>
                  ) : null}

                  {publication.doi ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-blue-100">
                      <Fingerprint className="h-4 w-4 text-amber-400" />
                      DOI available
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publication information */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Main content */}
          <div className="min-w-0">
            {publication.abstract ? (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-blue-950">
                      Abstract
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Publication overview and research summary
                    </p>
                  </div>
                </div>

                <div className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
                  {publication.abstract}
                </div>
              </article>
            ) : (
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                    <FileText className="h-5 w-5" />
                  </div>

                  <h2 className="text-2xl font-bold text-blue-950">
                    About this publication
                  </h2>
                </div>

                <p className="mt-5 leading-8 text-slate-600">
                  Publication details and available resources are provided
                  below.
                </p>
              </article>
            )}

            {authors.length > 0 ? (
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                    <Users className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-blue-950">
                      Authors
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Contributors to this publication
                    </p>
                  </div>
                </div>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {authors.map((author, index) => (
                    <li
                      key={`${author}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-900">
                        {String(author).trim().charAt(0).toUpperCase() || "A"}
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {author}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-bold text-blue-950">
              Publication information
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Bibliographic details and available links.
            </p>

            <div className="mt-6 space-y-6">
              <DetailItem
                icon={BookOpen}
                label="Publication type"
              >
                {publication.publicationType}
              </DetailItem>

              <DetailItem
                icon={CalendarDays}
                label="Publication date"
              >
                {publicationDate}
              </DetailItem>

              <DetailItem
                icon={Building2}
                label="Journal / Conference"
              >
                {publication.journalOrConference}
              </DetailItem>

              <DetailItem
                icon={GraduationCap}
                label="Publisher"
              >
                {publication.publisher}
              </DetailItem>

              <DetailItem
                icon={FolderOpen}
                label="Research area"
              >
                {publication.researchArea}
              </DetailItem>

              <DetailItem
                icon={Fingerprint}
                label="DOI"
              >
                {publication.doi ? (
                  doiUrl ? (
                    <a
                      href={doiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-800 hover:underline"
                    >
                      {publication.doi}
                    </a>
                  ) : (
                    publication.doi
                  )
                ) : null}
              </DetailItem>
            </div>

            {publication.pdfUrl ||
            publication.externalUrl ||
            doiUrl ? (
              <div className="mt-7 space-y-3 border-t border-slate-100 pt-6">
                {publication.pdfUrl ? (
                  <a
                    href={publication.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
                  >
                    <FileText className="h-4 w-4" />
                    Open publication file
                  </a>
                ) : null}

                {publication.externalUrl ? (
                  <a
                    href={publication.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-900"
                  >
                    Visit original publication
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}

                {doiUrl ? (
                  <a
                    href={doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-900"
                  >
                    Open DOI
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* Bottom navigation */}
      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <Link
          href="/research/publications"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 transition hover:text-blue-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse all publications
        </Link>
      </div>
    </main>
  );
}