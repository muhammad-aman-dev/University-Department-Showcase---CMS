import Link from "next/link";
import { getFaculty } from "@/lib/data/faculty";

export const metadata = {
  title: "Our Faculty",
  description:
    "Meet our faculty members and explore their academic backgrounds, expertise, research interests, publications, and projects.",
  alternates: {
    canonical: "/faculty",
  },
};

// Designation priority: lower number appears first
const designationPriority = {
  Professor: 1,
  "Associate Professor": 2,
  "Assistant Professor": 3,
  Lecturer: 4,
  "Research Officer": 5,
  "Visiting Faculty": 6,
  "Lab Engineer": 7,
  "Lab Instructor": 8,
  "Teaching Assistant": 9,
  Other: 10,
};

// Randomize members who have the same designation and order
function shuffleGroup(group) {
  const shuffled = [...group];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function sortFaculty(faculty) {
  const sorted = [...faculty].sort((a, b) => {
    const priorityA =
      designationPriority[a.designation] ?? designationPriority.Other;

    const priorityB =
      designationPriority[b.designation] ?? designationPriority.Other;

    // First sort by designation hierarchy
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Then sort by custom order within the same designation
    return (a.order ?? 0) - (b.order ?? 0);
  });

  const result = [];
  let i = 0;

  while (i < sorted.length) {
    let j = i + 1;

    // Find members with the same designation and order
    while (
      j < sorted.length &&
      sorted[j].designation === sorted[i].designation &&
      (sorted[j].order ?? 0) === (sorted[i].order ?? 0)
    ) {
      j++;
    }

    // Randomize only members in this tied group
    result.push(...shuffleGroup(sorted.slice(i, j)));

    i = j;
  }

  return result;
}

export default async function FacultyPage() {
  const faculty = sortFaculty(await getFaculty());

  return (
    <main className="min-h-screen bg-slate-50">
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
            Meet Our Faculty
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Explore our faculty members, their academic backgrounds,
            areas of expertise, research interests, publications, and projects.
          </p>

          {/* Decorative Accent */}
          <div className="mt-6 flex items-center gap-3">
            <span className="h-1 w-12 rounded-full bg-amber-400" />
            <span className="h-px w-16 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Faculty Directory */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        {faculty.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Faculty profiles will be available soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((member) => {
              const stats = [
                {
                  label: "Publications",
                  count: member.publications?.length ?? 0,
                },
                {
                  label: "Projects",
                  count: member.researchProjects?.length ?? 0,
                },
                {
                  label: "Books",
                  count: member.books?.length ?? 0,
                },
              ].filter((item) => item.count > 0);

              return (
                <article
                  key={member._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  {/* Faculty Details */}
                  <div className="flex gap-4 p-5">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-24 w-24 shrink-0 rounded-xl border border-slate-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-50 to-slate-100 text-2xl font-bold text-blue-950">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      {member.isHOD && (
                        <span className="mb-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900">
                          Head of Department
                        </span>
                      )}

                      <h2 className="text-lg font-bold leading-snug text-slate-900">
                        {member.name}
                      </h2>

                      {member.designation && (
                        <p className="mt-1 text-sm font-medium text-blue-900">
                          {member.designation}
                        </p>
                      )}

                      {member.qualification && (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {member.qualification}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expertise */}
                  {member.specialization && (
                    <div className="px-5 pb-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Expertise
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {member.specialization}
                      </p>
                    </div>
                  )}

                  {/* Statistics: show only counts greater than zero */}
                  {stats.length > 0 && (
                    <div
                      className={`grid border-y border-slate-100 bg-slate-50/80 ${
                        stats.length === 1
                          ? "grid-cols-1"
                          : stats.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-3"
                      }`}
                    >
                      {stats.map((stat) => (
                        <Count
                          key={stat.label}
                          label={stat.label}
                          count={stat.count}
                        />
                      ))}
                    </div>
                  )}

                  {/* Profile Link */}
                  <div className="p-5">
                    <Link
                      href={`/faculty/${member.slug}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      View Full Profile
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Count({ label, count }) {
  return (
    <div className="px-2 py-4 text-center">
      <p className="text-xl font-black text-blue-950">{count}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}