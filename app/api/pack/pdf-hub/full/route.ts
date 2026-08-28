import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasProSubscription } from "@/lib/pro";
import { createElement } from "react";
import type { ReactElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { FullPackPdfDocument } from "../FullPackPdfDocument";
import { getSpokeData } from "@/app/event-pack/[slug]/_hub-and-spoke/_lib/getSpokeData";
import { PDF_CONTENT_BY_EVENT } from "../pdfContentRegistry";
import { INTRO_BY_EVENT, QUICK_REFERENCE_BY_EVENT } from "@/app/event-pack/[slug]/_hub-and-spoke/HubPage";
import { GENERIC_SECTION_BUILDERS } from "./genericSectionBuilders";

// Full Pack PDF — generic across every hub-and-spoke event. Takes ?slug=
// like every other pack route. Looks up that event's extracted content
// bundle in pdfContentRegistry.ts — 404s if the event has no content
// extracted yet, rather than silently rendering a blank/wrong document.
//
// Every section renders both the extracted static prose AND real
// experience cards (title/subtitle/neighborhood) looked up live from
// getSpokeData()'s linkedExperiences via the shared toExpCard/lookupMany
// helpers below — same live DB data every web spoke's
// <SpokeExperienceCard> renders from, for every section that references
// one, not just Cost/Hotels. Fixed 28 Aug 2026 after an earlier version
// of this route silently omitted cards for 9 of 12 sections without
// authorization — see the content-extraction task's own "needs live
// experience data, not extracted here" notes for the real slugs.
//
// Mirrors classic pack's app/api/pack/pdf/route.ts auth/Pro-gate pattern
// exactly — independent server-side re-check, not just a hidden button.
//
// Per-event Cost-math config — each event's trip length and flight-region
// filter genuinely differ (Bahrain GP/Sepang: 3 nights, Asia-Pacific-only
// flights, no exclusion list — vs. Wimbledon's 4 nights, Europe-only with
// an exclusion list for same-region short-hop origins). Keyed by slug so
// adding an event is additive, not a branch inside the route body.
type CostMathConfig = {
  tripNights: number;
  flightRegion: string;
  excludedOrigins: string[];
  // "per-tier" (default): Budget/Moderate/Splurge/Luxury pair with
  // tier1/tier2/tier3/tier4 respectively — the pattern every event but ATP
  // Finals uses. "all-tier2": every profile card's total uses tier2Ticket
  // regardless of label — this is ATP Finals' actual real source behavior
  // (CostSpoke.tsx's profiles.map always calls tripTotal(p.hotel,
  // tier2Ticket)), flagged as a real divergence rather than silently
  // normalized to the per-tier pattern. "nz-australia": only 3 profiles
  // (no Luxury card — Luxury lives in its own spoke), Budget/Moderate both
  // pair with tier1 (General Admission), Splurge pairs with tier2 — the
  // real source behavior, not the standard per-tier pattern.
  // "australian-open": standard per-tier for Budget/Moderate/Splurge
  // (tier1-3), but Luxury is a real exception — a fixed USD range (not a
  // seeded ticket tier) added to the SPLURGE hotel's HIGH end only
  // (Melbourne has no seeded luxury hotel row), per founder direction
  // 27 Aug 2026.
  ticketPairingMode?: "per-tier" | "all-tier2" | "nz-australia" | "australian-open";
  // Filters hotel rows by seasonalBand before tier lookup — only
  // NZ-Australia's real seeded data needs this (hotels.find also requires
  // seasonalBand === "dec" in the source, since only December-band
  // Melbourne rows exist).
  hotelSeasonalBand?: string;
  // Australian Open's real exception — no seeded luxury hotel tier, so the
  // Luxury profile reuses splurgeHotel's high end plus a fixed USD ticket
  // range (from CostSpoke.tsx's own hardcoded LUXURY_TICKET_LOW/HIGH_USD
  // constants, converted from real AO Reserve AUD pricing).
  luxuryFixedUsd?: { low: number; high: number };
  // When set, the flight range is computed from ONLY these originMarket
  // values within flightRegion — not the whole region minus exclusions.
  // Australian Open's real source narrows to a specific East/South Asia
  // city cluster (Sydney short-hop and Doha/Dubai Gulf long-haul both
  // excluded as misleadingly wide outliers, 26 Aug 2026 decision) rather
  // than excluding a short list of outliers from the full region.
  flightOriginAllowlist?: string[];
};
const COST_MATH_BY_EVENT: Record<string, CostMathConfig> = {
  wimbledon: { tripNights: 4, flightRegion: "Europe", excludedOrigins: ["London", "Barcelona", "Amsterdam", "Zurich", "Moscow"] },
  "bahrain-grand-prix": { tripNights: 3, flightRegion: "Asia-Pacific", excludedOrigins: [] },
  // Shanghai (same-city, seeded $0-$0 by design) and Doha/Dubai (tagged
  // Asia-Pacific in planner_origin_markets but geographically Middle East,
  // long-haul pricing closer to Europe than genuine East/SE Asia — curator
  // decision, 10 Aug 2026) excluded to keep the range representative.
  "shanghai-masters": { tripNights: 4, flightRegion: "Asia-Pacific", excludedOrigins: ["Shanghai", "Doha", "Dubai"] },
  // Singapore (same-city, seeded $0-$0 by design) excluded — same
  // "no flight needed" rule as every other event's same-city origin row.
  "singapore-grand-prix": { tripNights: 3, flightRegion: "Asia-Pacific", excludedOrigins: ["Singapore"] },
  // Europe, no exclusion list — source filters flights.region === "Europe"
  // with no originMarket exclusions (unlike Wimbledon's short-hop list).
  "atp-finals": { tripNights: 3, flightRegion: "Europe", excludedOrigins: [], ticketPairingMode: "all-tier2" },
  // Real source CostSpoke.tsx doesn't destructure `flights` from
  // getSpokeData() at all — no flight-range computation exists for this
  // event's Cost spoke (it just tells the reader to check the Planner).
  // flightRegion is set to a value with zero real rows so flightRange
  // resolves to null here, matching the source's actual absence of a
  // flight-range figure rather than guessing a real region.
  "new-zealand-in-australia-cricket-2026-27": { tripNights: 3, flightRegion: "__none__", excludedOrigins: [], ticketPairingMode: "nz-australia", hotelSeasonalBand: "dec" },
  // East/South Asia city cluster only — Sydney (short domestic hop) and
  // Doha/Dubai (Gulf long-haul) are real seeded rows but excluded from
  // this range as misleadingly wide outliers, per the source's own
  // EAST_SOUTH_ASIA_CORE list (26 Aug 2026 decision). excludedOrigins is
  // left empty; the real filtering happens via the cluster allowlist
  // below in the Cost section computation, not an exclusion list.
  "australian-open": {
    tripNights: 4,
    flightRegion: "Asia-Pacific",
    excludedOrigins: [],
    ticketPairingMode: "australian-open",
    luxuryFixedUsd: { low: 1017, high: 1753 },
    flightOriginAllowlist: ["Tokyo", "Seoul", "Beijing", "Shanghai", "Hong Kong", "Singapore", "Manila", "Mumbai", "Bangalore", "New Delhi"],
  },
};

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  let user: { email?: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Stale/invalid refresh token — treat exactly like "not signed in"
  }
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const isPro = await hasProSubscription(user.email);
  if (!isPro) {
    return NextResponse.json({ error: "Pro required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const content = PDF_CONTENT_BY_EVENT[slug];
  if (!content) {
    return NextResponse.json({ error: "No Full Pack PDF content configured for this event yet" }, { status: 404 });
  }

  const { event, hotels, tickets, destinationBand, flights, linkedExperiences } = await getSpokeData(slug);

  // --- Hub section (venue intro + Quick Reference + Pre-Trip Brief) —
  //     same construction as pdf-hub/route.ts's Travel Brief, so the two
  //     documents show identical hub content. Fixed 28 Aug 2026 — Full
  //     Pack was previously missing this entirely, jumping straight into
  //     spoke content with no venue intro/address/emergencies section.
  const introConfig = INTRO_BY_EVENT[slug];
  let hubSection = null;
  if (introConfig) {
    const quickReference: Array<{ label: string; value: string; href?: string; linkLabel?: string }> = [];
    if (event.venueName && event.venueAddress) {
      quickReference.push({
        label: "Address",
        value: `${event.venueName}, ${event.venueAddress}`,
        href: `https://maps.google.com/?q=${encodeURIComponent(`${event.venueName}, ${event.venueAddress}`)}`,
        linkLabel: "Open in Maps",
      });
    }
    if (event.ticketingUrl) {
      quickReference.push({
        label: "Official ticketing",
        value: new URL(event.ticketingUrl).hostname.replace("www.", ""),
        href: event.ticketingUrl,
        linkLabel: "Visit",
      });
    }
    quickReference.push(...(QUICK_REFERENCE_BY_EVENT[slug] ?? []));

    hubSection = {
      venueLine: introConfig.venueLine,
      introText: introConfig.introText,
      quickReference,
      preTripBriefLines: event.preTripBriefLines ?? null,
      preTripBriefLiveAt: event.preTripBriefLiveAt ?? null,
      // getSpokeData()'s cached path can return this as a serialized string
      // rather than a real Date — same reason HubPage.tsx wraps it in
      // new Date(...) before calling toLocaleDateString(). Do the same
      // here rather than trust the type as declared.
      preTripBriefUpdatedAt: event.preTripBriefUpdatedAt ? new Date(event.preTripBriefUpdatedAt) : null,
    };
  }

  // Shared lookup helper — pulls real title/subtitle/neighborhood straight
  // from getSpokeData()'s linkedExperiences, same live DB data every web
  // spoke's <SpokeExperienceCard> renders from. Used by every section
  // below that references an experience card, not just Hotels.
  const toExpCard = (s: string) => {
    const exp = linkedExperiences.find((e) => e.slug.includes(s));
    if (!exp) return null;
    return {
      title: exp.title,
      subtitle: exp.subtitle,
      whyItsSpecial: exp.whyItsSpecial,
      neighborhood: exp.neighborhood,
      googleMapsRating: exp.googleMapsRating,
      googleMapsReviewCount: exp.googleMapsReviewCount,
    };
  };
  const lookupMany = (slugs: string[]) => slugs.map(toExpCard).filter((e): e is NonNullable<typeof e> => Boolean(e));

  const costMath = COST_MATH_BY_EVENT[slug];

  // --- Cost section (real DB-computed math; tier/hotel-pairing structure
  //     is genuinely shared across events — Bahrain GP pairs
  //     budget/moderate/splurge/luxury with tier1-4 the same way Wimbledon
  //     does — only trip length and flight-region filter differ, via
  //     costMath above). Not built for events missing a COST_MATH_BY_EVENT
  //     entry, same "flag, don't fabricate" rule as everything else. ---
  let costSection = null;
  if (content.cost && costMath) {
    const hotelPool = costMath.hotelSeasonalBand
      ? hotels.filter((h) => h.seasonalBand === costMath.hotelSeasonalBand)
      : hotels;
    const budgetHotel = hotelPool.find((h) => h.tier === "budget");
    const moderateHotel = hotelPool.find((h) => h.tier === "moderate");
    const splurgeHotel = hotelPool.find((h) => h.tier === "splurge");
    const luxuryHotel = hotelPool.find((h) => h.tier === "luxury");
    const tier1Ticket = tickets.find((t) => t.tier === "tier1");
    const tier2Ticket = tickets.find((t) => t.tier === "tier2");
    const tier3Ticket = tickets.find((t) => t.tier === "tier3");
    const tier4Ticket = tickets.find((t) => t.tier === "tier4");
    const nights = costMath.tripNights;

    const tripTotal = (hotel: typeof moderateHotel, ticket: typeof tier2Ticket) => {
      if (!hotel) return null;
      const stayLow = Number(hotel.costLow) * nights + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * nights : 0);
      const stayHigh = Number(hotel.costHigh) * nights + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * nights : 0);
      const ticketLow = ticket ? Number(ticket.costLow) : 0;
      const ticketHigh = ticket ? Number(ticket.costHigh) : 0;
      return { low: Math.round(stayLow + ticketLow), high: Math.round(stayHigh + ticketHigh) };
    };

    const moderateTotal = costMath.ticketPairingMode === "nz-australia"
      ? tripTotal(moderateHotel, tier1Ticket)
      : tripTotal(moderateHotel, tier2Ticket);
    let profiles: Array<{ label: string; total: { low: number; high: number } | null; hotelNote: string; ticketNote: string }>;
    if (costMath.ticketPairingMode === "all-tier2") {
      // ATP Finals' real source behavior — every profile pairs with
      // tier2Ticket, not tier1-4 respectively. See CostMathConfig comment.
      const ap = content.cost.profiles as Array<{ tier: string; hotelNote: string; ticketNote: string }> | undefined;
      const hotelByLabel: Record<string, typeof moderateHotel> = { Budget: budgetHotel, Moderate: moderateHotel, Splurge: splurgeHotel, Luxury: luxuryHotel };
      profiles = (ap ?? []).map((p) => ({
        label: p.tier,
        total: tripTotal(hotelByLabel[p.tier], tier2Ticket),
        hotelNote: p.hotelNote,
        ticketNote: p.ticketNote,
      }));
    } else if (costMath.ticketPairingMode === "nz-australia") {
      // NZ-Australia's real source behavior — only 3 profiles (no Luxury
      // card here), Budget/Moderate both pair with tier1 (General
      // Admission), Splurge pairs with tier2. See CostMathConfig comment.
      const np = content.cost.profiles as Array<{ label: string; ticketTier: string; hotelNote: string; ticketNote: string }> | undefined;
      const hotelByLabel: Record<string, typeof moderateHotel> = { Budget: budgetHotel, Moderate: moderateHotel, Splurge: splurgeHotel };
      const ticketByTier: Record<string, typeof tier1Ticket> = { tier1: tier1Ticket, tier2: tier2Ticket, tier3: tier3Ticket };
      profiles = (np ?? []).map((p) => ({
        label: p.label,
        total: tripTotal(hotelByLabel[p.label], ticketByTier[p.ticketTier]),
        hotelNote: p.hotelNote,
        ticketNote: p.ticketNote,
      }));
    } else if (costMath.ticketPairingMode === "australian-open") {
      // Australian Open's real source behavior — standard per-tier for
      // Budget/Moderate/Splurge (tier1/tier2/tier3), but Luxury reuses
      // splurgeHotel's HIGH end (not its full range) plus a fixed USD
      // ticket range from costMath.luxuryFixedUsd, not a seeded tier4
      // ticket (Melbourne has no seeded luxury hotel row). See
      // CostMathConfig comment and costContent.ts's luxuryProfile.
      const aop = content.cost.profiles as Array<{ label: string; ticketTier: string; hotelNote: string; ticketNote: string }> | undefined;
      const hotelByLabel: Record<string, typeof moderateHotel> = { Budget: budgetHotel, Moderate: moderateHotel, Splurge: splurgeHotel };
      const ticketByTier: Record<string, typeof tier1Ticket> = { tier1: tier1Ticket, tier2: tier2Ticket, tier3: tier3Ticket };
      profiles = (aop ?? []).map((p) => ({
        label: p.label,
        total: tripTotal(hotelByLabel[p.label], ticketByTier[p.ticketTier]),
        hotelNote: p.hotelNote,
        ticketNote: p.ticketNote,
      }));
      const lux = content.cost.luxuryProfile as { label: string; hotelNote: string; ticketNote: string; ticketLowUsd: number; ticketHighUsd: number } | undefined;
      if (lux && splurgeHotel && costMath.luxuryFixedUsd) {
        const stayHighOnlyLow = Number(splurgeHotel.costHigh) * nights + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * nights : 0);
        profiles.push({
          label: lux.label,
          total: {
            low: Math.round(stayHighOnlyLow + costMath.luxuryFixedUsd.low),
            high: Math.round(stayHighOnlyLow + costMath.luxuryFixedUsd.high),
          },
          hotelNote: lux.hotelNote,
          ticketNote: lux.ticketNote,
        });
      }
    } else {
      const cp = content.cost.profiles as Array<{ tier: string; ticketTier: string; ticketTierLabel: string; hotelNote: string }> | undefined;
      const profileFor = (label: string, ticketTier: string) => cp?.find((p) => p.tier === label && p.ticketTier === ticketTier);
      profiles = [
        { label: "Budget", total: tripTotal(budgetHotel, tier1Ticket), hotelNote: profileFor("Budget", "tier1")?.hotelNote ?? "", ticketNote: profileFor("Budget", "tier1")?.ticketTierLabel ?? "" },
        { label: "Moderate", total: tripTotal(moderateHotel, tier2Ticket), hotelNote: profileFor("Moderate", "tier2")?.hotelNote ?? "", ticketNote: profileFor("Moderate", "tier2")?.ticketTierLabel ?? "" },
        { label: "Splurge", total: tripTotal(splurgeHotel, tier3Ticket), hotelNote: profileFor("Splurge", "tier3")?.hotelNote ?? "", ticketNote: profileFor("Splurge", "tier3")?.ticketTierLabel ?? "" },
        { label: "Luxury", total: tripTotal(luxuryHotel, tier4Ticket), hotelNote: profileFor("Luxury", "tier4")?.hotelNote ?? "", ticketNote: profileFor("Luxury", "tier4")?.ticketTierLabel ?? "" },
      ];
    }

    const moderateTicketForCategoryRow = costMath.ticketPairingMode === "nz-australia" ? tier1Ticket : tier2Ticket;
    const categoryRows = [
      moderateTicketForCategoryRow && { label: "Ticket (mid tier)", low: Number(moderateTicketForCategoryRow.costLow), high: Number(moderateTicketForCategoryRow.costHigh), unit: "one day" },
      moderateHotel && { label: "Hotel", low: Number(moderateHotel.costLow) * nights, high: Number(moderateHotel.costHigh) * nights, unit: `for ${nights} nights` },
      destinationBand && { label: "Local travel", low: Number(destinationBand.localTravelLow) * nights, high: Number(destinationBand.localTravelHigh) * nights, unit: `for ${nights} days` },
      destinationBand && { label: "Food", low: Number(destinationBand.foodPerDayLow) * nights, high: Number(destinationBand.foodPerDayHigh) * nights, unit: `for ${nights} days` },
    ].filter((r): r is { label: string; low: number; high: number; unit: string } => Boolean(r));

    const regionFlights = flights.filter((f) =>
      f.region === costMath.flightRegion &&
      !costMath.excludedOrigins.includes(f.originMarket) &&
      (!costMath.flightOriginAllowlist || costMath.flightOriginAllowlist.includes(f.originMarket))
    );
    const flightRange = regionFlights.length
      ? { low: Math.min(...regionFlights.map((f) => Number(f.costLow))), high: Math.max(...regionFlights.map((f) => Number(f.costHigh))) }
      : null;

    costSection = {
      intro: (content.cost as { intro?: string; h1?: string; eventName?: string }).intro ?? "",
      moderateTotal,
      tripNights: nights,
      profiles,
      categoryRows,
      bookingTimingTrap: content.cost.bookingTimingCallout ?? content.cost.bookingTimingTrap ?? { label: "", body: "" },
      flightRange,
      flightsNote: content.cost.flightsNote ?? "",
      crossLinks: content.cost.crossLinks ?? { hotels: "", tickets: "" },
      verdicts: content.cost.verdicts ?? [],
    };
  }

  // --- Tickets/Hotels/GettingThere/Weather/FirstTimerGuide/WhereToEat/
  //     DayTrips/Itinerary/Arrival/Map/Luxury: Wimbledon reuses the typed
  //     Full Pack section components directly (their field shapes match
  //     Wimbledon's real content); every other event's content doesn't
  //     match those field names, so it goes through a per-event generic-
  //     block builder instead (see genericSectionBuilders.ts) — registered
  //     by slug there, not branched inline here, so adding event N+1 means
  //     adding one function to that registry, not growing this route. ---
  let ticketsSection = null;
  if (slug === "wimbledon" && content.tickets) {
    ticketsSection = { ...content.tickets };
  }

  let hotelsSection = null;
  if (slug === "wimbledon" && content.hotels) {
    const sw19Experiences = lookupMany(["wimbledon-cannizaro-house", "wimbledon-rose-crown"]);
    const centralLondonExperiences = lookupMany(["nox-waterloo", "park-plaza-county-hall-london"]);
    hotelsSection = {
      intro: content.hotels.intro,
      villageAtmosphere: content.hotels.villageAtmosphere,
      sw19Picks: content.hotels.sw19Picks,
      sw19Experiences,
      centralLondonPicks: content.hotels.centralLondonPicks,
      centralLondonExperiences,
      verdicts: content.hotels.verdicts,
    };
  }

  const gettingThereSection = slug === "wimbledon" && content.gettingThere
    ? { ...content.gettingThere, experiences: lookupMany(["traveling-to-the-all-england-club"]) }
    : null;

  const weatherSection = slug === "wimbledon" && content.weather
    ? { ...content.weather, experiences: lookupMany(["wimbledon-when-it-rains"]) }
    : null;

  const firstTimerGuideSection = slug === "wimbledon" && content.firstTimerGuide
    ? { ...content.firstTimerGuide, experiences: lookupMany(["preparing-for-your-wimbledon-visit", "the-wimbledon-queue"]) }
    : null;

  const whereToEatSection = slug === "wimbledon" && content.whereToEat
    ? {
        ...content.whereToEat,
        onGroundsExperiences: lookupMany(["wimbledon-eating"]),
        villageExperiences: lookupMany(["dinner-at-the-crooked-billet", "dinner-at-the-black-lamb"]),
      }
    : null;

  const dayTripsSection = slug === "wimbledon" && content.dayTrips
    ? {
        ...content.dayTrips,
        windsorEtonExperiences: lookupMany(["windsor-castle-long-walk", "eton-across-river-windsor"]),
        restDayExperiences: lookupMany(["london-rest-day", "brixton-village-market-row"]),
      }
    : null;

  const itinerarySection = slug === "wimbledon" && content.itinerary
    ? { ...content.itinerary, experiences: lookupMany(["sw19-during-the-fortnight"]) }
    : null;

  const arrivalSection = slug === "wimbledon" && content.arrival
    ? { ...content.arrival, experiences: lookupMany(["the-wimbledon-queue"]) }
    : null;

  const mapSection = slug === "wimbledon" && content.map
    ? {
        ...content.map,
        outerCourtExperiences: lookupMany(["the-hill-wimbledon", "wimbledon-outer-courts"]),
        practiceCourtExperiences: lookupMany(["wimbledon-practice-courts"]),
        museumExperiences: lookupMany(["wimbledon-museum-private-tour"]),
      }
    : null;

  const luxurySection = slug === "wimbledon" && content.luxury
    ? {
        ...content.luxury,
        theLawnExperience: lookupMany(["wimbledon-the-lawn-hospitality"]),
        premiumStayExperience: lookupMany(["wimbledon-cannizaro-house"]),
      }
    : null;

  const genericBuilder = GENERIC_SECTION_BUILDERS[slug];
  const genericSections = genericBuilder ? genericBuilder(content, lookupMany) : undefined;

  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const docElement = createElement(FullPackPdfDocument, {
    eventName: event.name,
    dateStr,
    userEmail: user.email,
    hub: hubSection,
    cost: costSection,
    tickets: ticketsSection,
    hotels: hotelsSection,
    gettingThere: gettingThereSection,
    weather: weatherSection,
    firstTimerGuide: firstTimerGuideSection,
    whereToEat: whereToEatSection,
    dayTrips: dayTripsSection,
    itinerary: itinerarySection,
    arrival: arrivalSection,
    map: mapSection,
    luxury: luxurySection,
    genericSections,
  }) as ReactElement<DocumentProps>;

  const buffer = await renderToBuffer(docElement);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}-full-pack.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
