import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgramBySlug } from "@/lib/data/programs";

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "graduation":
      return (
        <svg {...common}>
          <path d="m2.5 8 9.5 5 9.5-5L12 3 2.5 8Z" />
          <path d="M6.5 10.1v5.1c3.7 2.5 7.3 2.5 11 0v-5.1M21.5 8v6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );

    case "document":
      return (
        <svg {...common}>
          <path d="M6 3.75h8l4 4v12.5H6a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z" />
          <path d="M14 3.75v4h4M8 12h8M8 15.5h8" />
        </svg>
      );

    case "book":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
          <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h7M8 10h7" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      );

    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19 12H5m7 7-7-7 7-7" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4" />
        </svg>
      );

    case "external":
      return (
        <svg {...common}>
          <path d="M14 4h6v6M20 4 10 14" />
          <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
        </svg>
      );

    default:
      return null;
  }
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-800">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      ) : null}

      <div className="mt-4 h-1 w-14 rounded-full bg-amber-400" />
    </div>
  );
}

function getFileName(document, index) {
  return document.fileName || `Scheme of Studies — Document ${index + 1}`;
}

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return {
      title: "Program Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    program.shortDescription ||
    `Explore ${program.name}, including program duration, eligibility, and scheme of studies.`;

  return {
    title: program.name,
    description,
    alternates: {
      canonical: `/programs/${program.slug}`,
    },
    openGraph: {
      title: program.name,
      description,
      type: "article",
      ...(program.image ? { images: [program.image] } : {}),
    },
  };
}

export default async function ProgramDetailPage({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const documents = Array.isArray(program.schemeOfStudies)
    ? program.schemeOfStudies
    : [];

  const duration = program.duration || "Not specified";
  const degreeType = program.degreeType || "Not specified";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section — matches the Academic Programs page */}
<section className="hero-section relative isolate overflow-hidden bg-blue-950 px-5 py-16 text-white sm:py-20">
  {/* Grid Texture */}
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

  {/* Blue Glow */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl"
  />

  {/* Amber Glow */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
  />

  {/* Hero Content */}
  <div className="mx-auto max-w-7xl">
    <Link
      href="/programs"
      className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-blue-100 transition hover:text-amber-400"
    >
      <Icon name="arrow-left" className="h-4 w-4" />
      All Programs
    </Link>

    {program.degreeType && (
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
        {program.degreeType}
      </p>
    )}

    <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
      {program.name}
    </h1>

    {/* Decorative Accent */}
    <div className="mt-6 flex items-center gap-3">
      <span className="h-1 w-12 rounded-full bg-amber-400" />
      <span className="h-px w-16 bg-white/20" />
    </div>
  </div>
</section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-10">
          {/* Main Column */}
          <div className="min-w-0 space-y-8 lg:col-span-2">
            {/* About */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeading
                eyebrow="About the Program"
                title="Program Overview"
              />

              {program.shortDescription ? (
                <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                  {program.shortDescription}
                </p>
              ) : (
                <p className="text-base leading-8 text-slate-500">
                  Detailed information about this program will be added soon.
                </p>
              )}
            </section>

            {/* Program Image */}
            {program.image ? (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={program.image}
                    alt={program.name}
                    className="max-h-120 w-full object-cover"
                  />
                </div>
              </section>
            ) : null}

            {/* Eligibility */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeading
                eyebrow="Admission Requirements"
                title="Eligibility Criteria"
                description="Review the eligibility requirements for this program."
              />

              {program.eligibility ? (
                <div className="flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50/70 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-800 shadow-sm ring-1 ring-blue-100">
                    <Icon name="check" className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Eligibility Requirements
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {program.eligibility}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                  Eligibility details for this program have not been published
                  yet. Please contact the department for further information.
                </p>
              )}
            </section>

            {/* Scheme of Studies */}
            <section
              id="scheme-of-studies"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <SectionHeading
                    eyebrow="Curriculum & Course Structure"
                    title="Scheme of Studies"
                    description="View the curriculum documents available for this program."
                  />
                </div>

                <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-900">
                  <Icon name="document" className="h-4 w-4" />
                  {documents.length}{" "}
                  {documents.length === 1 ? "Document" : "Documents"}
                </div>
              </div>

              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((document, index) => {
                    const fileUrl = document.fileUrl;
                    const fileName = getFileName(document, index);

                    return (
                      <div
                        key={`${document.year || "document"}-${fileUrl || index}`}
                        className="group flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                      >
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b1739] text-amber-300 transition group-hover:bg-blue-950">
                            <Icon name="document" className="h-6 w-6" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="wrap-break-words text-sm font-semibold leading-6 text-slate-900">
                              {fileName}
                            </h3>

                            {document.year ? (
                              <p className="mt-1 text-sm text-slate-500">
                                Academic Year: {document.year}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        {fileUrl ? (
                          <a
                            href={fileUrl}
                            target={isExternalUrl(fileUrl) ? "_blank" : undefined}
                            rel={
                              isExternalUrl(fileUrl)
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0b1739] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            View Document
                            <Icon name="external" className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Document link unavailable
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                    <Icon name="book" className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    No Documents Available
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Scheme of studies documents for this program have not been
                    uploaded yet. Please check again later.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="min-w-0 space-y-6 lg:sticky lg:top-6">
            {/* Program Overview Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Header */}
              <div className="relative overflow-hidden bg-[#0b1739] px-6 py-6">
                <div
                  className="pointer-events-none absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />

                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-amber-400/10 blur-3xl" />

                <div className="relative">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-amber-300">
                    <Icon name="graduation" className="h-6 w-6" />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                    Program at a glance
                  </p>

                  <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
                    Program Overview
                  </h2>

                  <div className="mt-4 h-1 w-14 rounded-full bg-amber-400" />
                </div>
              </div>

              {/* Details */}
              <div className="p-5 sm:p-6">
                <div className="space-y-5">
                  {/* Degree Type */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800 ring-1 ring-blue-100">
                      <Icon name="graduation" />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Degree Type
                      </p>

                      <p className="mt-1 wrap-break-words text-sm font-semibold leading-6 text-slate-900">
                        {degreeType}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Duration */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                      <Icon name="clock" />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Duration
                      </p>

                      <p className="mt-1 wrap-break-words text-sm font-semibold leading-6 text-slate-900">
                        {duration}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Scheme of Studies */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800 ring-1 ring-blue-100">
                      <Icon name="document" />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Scheme of Studies
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-900">
                        {documents.length}{" "}
                        {documents.length === 1 ? "document" : "documents"}{" "}
                        available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 space-y-3">
                  <a
                    href="#scheme-of-studies"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1739] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-950 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    View Scheme of Studies
                    <Icon
                      name="arrow-right"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </a>

                  <Link
                    href="/programs"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Icon name="arrow-left" className="h-4 w-4" />
                    Explore All Programs
                  </Link>
                </div>
              </div>
            </div>

            {/* Helpful Information Card */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-800 shadow-sm ring-1 ring-blue-100">
                  <Icon name="book" className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Exploring Other Programs?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Browse the complete list of academic programs to compare
                    degree options and find the right program for you.
                  </p>

                  <Link
                    href="/programs"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-900 transition hover:text-blue-700"
                  >
                    Browse Programs
                    <Icon
                      name="arrow-right"
                      className="h-4 w-4"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}