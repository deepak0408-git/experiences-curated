"use server";

import { db } from "@/lib/db";
import { blogArticles, sportingEvents } from "@/schema/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllBlogArticlesForReview() {
  return db
    .select({
      id: blogArticles.id,
      title: blogArticles.title,
      slug: blogArticles.slug,
      status: blogArticles.status,
      contentCategory: blogArticles.contentCategory,
      sport: blogArticles.sport,
      seriesSlug: blogArticles.seriesSlug,
      seriesPosition: blogArticles.seriesPosition,
      eventName: sportingEvents.name,
      excerpt: blogArticles.excerpt,
      reviewNotes: blogArticles.reviewNotes,
      createdAt: blogArticles.createdAt,
      publishedAt: blogArticles.publishedAt,
    })
    .from(blogArticles)
    .leftJoin(sportingEvents, eq(blogArticles.sportingEventId, sportingEvents.id))
    .orderBy(blogArticles.createdAt);
}

// Distinct series slugs actually present in the DB (any status — a curator
// reviewing an in_review article needs to see series still in progress, not
// just published ones) — drives the series filter dropdown, never a
// hardcoded list (avoids the same Record<string,>-drift trap already
// logged in Operations Checklist P2 T3 #1).
export async function getSeriesOptions() {
  const rows = await db.selectDistinct({ seriesSlug: blogArticles.seriesSlug }).from(blogArticles);
  return rows.map((r) => r.seriesSlug).filter((s): s is string => !!s).sort();
}

async function getSlug(id: string) {
  const [row] = await db.select({ slug: blogArticles.slug }).from(blogArticles).where(eq(blogArticles.id, id));
  return row?.slug ?? null;
}

export async function publishBlogArticle(id: string) {
  const slug = await getSlug(id);
  await db
    .update(blogArticles)
    .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(blogArticles.id, id));
  revalidatePath("/curator/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function unpublishBlogArticle(id: string) {
  const slug = await getSlug(id);
  await db
    .update(blogArticles)
    .set({ status: "in_review", updatedAt: new Date() })
    .where(eq(blogArticles.id, id));
  revalidatePath("/curator/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

// Return with feedback — same pattern as experiences' returnToDraft. Stays
// in_review (there's no separate "draft" state for blog articles) but
// records what needs fixing so the next research/rewrite pass has a target.
export async function returnBlogArticle(id: string, notes: string) {
  await db
    .update(blogArticles)
    .set({ reviewNotes: notes.trim() || null, updatedAt: new Date() })
    .where(eq(blogArticles.id, id));
  revalidatePath("/curator/blog");
}

export async function rejectBlogArticle(id: string) {
  const slug = await getSlug(id);
  await db
    .update(blogArticles)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(blogArticles.id, id));
  revalidatePath("/curator/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}
