import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sportingEvents, sportingEventExperiences, experiences } from "@/schema/database";
import { eq, and, gte, asc, isNotNull, count, inArray } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import HomepageTripBoardCTA from "./_components/HomepageTripBoardCTA";
import HomepageNav from "./_components/HomepageNav";
import IdentityStrip from "./_components/IdentityStrip";
import PlannerTeaser from "./_components/PlannerTeaser";
import SportNavigator from "./_components/SportNavigator";
import ScrollFadeInit from "./_components/ScrollFadeInit";
import BrandHero from "./_components/BrandHero";
import { getAuthUser } from "@/lib/supabase/server";

// Revalidate every 5 minutes — events and experience counts change rarely.
// Auth (nav email, trip board CTA) gracefully falls back to unauthenticated state from cache.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Experiences | Curated — Insider guides to the world's greatest sporting events",
  description:
    "Curated experiences for sports fans. Not aggregated — chosen. Hand-picked guides to Wimbledon, the US Open, and beyond.",
};

const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  football: "Football",
  rugby: "Rugby",
  golf: "Golf",
  formula_one: "Formula 1",
  cycling: "Cycling",
  athletics: "Athletics",
  other: "Sport",
};


const HOMEPAGE_PRICE_BY_EVENT: Record<string, { earlyBirdCutoff: string; early: string; standard: string }> = {
  // Real, current key for the evergreen-slug Wimbledon event (migrated 14 Aug
  // 2026) — the DB row's slug is now "wimbledon", not "wimbledon-2026".
  "wimbledon": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_EARLY_BIRD_CUTOFF ?? "2026-06-01",
    early: process.env.NEXT_PUBLIC_EARLY_BIRD_PRICE_DISPLAY ?? "US$15",
    standard: process.env.NEXT_PUBLIC_STANDARD_PRICE_DISPLAY ?? "US$25",
  },
  "belgian-gp-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BELGIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-07-10",
    early: process.env.NEXT_PUBLIC_BELGIAN_GP_EARLY_BIRD_PRICE_DISPLAY ?? "US$15",
    standard: process.env.NEXT_PUBLIC_BELGIAN_GP_STANDARD_PRICE_DISPLAY ?? "US$25",
  },
  "us-open-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_US_OPEN_EARLY_BIRD_CUTOFF ?? "2026-08-01",
    early: "US$0",
    standard: "US$10",
  },
  "india-in-england-cricket-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_CRICKET_EARLY_BIRD_CUTOFF ?? "2026-06-15",
    early: "US$9",
    standard: "US$15",
  },
  "hungarian-gp-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_HUNGARIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-07-17",
    early: "US$0",
    standard: "US$7",
  },
  "italian-gp-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_ITALIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-08-25",
    early: "US$5",
    standard: "US$10",
  },
  "bmw-pga-championship-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BMW_PGA_EARLY_BIRD_CUTOFF ?? "2026-09-03",
    early: "US$5",
    standard: "US$10",
  },
  "australia-in-south-africa-cricket-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_AUS_SA_EARLY_BIRD_CUTOFF ?? "2026-08-09",
    early: "US$5",
    standard: "US$10",
  },
  "bahrain-grand-prix": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BAHRAIN_GP_EARLY_BIRD_CUTOFF ?? "2026-09-04",
    early: "US$5",
    standard: "US$10",
  },
  "singapore-grand-prix": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_SINGAPORE_GP_EARLY_BIRD_CUTOFF ?? "2026-09-01",
    early: "US$5",
    standard: "US$10",
  },
  "atp-finals": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_ATP_FINALS_EARLY_BIRD_CUTOFF ?? "2026-10-18",
    early: "US$5",
    standard: "US$10",
  },
  "shanghai-masters": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_SHANGHAI_MASTERS_EARLY_BIRD_CUTOFF ?? "2026-09-21",
    early: "US$5",
    standard: "US$10",
  },
};


function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${e.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
}

