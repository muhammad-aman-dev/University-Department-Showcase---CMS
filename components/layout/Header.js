"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, MapPin, GraduationCap } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Faculty", href: "/faculty" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ settings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const departmentName =
    settings?.departmentName ||
    "Department of Computer Science";

  const universityName =
    settings?.universityName || "MNSUAM";

  const address =
    settings?.address || "";

  const facultyName =
    settings?.facultyName ||
    "Faculty Of Computing";

  const logo =
    settings?.logo || "";

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    }

    if (mobileOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white font-sans shadow-sm">
        {/* Main Department Header */}
        <div
          className="relative border-b border-gray-200/80 bg-white"
          ref={menuRef}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-20 sm:px-8">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2.5 pr-2 sm:gap-3.5"
            >
              {logo ? (
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-blue-100 bg-blue-50/50 sm:h-12 sm:w-12">
                  <Image
                    src={logo}
                    alt={departmentName}
                    fill
                    sizes="(max-width: 640px) 36px, 48px"
                    className="object-contain p-1"
                  />
                </div>
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-amber-400 shadow-md sm:h-12 sm:w-12">
                  <GraduationCap
                    size={22}
                    className="sm:h-6 sm:w-6"
                  />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-[9px] font-bold uppercase tracking-wider text-blue-900 sm:text-[11px]">
                  {universityName}
                </p>

                <p className="truncate text-xs font-black tracking-tight text-blue-950 sm:text-sm md:text-lg">
                  {departmentName}
                </p>
              </div>
            </Link>

            {/* Location Badge */}
            {address && (
              <div className="hidden shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 lg:flex">
                <MapPin
                  size={15}
                  className="shrink-0 text-blue-900"
                />

                <span className="font-medium">
                  {address}
                </span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen((prev) => !prev)
              }
              className="shrink-0 rounded-lg p-2 text-blue-950 transition hover:bg-blue-50 lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`absolute left-0 top-full w-full origin-top overflow-hidden border-b border-blue-900 bg-[#0c3559] text-white shadow-2xl transition-all duration-300 ease-in-out lg:hidden ${
              mobileOpen
                ? "visible max-h-125 py-4 opacity-100"
                : "invisible max-h-0 border-none py-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col gap-1 px-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-blue-100 transition hover:bg-blue-900/60 hover:text-amber-400 sm:text-sm"
                >
                  <span>{link.label}</span>
                </Link>
              ))}

              {address && (
                <div className="mt-3 flex items-center gap-2 border-t border-blue-800/80 px-3 py-2 pt-3 text-xs text-blue-200">
                  <MapPin
                    size={14}
                    className="shrink-0 text-amber-400"
                  />

                  <span>{address}</span>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden bg-[#0c3559] text-white shadow-md lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
            <div className="flex items-center space-x-1 py-2 text-sm font-medium">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-4 py-2 text-xs font-medium uppercase tracking-wide text-blue-100 transition hover:bg-blue-950/60 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="rounded border border-blue-900 bg-blue-950/40 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              {facultyName}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity lg:hidden"
        />
      )}
    </>
  );
}