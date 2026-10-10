import { getPrograms } from "@/lib/data/programs";
import ProgramCard from "@/components/programs/ProgramCard";

export const metadata = {
  title: "Academic Programs",
  description:
    "Explore undergraduate, graduate, postgraduate, diploma, and certificate programs. Discover program duration, eligibility requirements, and schemes of studies.",

  alternates: {
    canonical: "/programs",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Degree levels in the desired display order
const degreeOrder = [
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Diploma",
  "Certificate",
  "Other",
];

export default async function ProgramsPage() {
  const programs = await getPrograms();

  const sortedPrograms = [...(programs || [])].sort((a, b) => {
    const levelA = degreeOrder.indexOf(a.degreeType);
    const levelB = degreeOrder.indexOf(b.degreeType);

    const rankA = levelA === -1 ? degreeOrder.length : levelA;
    const rankB = levelB === -1 ? degreeOrder.length : levelB;

    // 1. Sort by degree level
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // 2. Sort by the order field within the same degree level
    const orderA = Number.isFinite(Number(a.order))
      ? Number(a.order)
      : 0;

    const orderB = Number.isFinite(Number(b.order))
      ? Number(b.order)
      : 0;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // 3. If order is equal, sort alphabetically by program name
    return (a.name || "").localeCompare(b.name || "");
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
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
            maskImage:
              "linear-gradient(to bottom, black, transparent 95%)",
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            Academic Directory
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Academic Programs
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Explore our academic programs, discover degree options, review
            program duration and eligibility requirements, and access schemes
            of studies to plan your academic journey.
          </p>

          {/* Decorative Accent */}
          <div className="mt-6 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-amber-400" />
            <span className="h-px w-16 bg-white/20" />
          </div>
        </div>
      </section>

      {/* All Academic Programs */}
      <section className="px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Section Heading */}
          <div className="mb-9">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Find Your Future
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Explore Our Programs
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Discover our academic offerings and find the program that
              matches your interests and career goals.
            </p>

            {/* Program Count */}
            {sortedPrograms.length > 0 && (
              <p className="mt-4 text-sm text-slate-500">
                {sortedPrograms.length}{" "}
                {sortedPrograms.length === 1 ? "program" : "programs"} available
              </p>
            )}
          </div>

          {/* Programs Grid */}
          {sortedPrograms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedPrograms.map((program) => (
                <ProgramCard
                  key={program._id?.toString() || program.slug}
                  program={JSON.parse(JSON.stringify(program))}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No programs available yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                Academic programs will appear here once they have been
                published.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}