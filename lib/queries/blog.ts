import { db } from "@/lib/db";
import { blogArticles, sportingEvents } from "@/schema/database";
import { and, eq, desc, asc, sql, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";

const PUBLISHED = eq(blogArticles.status, "published");

// No status filter here — matches getExperienceBySlug's pattern exactly.
// An in_review article is reachable at its real /blog/[slug] URL by direct
// link only (never surfaced by the index/related/series queries below,
// which do filter to published) — this is what makes curator/blog's
// "Preview" link work the same way curator/review's does, without a
// separate draft-preview route.
export async function getBlogArticleBySlug(slug: string) {
  const [row] = await db
    .select({
      id: blogArticles.id,
      slug: blogArticles.slug,
      title: blogArticles.title,
      sport: blogArticles.sport,
      sportingEventId: blogArticles.sportingEventId,
      contentCategory: blogArticles.contentCategory,
      seriesSlug: blogArticles.seriesSlug,
      seriesPosition: blogArticles.seriesPosition,
      excerpt: blogArticles.excerpt,
      bodyContent: blogArticles.bodyContent,
      readMinutes: blogArticles.readMinutes,
      heroImageUrl: blogArticles.heroImageUrl,
      heroImageAlt: blogArticles.heroImageAlt,
      heroImageCredit: blogArticles.heroImageCredit,
      status: blogArticles.status,
      publishedAt: blogArticles.publishedAt,
      eventName: sportingEvents.name,
      eventSlug: sportingEvents.slug,
      eventPackStatus: sportingEvents.packStatus,
      eventIsHidden: sportingEvents.isHidden,
      eventPackFormat: sportingEvents.packFormat,
    })
    .from(blogArticles)
    .leftJoin(sportingEvents, eq(blogArticles.sportingEventId, sportingEvents.id))
    .where(eq(blogArticles.slug, slug));

  if (!row) notFound();
  return row;
}

// Sibling entries in the same named series, ordered by seriesPosition.
export async function getSeriesSiblings(seriesSlug: string, excludeSlug: string) {
  return db
    .select({
      slug: blogArticles.slug,
      title: blogArticles.title,
      seriesPosition: blogArticles.seriesPosition,
    })
    .from(blogArticles)
    .where(and(eq(blogArticles.seriesSlug, seriesSlug), PUBLISHED))
    .orderBy(asc(blogArticles.seriesPosition))
    .then((rows) => rows.filter((r) => r.slug !== excludeSlug));
}

// Other one-off pieces in the same category, most recent first — used when
// an article has no seriesSlug (see design doc: "More '[Category]' pieces").
// Ranked in 3 tiers: (1) same sportingEventId — genuinely the same event's
// other history/rivalry/etc pieces, (2) same-sport, (3) everything else in
// the category. Within each tier, narrower-sport articles (array length 1)
// rank ahead of broad cross-sport ones, then recency.
// Sport-relevance-over-recency fix: 10 Aug 2026 incident (getArticlesForEvent's
// fallback tier — cross-sport pieces bumping genuinely sport-specific ones).
// Event-tier fix: 14 Aug 2026, found live on a US Open article — 3 other real
// US Open history pieces existed but never surfaced because this query only
// checked contentCategory + sport, never sportingEventId, even though the
// viewed article had one. `sportingEventId` is nullable — most articles
// (rivalries, general history) have none, so that tier is a no-op for them.
export async function getRelatedByCategory(
  contentCategory: string,
  excludeSlug: string,
  sport: string[],
  sportingEventId: string | null,
  limit = 4,
) {
  return db
    .select({
      slug: blogArticles.slug,
      title: blogArticles.title,
    })
    .from(blogArticles)
    .where(and(eq(blogArticles.contentCategory, contentCategory as "history" | "rivalry" | "why_go" | "bucket_list" | "travel_craft"), PUBLISHED))
    .orderBy(
      sportingEventId
        ? sql`CASE WHEN ${blogArticles.sportingEventId} = ${sportingEventId} THEN 0 ELSE 1 END`
        : sql`0::int`,
      sql`CASE WHEN ${blogArticles.sport} && ARRAY[${sql.join(sport.map((s) => sql`${s}`), sql`, `)}]::sport[] THEN 0 ELSE 1 END`,
      sql`array_length(${blogArticles.sport}, 1) asc`,
      desc(blogArticles.publishedAt),
    )
    .limit(limit + 1)
    .then((rows) => rows.filter((r) => r.slug !== excludeSlug).slice(0, limit));
}

// Pack-side "Worth Reading" block (hub page) — the reverse direction of the
// blog sidebar's existing "Get the full guide" link. Event-tagged articles
// first (most relevant), topped up with same-sport articles if fewer than
// `limit` direct matches exist. Never pads with an unrelated sport — if a
// sport genuinely has zero published articles, returns fewer than `limit`
// (or none), and the hub page renders nothing rather than a placeholder.
export async function getArticlesForEvent(sportingEventId: string, sport: string, limit = 3) {
  const eventMatches = await db
    .select({ slug: blogArticles.slug, title: blogArticles.title, excerpt: blogArticles.excerpt, readMinutes: blogArticles.readMinutes, heroImageUrl: blogArticles.heroImageUrl })
    .from(blogArticles)
    .where(and(eq(blogArticles.sportingEventId, sportingEventId), PUBLISHED))
    .orderBy(desc(blogArticles.publishedAt))
    .limit(limit);

  if (eventMatches.length >= limit) return eventMatches;

  const sportMatches = await db
    .select({ slug: blogArticles.slug, title: blogArticles.title, excerpt: blogArticles.excerpt, readMinutes: blogArticles.readMinutes, heroImageUrl: blogArticles.heroImageUrl })
    .from(blogArticles)
    .where(and(sql`${sport} = ANY(${blogArticles.sport})`, PUBLISHED))
    // Single/narrow-sport articles first, then recency — a 4-sport
    // travel-craft piece ("never book a same-day return flight") merely
    // includes this sport, it isn't really about it. Without this, a
    // recently-published cross-sport article can bump a genuinely
    // sport-specific piece (e.g. a Federer/Nadal final) out of the fallback
    // slots purely on publish date. Found live on Shanghai Masters, 10 Aug
    // 2026 — the two fallback fill slots were both cross-sport travel-craft
    // pieces instead of any real tennis-specific article.
    .orderBy(sql`array_length(${blogArticles.sport}, 1) asc`, desc(blogArticles.publishedAt))
    .limit(limit + eventMatches.length);

  const seen = new Set(eventMatches.map((a) => a.slug));
  const fill = sportMatches.filter((a) => !seen.has(a.slug)).slice(0, limit - eventMatches.length);
  return [...eventMatches, ...fill];
}

// Destination-page "Worth reading" block — same job as getArticlesForEvent's
// hub-page block, but a destination can have multiple sportingEvents, so
// this matches articles tagged to ANY of the destination's events first,
// then falls back to articles matching any of those events' sports. Never
// pads with an unrelated sport; returns fewer than `limit` (or none) if the
// destination's events genuinely have no related coverage yet.
// Diversity-first: a destination with 2 cricket events and 1 tennis event
// (e.g. London) must not fill all `limit` slots with cricket just because
// cricket has more event-tagged articles available — picks the single best
// article per represented sport first (event-tagged match preferred over a
// sport-level fallback), THEN fills any remaining slots by recency.
// Founder-confirmed 1 Oct 2026: "endeavour should be to cover at least 1
// blog from all sports" a destination's events represent.
//
// extraEvents covers the page's "Nearby" events too (different
// destinationId, shown on this page via getNearbyDestinationEvents) — e.g.
// London's page shows British Grand Prix (Silverstone, a different
// destination) as nearby, so F1 must be covered here too, not just the 2
// sports attached to London's own destinationId. Caught live 1 Oct 2026:
// Silverstone/F1 wasn't appearing in "Worth reading" despite being part of
// the page.
export async function getArticlesForDestination(
  destinationId: string,
  limit = 3,
  extraEvents: { id: string; sport: typeof sportingEvents.$inferSelect["sport"] }[] = []
) {
  const destEventsRaw = await db
    .select({ id: sportingEvents.id, sport: sportingEvents.sport })
    .from(sportingEvents)
    .where(eq(sportingEvents.destinationId, destinationId));

  const destEvents = [...destEventsRaw, ...extraEvents];
  if (destEvents.length === 0) return [];

  const eventIds = [...new Set(destEvents.map((e) => e.id))];
  const sports = [...new Set(destEvents.map((e) => e.sport))];

  const ARTICLE_COLS = { slug: blogArticles.slug, title: blogArticles.title, excerpt: blogArticles.excerpt, readMinutes: blogArticles.readMinutes, heroImageUrl: blogArticles.heroImageUrl, sport: blogArticles.sport };

  const eventMatches = await db
    .select(ARTICLE_COLS)
    .from(blogArticles)
    .where(and(inArray(blogArticles.sportingEventId, eventIds), PUBLISHED))
    .orderBy(desc(blogArticles.publishedAt));

  const sportMatches = await db
    .select(ARTICLE_COLS)
    .from(blogArticles)
    .where(and(sql`${blogArticles.sport} && ARRAY[${sql.join(sports.map((s) => sql`${s}`), sql`, `)}]::sport[]`, PUBLISHED))
    .orderBy(sql`array_length(${blogArticles.sport}, 1) asc`, desc(blogArticles.publishedAt));

  const picked: typeof eventMatches = [];
  const seen = new Set<string>();

  // One pick per represented sport, in the order the destination's own
  // events appear (not alphabetical) — event-tagged article preferred.
  for (const sport of sports) {
    const best =
      eventMatches.find((a) => a.sport.includes(sport) && !seen.has(a.slug)) ??
      sportMatches.find((a) => a.sport.includes(sport) && !seen.has(a.slug));
    if (best) {
      picked.push(best);
      seen.add(best.slug);
    }
    if (picked.length >= limit) break;
  }

  // Fill any remaining slots by recency across both pools.
  if (picked.length < limit) {
    const fill = [...eventMatches, ...sportMatches]
      .filter((a) => !seen.has(a.slug))
      .filter((a, i, arr) => arr.findIndex((b) => b.slug === a.slug) === i);
    for (const a of fill) {
      if (picked.length >= limit) break;
      picked.push(a);
      seen.add(a.slug);
    }
  }

  return picked.map(({ sport, ...rest }) => rest);
}

// Index listing. Travel Craft always sorts last (added 14 Aug 2026, founder
// request) — it's the broadest/least sport-specific category by design
// (never carries a sportingEventId — see the hard rule in
// blog-article-researcher skill §0), so it reads as a "browse everything
// else first" tier regardless of which filters are active. When a sport
// filter is active, the remaining (non-Travel-Craft) articles get a second
// tier on top: articles where this is the ONLY sport (array length 1 —
// genuinely about this sport, not just touching it) before multi-sport
// articles that merely include it. Recency is the tiebreaker within each
// tier throughout.
export async function getBlogArticles(opts?: { category?: string; sport?: string }) {
  const conditions = [PUBLISHED];
  if (opts?.category) {
    conditions.push(eq(blogArticles.contentCategory, opts.category as "history" | "rivalry" | "why_go" | "bucket_list" | "travel_craft"));
  }
  if (opts?.sport) {
    conditions.push(sql`${opts.sport} = ANY(${blogArticles.sport})`);
  }

  const orderBy = [
    sql`CASE WHEN ${blogArticles.contentCategory} = 'travel_craft' THEN 1 ELSE 0 END`,
    ...(opts?.sport ? [sql`array_length(${blogArticles.sport}, 1) asc`] : []),
    desc(blogArticles.publishedAt),
  ];

  return db
    .select({
      slug: blogArticles.slug,
      title: blogArticles.title,
      excerpt: blogArticles.excerpt,
      sport: blogArticles.sport,
      contentCategory: blogArticles.contentCategory,
      seriesSlug: blogArticles.seriesSlug,
      readMinutes: blogArticles.readMinutes,
      heroImageUrl: blogArticles.heroImageUrl,
      publishedAt: blogArticles.publishedAt,
    })
    .from(blogArticles)
    .where(and(...conditions))
    .orderBy(...orderBy);
}
