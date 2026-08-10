import { db } from "@/lib/db";
import { blogArticles, sportingEvents } from "@/schema/database";
import { and, eq, desc, asc, sql } from "drizzle-orm";
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
export async function getRelatedByCategory(contentCategory: string, excludeSlug: string, limit = 4) {
  return db
    .select({
      slug: blogArticles.slug,
      title: blogArticles.title,
    })
    .from(blogArticles)
    .where(and(eq(blogArticles.contentCategory, contentCategory as "history" | "rivalry" | "why_go" | "bucket_list" | "travel_craft"), PUBLISHED))
    .orderBy(desc(blogArticles.publishedAt))
    .limit(limit + 1)
    .then((rows) => rows.filter((r) => r.slug !== excludeSlug).slice(0, limit));
}

// Index listing — flat, chronological (see design doc: flat is fine at
// pilot-batch scale, revisit past ~40-50 articles).
export async function getBlogArticles(opts?: { category?: string; sport?: string }) {
  const conditions = [PUBLISHED];
  if (opts?.category) {
    conditions.push(eq(blogArticles.contentCategory, opts.category as "history" | "rivalry" | "why_go" | "bucket_list"));
  }
  if (opts?.sport) {
    conditions.push(sql`${opts.sport} = ANY(${blogArticles.sport})`);
  }

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
    .orderBy(desc(blogArticles.publishedAt));
}
