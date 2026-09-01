// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/TicketsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. DB-computed
// values (live price bands via tickets.find(...)) are NOT duplicated here.
//
// Genuinely unusual, deliberate fact from this session's review (not an
// extraction mistake — reproduce as-is): tier2 = "T-Mobile Zone at Sphere /
// West Harmon / Turn 3" ($1,047-1,499), tier3 = "Heineken Silver Main
// Grandstand" ($1,499-2,076). These were swapped from an earlier
// mislabeling; the current source code is correct — extract verbatim.
//
// F1 Tickets spoke — verified reseller frame is mandatory per memory
// feedback_f1_tickets_reseller_verification.md: P1 Travel is confirmed
// verified/used (named on Yas Marina's official reseller list, Singapore
// GP's Authorised Partner), never present an unverified reseller as
// equivalent.

export const lasVegasGpTicketsSpokeContent = {
  h1: "Five real ticket tiers, one genuine budget move",
  eventName: "Las Vegas Grand Prix",

  intro:
    "Las Vegas sells a genuinely wide spread of tickets, from standing-room general admission to a five-figure hospitality tier — and unlike most Grands Prix, the difference between tiers here is about which part of the race weekend you actually want, not just how close you sit.",

  officialVsResellerCallout: {
    label: "Where to actually buy your ticket",
    body:
      "Buy directly from the official source first. Every F1 ticket ultimately traces back to the promoter, and buying direct means no markup and no risk of a fraudulent listing. If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in, P1 Travel is a genuine authorized F1 ticket partner — named directly on Yas Marina Circuit's own official reseller list and confirmed as Singapore GP's own Authorised Partner, not a random resale site. It's rated 4.7 from over 10,000 reviews on Trustpilot, and has been in business since 2007. Steer clear of anything else claiming to be \"official\" without that kind of direct confirmation — ticket fraud is real at every high-demand Grand Prix, and a listing that looks legitimate isn't the same as one a circuit has actually named.",
    officialUrl: "https://www.f1lasvegasgp.com/tickets/",
    resellerUrl: "https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-las-vegas",
  },

  // "Four real tiers" comparison cards — static hardcoded labels/notes in
  // the source; prices themselves are DB-derived (tickets.find(t => ...)).
  tiersTable: {
    label: "The four real tiers",
    rows: [
      {
        name: "Flamingo Zone GA",
        tier: "tier1",
        note: "Standing room, Koval Straight toward Turn 5G braking zone",
      },
      {
        name: "T-Mobile Zone at Sphere / West Harmon / Turn 3",
        tier: "tier2",
        note: "Real assigned grandstand seating, genuine racing views",
      },
      {
        name: "Heineken Silver Main Grandstand",
        tier: "tier3",
        note: "Start/finish line, pit lane views, the full ceremony",
      },
      {
        name: "Paddock Club",
        tier: "tier4",
        note: "Garage-level hospitality, restricted paddock tour",
      },
    ],
  },

  // "Every grandstand and zone, in detail" — 6 experience cards, generic
  // <SpokeExperienceCard> component, no inline description beyond the card
  // itself:
  // - "las-vegas-gp-main-grandstand" (mainGrandstand) — Heineken Silver Main Grandstand
  // - "las-vegas-gp-turn3-grandstand" (turn3) — Turn 3 Grandstand
  // - "las-vegas-gp-west-harmon-grandstand" (westHarmon) — West Harmon Grandstand
  // - "las-vegas-gp-flamingo-ga" (flamingo) — Flamingo Zone GA
  // - "las-vegas-gp-tmobile-sphere" (tmobile) — T-Mobile Zone at Sphere
  // - "las-vegas-gp-practice-qualifying-tickets" (practiceQualifying) — single-day practice/qualifying tickets
  // Note: 4 of these (Heineken Silver Main Grandstand, Turn 3 Grandstand,
  // West Harmon Grandstand, Flamingo Zone GA) have no hero image — doesn't
  // affect PDF content, flagged per task instructions only.

  // Pro-gated verdict content — matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "The real budget move",
      body:
        "Single-day tickets exist for every session, and the price gap between them is enormous: Thursday practice starts around US$50, Friday qualifying around US$99, Saturday's race around US$393. Qualifying delivers genuine competitive intensity under the same night lights as the race, for roughly a quarter of race day's price — a real, underused way into the weekend on a tighter budget.",
    },
    {
      label: "Which tier we'd actually book",
      body:
        "For a genuine first Las Vegas GP, Heineken Silver Main Grandstand is the strongest single seat — start/finish, pit lane, the full ceremony, and nowhere else on the circuit replicates that specific view. If real racing matters more than the ceremony, West Harmon or Turn 3 delivers a sharper price-to-action ratio: Turn 3's real selling point is the Koval Straight DRS zone into the Turn 5G braking zone, genuine overtaking territory, not just a cheaper seat. Flamingo Zone GA isn't a compromise pick, it's the honest budget move: standing room on the same Koval Straight/Turn 5G braking zone Turn 3 Grandstand looks onto, at a fraction of any seated tier's price. T-Mobile Zone at Sphere is a genuinely different product, not a cheaper grandstand — you're buying a standing view with the Sphere itself as the backdrop, plus a real concert stage each night of race weekend (Two Friends, Disclosure, Sean Paul, and a Backstreet Boys afterparty at the Sphere in past years). Worth knowing either way: General Admission tickets are single-zone-locked — a Flamingo Zone ticket doesn't let you wander into T-Mobile Zone on the same day, so pick the zone whose specific view (and lineup) matters most to you, not just the cheapest one.",
    },
    {
      label: "Book early — this circuit sells out grandstands fast",
      body:
        "Main Grandstand has historically been the first stand to sell out given its start/finish and pit-lane view. Buy only via f1lasvegasgp.com or tickets.formula1.com directly — avoid resellers.",
      url: "https://www.f1lasvegasgp.com/tickets/",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - Live ticket-tier prices via tickets.find((t) => t.tier === "tierN")
// - linkedExperiences lookups for 6 experience cards (see comment above)
