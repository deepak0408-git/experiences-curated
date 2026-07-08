"use server";

import { db } from "@/lib/db";
import { eventPackFeedback, sportingEvents } from "@/schema/database";
import { eq, sql, desc } from "drizzle-orm";

export async function getFeedbackSummary() {
  const summaryRows = await db
    .select({
      eventId: sportingEvents.id,
      eventName: sportingEvents.name,
      eventSlug: sportingEvents.slug,
      responses: sql<number>`count(${eventPackFeedback.id})`.mapWith(Number),
      avgRating: sql<number>`round(avg(${eventPackFeedback.rating})::numeric, 2)`.mapWith(Number),
      commentsCount: sql<number>`count(${eventPackFeedback.comment})`.mapWith(Number),
    })
    .from(eventPackFeedback)
    .innerJoin(sportingEvents, eq(eventPackFeedback.sportingEventId, sportingEvents.id))
    .groupBy(sportingEvents.id, sportingEvents.name, sportingEvents.slug)
    .orderBy(desc(sql`count(${eventPackFeedback.id})`));

  const comments = await db
    .select({
      id: eventPackFeedback.id,
      email: eventPackFeedback.email,
      rating: eventPackFeedback.rating,
      comment: eventPackFeedback.comment,
      displayConsent: eventPackFeedback.displayConsent,
      createdAt: eventPackFeedback.createdAt,
      eventName: sportingEvents.name,
      eventSlug: sportingEvents.slug,
    })
    .from(eventPackFeedback)
    .innerJoin(sportingEvents, eq(eventPackFeedback.sportingEventId, sportingEvents.id))
    .where(sql`${eventPackFeedback.comment} is not null`)
    .orderBy(desc(eventPackFeedback.createdAt));

  return { summary: summaryRows, comments };
}