// FREE_EVENT_SLUGS format: "slug:YYYY-MM-DD,slug:YYYY-MM-DD,slug" — a slug with
// no :date is free with no end date; a slug with :date is free through the end
// of that day (UTC). Must match the parsing in app/event-pack/[slug]/page.tsx
// exactly, or the pages disagree on which events are free (caught live on
// homepage vs event-pack pages, 12 Jul 2026 — and again 13 Jul 2026, when the
// :date suffix was found to be parsed everywhere but never actually compared
// against today, so dated entries stayed free forever past their cutoff).
function isFreeEventSlug(slug: string): boolean {
  const entry = (process.env.FREE_EVENT_SLUGS ?? "")
    .split(",")
    .filter(Boolean)
    .map((e) => {
      const [entrySlug, endDate] = e.split(":");
      return { slug: entrySlug.trim(), endDate: endDate?.trim() };
    })
    .find((e) => e.slug === slug);
  if (!entry) return false;
  if (!entry.endDate) return true;
  return new Date() <= new Date(`${entry.endDate}T23:59:59Z`);
}

function eventPriceDisplay(slug: string): string {
  if (isFreeEventSlug(slug)) return "Free";
  // Fallback changed from "wimbledon-2026" to "us-open-2026" 16 Aug 2026 —
  // "wimbledon-2026" retired entirely as part of the Wimbledon evergreen-
  // slug migration (see lib/packPricing.ts and app/event-pack/[slug]/page.tsx
  // for the same change).
  const pricing = HOMEPAGE_PRICE_BY_EVENT[slug] ?? HOMEPAGE_PRICE_BY_EVENT["us-open-2026"];
  const isEarlyBird = new Date() < new Date(pricing.earlyBirdCutoff);
  return isEarlyBird ? pricing.early : pricing.standard;
}

function earlyBirdNudge(slug: string): { show: boolean; cutoffLabel: string; standardPrice: string } {
  if (isFreeEventSlug(slug)) return { show: false, cutoffLabel: "", standardPrice: "" };
  const pricing = HOMEPAGE_PRICE_BY_EVENT[slug];
  if (!pricing) return { show: false, cutoffLabel: "", standardPrice: "" };
  const isEarlyBird = new Date() < new Date(pricing.earlyBirdCutoff);
  if (!isEarlyBird) return { show: false, cutoffLabel: "", standardPrice: "" };
  const d = new Date(pricing.earlyBirdCutoff);
  const cutoffLabel = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return { show: true, cutoffLabel, standardPrice: pricing.standard };
}

function eventState(startDate: string, endDate: string) {
  const toStart = daysUntil(startDate);
  const toEnd = daysUntil(endDate);
  if (toStart > 0) return { state: "upcoming" as const, toStart, toEnd };
  if (toEnd >= 0) return { state: "live" as const, toStart, toEnd };
  return { state: "past" as const, toStart, toEnd };
}

