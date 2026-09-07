// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const mexicoCityGpTicketsSpokeContent = {
  h1: "Four real tiers, and a race that sells out in a single day",

  intro:
    "The Autódromo Hermanos Rodríguez sells a genuine range, from flexible general admission up through full pit-lane hospitality. Every ticket covers the standard 3-day (Friday-Sunday) weekend. Mexico City is also one of the hardest tickets on the F1 calendar to get — recent editions have sold out within a single day of going on sale, so the real decision here is less \"which tier\" and more \"be ready the moment tickets open.\"",

  whereToBuy: {
    label: "Where to actually buy your ticket",
    body:
      "Buy directly from the official source first, and be ready the moment sales open — this race has sold out within a single day in recent seasons. Every F1 ticket ultimately traces back to the promoter, and buying direct means no markup and no risk of a fraudulent listing.",
    body2:
      "If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in, P1 Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits' own official reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since 2007. Motorsport Tickets, sometimes seen advertised for this race, ceased trading and entered liquidation in 2026 — avoid it regardless of what a listing claims.",
    officialUrl: "https://tickets.formula1.com/en/f1-4861-mexico",
    resellerUrl: "https://www.p1travel.com/en/organizer/grand-prix-mexico",
  },

  standsTable: {
    label: "Side by side",
    rows: [
      { name: "General Admission (Grada 2A)", shows: "Open zones around the circuit — flexible, no assigned seat", seating: "General admission, unreserved, standing/lawn", exposure: "No cover — open zones", priceBand: "3-day: ~US$231" },
      { name: "Grandstand (Grandstands 15, 14, 5A)", shows: "Lower-tier reserved grandstands around the circuit", seating: "Reserved seat", exposure: "Mostly uncovered — check individual stand", priceBand: "3-day: US$785–1,270" },
      { name: "Main Grandstand & Premium Grandstands (10, 11)", shows: "The main straight and premium reserved sections — the best sightlines on the circuit", seating: "Reserved seat", exposure: "Main Grandstand partially covered; 10 and 11 mostly uncovered", priceBand: "3-day: US$1,640–2,166" },
      { name: "Paddock Club & House 44 at F1 Paddock Club™", shows: "Pit-lane hospitality, garage proximity, pit-lane walks", seating: "Hospitality tier — table seating, not a fixed grandstand view", exposure: "Fully covered", priceBand: "3-day: Paddock Club from US$8,502 · House 44 from US$16,338" },
    ],
  },

  pricingNote: {
    label: "On pricing",
    body:
      "Grandstand and hospitality figures above are confirmed 2026 prices from the official ticketing site. General Admission isn't listed there directly and is estimated from a third-party source instead — treat it as a guide rather than an exact figure. Confirm exact current pricing on the official ticketing site before buying.",
  },

  // Pro-gated verdict content — matching TicketsSpoke.tsx's {isUnlocked}
  // block exactly.
  verdicts: [
    {
      label: "Which tier we'd pick",
      body:
        "For a genuine first Mexico City GP, Main Grandstand or Grandstand 10/11 are the sharpest picks if racing action and sightlines matter most to you — these sit closest to the main straight and pit lane. If atmosphere is the actual reason you're making this trip, Foro Sol (Grandstands 14 & 15) is the honest answer instead: the racing itself is slower through that stadium section, but no other ticket on the calendar puts you inside a stadium-sized crowd that sings through Friday practice the way it does through the race. General admission is a genuinely reasonable budget entry — you lose a reserved seat, not the atmosphere, since GA areas still put you inside the same electric crowd. The full grandstand-by-grandstand comparison lives in the Venue Map guide.",
    },
    {
      label: "Paddock Club and House 44",
      body:
        "Paddock Club and House 44 at F1 Paddock Club™ sit above all of these as a genuinely different product — hospitality, not just a seat. Both get the full breakdown, including real booking mechanics and the season's highest-demand risk, in the Luxury Guide.",
    },
    {
      label: "Where to actually buy",
      body:
        "Buy the moment tickets open on the official promoter's site — this race has genuinely sold out within a day in recent years, and there's no realistic late-buyer path at face value once that happens. Set a calendar reminder for the announced release date rather than waiting to hear about it secondhand.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups:
//   - "foro-sol-mexico-city-gp-" (Foro Sol card, inside the verdict block)
//   - "mexico-city-gp-ticket-guide-" (Ticket Guide card, free section)
