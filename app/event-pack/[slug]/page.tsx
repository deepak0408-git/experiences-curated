import { db } from "@/lib/db";
import { sportingEvents, experiences, purchases, userProfiles } from "@/schema/database";
import { eq, and, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PaddleCheckout from "./_components/PaddleCheckout";
import PackView from "./_components/PackView";
import { hasProSubscription } from "@/lib/pro";
import HomepageNav from "@/app/_components/HomepageNav";
import LocalCurrencyHint from "./_components/LocalCurrencyHint";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [event] = await db
    .select({
      name: sportingEvents.name,
      editorialOverview: sportingEvents.editorialOverview,
      heroImageUrl: sportingEvents.heroImageUrl,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      venueName: sportingEvents.venueName,
    })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug))
    .limit(1);

  if (!event) return { title: "Event Pack" };

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const dateRange = `${start.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${end.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
  const description = event.editorialOverview?.slice(0, 160) ?? `Curated experiences for ${event.name} — ${dateRange}${event.venueName ? ` at ${event.venueName}` : ""}.`;

  return {
    title: `${event.name} Event Pack`,
    description,
    openGraph: {
      title: `${event.name} Event Pack`,
      description,
      images: event.heroImageUrl ? [{ url: event.heroImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.name} Event Pack`,
      description,
      images: event.heroImageUrl ? [event.heroImageUrl] : [],
    },
  };
}

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

const PACK_SECTIONS_BY_EVENT: Record<string, { label: string; description: string }[]> = {
  "wimbledon-2026": [
    {
      label: "Fan Experiences",
      description:
        "Queuing tips, Henman Hill, public screens, fan zones, and the rituals that make Wimbledon, Wimbledon",
    },
    {
      label: "Where to Stay",
      description:
        "SW19 hotels, central London picks for day-trippers, and the spots locals actually recommend",
    },
    {
      label: "Where to Eat",
      description:
        "Strawberries and cream, pre-match dining, neighbourhood favourites, and post-match spots worth the detour",
    },
    {
      label: "Day Plans",
      description:
        "Morning routines, rest-day itineraries, and neighbourhood walks to fill every hour",
    },
    {
      label: "Getting There",
      description:
        "Transport strategy, the District line myth debunked, queue science, and what to bring",
    },
  ],
  "india-in-england-cricket-2026": [
    {
      label: "Match Day",
      description: "Edgbaston on India day, Lord's for the ODI — inside the grounds, in the stands, doing it properly",
    },
    {
      label: "The Bharat Army",
      description: "How to find the travelling India fan community, join the chants, and be inside the blue rather than watching it",
    },
    {
      label: "Where to Eat & Drink",
      description: "The Twelfth Man before Edgbaston, the Lord's Tavern inside the ground, Shababs for the Birmingham balti experience",
    },
    {
      label: "Where to Stay",
      description: "Edgbaston Park Hotel for Birmingham, The Landmark London for Lord's — and what to book near each ground",
    },
    {
      label: "Getting There",
      description: "Edgbaston from New Street, Lord's from St John's Wood tube — transport strategy for both grounds",
    },
  ],
  "us-open-2026": [
    {
      label: "Night Sessions",
      description:
        "Arthur Ashe under lights — prime matches from 7pm in the largest tennis stadium in the world, at full volume",
    },
    {
      label: "On the Grounds",
      description:
        "Outer courts, practice facility, the big stadiums — grounds passes get you closer to top players than at any other Slam",
    },
    {
      label: "Where to Eat",
      description:
        "Flushing's Golden Mall basement, Jackson Heights, and everything Queens does that no other Grand Slam city can match",
    },
    {
      label: "Where to Stay",
      description:
        "Flushing for immersion, Long Island City for value, Manhattan if you're combining the Open with a broader New York trip",
    },
    {
      label: "Getting There",
      description:
        "The 7 train from Midtown — 40 minutes, no transfers, straight to Mets-Willets Point and a 10-minute walk to the gates",
    },
  ],
};

const PACK_PRICING: Record<string, {
  earlyBirdPriceId: string;
  standardPriceId: string;
  earlyBirdCutoff: string;
  earlyBirdDisplay: string;
  standardDisplay: string;
}> = {
  "wimbledon-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_EARLY_BIRD_CUTOFF ?? "2026-06-01",
    earlyBirdDisplay: process.env.NEXT_PUBLIC_EARLY_BIRD_PRICE_DISPLAY ?? "£15",
    standardDisplay: process.env.NEXT_PUBLIC_STANDARD_PRICE_DISPLAY ?? "£25",
  },
  "us-open-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_US_OPEN_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_US_OPEN_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_US_OPEN_EARLY_BIRD_CUTOFF ?? "2026-08-01",
    earlyBirdDisplay: "$15",
    standardDisplay: "$25",
  },
  "india-in-england-cricket-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CRICKET_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CRICKET_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_CRICKET_EARLY_BIRD_CUTOFF ?? "2026-06-15",
    earlyBirdDisplay: "£9",
    standardDisplay: "£15",
  },
};

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${end.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
}