export default async function HomePage() {
  const today = new Date().toISOString().split("T")[0];
  const in120Days = new Date(Date.now() + 120 * 86_400_000).toISOString().split("T")[0];

  const { user } = await getAuthUser();

  // Fetch featured events from DB by homepageSlot (set via /curator/events)
  const featuredRows = await db
    .select()
    .from(sportingEvents)
    .where(and(isNotNull(sportingEvents.homepageSlot), eq(sportingEvents.isHidden, false)))
    .orderBy(asc(sportingEvents.homepageSlot));

  const featuredSorted = featuredRows.slice(0, 4);

  // All upcoming events not in the featured set — for "On the calendar"
  const allUpcoming = await db
    .select()
    .from(sportingEvents)
    .where(and(
      gte(sportingEvents.endDate, today),
      inArray(sportingEvents.packStatus, ["built_hidden", "live"]),
    ))
    .orderBy(asc(sportingEvents.startDate));

  const calendarEvents = allUpcoming
    .filter((e) => e.startDate <= in120Days && !e.isHidden);

  // Experience counts per event for calendar cards
  const expCounts = await db
    .select({ eventId: sportingEventExperiences.sportingEventId, cnt: count() })
    .from(sportingEventExperiences)
    .innerJoin(experiences, and(
      eq(experiences.id, sportingEventExperiences.experienceId),
      eq(experiences.status, "published")
    ))
    .groupBy(sportingEventExperiences.sportingEventId);

  const expCountMap = Object.fromEntries(expCounts.map((r) => [r.eventId, r.cnt]));

  // Top 3 experiences per calendar event for glimpse thumbnails
  const calendarEventIds = calendarEvents.map((e) => e.id);
  const glimpseRows = calendarEventIds.length > 0
    ? await db
        .select({
          eventId: sportingEventExperiences.sportingEventId,
          id: experiences.id,
          title: experiences.title,
          packRank: sportingEventExperiences.packRank,
        })
        .from(sportingEventExperiences)
        .innerJoin(experiences, eq(experiences.id, sportingEventExperiences.experienceId))
        .where(and(
          eq(experiences.status, "published"),
          isNotNull(sportingEventExperiences.packRank)
        ))
        .orderBy(asc(sportingEventExperiences.packRank))
    : [];

  // Group by eventId, keep top 3 per event
  const glimpseMap: Record<string, { id: string; title: string }[]> = {};
  for (const row of glimpseRows) {
    if (!row.eventId) continue;
    if (!glimpseMap[row.eventId]) glimpseMap[row.eventId] = [];
    if (glimpseMap[row.eventId].length < 5) {
      glimpseMap[row.eventId].push({ id: row.id, title: row.title });
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <ScrollFadeInit />

      {/* Zone 1 — Nav overlaid on hero + crossfading brand hero */}
      <div className="relative">
        <HomepageNav email={user?.email ?? null} showSearch={true} overlay={true} />
        <BrandHero
          featuredEvents={featuredSorted.map((ev) => ({
            slug: ev.slug,
            name: ev.name,
            sport: ev.sport,
            startDate: ev.startDate,
            endDate: ev.endDate,
            isFree: eventPriceDisplay(ev.slug) === "Free",
          }))}
          hasCalendarEvents={calendarEvents.length > 0}
          showPlannerLink={process.env.SHOW_PLANNER_TEASER === "true"}
        />
      </div>

      {/* Zone 1.5 — Trip Planner teaser: the alternate path for visitors who
          are sport-decided but event-undecided. Sits before Identity Strip
          and On the calendar/Browse by sport, since those all assume the
          visitor already knows their event.
          Gated behind SHOW_PLANNER_TEASER during Planner beta (27 Jul 2026)
          — Planner itself stays live at /planner (shareable with beta
          testers directly), homepage stays unchanged for everyone else
          until beta wraps and this flag flips to "true". */}
      {process.env.SHOW_PLANNER_TEASER === "true" && <PlannerTeaser />}

      {/* Zone 2 — Identity strip */}
      <IdentityStrip />

      {/* Browse CTA — mobile only */}
      <div className="md:hidden bg-[#0A0A0A] px-4 pt-8 pb-0">
        <Link
          href="/search"
          className="inline-flex items-center px-5 py-2.5 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-sm font-black tracking-wide hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Browse all experiences
        </Link>
      </div>

      {/* Zone 3 — Available Now */}
      {calendarEvents.length > 0 && (
        <div id="on-the-calendar" className="bg-[#0A0A0A]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
            <div className="flex flex-col-reverse sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">
                  Available Now
                </p>
                <p className="text-sm text-[#A3A3A3]">
                  Full guides, ready today — buy once, keep forever.
                </p>
              </div>
              <Link
                href="/calendar"
                className="group pb-4 border-b border-[#2A2A2A] sm:pb-0 sm:border-b-0 sm:text-right"
              >
                <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1 group-hover:text-[#BBFF33] transition-colors">
                  The Full Calendar
                </p>
                <p className="text-sm text-[#A3A3A3] group-hover:text-white transition-colors">
                  40+ events across Formula 1, Tennis, Golf &amp; Cricket — every date we track →
                </p>
              </Link>
            </div>
            <div className="flex flex-col gap-6">
              {calendarEvents.map((ev) => {
                const es = eventState(ev.startDate, ev.endDate);
                const price = eventPriceDisplay(ev.slug);
                const nudge = earlyBirdNudge(ev.slug);
                const expCount = expCountMap[ev.id] ?? 0;
                const glimpse = glimpseMap[ev.id] ?? [];
                const venue = ev.slug === "india-in-england-cricket-2026"
                  ? "Birmingham · London · Nottingham · more"
                  : ev.venueName;
                return (
                  <Link
                    key={ev.id}
                    href={`/event-pack/${ev.slug}`}
                    className="group relative flex flex-col sm:flex-row rounded-sm overflow-hidden border border-[#2A2A2A] bg-[#141414] hover:border-[#AAFF00] transition-all duration-200"
                  >
                    {/* Image — taller, more dominant */}
                    <div className="relative h-52 sm:h-auto sm:w-80 sm:flex-shrink-0 overflow-hidden bg-[#1A1A1A]">
                      {ev.heroImageUrl ? (
                        <Image
                          src={ev.heroImageUrl}
                          alt={ev.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 320px"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                      {/* Live badge over image */}
                      {es.state === "live" && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#AAFF00] text-black text-xs font-black tracking-wide">
                          LIVE NOW
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between px-6 py-5 flex-1 min-w-0">
                      <div>
                        {/* Sport + countdown */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-black tracking-widest uppercase text-[#AAFF00]">
                            {SPORT_LABELS[ev.sport] ?? ev.sport}
                          </span>
                          {es.state === "upcoming" && (
                            <span className="text-xs text-[#A3A3A3]">
                              · {es.toStart} day{es.toStart !== 1 ? "s" : ""} away
                            </span>
                          )}
                        </div>

                        {/* Event name */}
                        <h3 className="text-xl font-black text-white leading-snug group-hover:text-[#AAFF00] transition-colors">
                          {ev.name}
                        </h3>

                        {/* Date + venue */}
                        <p className="mt-1.5 text-sm text-[#A3A3A3]">
                          {formatDateRange(ev.startDate, ev.endDate)}
                          {venue && <span className="text-[#6A6A6A]"> · {venue}</span>}
                        </p>

                        {/* Experience count */}
                        {expCount > 0 && (
                          <p className="mt-3 text-xs text-[#A3A3A3]">
                            <span className="text-white font-black">{expCount} hand-researched experiences</span> inside this pack
                          </p>
                        )}

                        {/* Early bird nudge */}
                        {nudge.show && (
                          <p className="mt-2 text-xs text-[#AAFF00] border border-[#AAFF00]/30 rounded-sm inline-block px-3 py-1 font-mono">
                            Early bird {price} — rises to {nudge.standardPrice} after {nudge.cutoffLabel}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-5">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black tracking-wide group-hover:bg-[#BBFF33] transition-colors whitespace-nowrap">
                          {price === "Free" ? "Get the free pack" : <>Get the pack <span className="text-black/50 font-black">{price}</span></>}
                        </span>
                      </div>

                      {/* Glimpse — text-only panel */}
                      {glimpse.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-[#2A2A2A] bg-[#1A1A1A] rounded-sm px-4 py-3">
                          <p className="text-xs font-black text-[#AAFF00] leading-tight">A taste of what&apos;s inside</p>
                          <ul className="mt-2 space-y-1.5">
                            {glimpse.map((exp) => (
                              <li key={exp.id} className="flex items-start gap-1.5 min-w-0">
                                <span className="text-[#AAFF00] text-xs mt-0.5 flex-shrink-0">›</span>
                                <span className="text-xs leading-tight truncate text-[#A3A3A3]">
                                  {exp.title}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <SportNavigator />

      {/* Editorial statement — Why us */}
      <div className="bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
              Why Experiences | Curated
            </p>
            <p className="text-2xl font-black text-white leading-snug">
              An expert guide. Not a search engine. Not a booking platform.
            </p>
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: "✦",
                  heading: "Written by fans, not algorithms",
                  body: "Every experience is researched and written by someone who has been there — on the ground, at the event, with specific knowledge of what is actually worth your time.",
                },
                {
                  icon: "✦",
                  heading: "Plan your next trip. Know real costs before you commit.",
                  body: "No guessing what you can afford. Give us your budget, we'll show you what fits. Flights, hotels, tickets.",
                },
                {
                  icon: "✦",
                  heading: "One pack. Everything you need.",
                  body: "Buy an Event Pack and get the full picture: venues, transport, stays, dining, and insider tips — sorted and ready for your trip.",
                },
                {
                  icon: "✦",
                  heading: "The stories behind the sport, not just the trip",
                  body: "History, rivalries, and the moments that made these events matter — written the same way, by people who actually care.",
                  link: { href: "/blog/federer-nadal-2008-final-that-changed-everything", label: "Read: Federer vs. Nadal, 2008 — the final that changed what a final could be" },
                },
              ].map((item) => (
                <div key={item.heading} className="flex gap-4">
                  <span className="text-[#AAFF00] mt-0.5 flex-shrink-0 text-lg leading-none">{item.icon}</span>
                  <div>
                    <p className="text-sm font-black text-white">{item.heading}</p>
                    <p className="mt-1 text-sm text-[#A3A3A3] leading-6">{item.body}</p>
                    {item.link && (
                      <Link
                        href={item.link.href}
                        className="mt-2 inline-block text-xs font-black text-[#AAFF00] hover:text-[#BBFF33] transition-colors"
                      >
                        {item.link.label} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:pl-8">
            <div className="rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] p-6">
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">
                What&apos;s in an event pack
              </p>
              {[
                "Real cost breakdown before you buy",
                "Ticketing guide — what to buy and when",
                "Stays near the action, verified by our team",
                "Dining picks open on event days",
                "Getting there — shuttles, parking, timing",
                "Day trips and city guides beyond the venue",
                "First-timer guide — apps, rules, what to expect",
                "Pre-trip brief sent 7 days before kick-off",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5 py-2 border-b border-[#2A2A2A] last:border-0">
                  <span className="text-[#AAFF00] text-sm flex-shrink-0 mt-0.5 font-black">✓</span>
                  <span className="text-sm text-[#A3A3A3]">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trip board CTA */}
      <div id="get-started" className="bg-[#0A0A0A] scroll-fade">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
              Your trip, your way
            </p>
            <h2 className="text-2xl font-black text-white leading-snug">
              Save what catches your eye. Build a Trip Board. Show up ready.
            </h2>
            <p className="mt-4 text-sm text-[#A3A3A3] leading-7">
              Browse an event pack, save the experiences that fit your trip,
              and arrange them into a day-by-day itinerary. Share it with
              anyone travelling with you — no app download needed.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Save experiences from any event pack",
                "Arrange into days — morning, afternoon, evening",
                "Share your board with travel companions",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-[#A3A3A3]">
                  <span className="text-[#AAFF00] font-black flex-shrink-0">›</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10 lg:mt-0">
            <HomepageTripBoardCTA isSignedIn={!!user} />
          </div>
        </div>
      </div>

      {/* Pro strip — annual pack pitch */}
      {process.env.HIDE_PRO !== "true" && (
        <div className="bg-[#141414] border-t border-[#2A2A2A]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">
                Annual Pro
              </p>
              <p className="text-lg font-black text-white leading-snug">
                Every event pack, included. One subscription.
              </p>
              <p className="mt-2 text-sm text-[#A3A3A3] leading-6">
                Annual Pro members get free access to every pack we publish — no separate purchase needed. Plus unlimited reads, Trip Boards, and booking contacts.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/pro"
                className="inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors whitespace-nowrap"
              >
                See Pro →
              </Link>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
