import { createClient } from "@/lib/supabase/server";
import { hasProSubscription } from "@/lib/pro";
import { db } from "@/lib/db";
import { savedItems, users, experiences, destinations, sportingEvents } from "@/schema/database";
import { eq, desc, gte } from "drizzle-orm";
import Link from "next/link";
import type { Metadata } from "next";
import TripBoardSignIn from "./_components/TripBoardSignIn";
import TripBoardPlanner from "./_components/TripBoardPlanner";
import type { PlannerItem, UpcomingEvent } from "./_components/TripBoardPlanner";
import { getOrCreateDefaultBoard, getUserBoards } from "@/lib/trip-boards";

export const metadata: Metadata = {
  title: "Trip Board — Experiences | Curated",
};

export default async function TripBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-neutral-100">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4">
            <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
              Experiences | Curated
            </Link>
          </div>
        </nav>
        <div className="max-w-sm mx-auto px-6 py-24 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">Trip Board</p>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">Sign in to see your board</h1>
          <p className="text-sm text-neutral-500 leading-6 mb-8">
            Enter your email and we&apos;ll send you a sign-in link. No password needed.
          </p>
          <TripBoardSignIn />
        </div>
      </div>
    );
  }

  const isPro = authUser.email ? await hasProSubscription(authUser.email) : false;

  let [dbUser] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.authId, authUser.id))
    .limit(1);

  if (!dbUser) {
    [dbUser] = await db
      .insert(users)
      .values({ email: authUser.email!, authId: authUser.id })
      .returning({ id: users.id, email: users.email });
  }

  // Ensure a default board exists and backfill any orphaned saves
  const defaultBoardId = await getOrCreateDefaultBoard(dbUser.id);
  const allBoards = await getUserBoards(dbUser.id);

  // Active board — from URL param or default
  const { board: boardParam } = await searchParams;
  const activeBoardId = boardParam && allBoards.find((b) => b.id === boardParam)
    ? boardParam
    : defaultBoardId;

  const rows = await db
    .select({
      savedItemId: savedItems.id,
      status: savedItems.status,
      notes: savedItems.notes,
      scheduledAt: savedItems.scheduledAt,
      durationMinutes: savedItems.durationMinutes,
      experienceId: experiences.id,
      title: experiences.title,
      subtitle: experiences.subtitle,
      slug: experiences.slug,
      heroImageUrl: experiences.heroImageUrl,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      neighborhood: experiences.neighborhood,
      destinationName: destinations.name,
      bookingLinks: experiences.bookingLinks,
    })
    .from(savedItems)
    .innerJoin(experiences, eq(savedItems.experienceId, experiences.id))
    .innerJoin(destinations, eq(experiences.destinationId, destinations.id))
    .where(eq(savedItems.tripBoardId, activeBoardId))
    .orderBy(desc(savedItems.createdAt));

  const items: PlannerItem[] = rows.map((r) => ({
    ...r,
    scheduledAt: r.scheduledAt ? r.scheduledAt.toISOString() : null,
    bookingLinks: r.bookingLinks as Array<{ platform: string; url: string }> | null,
  }));

  const today = new Date().toISOString().slice(0, 10);
  const upcomingEventRows = await db
    .select({
      slug: sportingEvents.slug,
      name: sportingEvents.name,
      sport: sportingEvents.sport,
      heroImageUrl: sportingEvents.heroImageUrl,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      venueName: sportingEvents.venueName,
      destinationName: destinations.name,
    })
    .from(sportingEvents)
    .leftJoin(destinations, eq(sportingEvents.destinationId, destinations.id))
    .where(gte(sportingEvents.endDate, today))
    .orderBy(sportingEvents.startDate);

  const upcomingEvents: UpcomingEvent[] = upcomingEventRows.map((e) => ({
    ...e,
    destinationName: e.destinationName ?? null,
  }));

  return (
    <TripBoardPlanner
      key={activeBoardId}
      initialItems={items}
      userId={authUser.id}
      userEmail={authUser.email ?? ""}
      isPro={isPro}
      boards={allBoards.map((b) => ({ id: b.id, title: b.title }))}
      activeBoardId={activeBoardId}
      dbUserId={dbUser.id}
      upcomingEvents={upcomingEvents}
    />
  );
}
