import Link from "next/link";

export default function ProgramCard({ program }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/programs/${program.slug}`}
        className="block"
        aria-label={`View ${program.name}`}
      >
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {program.image ? (
            <img
              src={program.image}
              alt={program.name}
              width={program.imageWidth || undefined}
              height={program.imageHeight || undefined}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <span className="text-sm">Program image will be availible soon</span>
            </div>
          )}

          {program.isFeatured && (
            <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          {program.degreeType}
        </p>

        <h2 className="mt-2 text-lg font-bold text-gray-900">
          <Link
            href={`/programs/${program.slug}`}
            className="hover:text-blue-700"
          >
            {program.name}
          </Link>
        </h2>

        {program.shortDescription && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
            {program.shortDescription}
          </p>
        )}

        {program.duration && (
          <p className="mt-3 text-sm text-gray-500">
            <span className="font-medium text-gray-700">Duration:</span>{" "}
            {program.duration}
          </p>
        )}

        <div className="mt-auto pt-5">
          <Link
            href={`/programs/${program.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            View program <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}