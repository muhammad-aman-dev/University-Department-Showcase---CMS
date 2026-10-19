"use client";

import { useState } from "react";
import {
  CollaborationCTA,
  EmptyState,
  ErrorState,
  PageHero,
  ProjectSkeleton,
  ResearchAreaCard,
  readResponse,
} from "./ResearchUI";

export default function ResearchAreasClient({
  initialAreas = [],
  initialError = false,
}) {
  const [areas, setAreas] = useState(initialAreas);
  const [error, setError] = useState(
    initialError ? "Research areas could not be loaded from the server." : ""
  );
  const [loading, setLoading] = useState(false);

  async function reload() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/research/areas", {
        cache: "no-store",
      });
      const result = await readResponse(response);
      setAreas(result.data || []);
    } catch (err) {
      setError(err.message || "Unable to load research areas.");
    } finally {
      setLoading(false);
    }
  }

  // Featured areas first; sort is stable so admin "order" is kept otherwise.
  const sortedAreas = [...areas].sort(
    (a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <PageHero
        crumb="Research Areas"
        eyebrow="Areas of expertise"
        title="Our research"
        highlight="areas"
        description="Discover the themes and specialist fields guiding our department's research and academic inquiry."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <ProjectSkeleton key={item} />
              ))}
            </div>
          ) : sortedAreas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedAreas.map((area) => (
                <ResearchAreaCard key={area._id || area.slug} area={area} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No research areas yet"
              description="Research areas will appear here once they have been published."
            />
          )}
        </div>
      </section>

      <CollaborationCTA />
    </main>
  );
}