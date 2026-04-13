import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { guides } from "@/data/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const guideUrls = guides.map((guide) => ({
    url: `${SITE_URL}/guide/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date("2026-04-13"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/checklist`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/checklist/hospital`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/checklist/home`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/checklist/accident`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/calculator`,
      lastModified: new Date("2026-04-13"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guide`,
      lastModified: new Date("2026-04-13"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...guideUrls,
    {
      url: `${SITE_URL}/experts`,
      lastModified: new Date("2026-03-29"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
