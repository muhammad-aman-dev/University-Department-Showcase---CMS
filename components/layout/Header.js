"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Mail, Phone, MapPin, GraduationCap } from "lucide-react";

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-sm font-sans bg-white">
        {/* Main Department Header */}
        <div className="border-b border-gray-200/80 bg-white relative" ref={menuRef}>
          <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-8">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-2">
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={settings?.departmentName || "Department"}
                  className="h-9 w-9 sm:h-12 sm:w-12 object-contain rounded-lg bg-blue-50/50 p-1 border border-blue-100 shrink-0"
                />
              ) : (
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-950 text-amber-400 shadow-md shrink-0">
                  <GraduationCap size={22} className="sm:w-6 sm:h-6" />
                </div>
              )}

              <div className="min-w-0">
                <p className="text-[9px] sm:text-[11px] font-bold text-blue-900 tracking-wider uppercase truncate">
                  {settings?.universityName || "MNSUAM"}
                </p>
                <p className="text-xs sm:text-sm md:text-lg font-black tracking-tight text-blue-950 truncate">
                  {settings?.departmentName || "Department of Computer Science"}
                </p>
              </div>
            </Link>

            {/* Location Badge on Desktop Header */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 shrink-0">
              <MapPin size={15} className="text-blue-900 shrink-0" />
              <span className="font-medium">Old Shujabad Road, Multan</span>
            </div>

            {/* Mobile burger button */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="rounded-lg p-2 text-blue-950 hover:bg-blue-50 lg:hidden transition shrink-0"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Animated Mobile Navigation Dropdown Menu */}
          <div
            className={`absolute top-full left-0 w-full bg-[#0c3559] border-b border-blue-900 shadow-2xl lg:hidden transition-all duration-300 ease-in-out origin-top overflow-hidden text-white ${
              mobileOpen ? "opacity-100 max-h-125 py-4 visible" : "opacity-0 max-h-0 py-0 invisible border-none"
            }`}
          >
            <nav className="px-3 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium text-blue-100 hover:bg-blue-900/60 hover:text-amber-400 transition flex items-center justify-between"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="mt-3 pt-3 border-t border-blue-800/80 flex items-center gap-2 px-3 py-2 text-xs text-blue-200">
                <MapPin size={14} className="text-amber-400 shrink-0" />
                <span>Old Shujabad Road, Multan</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Core Navy Theme Primary Navigation Bar */}
        <nav className="bg-[#0c3559] text-white hidden lg:block shadow-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
            <div className="flex items-center space-x-1 py-2 text-sm font-medium">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-md text-blue-100 hover:bg-blue-950/60 hover:text-white transition font-medium tracking-wide text-xs uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="text-[11px] text-amber-400 font-mono font-semibold tracking-wider uppercase bg-blue-950/40 px-3 py-1 rounded border border-blue-900">
              Faculty of Computing
            </div>
          </div>
        </nav>
      </header>

      {/* Backdrop overlay when mobile menu is open */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity" 
        />
      )}
    </>
  );
}