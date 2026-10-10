import { notFound } from "next/navigation";
import { getFacultyBySlug } from "@/lib/data/faculty";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const faculty = await getFacultyBySlug(slug);

  if (!faculty) {
    return {
      title: "Faculty Profile Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = faculty.name;

  const description =
    faculty.bio?.trim().replace(/\s+/g, " ").slice(0, 155) ||
    `${faculty.name}, ${faculty.designation || "Faculty Member"} in the Department of Computer Science.`;

  const image = faculty.image?.trim() || "";

  return {
    title,
    description,

    keywords: [
      faculty.name,
      faculty.designation,
      faculty.qualification,
      faculty.specialization,
      "Faculty Profile",
      "Research Publications",
    ].filter(Boolean),

    alternates: {
      canonical: `/faculty/${slug}`,
    },

    openGraph: {
      title,
      description,
      type: "profile",
      url: `/faculty/${slug}`,
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: `${faculty.name} faculty profile`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

function ExternalLink({ href, children }) {
  if (!href || !/^https?:\/\//i.test(href)) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-semibold text-blue-800 underline decoration-blue-200 underline-offset-4 transition hover:text-blue-950"
    >
      {children}
    </a>
  );
}

function Section({ title, count, children }) {
  return (
    <section className="mt-10 sm:mt-12">
      <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
        <span className="h-7 w-1 rounded-full bg-amber-400" />

        <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>

        {typeof count === "number" && count > 0 && (
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900">
            {count}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}

export default async function FacultyProfilePage({ params }) {
  const { slug } = await params;
  const faculty = await getFacultyBySlug(slug);

  if (!faculty) notFound();

  const publications = faculty.publications ?? [];
  const projects = faculty.researchProjects ?? [];
  const books = faculty.books ?? [];
  const interests = faculty.researchInterests ?? [];

  const hasBiography = Boolean(faculty.bio?.trim());
  const hasInterests = interests.length > 0;
  const hasPublications = publications.length > 0;
  const hasProjects = projects.length > 0;
  const hasBooks = books.length > 0;

  const stats = [
    { label: "Publications", value: publications.length },
    { label: "Projects", value: projects.length },
    { label: "Books", value: books.length },
  ].filter((item) => item.value > 0);

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Header */}
      <header className="relative isolate overflow-hidden bg-blue-950 px-5 py-10 text-white sm:py-14">
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
            maskImage:
              "linear-gradient(to bottom, black, transparent 95%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, transparent 95%)",
          }}
        />

        {/* Blue Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl"
        />

        {/* Amber Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl"
        />

        {/* Hero Content */}
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Academic Faculty
          </p>

          <nav
            aria-label="Breadcrumb"
            className="mt-3 flex flex-wrap items-center gap-2 text-sm text-blue-100"
          >
            <Link
              href="/faculty"
              className="transition hover:text-amber-400 hover:underline"
            >
              Faculty
            </Link>

            <span aria-hidden="true" className="text-blue-300/60">
              /
            </span>

            <span className="wrap-break-words text-white">
              {faculty.name}
            </span>
          </nav>

          {/* Decorative Accent */}
          <div className="mt-5 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-amber-400" />
            <span className="h-px w-16 bg-white/20" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        {/* Faculty Profile Card */}
        <section className="relative -mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_-16px_rgba(15,23,42,0.18)] sm:-mt-8">
          {/* Top Accent */}
          <div className="h-1 w-full bg-linear-to-r from-amber-400 via-blue-500 to-blue-950" />

          <div className="p-5 sm:p-8 lg:p-9">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              {/* Faculty Image */}
              <div className="shrink-0">
                {faculty.image ? (
                  <img
                    src={faculty.image}
                    alt={faculty.name}
                    className="h-44 w-36 rounded-2xl border border-slate-200 object-cover shadow-sm sm:h-48 sm:w-40"
                  />
                ) : (
                  <div className="flex h-44 w-36 items-center justify-center rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-slate-100 text-5xl font-black text-blue-950 sm:h-48 sm:w-40">
                    {faculty.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Faculty Details */}
              <div className="min-w-0 flex-1 pt-1">
                {faculty.isHOD && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Head of Department
                  </span>
                )}

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  {faculty.name}
                </h1>

                {faculty.designation && (
                  <p className="mt-2 text-lg font-semibold text-blue-900">
                    {faculty.designation}
                  </p>
                )}

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  {faculty.qualification && (
                    <p className="text-sm leading-6 text-slate-600">
                      <strong className="font-semibold text-slate-800">
                        Qualification:
                      </strong>{" "}
                      {faculty.qualification}
                    </p>
                  )}

                  {faculty.specialization && (
                    <p className="text-sm leading-6 text-slate-600">
                      <strong className="font-semibold text-slate-800">
                        Expertise:
                      </strong>{" "}
                      {faculty.specialization}
                    </p>
                  )}

                  {faculty.email && (
                    <p className="wrap-break-words text-sm leading-6 text-slate-600">
                      <strong className="font-semibold text-slate-800">
                        Email:
                      </strong>{" "}
                      <a
                        href={`mailto:${faculty.email}`}
                        className="font-medium text-blue-800 underline-offset-4 transition hover:text-blue-950 hover:underline"
                      >
                        {faculty.email}
                      </a>
                    </p>
                  )}

                  {faculty.phone && (
                    <p className="text-sm leading-6 text-slate-600">
                      <strong className="font-semibold text-slate-800">
                        Phone:
                      </strong>{" "}
                      {faculty.phone}
                    </p>
                  )}

                  {faculty.office && (
                    <p className="text-sm leading-6 text-slate-600">
                      <strong className="font-semibold text-slate-800">
                        Office:
                      </strong>{" "}
                      {faculty.office}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Faculty Statistics */}
            {stats.length > 0 && (
              <div
                className={`mt-8 grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 ${
                  stats.length === 2
                    ? "sm:grid-cols-2"
                    : stats.length === 3
                      ? "sm:grid-cols-3"
                      : ""
                }`}
              >
                {stats.map((stat) => (
                  <Stat
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Biography */}
        {hasBiography && (
          <Section title="Biography">
            <div className="whitespace-pre-line rounded-xl border border-slate-200/80 bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm sm:p-6">
              {faculty.bio}
            </div>
          </Section>
        )}

        {/* Research Interests */}
        {hasInterests && (
          <Section title="Research Interests" count={interests.length}>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={`${interest}-${index}`}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-900 transition hover:border-blue-200 hover:bg-blue-100"
                >
                  {interest}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Publications */}
        {hasPublications && (
          <Section title="Publications" count={publications.length}>
            <div className="space-y-4">
              {publications.map((publication, index) => (
                <article
                  key={publication._id || index}
                  className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-md sm:p-6"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-800">
                    {publication.type || "Publication"}
                    {publication.year ? ` · ${publication.year}` : ""}
                  </p>

                  {publication.title && (
                    <h3 className="mt-2 text-base font-bold leading-7 text-slate-900">
                      {publication.title}
                    </h3>
                  )}

                  {publication.authors && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      <strong className="text-slate-800">Authors:</strong>{" "}
                      {publication.authors}
                    </p>
                  )}

                  {publication.journal && (
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {publication.journal}
                    </p>
                  )}

                  {publication.doi && (
                    <p className="mt-2 break-all text-sm text-slate-600">
                      <strong className="text-slate-800">DOI:</strong>{" "}
                      {publication.doi}
                    </p>
                  )}

                  <div className="mt-3">
                    <ExternalLink href={publication.url}>
                      View Publication
                    </ExternalLink>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* Research Projects */}
        {hasProjects && (
          <Section
            title="Project / Research Development"
            count={projects.length}
          >
            <div className="space-y-4">
              {projects.map((project, index) => (
                <article
                  key={project._id || index}
                  className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="min-w-0 flex-1 text-base font-bold leading-7 text-slate-900">
                      {project.title}
                    </h3>

                    {project.status && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {project.status}
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {project.description}
                    </p>
                  )}

                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    {project.role && (
                      <p>
                        <strong className="text-slate-800">Role:</strong>{" "}
                        {project.role}
                      </p>
                    )}

                    {project.fundingAgency && (
                      <p>
                        <strong className="text-slate-800">Funding:</strong>{" "}
                        {project.fundingAgency}
                      </p>
                    )}

                    {(project.startYear || project.endYear) && (
                      <p>
                        <strong className="text-slate-800">Period:</strong>{" "}
                        {project.startYear || "—"} –{" "}
                        {project.endYear || "Present"}
                      </p>
                    )}
                  </div>

                  <div className="mt-3">
                    <ExternalLink href={project.url}>
                      View Project
                    </ExternalLink>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* Books and Book Chapters */}
        {hasBooks && (
          <Section title="Books & Book Chapters" count={books.length}>
            <div className="grid gap-4 sm:grid-cols-2">
              {books.map((book, index) => (
                <article
                  key={book._id || index}
                  className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-md"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-800">
                    {book.type || "Book"}
                    {book.year ? ` · ${book.year}` : ""}
                  </p>

                  {book.title && (
                    <h3 className="mt-2 font-bold leading-6 text-slate-900">
                      {book.title}
                    </h3>
                  )}

                  {book.authors && (
                    <p className="mt-2 text-sm text-slate-600">
                      <strong className="text-slate-800">Authors:</strong>{" "}
                      {book.authors}
                    </p>
                  )}

                  {book.publisher && (
                    <p className="mt-1 text-sm text-slate-600">
                      <strong className="text-slate-800">Publisher:</strong>{" "}
                      {book.publisher}
                    </p>
                  )}

                  {book.isbn && (
                    <p className="mt-1 break-all text-sm text-slate-600">
                      <strong className="text-slate-800">ISBN:</strong>{" "}
                      {book.isbn}
                    </p>
                  )}

                  <div className="mt-3">
                    <ExternalLink href={book.url}>
                      View Book
                    </ExternalLink>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="group rounded-xl border border-slate-200/80 bg-slate-50/80 p-5 text-center transition duration-300 hover:border-blue-200 hover:bg-blue-50/70">
      <p className="text-3xl font-black tracking-tight text-blue-950">
        {value}
      </p>

      <div className="mx-auto mt-2 h-0.5 w-8 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-12" />

      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">
        {label}
      </p>
    </div>
  );
}