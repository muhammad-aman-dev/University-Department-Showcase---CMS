import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { getSiteSettings } from "@/lib/data/site-settings";

export async function generateMetadata() {
  const settings = await getSiteSettings();

  const departmentName =
    settings?.seo?.title?.trim() ||
    "Department of Computer Science";

  const universityName =
    settings?.universityName?.trim() ||
    "";

  const title = universityName
    ? `${departmentName} | ${universityName}`
    : departmentName;

  const description =
    settings?.seo?.description?.trim() ||
    `${departmentName} official website.`;

  const keywords =
    Array.isArray(settings?.seo?.keywords)
      ? settings.seo.keywords
      : [];

  const ogImage =
    settings?.seo?.ogImage?.trim() ||
    "";

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  return {
    metadataBase: siteUrl
      ? new URL(siteUrl)
      : undefined,

    title: {
      default: title,
      template: `%s | ${departmentName}`,
    },

    description,

    keywords,

    alternates: {
      canonical: "/",
    },

    icons: {
      icon: [
        {
          url:
            settings?.favicon ||
            "/default-icon.png",
          type: "image/png",
        },
      ],
    },

    openGraph: {
      title,
      description,
      siteName: departmentName,
      type: "website",
      url: "/",

      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: ogImage
        ? "summary_large_image"
        : "summary",

      title,
      description,

      ...(ogImage
        ? {
            images: [ogImage],
          }
        : {}),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SiteLayout({
  children,
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header settings={settings} />

      <main className="flex-1">
        {children}
      </main>

      <Footer settings={settings} />
    </>
  );
}