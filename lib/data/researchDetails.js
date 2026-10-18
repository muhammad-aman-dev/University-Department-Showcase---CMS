import { connectDB } from "@/lib/db";
import ResearchArea from "@/models/ResearchArea";
import ResearchProject from "@/models/ResearchProjects";

function serializeDocument(document) {
  if (!document) return null;
  return JSON.parse(JSON.stringify(document));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getResearchAreaBySlug(slug) {
  await connectDB();

  const area = await ResearchArea.findOne({
    slug: String(slug).toLowerCase(),
    status: "active",
  }).lean();

  return serializeDocument(area);
}

export async function getProjectsForResearchArea(areaName) {
  await connectDB();

  const exactName = new RegExp(
    `^\\s*${escapeRegex(String(areaName).trim())}\\s*$`,
    "i"
  );

  const projects = await ResearchProject.find({
    researchArea: exactName,
  })
    .sort({ isFeatured: -1, order: 1, createdAt: -1 })
    .lean();

  return serializeDocument(projects);
}

export async function getResearchProjectBySlug(slug) {
  await connectDB();

  const project = await ResearchProject.findOne({
    slug: String(slug).toLowerCase(),
  }).lean();

  return serializeDocument(project);
}


export async function getActiveResearchAreaByName(areaName) {
    if (!areaName || !String(areaName).trim()) return null;
  
    await connectDB();
  
    const exactName = new RegExp(
      `^\\s*${escapeRegex(String(areaName).trim())}\\s*$`,
      "i"
    );
  
    const area = await ResearchArea.findOne({
      name: exactName,
      status: "active",
    }).lean();
  
    return serializeDocument(area);
  }