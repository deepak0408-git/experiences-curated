import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { experiences, destinations, sportingEvents } from "@/schema/database";
import { eq, inArray } from "drizzle-orm";

// Must be the canonical www host — the site 308-redirects the bare apex
// domain (experiences-curated.com) to www.experiences-curated.com, so any
// sitemap entry built off the apex domain sends Google to crawl a redirect
// on every single URL instead of indexing the real page directly. Confirmed
// live 23 Aug 2026: Search Console flagged 181 pages as "Page with
// redirect" — all of them apex-domain sitemap entries hitting that
// redirect. Never fall back to the bare apex domain here again.
const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.experiences-curated.com";

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
      .from(sportingEvents)
      .where(inArray(sportingEvents.packStatus, ["built_hidden", "live"])),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
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
