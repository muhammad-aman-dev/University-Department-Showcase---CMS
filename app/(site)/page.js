import { getDepartmentData } from "@/lib/getHomepageData";
import HeroSection from "@/components/home/HeroSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import IntroductionSection from "@/components/home/IntroductionSection";
import VisionMissionObjectivesSection from "@/components/home/VisionMissionObjectivesSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import AchievementsSection from "@/components/home/AchievementsSection";
import NewsEventsNoticesSection from "@/components/home/NewsEventsNoticesSection";

// export async function generateMetadata() {
//   const data = await getDepartmentData();
//   const title = data?.homePage?.hero?.title || "Department of Computer Science";
//   const description = data?.homePage?.hero?.description || "Shaping the Future Through Computing and Innovation.";
//   const heroImage = data?.homePage?.hero?.images?.[0]?.url;

//   return {
//     title: `${title} | Academic Portal`,
//     description: description,
//     openGraph: {
//       title: `${title} | Academic Portal`,
//       description: description,
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: `${title}`,
//       description: description,
//     },
//   };
// }

export default async function HomePage() {
  const data = await getDepartmentData();

  if (!data || !data.homePage) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-center px-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Department Portal Initializing</h2>
          <p className="mt-2 text-sm text-gray-600">Homepage configuration payload is currently unavailable.</p>
        </div>
      </div>
    );
  }

  const {
    homePage,
    projects = [],
    achievements = [],
    news = [],
    events = [],
    notices = [],
  } = data;

  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      <HeroSection hero={homePage.hero} />
      <StatisticsSection statistics={homePage.statistics} />
      <IntroductionSection introduction={homePage.introduction} hodMessage={homePage.hodMessage} />
      
      <VisionMissionObjectivesSection 
        vision={homePage.vision} 
        mission={homePage.mission} 
        objectives={homePage.objectives} 
        scope={homePage.scope} 
      />

      {homePage.showProjects && projects.length > 0 && (
        <ProjectsSection projects={projects} />
      )}

      {homePage.showAchievements && achievements.length > 0 && (
        <AchievementsSection achievements={achievements} />
      )}

      <NewsEventsNoticesSection
        news={homePage.showNews ? news : []}
        events={homePage.showEvents ? events : []}
        notices={homePage.showNotices ? notices : []}
      />
    </main>
  );
}