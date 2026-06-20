import { db } from "@/lib/db";
import { savedItems, users, experiences, destinations, tripBoards } from "@/schema/database";
import { eq, desc, and } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip Board — Experiences | Curated",
};

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity", dining: "Dining", accommodation: "Stay",
  cultural_site: "Cultural Site", natural_wonder: "Natural Wonder",
  neighborhood: "Neighbourhood", day_trip: "Day Trip", multi_day: "Multi-day",
  sports_venue: "Sports Venue", fan_experience: "Fan Experience",
  transit: "Transit", event: "Event",
};

const BUDGET_LABELS: Record<string, string> = {
  free: "Free", budget: "Budget", moderate: "Mid-range",
  splurge: "Splurge", luxury: "Luxury",
};

const TYPE_COLORS: Record<string, string> = {
  fan_experience: "bg-blue-100 border-blue-300 text-blue-800",
  sports_venue:   "bg-blue-100 border-blue-300 text-blue-800",
  dining:         "bg-amber-100 border-amber-300 text-amber-800",
  accommodation:  "bg-purple-100 border-purple-300 text-purple-800",
  transit:        "bg-neutral-100 border-neutral-300 text-neutral-600",
  activity:       "bg-emerald-100 border-emerald-300 text-emerald-800",
  cultural_site:  "bg-rose-100 border-rose-300 text-rose-800",
  neighborhood:   "bg-teal-100 border-teal-300 text-teal-800",
  day_trip:       "bg-orange-100 border-orange-300 text-orange-800",
  natural_wonder: "bg-green-100 border-green-300 text-green-800",
  event:          "bg-indigo-100 border-indigo-300 text-indigo-800",
  multi_day:      "bg-orange-100 border-orange-300 text-orange-800",
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDayHeading(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export default async function SharedTripBoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ board?: string }>;
}) {
  const { userId } = await params;
  const { board: boardId } = await searchParams;

  const [owner] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.authId, userId))
    .limit(1);

  if (!owner) notFound();

  // Resolve the board — use the provided boardId if it belongs to this user, else fall back to default
  let resolvedBoardId = boardId ?? null;
  let boardTitle = "";
  if (resolvedBoardId) {
    const [board] = await db
      .select({ id: tripBoards.id, title: tripBoards.title })
      .from(tripBoards)
      .where(and(eq(tripBoards.id, resolvedBoardId), eq(tripBoards.userId, owner.id)))
      .limit(1);
    if (!board) resolvedBoardId = null;
    else boardTitle = board.title;
  }
  if (!resolvedBoardId) {
    const [defaultBoard] = await db
      .select({ id: tripBoards.id, title: tripBoards.title })
      .from(tripBoards)
      .where(eq(tripBoards.userId, owner.id))
      .limit(1);
    resolvedBoardId = defaultBoard?.id ?? null;
    boardTitle = defaultBoard?.title ?? "Trip Board";
  }
  if (!resolvedBoardId) notFound();

  const saved = await db
    .select({
      savedItemId: savedItems.id,
      notes: savedItems.notes,
      scheduledAt: savedItems.scheduledAt,
      durationMinutes: savedItems.durationMinutes,
      title: experiences.title,
      subtitle: experiences.subtitle,
      slug: experiences.slug,
      heroImageUrl: experiences.heroImageUrl,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      neighborhood: experiences.neighborhood,
      destinationName: destinations.name,
    })
    .from(savedItems)
    .innerJoin(experiences, eq(savedItems.experienceId, experiences.id))
    .innerJoin(destinations, eq(experiences.destinationId, destinations.id))
    .where(and(eq(savedItems.userId, owner.id), eq(savedItems.tripBoardId, resolvedBoardId!)))
    .orderBy(desc(savedItems.createdAt));

  // Sort: scheduled first by time, then unscheduled
  saved.sort((a, b) => {
    if (a.scheduledAt && b.scheduledAt) return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
    if (a.scheduledAt) return -1;
    if (b.scheduledAt) return 1;
    return 0;
  });

  // Build itinerary — group scheduled items by day
  const scheduled = saved.filter((i) => i.scheduledAt && i.durationMinutes);
  const byDay = new Map<string, typeof scheduled>();
  for (const item of scheduled) {
    const d = new Date(item.scheduledAt!);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(item);
  }
  const sortedDays = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));
  for (const [, items] of sortedDays) {
    items.sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());
  }

  const unscheduled = saved.filter((i) => !i.scheduledAt);
  const scheduledCount = scheduled.length;

  const sharedTitle = `${owner.email?.split("@")[0]}'s ${boardTitle}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors whitespace-nowrap">
            Experiences | Curated
          </Link>
          <Link href="/search" className="hidden sm:block text-sm text-[#6A6A6A] hover:text-white transition-colors">
            Browse experiences
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">
            Shared Trip Board
          </p>
          <h1 className="text-3xl font-black text-white">{sharedTitle}</h1>
          <p className="mt-1 text-sm text-[#A3A3A3]">
            {saved.length} saved experience{saved.length !== 1 ? "s" : ""}
            {scheduledCount > 0 ? ` · ${scheduledCount} scheduled` : ""}
          </p>
        </div>

        {saved.length === 0 ? (
          <p className="text-[#6A6A6A] text-sm">This board is empty.</p>
        ) : (
          <div className="flex gap-8 items-start">
            {/* Left — experience cards */}
            <div className="w-full lg:w-[60%] lg:flex-shrink-0 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#AAFF00] mb-4">
                Saved experiences
              </p>
              {saved.map((item) => (
                <div key={item.savedItemId} className="rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden">
                  <div className="flex">
                    <Link href={`/experience/${item.slug}`} className="block flex-shrink-0">
                      <div className="relative w-24 h-24 overflow-hidden bg-[#1A1A1A]">
                        {item.heroImageUrl ? (
                          <Image src={item.heroImageUrl} alt={item.title} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="96px" />
                        ) : (
                          <div className="w-full h-full bg-[#2A2A2A]" />
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0 px-3 py-2.5">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#6A6A6A]">
                        {TYPE_LABELS[item.experienceType] ?? item.experienceType}
                        <span className="hidden sm:inline">{item.budgetTier ? ` · ${BUDGET_LABELS[item.budgetTier]}` : ""}</span>
                      </span>
                      <Link href={`/experience/${item.slug}`}>
                        <h3 className="text-sm font-black text-white leading-snug line-clamp-1 hover:text-[#AAFF00] transition-colors mt-0.5">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#6A6A6A] mt-0.5">
                        {item.destinationName}{item.neighborhood ? ` · ${item.neighborhood}` : ""}
                      </p>
                      {item.scheduledAt && item.durationMinutes && (
                        <p className="mt-1.5 text-xs font-medium text-[#AAFF00]">
                          📅 {new Date(item.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {formatTime(new Date(item.scheduledAt))}–{formatTime(new Date(new Date(item.scheduledAt).getTime() + item.durationMinutes * 60_000))}
                        </p>
                      )}
                      {item.notes && (
                        <p className="mt-1 text-xs text-[#6A6A6A] italic line-clamp-1">{item.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — itinerary timeline */}
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#AAFF00] mb-4">
                Itinerary
              </p>

              {unscheduled.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2">
                    Not yet scheduled ({unscheduled.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {unscheduled.map((item) => (
                      <span key={item.savedItemId} className="px-2.5 py-1 rounded-sm border border-[#2A2A2A] text-[#6A6A6A] text-xs font-medium truncate max-w-[160px]" title={item.title}>
                        {item.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {sortedDays.length === 0 && (
                <p className="text-sm text-[#6A6A6A]">No items scheduled yet.</p>
              )}

              <div className="space-y-6">
                {sortedDays.map(([dateStr, dayItems]) => (
                  <div key={dateStr}>
                    <p className="text-xs font-black text-white mb-2 pb-1.5 border-b border-[#2A2A2A]">
                      {formatDayHeading(dateStr)}
                    </p>
                    <div className="space-y-1.5">
                      {dayItems.map((item) => {
                        const start = new Date(item.scheduledAt!);
                        const end = new Date(start.getTime() + item.durationMinutes! * 60_000);
                        return (
                          <Link
                            key={item.savedItemId}
                            href={`/experience/${item.slug}`}
                            className="flex items-start gap-2 rounded-sm border border-[#2A2A2A] bg-[#141414] px-2.5 py-2 hover:border-[#AAFF00] transition-colors"
                          >
                            <span className="text-[10px] font-semibold tabular-nums whitespace-nowrap mt-0.5 text-[#6A6A6A]">
                              {formatTime(start)}–{formatTime(end)}
                            </span>
                            <span className="text-xs font-black text-white leading-snug line-clamp-2">
                              {item.title}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-[#2A2A2A] text-center">
          <p className="text-sm text-[#A3A3A3] mb-4">Want to build your own Trip Board?</p>
          <Link href="/trip-board" className="inline-flex px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors">
            Get started free
          </Link>
        </div>
      </div>
    </div>
  );
}
