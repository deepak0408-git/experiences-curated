import { db } from "@/lib/db";
import { savedItems, users, experiences, destinations, tripBoards } from "@/schema/database";
import { eq, desc, and } from "drizzle-orm";
import Link from "next/link";
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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
            Experiences | Curated
          </Link>
          <Link href="/search" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            Browse experiences
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2">
            Shared Trip Board
          </p>
          <h1 className="text-3xl font-bold text-neutral-900">{sharedTitle}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {saved.length} saved experience{saved.length !== 1 ? "s" : ""}
            {scheduledCount > 0 ? ` · ${scheduledCount} scheduled` : ""}
          </p>
        </div>

        {saved.length === 0 ? (
          <p className="text-neutral-400 text-sm">This board is empty.</p>
        ) : (
          <div className="flex gap-8 items-start">
            {/* Left — experience cards */}
            <div className="w-[60%] flex-shrink-0 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                Saved experiences
              </p>
              {saved.map((item) => (
                <div key={item.savedItemId} className="rounded-xl border border-neutral-200 overflow-hidden">
                  <div className="flex">
                    <Link href={`/experience/${item.slug}`} className="block flex-shrink-0">
                      <div className="w-24 h-24 overflow-hidden bg-neutral-100">
                        {item.heroImageUrl ? (
                          <img src={item.heroImageUrl} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-neutral-200" />
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0 px-3 py-2.5">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">
                        {TYPE_LABELS[item.experienceType] ?? item.experienceType}
                        {item.budgetTier ? ` · ${BUDGET_LABELS[item.budgetTier]}` : ""}
                      </span>
                      <Link href={`/experience/${item.slug}`}>
                        <h3 className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-1 hover:text-neutral-600 transition-colors mt-0.5">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {item.destinationName}{item.neighborhood ? ` · ${item.neighborhood}` : ""}
                      </p>
                      {item.scheduledAt && item.durationMinutes && (
                        <p className="mt-1.5 text-xs font-medium text-emerald-600">
                          📅 {new Date(item.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {formatTime(new Date(item.scheduledAt))}–{formatTime(new Date(new Date(item.scheduledAt).getTime() + item.durationMinutes * 60_000))}
                        </p>
                      )}
                      {item.notes && (
                        <p className="mt-1 text-xs text-neutral-500 italic line-clamp-1">{item.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — itinerary timeline */}
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                Itinerary
              </p>

              {unscheduled.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-2">
                    Not yet scheduled ({unscheduled.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {unscheduled.map((item) => (
                      <span key={item.savedItemId} className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 text-xs font-medium truncate max-w-[160px]" title={item.title}>
                        {item.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {sortedDays.length === 0 && (
                <p className="text-sm text-neutral-400">No items scheduled yet.</p>
              )}

              <div className="space-y-6">
                {sortedDays.map(([dateStr, dayItems]) => (
                  <div key={dateStr}>
                    <p className="text-xs font-bold text-neutral-700 mb-2 pb-1.5 border-b border-neutral-100">
                      {formatDayHeading(dateStr)}
                    </p>
                    <div className="space-y-1.5">
                      {dayItems.map((item) => {
                        const start = new Date(item.scheduledAt!);
                        const end = new Date(start.getTime() + item.durationMinutes! * 60_000);
                        const color = TYPE_COLORS[item.experienceType] ?? "bg-neutral-100 border-neutral-200 text-neutral-700";
                        return (
                          <Link
                            key={item.savedItemId}
                            href={`/experience/${item.slug}`}
                            className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 hover:opacity-80 transition-opacity ${color}`}
                          >
                            <span className="text-[10px] font-semibold tabular-nums whitespace-nowrap mt-0.5 opacity-70">
                              {formatTime(start)}–{formatTime(end)}
                            </span>
                            <span className="text-xs font-semibold leading-snug line-clamp-2">
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
        <div className="mt-12 pt-8 border-t border-neutral-100 text-center">
          <p className="text-sm text-neutral-500 mb-4">Want to build your own Trip Board?</p>
          <Link href="/trip-board" className="inline-flex px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors">
            Get started free
          </Link>
        </div>
      </div>
    </div>
  );
}
