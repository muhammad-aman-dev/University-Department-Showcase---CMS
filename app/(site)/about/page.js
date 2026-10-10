import AboutHero from "@/components/about/AboutHero";
import AboutIntroduction from "@/components/about/AboutIntroduction";
import AboutHistory from "@/components/about/AboutHistory";
import AboutVisionMission from "@/components/about/AboutVisionMission";
import AboutObjectives from "@/components/about/AboutObjectives";
import AboutScope from "@/components/about/AboutScope";
import AboutFacilities from "@/components/about/AboutFacilities";

import { getAboutPage } from "@/lib/data/about";

export async function generateMetadata() {
  const about = await getAboutPage();

  const title =
    about?.title?.trim() ||
    "About the Department";

  const description =
    about?.introduction?.trim() ||
    "Learn more about the Department of Computer Science, its history, vision, mission, objectives, scope, and facilities.";

  const image =
    about?.pageImage?.trim() ||
    about?.history?.image?.trim() ||
    "";

  return {
    title,
    description,
    alternates: {
      canonical: "/about",
    },

    ...(image
      ? {
          openGraph: {
            title,
            description,
            type: "website",
            images: [
              {
                url: image,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          },

          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
          },
        }
      : {}),
  };
}

export default async function AboutPage() {
  const about = await getAboutPage();

  if (!about) {
    return (
      <main className="min-h-[70vh] bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-8">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-bold text-blue-950">
              About Department
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              About page content is currently unavailable.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50">
      <AboutHero
        title={about.title}
        image={about.pageImage}
      />

      {about.introduction && (
        <AboutIntroduction
          content={about.introduction}
        />
      )}

      {(about.history?.content ||
        about.history?.image ||
        about.history?.title) && (
        <AboutHistory
          history={about.history}
        />
      )}

      {(about.vision || about.mission) && (
        <AboutVisionMission
          vision={about.vision}
          mission={about.mission}
        />
      )}

      {about.objectives?.length > 0 && (
        <AboutObjectives
          objectives={about.objectives}
        />
      )}

      {about.scope && (
        <AboutScope
          scope={about.scope}
        />
      )}

      {about.facilities?.length > 0 && (
        <AboutFacilities
          facilities={about.facilities}
        />
      )}
    </main>
  );
}