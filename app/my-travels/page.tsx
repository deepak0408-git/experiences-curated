import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { travelLogs, users, experiences, sportingEvents, sportingEventExperiences, purchases } from "@/schema/database";
import { eq, desc, and, inArray, isNotNull, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import TravelsClient from "./_components/TravelsClient";

export const metadata: Metadata = {
  title: "My Travels — Experiences | Curated",
};

export default async function MyTravelsPage(props: { searchParams: Promise<{ event?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);

  if (!dbUser) redirect("/");

  const { event: eventId } = await props.searchParams;

  const logs = await db
    .select({
      id: travelLogs.id,
      experienceId: travelLogs.experienceId,
      visitedAt: travelLogs.visitedAt,
      rating: travelLogs.rating,
      moodTags: travelLogs.moodTags,
      title: experiences.title,
      slug: experiences.slug,
      heroImageUrl: experiences.heroImageUrl,
      experienceType: experiences.experienceType,
    })
    .from(travelLogs)
    .innerJoin(experiences, eq(travelLogs.experienceId, experiences.id))
    .where(eq(travelLogs.userId, dbUser.id))
    .orderBy(desc(travelLogs.visitedAt));

  // Post-event prompt: fetch top-10 ranked experiences for the event in the URL
  let promptEvent: {
    eventName: string;
    eventId: string;
    eventEndDate: string;
    experiences: { id: string; title: string; heroImageUrl: string | null; experienceType: string; slug: string }[];
  } | null = null;

  if (eventId) {
    // Verify user purchased this event
    const [purchase] = await db
      .select({ id: purchases.id })
      .from(purchases)
      .where(and(eq(purchases.sportingEventId, eventId), eq(purchases.email, user.email!)))
      .limit(1);

    if (purchase) {
      const [event] = await db
        .select({ name: sportingEvents.name, endDate: sportingEvents.endDate })
        .from(sportingEvents)
        .where(eq(sportingEvents.id, eventId))
        .limit(1);

      const top10 = await db
        .select({
          id: experiences.id,
          title: experiences.title,
          heroImageUrl: experiences.heroImageUrl,
          experienceType: experiences.experienceType,
          slug: experiences.slug,
          packRank: sportingEventExperiences.packRank,
        })
        .from(sportingEventExperiences)
        .innerJoin(experiences, eq(sportingEventExperiences.experienceId, experiences.id))
        .where(
          and(
            eq(sportingEventExperiences.sportingEventId, eventId),
            isNotNull(sportingEventExperiences.packRank)
          )
        )
        .orderBy(asc(sportingEventExperiences.packRank))
        .limit(10);

      if (event && top10.length > 0) {
        // Filter out experiences the user has already logged
        const loggedIds = new Set(logs.map((l) => l.experienceId));
        const unlogged = top10.filter((e) => !loggedIds.has(e.id));

        if (unlogged.length > 0) {
          promptEvent = {
            eventName: event.name,
            eventId,
            eventEndDate: event.endDate.toString(),
            experiences: unlogged,
          };
        }
      }
    }
  }

  return (
    <TravelsClient
      logs={logs.map((l) => ({ ...l, visitedAt: l.visitedAt.toString() }))}
      userEmail={user.email ?? ""}
      promptEvent={promptEvent}
    />
  );
}
