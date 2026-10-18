
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import ResearchProject from "@/models/ResearchProjects";

const PAGE_SIZE_DEFAULT = 9;
const PAGE_SIZE_MAX = 50;

const allowedStatuses = ["planned", "ongoing", "completed"];
const allowedSorts = ["newest", "oldest", "title"];

function normalizeParams(params = {}) {
  const page = Math.max(1, Number.parseInt(params.page, 10) || 1);

  const requestedLimit =
    Number.parseInt(params.limit, 10) || PAGE_SIZE_DEFAULT;

  return {
    search: String(params.search || "").trim().slice(0, 100),
    status: allowedStatuses.includes(params.status)
      ? params.status
      : "all",
    researchArea: String(params.researchArea || "").trim().slice(0, 100),
    sort: allowedSorts.includes(params.sort) ? params.sort : "newest",
    page,
    limit: Math.min(Math.max(1, requestedLimit), PAGE_SIZE_MAX),
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getResearchProjectsFromDB(params) {
  await connectDB();

  const filter = {};

  if (params.status !== "all") {
    filter.status = params.status;
  }

  if (params.researchArea) {
    filter.researchArea = params.researchArea;
  }

  if (params.search) {
    const searchRegex = new RegExp(escapeRegex(params.search), "i");

    filter.$or = [
      { title: searchRegex },
      { shortDescription: searchRegex },
      { description: searchRegex },
      { researchArea: searchRegex },
      { principalInvestigator: searchRegex },
      { teamMembers: searchRegex },
      { fundingOrganization: searchRegex },
    ];
  }

  const sortOptions = {
    newest: { startDate: -1, createdAt: -1, _id: -1 },
    oldest: { startDate: 1, createdAt: 1, _id: 1 },
    title: { title: 1, _id: 1 },
  };

  const [projects, total, areas] = await Promise.all([
    ResearchProject.find(filter)
      .sort(sortOptions[params.sort])
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .lean(),

    ResearchProject.countDocuments(filter),

    ResearchProject.distinct("researchArea"),
  ]);

  return {
    projects: JSON.parse(JSON.stringify(projects)),
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
    areas: areas.filter(Boolean).sort((a, b) => a.localeCompare(b)),
  };
}

export async function getResearchProjects(input = {}) {
  const params = normalizeParams(input);

  const getCachedResults = unstable_cache(
    async () => getResearchProjectsFromDB(params),
    [
      "research-projects",
      params.search,
      params.status,
      params.researchArea,
      params.sort,
      String(params.page),
      String(params.limit),
    ],
    {
      revalidate: 60 * 60 * 6,
      tags: ["research-projects"],
    }
  );

  return getCachedResults();
}
