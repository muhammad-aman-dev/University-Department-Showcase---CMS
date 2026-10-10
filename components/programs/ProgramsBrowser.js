"use client";

import { useMemo, useState } from "react";
import ProgramCard from "./ProgramCard";

export default function ProgramsBrowser({ programs = [] }) {
  const [search, setSearch] = useState("");
  const [degreeType, setDegreeType] = useState("all");

  const degreeTypes = useMemo(
    () => [...new Set(programs.map((program) => program.degreeType).filter(Boolean))].sort(),
    [programs]
  );

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesDegree =
        degreeType === "all" || program.degreeType === degreeType;

      const searchableText = [
        program.name,
        program.shortDescription,
        program.degreeType,
        program.duration,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesDegree && (!query || searchableText.includes(query));
    });
  }, [programs, search, degreeType]);

  return (
    <div>
      <div className="mb-8 grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-[1fr_240px] sm:p-5">
        <div>
          <label
            htmlFor="program-search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search programs
          </label>
          <input
            id="program-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by program name or keyword..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="degree-filter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Degree type
          </label>
          <select
            id="degree-filter"
            value={degreeType}
            onChange={(event) => setDegreeType(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All degree types</option>
            {degreeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600" aria-live="polite">
          {filteredPrograms.length}{" "}
          {filteredPrograms.length === 1 ? "program" : "programs"} found
        </p>

        {(search || degreeType !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDegreeType("all");
            }}
            className="text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredPrograms.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <ProgramCard key={program._id} program={program} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No programs found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Try another search term or choose a different degree type.
          </p>
        </div>
      )}
    </div>
  );
}
