import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sportingEvents, experiences, sportingEventExperiences } from "@/schema/database";
import { eq, and, gte, asc, ne, sql, isNotNull } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import HomepageTripBoardCTA from "./_components/HomepageTripBoardCTA";
import HomepageNav from "./_components/HomepageNav";
import HeroCarousel, { type HeroEvent } from "./_components/HeroCarousel";
import IdentityStrip from "./_components/IdentityStrip";
import SportNavigator from "./_components/SportNavigator";
import ScrollFadeInit from "./_components/ScrollFadeInit";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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

const TYPE_LABELS: Record<string, string> = {
  fan_experience: "Fan experience",
  accommodation: "Stay",
  dining: "Dining",
  activity: "Activity",
  cultural_site: "Cultural site",
  transit: "Getting there",
  sports_venue: "Venue",
  neighborhood: "Neighbourhood",
  day_trip: "Day trip",
  multi_day: "Multi-day",
  natural_wonder: "Nature",
  event: "Event",
};

const BUDGET_LABELS: Record<string, string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Mid-range",
  splurge: "Splurge",
  luxury: "Luxury",
};


const HOMEPAGE_PRICE_BY_EVENT: Record<string, { earlyBirdCutoff: string; early: string; standard: string }> = {
  "wimbledon-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_EARLY_BIRD_CUTOFF ?? "2026-06-01",
    early: process.env.NEXT_PUBLIC_EARLY_BIRD_PRICE_DISPLAY ?? "£15",
    standard: process.env.NEXT_PUBLIC_STANDARD_PRICE_DISPLAY ?? "£25",
  },
  "belgian-gp-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BELGIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-07-10",
    early: process.env.NEXT_PUBLIC_BELGIAN_GP_EARLY_BIRD_PRICE_DISPLAY ?? "€15",
    standard: process.env.NEXT_PUBLIC_BELGIAN_GP_STANDARD_PRICE_DISPLAY ?? "€25",
  },
  "us-open-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_US_OPEN_EARLY_BIRD_CUTOFF ?? "2026-08-01",
    early: "$15",
    standard: "$25",
  },
  "india-in-england-cricket-2026": {
    earlyBirdCutoff: process.env.NEXT_PUBLIC_CRICKET_EARLY_BIRD_CUTOFF ?? "2026-06-15",
    early: "£9",
    standard: "£15",
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

function eventPriceDisplay(slug: string): string {
  if (slug === "wimbledon-2026" && process.env.WIMBLEDON_FREE_ACCESS === "true") return "Free";
  const pricing = HOMEPAGE_PRICE_BY_EVENT[slug] ?? HOMEPAGE_PRICE_BY_EVENT["wimbledon-2026"];
  const isEarlyBird = new Date() < new Date(pricing.earlyBirdCutoff);
  return isEarlyBird ? pricing.early : pricing.standard;
}

function earlyBirdNudge(slug: string): { show: boolean; cutoffLabel: string; standardPrice: string } {
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

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch featured events from DB by homepageSlot (set via /curator/events)
  const featuredRows = await db
    .select()
    .from(sportingEvents)
    .where(and(isNotNull(sportingEvents.homepageSlot), eq(sportingEvents.isHidden, false)))
    .orderBy(asc(sportingEvents.homepageSlot));

  const featuredSorted = featuredRows.slice(0, 2);
  const featuredIds = new Set(featuredSorted.map((e) => e.id));

  // All upcoming events not in the featured set — for "On the calendar"
  const allUpcoming = await db
    .select()
    .from(sportingEvents)
    .where(gte(sportingEvents.endDate, today))
    .orderBy(asc(sportingEvents.startDate));

  const calendarEvents = allUpcoming
    .filter((e) => !featuredIds.has(e.id) && e.startDate <= in120Days && !e.isHidden);

  // Build HeroEvent data for each featured event
  async function buildHeroEvent(ev: typeof featuredRows[number]): Promise<HeroEvent> {
    const [countRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(experiences)
      .where(and(eq(experiences.sportingEventId, ev.id), eq(experiences.status, "published")));
    const totalCount = Number(countRow?.count ?? 0);

    const teasers = await db
      .select({
        id: experiences.id,
        title: experiences.title,
        subtitle: experiences.subtitle,
        slug: experiences.slug,
        heroImageUrl: experiences.heroImageUrl,
        experienceType: experiences.experienceType,
        budgetTier: experiences.budgetTier,
        neighborhood: experiences.neighborhood,
      })
      .from(experiences)
      .innerJoin(
        sportingEventExperiences,
        and(
          eq(sportingEventExperiences.experienceId, experiences.id),
          eq(sportingEventExperiences.sportingEventId, ev.id)
        )
      )
      .where(
        and(
          eq(experiences.status, "published"),
          ne(experiences.experienceType, "transit"),
          isNotNull(sportingEventExperiences.packRank)
        )
      )
      .orderBy(asc(sportingEventExperiences.packRank))
      .limit(3);

    const es = eventState(ev.startDate, ev.endDate);
    return {
      id: ev.id,
      slug: ev.slug,
      name: ev.name,
      sport: ev.sport,
      startDate: ev.startDate,
      endDate: ev.endDate,
      venueName: ev.venueName ?? null,
      heroImageUrl: ev.heroImageUrl ?? null,
      state: es.state,
      toStart: es.toStart,
      toEnd: es.toEnd,
      priceDisplay: eventPriceDisplay(ev.slug),
      earlyBird: earlyBirdNudge(ev.slug),
      totalCount,
      teasers,
    };
  }

  const heroEvents = await Promise.all(featuredSorted.map(buildHeroEvent));

  const calendarHint = calendarEvents.map((e) => e.name).join(" · ");

  return (
    <main className="min-h-screen bg-white">
      <ScrollFadeInit />
      <HomepageNav email={user?.email ?? null} showSearch />

      <HeroCarousel events={heroEvents} calendarHint={calendarHint} />

      <IdentityStrip />

      {/* Browse CTA — mobile only (desktop has search bar in nav) */}
      <div className="md:hidden max-w-5xl mx-auto px-4 pt-8 pb-0">
        <Link
          href="/search"
          className="inline-flex items-center px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-600 text-sm font-medium hover:border-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Browse all experiences
        </Link>
      </div>

      {/* On the calendar — upcoming events not in the featured carousel */}
      {calendarEvents.length > 0 && (
        <div id="on-the-calendar" className="border-t border-neutral-100">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
              On the calendar
            </p>
            <p className="text-sm text-neutral-500 mb-8">
              More event packs available now.
            </p>
            <div className="flex flex-col gap-4">
              {calendarEvents.map((ev) => {
                const es = eventState(ev.startDate, ev.endDate);
                const price = eventPriceDisplay(ev.slug);
                return (
                  <Link
                    key={ev.id}
                    href={`/event-pack/${ev.slug}`}
                    className="group flex flex-col sm:flex-row rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative h-40 sm:h-auto sm:w-64 sm:flex-shrink-0 overflow-hidden bg-neutral-100">
                      {ev.heroImageUrl ? (
                        <Image
                          src={ev.heroImageUrl}
                          alt={ev.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, 256px"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between px-5 py-4 flex-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                            {SPORT_LABELS[ev.sport] ?? ev.sport}
                          </span>
                          {es.state === "upcoming" && (
                            <span className="text-xs text-neutral-400 whitespace-nowrap">
                              · {es.toStart} day{es.toStart !== 1 ? "s" : ""} away
                            </span>
                          )}
                          {es.state === "live" && (
                            <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap">
                              · Underway
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors">
                          {ev.name}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                          {formatDateRange(ev.startDate, ev.endDate)}
                        </p>
                        {(ev.venueName || ev.slug === "india-in-england-cricket-2026") && (
                          <p className="mt-0.5 text-xs text-neutral-400 truncate">
                            {ev.slug === "india-in-england-cricket-2026"
                              ? "Birmingham · London · Nottingham · more"
                              : ev.venueName}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold group-hover:bg-neutral-700 transition-colors whitespace-nowrap">
                          Get the Pack
                          <span className="text-neutral-400 font-normal">{price}</span>
                        </span>
                      </div>
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
      <div className="border-t border-neutral-100 bg-slate-50 scroll-fade">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Why Experiences | Curated
            </p>
            <p className="text-2xl font-bold text-neutral-900 leading-snug">
              Not a search engine. Not a booking platform. An expert guide.
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
                  heading: "Packed for the event, not just the destination",
                  body: "We tell you what matters for this specific event — the ticket you should buy, the section of the ground to stand in, the restaurant that stays open on race Sunday.",
                },
                {
                  icon: "✦",
                  heading: "One pack. Everything you need.",
                  body: "Buy an Event Pack and get the full picture: venues, transport, stays, dining, and insider tips — sorted and ready for your trip.",
                },
              ].map((item) => (
                <div key={item.heading} className="flex gap-4">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0 text-lg leading-none">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{item.heading}</p>
                    <p className="mt-1 text-sm text-neutral-600 leading-6">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:pl-8">
            <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm">
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
                What&apos;s in a pack
              </p>
              {[
                "Ranked fan experiences at the venue",
                "Ticketing guide — what to buy and when",
                "Stays near the action, verified by our team",
                "Dining picks open on event days",
                "Getting there — shuttles, parking, timing",
                "Pre-trip brief sent 7 days before kick-off",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5 py-2 border-b border-neutral-100 last:border-0">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">✓</span>
                  <span className="text-sm text-neutral-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trip board CTA */}
      <div id="get-started" className="border-t border-neutral-100 scroll-fade">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Your trip, your way
            </p>
            <h2 className="text-2xl font-bold text-neutral-900 leading-snug">
              Save what catches your eye. Build a Trip Board. Show up ready.
            </h2>
            <p className="mt-4 text-sm text-neutral-600 leading-7">
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
                <li key={point} className="flex items-center gap-2.5 text-sm text-neutral-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            {process.env.HIDE_PRO !== "true" && (
              <p className="mt-6 text-xs text-neutral-400">
                Want booking contacts and unlimited Trip Boards?{" "}
                <Link href="/pro" className="underline underline-offset-2 hover:text-neutral-700 transition-colors">
                  See Pro →
                </Link>
              </p>
            )}
          </div>
          <div className="mt-10 lg:mt-0">
            <HomepageTripBoardCTA isSignedIn={!!user} />
          </div>
        </div>
      </div>

    </main>
  );
}
