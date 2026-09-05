// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/TicketsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
// DB-computed values (live 3-day tier pricing via tickets.find) are NOT
// duplicated here.
//
// Note: unlike Abu Dhabi's Tickets spoke (3 cards + 1 table-only row), US
// GP's unlocked grid shows all 4 stand cards (Main Grandstand, Turn 1,
// Turn 15, General Admission) — Paddock Club/Champions Club are referenced
// only in prose text (with practicalInfo.bookingMethod interpolated) and
// point to the Luxury Guide, no card rendered for either here.

export const usGpTicketsSpokeContent = {
  intro:
    "Circuit of the Americas sells a genuine range, from a flexible general-admission ticket up through full pit-lane hospitality — this isn't a single grandstand-vs-grandstand choice. Every ticket covers the standard 3-day (Friday-Sunday) weekend, and every tier — GA included — comes bundled with access to the Germania Insurance Super Stage concerts on the same ticket.",

  // "Side by side" / "Options compared" comparison table — static hardcoded
  // content in the source (STANDS const array), extracted verbatim.
  standsTable: {
    label: "Side by side",
    rows: [
      {
        name: "General Admission",
        slug: "us-gp-general-admission",
        tier: "tier1",
        shows: "Flexible — move between vantage points around the whole circuit",
        seating: "General admission, unreserved",
        exposure: "No cover — open zones",
      },
      {
        name: "Turn 1 \"Big Red\"",
        slug: "us-gp-turn-1-big-red",
        tier: "tier3",
        shows: "The 11% climb into COTA's signature blind hairpin, plus the start-finish straight",
        seating: "Reserved seat",
        exposure: "No cover — fully open",
      },
      {
        name: "Turn 15 — Stadium Section",
        slug: "us-gp-turn-15-stadium",
        tier: "tier2",
        shows: "Five corners in one sightline — Turns 12-15, plus the back straight",
        seating: "Reserved seat",
        exposure: "No cover — fully open",
      },
      {
        name: "Main Grandstand",
        slug: "us-gp-main-grandstand",
        tier: "tier3",
        shows: "Grid, pit lane, start & podium — the whole arc of the event",
        seating: "Reserved seat (Lower/Mezzanine/Club tiers)",
        exposure: "Partially covered — Club Level only",
      },
    ],
  },

  buyOfficialOnlyWarning: {
    label: "Where to actually buy your ticket",
    body:
      "Buy directly from the official source first. Every F1 ticket ultimately traces back to the promoter, and buying direct means no markup and no risk of a fraudulent listing. If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in, P1 Travel is a genuine authorized F1 ticket partner — named directly on Yas Marina Circuit's own official reseller list and confirmed as Singapore GP's own Authorised Partner, not a random resale site. It's rated 4.7 from over 10,000 reviews on Trustpilot, and has been in business since 2007. Steer clear of anything else claiming to be \"official\" without that kind of direct confirmation — ticket fraud is real at every high-demand Grand Prix, and a listing that looks legitimate isn't the same as one a circuit has actually named.",
    officialUrl: "https://tickets.formula1.com/en/f1-3320-united-states",
    p1TravelUrl: "https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-usa",
  },

  pricingConfirmedNote: {
    label: "Real, published pricing",
    body:
      "Every price above is the real, published 2026 3-day (Friday-Sunday) rate from tickets.formula1.com — not an estimate. A separate, cheaper Sunday race-day-only ticket also exists for each stand, starting from roughly US$310 for General Admission, if you only want to attend race day itself.",
  },

  // Pro-gated verdict content, matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block. Real price bands are computed inline via
  // tickets.find(t => t.tier === ...) in the source — PDF route must
  // recompute, not freeze a static number.
  verdicts: [
    {
      label: "Which tier we'd pick",
      body:
        "For a genuine first Austin GP, Turn 15's stadium section (3-day pass price) is arguably the best value seat at the track — five corners in one sightline. The Main Grandstand (3-day pass price) is the sharpest all-round pick if budget allows — it's the only seat that covers the grid, the pit stops, and the podium ceremony in a single sightline, and Club Level specifically is the one fully covered tier at the entire circuit. Turn 1 \"Big Red\", at the same price tier, is the more dramatic choice instead — an 11% climb into a blind hairpin, genuinely unlike anything else at COTA — but you'll trade the podium view for it. General Admission (3-day pass price) is a real, legitimate way to do your first COTA weekend on a budget — every tier here gets the same concert access, so going cheap on the seat costs you nothing on the evening entertainment.",
      priceInterpolation: "tier1_tier2_tier3",
    },
    {
      label: "Paddock Club and Champions Club",
      body:
        "Paddock Club and Champions Club sit above all four of these as a genuinely different product — hospitality, not just a seat. [paddockClub.practicalInfo.bookingMethod interpolated here if present — see TODO below]. Both get the full breakdown, including real booking contacts and sell-out timing, in the Luxury Guide.",
    },
  ],

  // "What each is actually like" table — pulls whyItsSpecial from each
  // linked experience live; not extracted as static text here. Row labels
  // and hardcoded summary lines (static) shown below for reference.
  comparisonTableRows: [
    { title: "Main Grandstand", summary: "The ceremony seat — grid, pit stops, podium, but only three corners of the lap are visible." },
    { title: "Turn 1 \"Big Red\"", summary: "The drama seat — an 11% climb to a blind hairpin, named for the man who built the track." },
    { title: "Turn 15 — Stadium Section", summary: "The value seat — five corners in one sightline, at the mid-tier grandstand price." },
    { title: "General Admission", summary: "The flexible seat — move around the whole circuit, same concert access as every reserved tier." },
  ],

  sourcesFooter: "Sources: tickets.formula1.com, circuitoftheamericas.com.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards (unlocked grid, all 4 cards):
//   - "us-gp-main-grandstand" (mainGrandstand)
//   - "us-gp-turn-1-big-red" (turn1)
//   - "us-gp-turn-15-stadium" (turn15)
//   - "us-gp-general-admission" (generalAdmission)
// - linkedExperiences lookup for practicalInfo.bookingMethod text only (no
//   card) referenced inline in the "Paddock Club and Champions Club" prose:
//   - "us-gp-paddock-club" (paddockClub)
// - "What each is actually like" table's `detail` column pulls
//   whyItsSpecial live from mainGrandstand / turn1 / turn15 /
//   generalAdmission — rows are filtered to only show if `detail` exists.
