import Link from "next/link";
import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";

export default function Footer({ settings }) {
  return (
    <footer className="border-t border-blue-900 bg-[#0b2545] text-white font-sans">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 py-14 md:grid-cols-3">
        {/* Department Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt={settings?.departmentName || "Department"}
                className="h-10 w-10 object-contain rounded-lg bg-white/10 p-1 border border-blue-800"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-blue-950 font-bold shadow-md">
                <GraduationCap size={22} />
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                {settings?.universityName || "MNSUAM"}
              </p>
              <h2 className="text-base font-black tracking-tight text-white">
                {settings?.departmentName || "Department of Computer Science"}
              </h2>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-blue-200">
            {settings?.footerDescription ||
              "Committed to excellence in teaching, innovative software engineering research, and empowering the next generation of computing professionals for modern technological advancement."}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-mono text-xs uppercase font-bold text-amber-400 tracking-wider mb-4">
            Quick Links
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link href="/about" className="text-blue-200 hover:text-white transition py-1">
              About Department
            </Link>
            <Link href="/programs" className="text-blue-200 hover:text-white transition py-1">
              Programs
            </Link>
            <Link href="/faculty" className="text-blue-200 hover:text-white transition py-1">
              Faculty Directory
            </Link>
            <Link href="/research" className="text-blue-200 hover:text-white transition py-1">
              Research & Labs
            </Link>
            <Link href="/projects" className="text-blue-200 hover:text-white transition py-1">
              Student Projects
            </Link>
            <Link href="/contact" className="text-blue-200 hover:text-white transition py-1">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="font-mono text-xs uppercase font-bold text-amber-400 tracking-wider mb-4">
            Contact & Location
          </h3>

          <div className="space-y-3 text-xs text-blue-200">
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <span>{settings?.address || "Old Shujabad Road, Multan, Pakistan"}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-amber-400 shrink-0" />
              <span>{settings?.email || "cs@mnsuam.edu.pk"}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone size={16} className="text-amber-400 shrink-0" />
              <span>{settings?.phone || "+92 61 9210400"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-900/80 bg-[#091f3a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-5 text-center text-xs text-blue-300">
          <p>
            {settings?.copyrightText ||
              `© ${new Date().getFullYear()} ${
                settings?.departmentName || "Department of Computer Science"
              }, ${settings?.universityName || "MNSUAM"}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}