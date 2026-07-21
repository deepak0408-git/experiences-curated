import { createClient } from "@/lib/supabase/server";
import { hasProSubscription } from "@/lib/pro";
import { db } from "@/lib/db";
import { savedItems, users, experiences, destinations, sportingEvents } from "@/schema/database";
import { eq, and, desc, gte, inArray } from "drizzle-orm";
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
      <div className="min-h-screen bg-[#0A0A0A]">
        <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4">
            <Link href="/" className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
              Experiences | Curated
            </Link>
          </div>
        </nav>
        <div className="max-w-sm mx-auto px-6 py-24 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">Trip Board</p>
          <h1 className="text-2xl font-black text-white mb-3">Sign in to see your board</h1>
          <p className="text-sm text-[#A3A3A3] leading-6 mb-8">
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
    // Race condition fix (21 Jul 2026): concurrent requests for the same
    // new user (e.g. a double-tap or rapid reload) can both pass the
    // SELECT above before either INSERT commits, then collide on
    // users_email_unique. onConflictDoNothing absorbs the loser insert;
    // the follow-up SELECT recovers the row that actually won — same
    // pattern already used in trip-board/actions.ts and
    // experience/[slug]/actions.ts.
    await db
      .insert(users)
      .values({ email: authUser.email!, authId: authUser.id })
      .onConflictDoNothing();

    [dbUser] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.authId, authUser.id))
      .limit(1);
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
    .where(and(
      gte(sportingEvents.endDate, today),
      eq(sportingEvents.isHidden, false),
      inArray(sportingEvents.packStatus, ["built_hidden", "live"]),
    ))
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
      hideProCtas={process.env.HIDE_PRO === "true"}
    />
  );
}
