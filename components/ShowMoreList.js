
"use client";

import { useState } from "react";

export default function ShowMoreList({
  items = [],
  initialCount = 5,
  step = 5,
  label = "items",
  listClassName = "space-y-4",
  children,
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  if (!items.length) return null;

  const remaining = items.length - visibleCount;

  return (
    <div>
      <div className={listClassName}>
        {children.slice(0, visibleCount)}
      </div>

      {remaining > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((current) =>
                Math.min(current + step, items.length)
              )
            }
            aria-label={`Show more ${label}`}
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-blue-950 shadow-sm transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          >
            Show More
            <span className="text-xs font-medium text-slate-500">
              ({remaining} remaining)
            </span>

            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
            >
              <path
                d="m5 7.5 5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
