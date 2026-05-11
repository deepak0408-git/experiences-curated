import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { experiences, destinations, sportingEvents } from "@/schema/database";
import { eq } from "drizzle-orm";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://experiencescurated.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publishedExps, allDestinations, allEvents] = await Promise.all([
    db
      .select({ slug: experiences.slug, updatedAt: experiences.updatedAt })
      .from(experiences)
      .where(eq(experiences.status, "published")),
    db
      .select({ slug: destinations.slug, updatedAt: destinations.updatedAt })
      .from(destinations),
    db
      .select({ slug: sportingEvents.slug, updatedAt: sportingEvents.updatedAt })
      .from(sportingEvents),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/trip-board`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: new Date("2026-05-07"), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: new Date("2026-05-07"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const experiencePages: MetadataRoute.Sitemap = publishedExps.map((e) => ({
    url: `${BASE}/experience/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const destinationPages: MetadataRoute.Sitemap = allDestinations.map((d) => ({
    url: `${BASE}/destination/${d.slug}`,
    lastModified: d.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const eventPackPages: MetadataRoute.Sitemap = allEvents.map((e) => ({
    url: `${BASE}/event-pack/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...eventPackPages, ...destinationPages, ...experiencePages];
}
