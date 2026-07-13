import { db } from "@/lib/db";
import { sportingEvents, experiences, purchases, userProfiles, sportingEventExperiences } from "@/schema/database";
import { eq, and, sql, asc, isNotNull } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PaddleCheckout from "./_components/PaddleCheckout";
import DodoCheckout from "./_components/DodoCheckout";
import PackView from "./_components/PackView";
import { getProDetails } from "@/lib/pro";
import HomepageNav from "@/app/_components/HomepageNav";
import LocalCurrencyHint from "./_components/LocalCurrencyHint";
import { grantFreeAccess } from "./actions";

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
  "open-championship-2026": [
    {
      label: "On the Course",
      description: "The 18th grandstand, the dunes, The Links private zone, and the hospitality tiers — what each gives you at Royal Birkdale",
    },
    {
      label: "Championship Week",
      description: "Practice days through the final round — when to go, what changes each day, and how to make the most of a sold-out week",
    },
    {
      label: "Where to Stay",
      description: "Southport's Lord Street hotels, Birkdale village, and Liverpool for those who prefer a city base with the train connection",
    },
    {
      label: "Where to Eat",
      description: "Bistrot Vérité and the Birkdale village high street, plus the pub walk and Lord Street for post-match dinner",
    },
    {
      label: "Getting There & Beyond",
      description: "Merseyrail from Liverpool Central, the Southport connection, and Liverpool as a day trip 40 minutes from the gates",
    },
  ],
  "bmw-pga-championship-2026": [
    {
      label: "On the Course",
      description: "The 18th and 7th grandstands, Horschel Hill, and the private-club story behind Wentworth's West Course",
    },
    {
      label: "Festival of Golf",
      description: "The Celebrity Pro-Am, the Championship Village and Show Stage concerts, and the hospitality tiers that shape your day",
    },
    {
      label: "Where to Stay",
      description: "Coworth Park's polo-estate luxury and the Wheatsheaf's accessible alternative, both minutes from Wentworth",
    },
    {
      label: "Where to Eat",
      description: "The Fat Duck's three Michelin stars in nearby Bray, plus Piccolino in Virginia Water village",
    },
    {
      label: "Getting There & Beyond",
      description: "A straightforward day trip from London Waterloo, with Windsor Castle, Eton, and Virginia Water Lake & Savill Garden minutes from the gates",
    },
  ],
  "belgian-gp-2026": [
    {
      label: "At the Circuit",
      description:
        "How to move between Eau Rouge, Kemmel, Pouhon, and the Fan Zone — and what each section of Spa actually gives you",
    },
    {
      label: "Race Weekend",
      description:
        "Friday practice, Saturday qualifying, Sunday race — what to prioritise at each session and where to be for the moments that matter",
    },
    {
      label: "The Ardennes",
      description:
        "Francorchamps village, the forest roads, and what to do when you have a rest afternoon in one of Europe's quieter corners",
    },
    {
      label: "Where to Eat & Drink",
      description:
        "Belgian classics near the circuit, the Fan Zone food offer, and where to find a proper meal after qualifying",
    },
    {
      label: "Where to Stay",
      description:
        "Francorchamps hotels 2km from the gates, Malmedy and Spa-town options, and what fills fastest for race weekend",
    },
  ],
  "hungarian-gp-2026": [
    {
      label: "At the Circuit",
      description:
        "Where to sit, the Chicane's technical drama, and General Admission on a natural bowl terrain that makes the cheap seats genuinely good",
    },
    {
      label: "Race Weekend",
      description:
        "Friday practice, Saturday qualifying, Sunday's 15:00 race — how to use the calendar's most affordable weekend without underestimating how fast the best spots move",
    },
    {
      label: "Budapest & Beyond",
      description:
        "Castle Hill, the Jewish Quarter's ruin bars, and Europe's largest thermal bath complex — 25 minutes from the circuit by metro",
    },
    {
      label: "Where to Eat & Drink",
      description:
        "Traditional goulash in the Jewish Quarter, a Michelin Bib Gourmand bistro across the river, and Budapest's ruin bar scene",
    },
    {
      label: "Where to Stay",
      description:
        "Pest's district-by-district character, a Danube-front five-star, and Zengo Camping right behind the final corner",
    },
  ],
  "us-open-2026": [
    {
      label: "On the Grounds",
      description:
        "Arthur Ashe under lights, outer courts, the practice facility — grounds passes get you closer to top players than at any other Slam",
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
    {
      label: "Beyond the Courts",
      description:
        "The Unisphere, Queens Museum, and a rest-day route through Corona Park and beyond for when you need a break from the tennis",
    },
  ],
  "italian-gp-2026": [
    {
      label: "At the Circuit",
      description:
        "Curva Grande, the Lesmo curves, the Parabolica, and the Fan Zone — the natural grandstand areas a General Admission ticket unlocks, plus the covered grandstands and hospitality tiers above it",
    },
    {
      label: "Race Weekend",
      description:
        "Friday practice, Saturday qualifying, Sunday's 15:00 race — what to prioritise at each session and how the Tifosi build the atmosphere across the weekend",
    },
    {
      label: "Where to Stay",
      description:
        "Milan as the practical base with a 9-minute direct train, Monza's own small hotel stock, and Lake Como for a slower, scenic alternative",
    },
    {
      label: "Where to Eat & Drink",
      description:
        "A century-old Milanese trattoria, Carlo Cracco's Michelin-starred restaurant in the Galleria, and the aperitivo ritual Milan invented",
    },
    {
      label: "Beyond the Track",
      description:
        "The abandoned 1955 banked oval, Monza's own royal villa and historic centre, and the Alfa Romeo Museum's actual 1951 championship car",
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
    earlyBirdPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_EARLY_BIRD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_EARLY_BIRD ?? "",
    standardPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_STANDARD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_EARLY_BIRD_CUTOFF ?? "2026-06-01",
    earlyBirdDisplay: process.env.NEXT_PUBLIC_EARLY_BIRD_PRICE_DISPLAY ?? "£15",
    standardDisplay: process.env.NEXT_PUBLIC_STANDARD_PRICE_DISPLAY ?? "£25",
  },
  "us-open-2026": {
    earlyBirdPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_US_OPEN_EARLY_BIRD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_US_OPEN_EARLY_BIRD ?? "",
    standardPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_US_OPEN_STANDARD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_US_OPEN_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_US_OPEN_EARLY_BIRD_CUTOFF ?? "2026-08-01",
    earlyBirdDisplay: "$0",
    standardDisplay: "$10",
  },
  "india-in-england-cricket-2026": {
    earlyBirdPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_CRICKET_EARLY_BIRD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CRICKET_EARLY_BIRD ?? "",
    standardPriceId:
      process.env.NEXT_PUBLIC_PAYMENT_PROVIDER === "dodo"
        ? process.env.NEXT_PUBLIC_DODO_PRICE_ID_CRICKET_STANDARD ?? ""
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_CRICKET_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_CRICKET_EARLY_BIRD_CUTOFF ?? "2026-06-15",
    earlyBirdDisplay: "£9",
    standardDisplay: "£15",
  },
  "belgian-gp-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BELGIAN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BELGIAN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BELGIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-07-10",
    earlyBirdDisplay: "€15",
    standardDisplay: "€25",
  },
  "hungarian-gp-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_HUNGARIAN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_HUNGARIAN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_HUNGARIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-07-17",
    earlyBirdDisplay: "€0",
    standardDisplay: "€7",
  },
  "open-championship-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_OPEN_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_OPEN_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_OPEN_EARLY_BIRD_CUTOFF ?? "2026-07-06",
    earlyBirdDisplay: "£15",
    standardDisplay: "£25",
  },
  "italian-gp-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ITALIAN_GP_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_ITALIAN_GP_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_ITALIAN_GP_EARLY_BIRD_CUTOFF ?? "2026-08-25",
    earlyBirdDisplay: "€5",
    standardDisplay: "€10",
  },
  "bmw-pga-championship-2026": {
    earlyBirdPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BMW_PGA_EARLY_BIRD ?? "",
    standardPriceId: process.env.NEXT_PUBLIC_DODO_PRICE_ID_BMW_PGA_STANDARD ?? "",
    earlyBirdCutoff: process.env.NEXT_PUBLIC_BMW_PGA_EARLY_BIRD_CUTOFF ?? "2026-09-03",
    earlyBirdDisplay: "£5",
    standardDisplay: "£10",
  },
};

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${end.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
}

