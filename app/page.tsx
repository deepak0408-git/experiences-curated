import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sportingEvents, experiences, userProfiles } from "@/schema/database";
import { eq, and, gte, desc, asc, ne, sql } from "drizzle-orm";
import Link from "next/link";
import HomepageTripBoardCTA from "./_components/HomepageTripBoardCTA";
import HomepageNav from "./_components/HomepageNav";
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

const HOMEPAGE_PICKS_BY_EVENT: Record<string, string[]> = {
  "wimbledon-2026": ["Centre Court", "Eating", "Practice Courts"],
  "us-open-2026": ["Arthur Ashe", "Night Sessions", "Golden Mall"],
};

const ARCHETYPE_PREFERRED_TYPES: Record<string, string[]> = {
  pilgrim:       ["sports_venue", "fan_experience", "event"],
  first_pilgrim: ["sports_venue", "fan_experience", "transit"],
  connoisseur:   ["accommodation", "dining", "fan_experience"],
  immersionist:  ["neighborhood", "dining", "activity"],
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
  let archetype: string | null = null;
  if (user?.email) {
    const [profile] = await db
      .select({ archetype: userProfiles.archetype })
      .from(userProfiles)
      .where(eq(userProfiles.email, user.email))
      .limit(1);
    archetype = profile?.archetype ?? null;
  }

  // All events not yet ended, ordered by start date
  const allUpcoming = await db
    .select()
    .from(sportingEvents)
    .where(gte(sportingEvents.endDate, today))
    .orderBy(asc(sportingEvents.startDate));

  // Featured = soonest; calendar = rest within 120 days of start
  const featured = allUpcoming[0] ?? null;
  const calendarEvents = allUpcoming
    .slice(1)
    .filter((e) => e.startDate <= in120Days);

  // Fallback: if no upcoming events, show most recent past
  let fallbackFeatured = null;
  if (!featured) {
    const [past] = await db
      .select()
      .from(sportingEvents)
      .orderBy(desc(sportingEvents.endDate))
      .limit(1);
    fallbackFeatured = past ?? null;
  }

  const hero = featured ?? fallbackFeatured;

  // Experience count + teasers for hero event
  let totalCount = 0;
  let teasers: {
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    heroImageUrl: string | null;
    experienceType: string;
    budgetTier: string | null;
    neighborhood: string | null;
  }[] = [];

  if (hero) {
    const [countRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(experiences)
      .where(
        and(
          eq(experiences.sportingEventId, hero.id),
          eq(experiences.status, "published")
        )
      );
    totalCount = Number(countRow?.count ?? 0);

    const allPublished = await db
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
      .where(
        and(
          eq(experiences.sportingEventId, hero.id),
          eq(experiences.status, "published"),
          ne(experiences.experienceType, "transit")
        )
      );

    if (archetype && ARCHETYPE_PREFERRED_TYPES[archetype]) {
      const preferredTypes = ARCHETYPE_PREFERRED_TYPES[archetype];
      const preferred = preferredTypes
        .flatMap((type) => allPublished.filter((e) => e.experienceType === type))
        .filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i);
      const remaining = allPublished.filter((e) => !preferred.some((p) => p.id === e.id));
      teasers = [...preferred, ...remaining].slice(0, 3);
    } else {
      const picks = (HOMEPAGE_PICKS_BY_EVENT[hero.slug] ?? [])
        .map((kw) => allPublished.find((e) => e.title.toLowerCase().includes(kw.toLowerCase())))
        .filter((e): e is NonNullable<typeof e> => e != null);
      const remaining = allPublished.filter((e) => !picks.some((p) => p.id === e.id));
      teasers = [...picks, ...remaining].slice(0, 3);
    }
  }

  const heroState = hero ? eventState(hero.startDate, hero.endDate) : null;
  const priceDisplay = hero ? eventPriceDisplay(hero.slug) : "";
  const earlyBird = hero ? earlyBirdNudge(hero.slug) : { show: false, cutoffLabel: "", standardPrice: "" };

  return (
    <main className="min-h-screen bg-white">
      <HomepageNav email={user?.email ?? null} showSearch />

      {/* Hero — featured event */}
      {hero && heroState && (
        <div className="relative h-[62vh] min-h-[420px] overflow-hidden bg-neutral-900">
          {hero.heroImageUrl && (
            <img
              src={hero.heroImageUrl}
              alt={hero.name}
              className="w-full h-full object-cover opacity-65"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-10">
            <div className="max-w-5xl mx-auto">
              <div className="mb-3">
                {heroState.state === "upcoming" && (
                  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white bg-black/50 px-3 py-1 rounded-full">
                    {SPORT_LABELS[hero.sport] ?? hero.sport} · Starts in {heroState.toStart} day{heroState.toStart !== 1 ? "s" : ""}
                  </span>
                )}
                {heroState.state === "live" && (
                  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 bg-black/50 px-3 py-1 rounded-full">
                    {SPORT_LABELS[hero.sport] ?? hero.sport} · Underway · {heroState.toEnd} day{heroState.toEnd !== 1 ? "s" : ""} remaining
                  </span>
                )}
                {heroState.state === "past" && (
                  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white/80 bg-black/50 px-3 py-1 rounded-full">
                    {SPORT_LABELS[hero.sport] ?? hero.sport} · The guide
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight max-w-2xl">
                {hero.name}
              </h1>
              <p className="mt-2 text-white/60 text-sm">
                {formatDateRange(hero.startDate, hero.endDate)}
                {hero.slug === "india-in-england-cricket-2026"
                  ? " · Birmingham · London · Nottingham · more"
                  : hero.venueName ? ` · ${hero.venueName}` : ""}
              </p>

              <div className="mt-7 flex items-center gap-4 flex-wrap">
                {(heroState.state === "upcoming" || heroState.state === "live") && (
                  <Link
                    href={`/event-pack/${hero.slug}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition-colors"
                  >
                    Get the Event Pack
                    <span className="text-neutral-400 font-normal">{priceDisplay}</span>
                  </Link>
                )}
                {heroState.state === "past" && (
                  <Link
                    href={`/event-pack/${hero.slug}`}
                    className="inline-flex items-center px-6 py-3 rounded-full bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition-colors"
                  >
                    Explore the guide
                  </Link>
                )}
                {totalCount > 0 && (
                  <span className="text-white/40 text-sm">
                    {totalCount} curated experiences inside
                  </span>
                )}
              </div>

              {/* Early-bird deadline nudge */}
              {earlyBird.show && heroState?.state === "upcoming" && (
                <p className="mt-3 text-xs text-white/50">
                  Early-bird price — rises to {earlyBird.standardPrice} after {earlyBird.cutoffLabel}
                </p>
              )}

              {/* Calendar hint — only shown when there are other upcoming events */}
              {calendarEvents.length > 0 && (
                <a
                  href="#on-the-calendar"
                  className="mt-5 inline-block text-xs font-semibold tracking-widest uppercase text-white bg-black/50 px-3 py-1 rounded-full hover:bg-black/70 transition-colors"
                >
                  Also coming up · {calendarEvents.map((e) => e.name).join(" · ")} ↓
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Experience teasers for hero event */}
      {teasers.length > 0 && hero && (
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
            A glimpse inside
          </p>
          <p className="text-sm text-neutral-500 mb-8">
            A few of the experiences in the pack.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teasers.map((exp) => (
              <Link
                key={exp.id}
                href={`/experience/${exp.slug}`}
                className="group rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors"
              >
                <div className="h-44 overflow-hidden bg-neutral-100">
                  {exp.heroImageUrl ? (
                    <img
                      src={exp.heroImageUrl}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                      {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
                    </span>
                    {exp.budgetTier && (
                      <span className="text-xs text-neutral-400">
                        {BUDGET_LABELS[exp.budgetTier] ?? exp.budgetTier}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors">
                    {exp.title}
                  </h3>
                  {exp.subtitle && (
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-5">
                      {exp.subtitle}
                    </p>
                  )}
                  {exp.neighborhood && (
                    <p className="mt-2 text-xs text-neutral-400">
                      {exp.neighborhood}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {totalCount > teasers.length && (
            <div className="mt-6 text-center">
              <Link
                href={`/event-pack/${hero.slug}`}
                className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors underline underline-offset-2"
              >
                +{totalCount - teasers.length} more experiences in the full pack
              </Link>
            </div>
          )}
        </div>
      )}

      {/* On the calendar — other upcoming events within 120 days */}
      {calendarEvents.length > 0 && (
        <div id="on-the-calendar" className="border-t border-neutral-100">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
              On the calendar
            </p>
            <p className="text-sm text-neutral-500 mb-8">
              More events coming up — packs available now.
            </p>
            <div className="flex flex-col gap-4">
              {calendarEvents.map((ev) => {
                const es = eventState(ev.startDate, ev.endDate);
                const price = eventPriceDisplay(ev.slug);
                return (
                  <Link
                    key={ev.id}
                    href={`/event-pack/${ev.slug}`}
                    className="group flex rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors"
                  >
                    {/* Image */}
                    <div className="w-48 sm:w-64 flex-shrink-0 overflow-hidden bg-neutral-100">
                      {ev.heroImageUrl ? (
                        <img
                          src={ev.heroImageUrl}
                          alt={ev.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between px-6 py-5 flex-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                            {SPORT_LABELS[ev.sport] ?? ev.sport}
                          </span>
                          {es.state === "upcoming" && (
                            <span className="text-xs text-neutral-400">
                              · {es.toStart} day{es.toStart !== 1 ? "s" : ""} away
                            </span>
                          )}
                          {es.state === "live" && (
                            <span className="text-xs font-semibold text-emerald-600">
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
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold group-hover:bg-neutral-700 transition-colors">
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

      {/* Editorial statement */}
      <div className="border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Why Experiences | Curated
            </p>
            <p className="text-2xl font-bold text-neutral-900 leading-snug">
              Not aggregated. Not ranked by popularity. Handpicked.
            </p>
          </div>
          <div className="mt-6 lg:mt-0">
            <p className="text-sm text-neutral-600 leading-7">
              Every experience here was written by someone who&apos;s actually been.
              They know the difference between the queue everyone joins and the one
              that moves, between the restaurant that&apos;s traded on location for
              a decade and the one that actually deserves to be there. The picks
              are specific because the knowledge is specific.
            </p>
            <p className="mt-4 text-sm text-neutral-600 leading-7">
              We don&apos;t publish everything. We publish what&apos;s worth your time.
            </p>
          </div>
        </div>
      </div>

      {/* Trip board CTA */}
      <div id="get-started" className="border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Plan your trip
            </p>
            <h2 className="text-2xl font-bold text-neutral-900 leading-snug">
              Save experiences. Build your Trip Board. Travel with a plan.
            </h2>
            <p className="mt-4 text-sm text-neutral-600 leading-7">
              Save the experiences that fit your trip, organise them into a
              day-by-day Trip Board, and share your itinerary with anyone
              travelling with you.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Save experiences across events",
                "Build day-by-day trip boards",
                "Access your pack on any device",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-neutral-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-neutral-400">
              Want booking contacts and unlimited Trip Boards?{" "}
              <Link href="/pro" className="underline underline-offset-2 hover:text-neutral-700 transition-colors">
                See Pro →
              </Link>
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <HomepageTripBoardCTA isSignedIn={!!user} />
          </div>
        </div>
      </div>

    </main>
  );
}
