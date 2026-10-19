"use client";

export default function AboutHero({ title }) {
  return (
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
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            Who We Are
          </p>

          {/* Main Heading */}
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            {title || "About the Department"}
          </h1>

          {/* Supporting Text */}
          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            Discover our academic journey, vision, mission, and commitment to
            excellence in computer science education, research, and innovation.
          </p>

          {/* Decorative Accent */}
          <div className="mt-6 h-1 w-16 rounded-full bg-amber-400" />
        </div>
      </div>
    </section>
  );
}