import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer({ settings }) {
  const universityName =
    settings?.universityName || "MNSUAM";

  const departmentName =
    settings?.departmentName ||
    "Department of Computer Science";

  const logo =
    settings?.logo || "";

  const footerDescription =
    settings?.footerDescription ||
    "Committed to excellence in teaching, innovative software engineering research, and empowering the next generation of computing professionals for modern technological advancement.";

  const address =
    settings?.address || "";

  const email =
    settings?.email || "";

  const phone =
    settings?.phone || "";

  const copyrightText =
    settings?.copyrightText ||
    `© ${new Date().getFullYear()} ${departmentName}, ${universityName}. All rights reserved.`;

  const socialLinks =
    settings?.socialLinks || {};

  const socials = [
    {
      key: "facebook",
      url: socialLinks.facebook,
      icon: <FaFacebookF />,
      label: "Facebook",
    },
    {
      key: "instagram",
      url: socialLinks.instagram,
      icon: <FaInstagram />,
      label: "Instagram",
    },
    {
      key: "linkedin",
      url: socialLinks.linkedin,
      icon: <FaLinkedinIn />,
      label: "LinkedIn",
    },
    {
      key: "youtube",
      url: socialLinks.youtube,
      icon: <FaYoutube />,
      label: "YouTube",
    },
    {
      key: "twitter",
      url: socialLinks.twitter,
      icon: <FaXTwitter />,
      label: "X",
    },
  ].filter((social) => social.url);

  return (
    <footer className="border-t border-blue-900 bg-[#0b2545] font-sans text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-3">

        {/* Department Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {logo ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-blue-800 bg-white/10">
                <Image
                  src={logo}
                  alt={departmentName}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                  quality={100}
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 font-bold text-blue-950 shadow-md">
                <GraduationCap size={22} />
              </div>
            )}

            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
                {universityName}
              </p>

              <h2 className="truncate text-base font-black tracking-tight text-white">
                {departmentName}
              </h2>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-blue-200">
            {footerDescription}
          </p>

          {/* Social Links */}
          {socials.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              {socials.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-800 bg-blue-950/40 text-sm text-blue-200 transition hover:border-amber-400 hover:bg-amber-400 hover:text-blue-950"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Quick Links
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/about"
              className="py-1 text-blue-200 transition hover:text-white"
            >
              About Department
            </Link>

            <Link
              href="/programs"
              className="py-1 text-blue-200 transition hover:text-white"
            >
              Programs
            </Link>

            <Link
              href="/faculty"
              className="py-1 text-blue-200 transition hover:text-white"
            >
              Faculty Directory
            </Link>

            <Link
              href="/research"
              className="py-1 text-blue-200 transition hover:text-white"
            >
              Research & Labs
            </Link>

            <Link
              href="/projects"
              className="py-1 text-blue-200 transition hover:text-white"
            >
              Student Projects
            </Link>

            <Link
              href="/contact"
              className="py-1 text-blue-200 transition hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Contact & Location
          </h3>

          <div className="space-y-3 text-xs text-blue-200">

            {/* Address */}
            {address && (
              <div className="flex items-start gap-2.5">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-amber-400"
                />

                <span>{address}</span>
              </div>
            )}

            {/* Email */}
            {email && (
              <div className="flex items-center gap-2.5">
                <Mail
                  size={16}
                  className="shrink-0 text-amber-400"
                />

                <a
                  href={`mailto:${email}`}
                  className="transition hover:text-white"
                >
                  {email}
                </a>
              </div>
            )}

            {/* Phone */}
            {phone && (
              <div className="flex items-center gap-2.5">
                <Phone
                  size={16}
                  className="shrink-0 text-amber-400"
                />

                <a
                  href={`tel:${phone}`}
                  className="transition hover:text-white"
                >
                  {phone}
                </a>
              </div>
            )}

            {/* No Contact Information */}
            {!address && !email && !phone && (
              <p className="text-blue-300">
                Contact information is currently unavailable.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-blue-900/80 bg-[#091f3a]">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-blue-300 sm:px-8">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}