export default async function EventPackPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { slug } = await params;
  const { status } = await searchParams;

  const [event] = await db
    .select()
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug))
    .limit(1);

  if (!event) notFound();

  // Teaser cards — top 2 by packRank, fall back to unranked published experiences
  const rankedTeasers = await db
    .select({
      id: experiences.id,
      title: experiences.title,
      subtitle: experiences.subtitle,
      heroImageUrl: experiences.heroImageUrl,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      neighborhood: experiences.neighborhood,
      packRank: sportingEventExperiences.packRank,
    })
    .from(sportingEventExperiences)
    .innerJoin(experiences, eq(experiences.id, sportingEventExperiences.experienceId))
    .where(
      and(
        eq(sportingEventExperiences.sportingEventId, event.id),
        eq(experiences.status, "published"),
        isNotNull(sportingEventExperiences.packRank)
      )
    )
    .orderBy(asc(sportingEventExperiences.packRank))
    .limit(2);

  let teaserExps = rankedTeasers;
  if (teaserExps.length < 2) {
    const ranked_ids = teaserExps.map(e => e.id);
    const fallback = await db
      .select({
        id: experiences.id,
        title: experiences.title,
        subtitle: experiences.subtitle,
        heroImageUrl: experiences.heroImageUrl,
        experienceType: experiences.experienceType,
        budgetTier: experiences.budgetTier,
        neighborhood: experiences.neighborhood,
        packRank: sql<number | null>`null`,
      })
      .from(experiences)
      .where(
        and(
          eq(experiences.sportingEventId, event.id),
          eq(experiences.status, "published")
        )
      )
      .limit(4);
    const extra = fallback.filter(e => !ranked_ids.includes(e.id));
    teaserExps = [...teaserExps, ...extra].slice(0, 2);
  }

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

  if (!user && status === "succeeded") {
    redirect(`/event-pack/${slug}/welcome`);
  }

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

  // Auto-grant free access for designated free events (controlled via FREE_EVENT_SLUGS env var)
  // Format: "slug:YYYY-MM-DD,slug:YYYY-MM-DD,slug" — a slug with no :date shows "Free" with no end date
  const freeEventEntries = (process.env.FREE_EVENT_SLUGS ?? "")
    .split(",")
    .filter(Boolean)
    .map((entry) => {
      const [entrySlug, endDate] = entry.split(":");
      return { slug: entrySlug.trim(), endDate: endDate?.trim() };
    });
  const freeEventEntry = freeEventEntries.find((e) => e.slug === slug);
  // A dated entry only grants access through the end of that day (UTC) — found
  // 13 Jul 2026 that this had never actually been enforced: the endDate was
  // parsed everywhere for display purposes only, so Belgian GP/Open
  // Championship stayed free indefinitely well past their stated cutoff.
  const freeAccessEnabled = !!freeEventEntry
    && (!freeEventEntry.endDate || new Date() <= new Date(`${freeEventEntry.endDate}T23:59:59Z`));
  const formattedFreeEndDate = freeEventEntry?.endDate
    ? new Date(freeEventEntry.endDate + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" })
    : undefined;
  const freeUntilLabel = formattedFreeEndDate ? `Free until ${formattedFreeEndDate}` : "Free";
  const freeEndsLabel = "No card required";
  if (!hasPurchased && freeAccessEnabled && user?.email) {
    await grantFreeAccess(user.email, event.id);
    hasPurchased = true;
  }

  const { isPro, isAnnual, currentPeriodEnd } = user?.email
    ? await getProDetails(user.email)
    : { isPro: false, isAnnual: false, currentPeriodEnd: null };

  // Annual Pro subscribers get free access to all event packs during their subscription period
  const isAnnualProActive = isAnnual && currentPeriodEnd != null && currentPeriodEnd > new Date();
  if (!hasPurchased && isAnnualProActive && user?.email) {
    hasPurchased = true;
  }

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
        isAnnual={isAnnual}
        archetype={archetype}
        preTripBriefLiveAt={event.preTripBriefLiveAt ?? null}
        preTripBriefLines={event.preTripBriefLines ?? null}
        preTripBriefUpdatedAt={event.preTripBriefUpdatedAt ?? null}
        endDate={event.endDate}
      />
    );
  }

  // Landing page
  // event.endDate is a bare date string ("2026-07-12"), which JS parses as UTC
  // midnight — comparing directly against `new Date()` made the pack show
  // "ended" for the entire final day of the event, not just after it's over.
  // Compare against end-of-day instead.
  const isEventPast = new Date() > new Date(`${event.endDate}T23:59:59Z`);

  const pricing = PACK_PRICING[slug] ?? PACK_PRICING["wimbledon-2026"];
  const isEarlyBird = new Date() < new Date(pricing.earlyBirdCutoff);
  const priceDisplay = freeAccessEnabled ? "Free" : isEarlyBird ? pricing.earlyBirdDisplay : pricing.standardDisplay;
  const priceId = isEarlyBird ? pricing.earlyBirdPriceId : pricing.standardPriceId;
  const earlyBirdCutoff = pricing.earlyBirdCutoff;

  const paddleEnv =
    (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") ??
    "sandbox";

  const paymentProvider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? "paddle";

  // Dodo and Paddle share the same per-event price IDs from PACK_PRICING — no separate table.
  const dodoProductId = priceId;

  const dateRange = formatDateRange(event.startDate, event.endDate);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />
      {/* Hero */}
      <div className="relative h-[38vh] min-h-[220px] overflow-hidden bg-[#0A0A0A]">
        {event.heroImageUrl && (
          <Image
            src={event.heroImageUrl}
            alt={event.name}
            fill
            className="object-cover opacity-90"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 max-w-5xl mx-auto">
          <span className="inline-block text-xs font-black tracking-widest uppercase text-black bg-[#AAFF00] px-3 py-1 rounded-sm mb-3">
            {SPORT_LABELS[event.sport] ?? event.sport} · Event Pack
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight max-w-2xl">
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
        {/* Past-event notice — shown at top when event has ended */}
        {isEventPast && (
          <div className="pt-10 pb-8 border-b border-[#2A2A2A]">
            <div>
              <span className="inline-block px-3 py-1 rounded-sm bg-[#141414] border border-[#2A2A2A] text-[#6A6A6A] text-xs font-semibold tracking-widest uppercase mb-5">
                Event ended
              </span>
              <h2 className="text-xl font-black text-white mb-3">
                This event has now passed
              </h2>
              <p className="text-sm text-[#A3A3A3] leading-6 mb-8">
                This pack is no longer available to purchase.
                {!user && " If you already bought access, sign in to read your pack."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {!user && (
                  <Link
                    href={`/sign-in?next=/event-pack/${slug}`}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                  >
                    Sign in to access your pack
                  </Link>
                )}
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-sm border border-[#2A2A2A] text-[#6A6A6A] text-sm font-semibold hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors"
                >
                  Browse upcoming events
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Intro */}
        <div className="pt-10 pb-8 border-b border-[#2A2A2A] lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
              The Pack
            </p>
            <p className="text-base font-black text-white leading-snug">
              {totalCount > 0
                ? `${totalCount} curated experiences — hand-picked by local experts`
                : "A curated guide to experiencing the event like a local"}
            </p>
            {event.editorialOverview && (
              <p className="mt-3 text-sm text-[#A3A3A3] leading-7">
                {event.editorialOverview}
              </p>
            )}
            <p className="mt-4 text-sm text-[#A3A3A3] leading-7">
              Every experience in this pack has been researched by someone who has attended the event — fan experiences at the venue, where to stay, where to eat, how to get there, and insider tips you won&apos;t find on a search engine. No filler, no paid placements — just the picks that are genuinely worth your time.
            </p>
            <p className="mt-3 text-sm text-[#A3A3A3] leading-7">
              Think of this pack as your insider briefing for the event. Read the guide, save the experiences that suit you, and arrive knowing exactly what you&apos;re doing and when.
            </p>
          </div>

          {!isEventPast && (
            <aside className="mt-8 lg:mt-0">
              {freeAccessEnabled ? (
                <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 lg:sticky lg:top-6">
                  <span className="inline-block px-2.5 py-0.5 rounded-sm bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/30 text-xs font-semibold mb-3">
                    {freeUntilLabel}
                  </span>
                  <p className="text-3xl font-black text-white tracking-tight mb-1">
                    Free
                  </p>
                  <p className="text-xs text-[#6A6A6A] mb-4">
                    {totalCount > 0 ? `${totalCount} experiences` : "Curated experiences"} · free access, no card needed
                  </p>
                  <Link
                    href={`/sign-in?next=/event-pack/${slug}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                  >
                    Sign in for free access
                  </Link>
                  <p className="mt-3 text-xs text-[#6A6A6A] text-center">
                    {freeEndsLabel}
                  </p>
                </div>
              ) : (
                <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 lg:sticky lg:top-6">
                  {isEarlyBird && pricing.earlyBirdDisplay !== pricing.standardDisplay && (
                    <span className="inline-block px-2.5 py-0.5 rounded-sm bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-semibold mb-3">
                      Early bird
                    </span>
                  )}
                  <p className="text-3xl font-black text-white tracking-tight">
                    {priceDisplay}
                    <LocalCurrencyHint gbpAmount={parseFloat(priceDisplay.replace(/[^0-9.]/g, ""))} />
                  </p>
                  {isEarlyBird && pricing.earlyBirdDisplay !== pricing.standardDisplay && (
                    <p className="mt-0.5 text-xs text-[#6A6A6A] mb-4">
                      Rises to {pricing.standardDisplay} after{" "}
                      {new Date(earlyBirdCutoff).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  )}
                  <p className="text-xs text-[#6A6A6A] mb-4 mt-1">
                    {totalCount > 0 ? `${totalCount} experiences` : "Curated experiences"} · one-time purchase
                  </p>
                  {paymentProvider === "dodo" ? (
                    dodoProductId ? (
                      <DodoCheckout
                        productId={dodoProductId}
                        sportingEventId={event.id}
                        eventSlug={slug}
                        eventName={event.name}
                        priceTier={isEarlyBird ? "early_bird" : "standard"}
                        successUrl={user?.email
                          ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}`
                          : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}/welcome`}
                        buttonClassName="w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                      />
                    ) : (
                      <p className="text-xs text-[#6A6A6A]">Checkout coming soon.</p>
                    )
                  ) : priceId ? (
                    <PaddleCheckout
                      priceId={priceId}
                      sportingEventId={event.id}
                      priceTier={isEarlyBird ? "early_bird" : "standard"}
                      clientToken={process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? ""}
                      successUrl={user?.email
                        ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}`
                        : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}/welcome`}
                      redirectDelay={user?.email ? 4000 : 2500}
                      environment={paddleEnv}
                      userEmail={user?.email ?? undefined}
                      buttonClassName="w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                    />
                  ) : (
                    <p className="text-xs text-[#6A6A6A]">Checkout coming soon.</p>
                  )}
                  {!isPro && (
                    <p className="mt-4 text-xs text-[#6A6A6A] text-center">
                      Or get this + every future pack with{" "}
                      <Link href="/pro" className="underline hover:text-[#AAFF00] transition-colors">
                        Annual Pro — £59/yr
                      </Link>
                    </p>
                  )}
                </div>
              )}
            </aside>
          )}
        </div>

        {/* What's inside */}
        <div className="py-10 border-b border-[#2A2A2A]">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-6">
            What&apos;s inside
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(PACK_SECTIONS_BY_EVENT[slug] ?? PACK_SECTIONS_BY_EVENT["wimbledon-2026"]).map((section) => (
              <div
                key={section.label}
                className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 hover:border-[#AAFF00] transition-colors"
              >
                <p className="text-sm font-black text-white mb-1">
                  {section.label}
                </p>
                <p className="text-xs text-[#6A6A6A] leading-5 line-clamp-2 min-h-[2.5rem]">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Teaser experiences — 2 cards + "+N more" always in one row */}
        {teaserExps.length > 0 && (
          <div className="py-10 border-b border-[#2A2A2A]">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-1">
              A glimpse inside
            </p>
            <p className="text-[#A3A3A3] text-sm mb-6">
              A few of the experiences waiting for you.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {teaserExps.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-sm border border-[#2A2A2A] overflow-hidden bg-[#141414]"
                >
                  <div className="relative h-40 overflow-hidden bg-[#1A1A1A]">
                    {exp.heroImageUrl ? (
                      <Image
                        src={exp.heroImageUrl}
                        alt={exp.title}
                        fill
                        className="object-cover blur-sm scale-105"
                        sizes="(max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A1A1A]" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-[#AAFF00] text-xs font-black tracking-widest uppercase">
                        Pack exclusive
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">
                        {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
                      </span>
                      {exp.budgetTier && (
                        <span className="hidden sm:block text-xs text-[#6A6A6A]">
                          {BUDGET_LABELS[exp.budgetTier] ?? exp.budgetTier}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-black text-white leading-snug">
                      {exp.title}
                    </h3>
                    {exp.subtitle && (
                      <p className="mt-1 text-xs text-[#6A6A6A] line-clamp-2 leading-5">
                        {exp.subtitle}
                      </p>
                    )}
                    {exp.neighborhood && (
                      <p className="mt-2 text-xs text-[#6A6A6A]">
                        {exp.neighborhood}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Always show the "+N more" card as the third column */}
              <div className="col-span-2 sm:col-span-1 rounded-sm border border-dashed border-[#2A2A2A] p-5 flex flex-col items-center justify-center text-center bg-[#141414]">
                <p className="text-2xl font-black text-[#AAFF00] mb-1">
                  +{totalCount - teaserExps.length}
                </p>
                <p className="text-xs text-[#6A6A6A] leading-5">
                  more experiences
                  <br />
                  in the full pack
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA — for visitors who read through before deciding */}
        {!isEventPast && (
          <div className="py-14">
            <div className="max-w-sm mx-auto text-center">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-5">
                Ready to go?
              </p>
              {freeAccessEnabled ? (
                <>
                  <Link
                    href={`/sign-in?next=/event-pack/${slug}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                  >
                    Sign in for free access
                  </Link>
                  <p className="mt-5 text-xs text-[#6A6A6A]">
                    {freeUntilLabel} · no card required · instant access
                  </p>
                </>
              ) : paymentProvider === "dodo" ? (
                dodoProductId ? (
                  <DodoCheckout
                    productId={dodoProductId}
                    sportingEventId={event.id}
                    eventSlug={slug}
                    eventName={event.name}
                    priceTier={isEarlyBird ? "early_bird" : "standard"}
                    successUrl={user?.email
                      ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}`
                      : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}/welcome`}
                  />
                ) : (
                  <p className="text-xs text-[#6A6A6A]">Checkout coming soon.</p>
                )
              ) : priceId ? (
                <PaddleCheckout
                  priceId={priceId}
                  sportingEventId={event.id}
                  priceTier={isEarlyBird ? "early_bird" : "standard"}
                  clientToken={process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? ""}
                  successUrl={user?.email
                    ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}`
                    : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}/welcome`}
                  redirectDelay={user?.email ? 4000 : 2500}
                  environment={paddleEnv}
                />
              ) : (
                <p className="text-xs text-[#6A6A6A]">Checkout coming soon.</p>
              )}
              {!freeAccessEnabled && (
                <p className="mt-5 text-xs text-[#6A6A6A]">
                  {priceDisplay} · one-time · instant access
                </p>
              )}
              {!freeAccessEnabled && !isPro && (
                <p className="mt-3 text-xs text-[#6A6A6A]">
                  Or get this + every future pack with{" "}
                  <Link href="/pro" className="underline hover:text-[#AAFF00] transition-colors">
                    Annual Pro — £59/yr
                  </Link>
                </p>
              )}
              <p className="mt-4 text-xs text-[#6A6A6A]">
                Questions?{" "}
                <a
                  href="mailto:hello@experiences-curated.com"
                  className="underline hover:text-[#AAFF00] transition-colors"
                >
                  hello@experiences-curated.com
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