export default async function EventPackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [event] = await db
    .select()
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug))
    .limit(1);

  if (!event) notFound();

  const PACK_TEASER_PICKS: Record<string, string[]> = {
    "wimbledon-2026": ["Centre Court", "Eating"],
    "us-open-2026": ["Night Sessions", "Arthur Ashe"],
  };

  // Teaser cards for the landing page — ordered by per-event picks
  const allTeaserCandidates = await db
    .select({
      id: experiences.id,
      title: experiences.title,
      subtitle: experiences.subtitle,
      heroImageUrl: experiences.heroImageUrl,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      neighborhood: experiences.neighborhood,
    })
    .from(experiences)
    .where(
      and(
        eq(experiences.sportingEventId, event.id),
        eq(experiences.status, "published")
      )
    );

  const teaserKeywords = PACK_TEASER_PICKS[slug] ?? [];
  const teaserPicks = teaserKeywords
    .map(kw => allTeaserCandidates.find(e => e.title.toLowerCase().includes(kw.toLowerCase())))
    .filter((e): e is NonNullable<typeof e> => e != null);
  const teaserRest = allTeaserCandidates.filter(e => !teaserPicks.some(p => p.id === e.id));
  const teaserExps = [...teaserPicks, ...teaserRest].slice(0, 2);

  // Total published experience count
  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences)
    .where(
      and(
        eq(experiences.sportingEventId, event.id),
        eq(experiences.status, "published")
      )
    );
  const totalCount = Number(countRow.count);

  // Auth + purchase check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasPurchased = false;
  if (user?.email) {
    const [purchase] = await db
      .select({ id: purchases.id })
      .from(purchases)
      .where(
        and(
          eq(purchases.email, user.email),
          eq(purchases.sportingEventId, event.id),
          eq(purchases.status, "active")
        )
      )
      .limit(1);
    hasPurchased = !!purchase;
  }

  const isPro = user?.email ? await hasProSubscription(user.email) : false;

  let archetype: string | null = null;
  if (user?.email) {
    const [profile] = await db
      .select({ archetype: userProfiles.archetype })
      .from(userProfiles)
      .where(eq(userProfiles.email, user.email))
      .limit(1);
    archetype = profile?.archetype ?? null;
  }

  if (hasPurchased) {
    return (
      <PackView
        eventId={event.id}
        eventSlug={event.slug}
        eventName={event.name}
        userEmail={user?.email ?? "test@preview.local"}
        heroImageUrl={event.heroImageUrl ?? null}
        dateRange={formatDateRange(event.startDate, event.endDate)}
        editorialOverview={event.editorialOverview ?? null}
        sportLabel={SPORT_LABELS[event.sport] ?? event.sport}
        isPro={isPro}
        archetype={archetype}
      />
    );
  }

  // Landing page
  const isEventPast = new Date() > new Date(event.endDate);

  const pricing = PACK_PRICING[slug] ?? PACK_PRICING["wimbledon-2026"];
  const isEarlyBird = new Date() < new Date(pricing.earlyBirdCutoff);
  const priceDisplay = isEarlyBird ? pricing.earlyBirdDisplay : pricing.standardDisplay;
  const priceId = isEarlyBird ? pricing.earlyBirdPriceId : pricing.standardPriceId;
  const earlyBirdCutoff = pricing.earlyBirdCutoff;

  const paddleEnv =
    (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") ??
    "sandbox";

  const dateRange = formatDateRange(event.startDate, event.endDate);

  return (
    <main className="min-h-screen bg-white">
      <HomepageNav email={user?.email ?? null} />
      {/* Hero */}
      <div className="relative h-[38vh] min-h-[220px] overflow-hidden bg-neutral-900">
        {event.heroImageUrl && (
          <img
            src={event.heroImageUrl}
            alt={event.name}
            className="w-full h-full object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 max-w-5xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white bg-black/50 px-3 py-1 rounded-full mb-3">
            {SPORT_LABELS[event.sport] ?? event.sport} · Event Pack
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight max-w-2xl">
            {event.name}
          </h1>
          <p className="mt-1.5 text-white/70 text-sm">{dateRange}</p>
          <p className="mt-0.5 text-white/50 text-xs">
            {slug === "india-in-england-cricket-2026"
              ? "Birmingham · London · Nottingham · Manchester · more"
              : event.venueName
                ? `${event.venueName}${event.venueAddress ? ` · ${event.venueAddress.split(",").slice(2).join(",").trim()}` : ""}`
                : null}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Intro */}
        <div className="pt-10 pb-8 border-b border-neutral-100 lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
              The Pack
            </p>
            <p className="text-base font-semibold text-neutral-900 leading-snug">
              {totalCount > 0
                ? `${totalCount} curated experiences — hand-picked by local experts`
                : "A curated guide to experiencing the event like a local"}
            </p>
            {event.editorialOverview && (
              <p className="mt-3 text-sm text-neutral-600 leading-7">
                {event.editorialOverview}
              </p>
            )}
          </div>

          {!isEventPast && (
            <aside className="mt-8 lg:mt-0">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 lg:sticky lg:top-6">
                {isEarlyBird && pricing.earlyBirdDisplay !== pricing.standardDisplay && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
                    Early bird
                  </span>
                )}
                <p className="text-3xl font-bold text-neutral-900 tracking-tight">
                  {priceDisplay}
                  <LocalCurrencyHint gbpAmount={parseFloat(priceDisplay.replace(/[^0-9.]/g, ""))} />
                </p>
                {isEarlyBird && pricing.earlyBirdDisplay !== pricing.standardDisplay && (
                  <p className="mt-0.5 text-xs text-neutral-400 mb-4">
                    Rises to {pricing.standardDisplay} after{" "}
                    {new Date(earlyBirdCutoff).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                )}
                <p className="text-xs text-neutral-500 mb-4 mt-1">
                  {totalCount > 0 ? `${totalCount} experiences` : "Curated experiences"} · one-time purchase
                </p>
                {priceId ? (
                  <PaddleCheckout
                    priceId={priceId}
                    sportingEventId={event.id}
                    priceTier={isEarlyBird ? "early_bird" : "standard"}
                    clientToken={process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? ""}
                    successUrl={`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}/welcome`}
                    environment={paddleEnv}
                    buttonClassName="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors"
                  />
                ) : (
                  <p className="text-xs text-neutral-400">Checkout coming soon.</p>
                )}
              </div>
            </aside>
          )}
        </div>

        {/* What's inside */}
        <div className="py-10 border-b border-neutral-100">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-6">
            What&apos;s inside
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(PACK_SECTIONS_BY_EVENT[slug] ?? PACK_SECTIONS_BY_EVENT["wimbledon-2026"]).map((section) => (
              <div
                key={section.label}
                className="rounded-xl border border-neutral-200 p-5"
              >
                <p className="text-sm font-semibold text-neutral-900 mb-1">
                  {section.label}
                </p>
                <p className="text-xs text-neutral-500 leading-5 line-clamp-2 min-h-[2.5rem]">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Teaser experiences — 2 cards + "+N more" always in one row */}
        {teaserExps.length > 0 && (
          <div className="py-10 border-b border-neutral-100">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
              A glimpse inside
            </p>
            <p className="text-neutral-500 text-sm mb-6">
              A few of the experiences waiting for you.
            </p>
            <div className="grid grid-cols-3 gap-5">
              {teaserExps.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border border-neutral-200 overflow-hidden"
                >
                  <div className="relative h-40 overflow-hidden bg-neutral-100">
                    {exp.heroImageUrl ? (
                      <img
                        src={exp.heroImageUrl}
                        alt={exp.title}
                        className="w-full h-full object-cover blur-sm scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-white text-xs font-semibold tracking-widest uppercase">
                        Pack exclusive
                      </span>
                    </div>
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
                    <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
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
                </div>
              ))}

              {/* Always show the "+N more" card as the third column */}
              <div className="rounded-xl border border-dashed border-neutral-300 p-5 flex flex-col items-center justify-center text-center bg-neutral-50">
                <p className="text-2xl font-bold text-neutral-900 mb-1">
                  +{totalCount - teaserExps.length}
                </p>
                <p className="text-xs text-neutral-500 leading-5">
                  more experiences
                  <br />
                  in the full pack
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA — for visitors who read through before deciding */}
        {!isEventPast ? (
          <div className="py-14 border-t border-neutral-100">
            <div className="max-w-sm mx-auto text-center">
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-5">
                Ready to go?
              </p>
              {priceId ? (
                <PaddleCheckout
                  priceId={priceId}
                  sportingEventId={event.id}
                  priceTier={isEarlyBird ? "early_bird" : "standard"}
                  clientToken={process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? ""}
                  successUrl={`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}/welcome`}
                  environment={paddleEnv}
                />
              ) : (
                <p className="text-xs text-neutral-400">Checkout coming soon.</p>
              )}
              <p className="mt-5 text-xs text-neutral-400">
                {priceDisplay} · one-time · instant access
              </p>
              <p className="mt-4 text-xs text-neutral-400">
                Questions?{" "}
                <a
                  href="mailto:hello@experiencescurated.com"
                  className="underline hover:text-neutral-600 transition-colors"
                >
                  hello@experiencescurated.com
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-neutral-400 text-sm">
              This event has ended. The pack is no longer available for purchase.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
