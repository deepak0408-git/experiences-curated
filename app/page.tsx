import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sportingEvents, sportingEventExperiences, experiences } from "@/schema/database";
import { eq, and, gte, asc, isNotNull, count, inArray } from "drizzle-orm";
import Link from "next/link";
import HomepageTripBoardCTA from "./_components/HomepageTripBoardCTA";
import HomepageNav from "./_components/HomepageNav";
import IdentityStrip from "./_components/IdentityStrip";
import PlannerTeaser from "./_components/PlannerTeaser";
import SportNavigator from "./_components/SportNavigator";
import CalendarSection from "./_components/CalendarSection";
import ScrollFadeInit from "./_components/ScrollFadeInit";
import BrandHero from "./_components/BrandHero";
import { getAuthUser } from "@/lib/supabase/server";
import { getPackPricing } from "@/lib/packPricing";

// Revalidate every 5 minutes — events and experience counts change rarely.
// Auth (nav email, trip board CTA) gracefully falls back to unauthenticated state from cache.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Experiences | Curated — Insider guides to the world's greatest sporting events",
  description:
    "Curated experiences for sports fans. Not aggregated — chosen. Hand-picked guides to Wimbledon, the US Open, and beyond.",
};

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
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

// Both functions below now read from the shared lib/packPricing.ts —
// HOMEPAGE_PRICE_BY_EVENT (a 3rd duplicate of the same display data) removed
// 28 Aug 2026 as part of the curator-driven pack pricing design (see memory
// project_curator_driven_pack_pricing_design.md).
async function eventPriceDisplay(slug: string): Promise<string> {
  if (isFreeEventSlug(slug)) return "Free";
  // Fallback changed from "wimbledon-2026" to "us-open-2026" 16 Aug 2026 —
  // "wimbledon-2026" retired entirely as part of the Wimbledon evergreen-
  // slug migration (see lib/packPricing.ts and app/event-pack/[slug]/page.tsx
  // for the same change).
  const pricing = (await getPackPricing(slug)) ?? (await getPackPricing("us-open-2026"))!;
  return pricing.priceDisplay;
}

async function earlyBirdNudge(slug: string): Promise<{ show: boolean; cutoffLabel: string; standardPrice: string }> {
  if (isFreeEventSlug(slug)) return { show: false, cutoffLabel: "", standardPrice: "" };
  const pricing = await getPackPricing(slug);
  if (!pricing || !pricing.isEarlyBird) return { show: false, cutoffLabel: "", standardPrice: "" };
  const d = new Date(pricing.earlyBirdCutoff);
  const cutoffLabel = d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return { show: true, cutoffLabel, standardPrice: pricing.standardDisplay };
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
  const in365Days = new Date(Date.now() + 365 * 86_400_000).toISOString().split("T")[0];

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
    .filter((e) => e.startDate <= in365Days && !e.isHidden);

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

  const featuredEventsForHero = await Promise.all(
    featuredSorted.map(async (ev) => ({
      slug: ev.slug,
      name: ev.name,
      sport: ev.sport,
      startDate: ev.startDate,
      endDate: ev.endDate,
      isFree: (await eventPriceDisplay(ev.slug)) === "Free",
    }))
  );

  const calendarCardData = calendarEvents.map((ev) => ({
    id: ev.id,
    slug: ev.slug,
    name: ev.name,
    sport: ev.sport,
    startDate: ev.startDate,
    endDate: ev.endDate,
    heroImageUrl: ev.heroImageUrl,
    expCount: expCountMap[ev.id] ?? 0,
    glimpse: glimpseMap[ev.id] ?? [],
    venue: ev.slug === "india-in-england-cricket-2026"
      ? "Birmingham · London · Nottingham · more"
      : ev.venueName,
    es: eventState(ev.startDate, ev.endDate),
  }));

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <ScrollFadeInit />

      {/* Zone 1 — Nav overlaid on hero + crossfading brand hero */}
      <div className="relative">
        <HomepageNav email={user?.email ?? null} showSearch={true} overlay={true} />
        <BrandHero
          featuredEvents={featuredEventsForHero}
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
      {calendarCardData.length > 0 && (
        <CalendarSection events={calendarCardData} />
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

      {/* Custom Itinerary Planning strip */}
      <div className="bg-[#141414] border-t border-[#2A2A2A]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">
              Customized Itinerary
            </p>
            <p className="text-lg font-black text-white leading-snug">
              Want an itinerary that is uniquely yours and fits your style?
            </p>
            <p className="mt-2 text-sm text-[#A3A3A3] leading-6">
              Tell us your sport, dates, and budget — get a real, day-by-day itinerary back, researched to the
              same standard as our published packs.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/custom-itinerary"
              className="inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors whitespace-nowrap"
            >
              Start your itinerary →
            </Link>
          </div>
        </div>
      </div>

      {/* Pro strip — annual pack pitch */}
      {process.env.HIDE_PRO !== "true" && (
        <div className="bg-[#0A0A0A] border-t border-[#2A2A2A]">
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
