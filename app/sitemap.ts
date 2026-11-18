import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { experiences, destinations, sportingEvents, circuitSeatingProfile, tennisTicketIntelligenceOptions } from "@/schema/database";
import { eq, inArray, sql } from "drizzle-orm";

// Must be the canonical www host — the site 308-redirects the bare apex
// domain (experiences-curated.com) to www.experiences-curated.com, so any
// sitemap entry built off the apex domain sends Google to crawl a redirect
// on every single URL instead of indexing the real page directly. Confirmed
// live 23 Aug 2026: Search Console flagged 181 pages as "Page with
// redirect" — all of them apex-domain sitemap entries hitting that
// redirect. Never fall back to the bare apex domain here again.
const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.experiences-curated.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publishedExps, allDestinations, allEvents, f1TiEvents, tennisTiEvents] = await Promise.all([
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
    // Ticket Intelligence (F1) — any event with at least one seeded seat row
    // is reachable at /ticket-intelligence/[slug] (same gate the page itself
    // uses: getSeatingData().seats.length === 0 -> notFound()). Previously
    // absent from the sitemap entirely — Issue 2 investigation, 18 Nov 2026:
    // Google had no sitemap signal to discover or prioritize these pages,
    // a plausible direct cause of organic traffic almost never reaching them.
    db
      .selectDistinct({ slug: sportingEvents.slug, updatedAt: sportingEvents.updatedAt })
      .from(circuitSeatingProfile)
      .innerJoin(sportingEvents, eq(circuitSeatingProfile.sportingEventId, sportingEvents.id))
      .where(sql`${sportingEvents.isHidden} = false`),
    // Ticket Intelligence (tennis) — same pattern, separate route tree
    // (/ticket-intelligence/tennis/[slug]) and gating table.
    db
      .selectDistinct({ slug: sportingEvents.slug, updatedAt: sportingEvents.updatedAt })
      .from(tennisTicketIntelligenceOptions)
      .innerJoin(sportingEvents, eq(tennisTicketIntelligenceOptions.sportingEventId, sportingEvents.id))
      .where(sql`${sportingEvents.isHidden} = false`),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/privacy`, lastModified: new Date("2026-05-07"), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: new Date("2026-05-07"), changeFrequency: "yearly", priority: 0.2 },
    // Trip Intelligence (F1 + tennis) — free, ungated quiz entry pages, each
    // a single static route (no per-event slug). Previously absent from the
    // sitemap entirely, same Issue 2 gap as Ticket Intelligence had. Their
    // /results pages are intentionally excluded — personalized per visitor's
    // answers, not a stable canonical page for any query — and are marked
    // noindex directly on those pages instead. 18 Nov 2026.
    { url: `${BASE}/trip-intelligence/formula-1`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/trip-intelligence/tennis`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    // F1 + Tennis Travel Planning Cockpit — both live in production behind
    // SHOW_F1_COCKPIT/SHOW_TENNIS_COCKPIT (confirmed "true" there, 18 Nov
    // 2026), but were absent from the sitemap entirely — same reasoning as
    // Ticket/Trip Intelligence before this. These are the main discovery
    // hub for every other product (Trip Intelligence, Planner, Ticket
    // Intelligence, Event Guides, Trip Board), so they get the highest
    // static priority on the site besides the homepage itself.
    { url: `${BASE}/formula-1`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tennis`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  // Lowered from 0.9 (was equal to Event Guides) 18 Nov 2026 — Issue 2
  // investigation found Experience pages (free content, hundreds of pages)
  // and Event Guides (paid, one per event) carrying near-identical sitemap
  // priority despite very different commercial value. This only biases
  // Google's relative crawl/re-crawl budget toward revenue pages — it does
  // not deindex, hide, or gate any Experience page, which stays fully
  // crawlable and included.
  const experiencePages: MetadataRoute.Sitemap = publishedExps.map((e) => ({
    url: `${BASE}/experience/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
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

  const ticketIntelligencePages: MetadataRoute.Sitemap = [
    ...f1TiEvents.map((e) => ({
      url: `${BASE}/ticket-intelligence/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...tennisTiEvents.map((e) => ({
      url: `${BASE}/ticket-intelligence/tennis/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];

  return [...staticPages, ...eventPackPages, ...ticketIntelligencePages, ...destinationPages, ...experiencePages];
}
