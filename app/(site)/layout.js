import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

async function getSiteSettings() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/site-settings`,
      {
        next: {
          revalidate: 60 * 60 * 24 * 3,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Failed to fetch site settings:", error);

    return null;
  }
}

export default async function SiteLayout({ children }) {
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