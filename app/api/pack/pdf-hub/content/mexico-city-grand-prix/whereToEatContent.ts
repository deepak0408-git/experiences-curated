// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/WhereToEatSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const mexicoCityGpWhereToEatSpokeContent = {
  h1: "From a 30-peso taco to a two-Michelin-star tasting menu — the real range",

  intro:
    "Mexico City now has more Michelin-recognized restaurants than Paris, and the real argument for this city's food scene isn't choosing between the street stand and the tasting menu — it's that both can be genuinely world-class on the same trip, sometimes the same night.",

  budgetHeading: { label: "Budget — the street-food essential" },
  moderateHeading: { label: "Moderate — a food hall covering every craving" },
  splurgeHeading: { label: "Splurge — the two hardest tables in the city" },

  // Pro-gated verdict content — matching WhereToEatSpoke.tsx's
  // {isUnlocked} block exactly.
  verdicts: [
    {
      label: "Don't want to pick just one — a guided food tour",
      body:
        "If narrowing the city's food scene down to two or three stops feels like the wrong problem to have, a guided tour through the Historic Center covers the range in one sitting — 8+ tastings across markets, hidden eateries, and local favorites, including chilaquiles, mole-covered enchiladas, fresh guacamole and tortillas, tacos at a locals' taquería, Mexican pastry, artisanal chocolate, and a genuine surprise dish kept off the menu until you get there. Led by a local guide, with free cancellation up to 24 hours ahead — check the link below for current pricing and availability.",
      linkUrl: "https://www.getyourguide.com/mexico-city-l194/mexico-city-old-town-food-tour-of-7-tastings-secret-dish-t220743/?partner_id=HCNITTS&utm_medium=online_publisher",
      linkLabel: "Book with GetYourGuide",
    },
    {
      label: "How we'd actually sequence a food-focused day",
      body:
        "Start with a genuine sampling crawl across two or three taco stands in one evening — El Vilsito, Los Cocuyos, or a nearby Orinoco branch — rather than filling up at the first one, since each stand's trompo has its own marinade and char worth comparing. Save Mercado Roma for a day when your group can't agree on one cuisine, or when you want to sample widely without committing to one restaurant for the whole meal. Reserve for Pujol and Contramar weeks, not days, ahead — Pujol's calendar releases exactly 30 days out at midnight Mexico City time, and Contramar takes same-day walk-ins only if you arrive 10 minutes before opening.",
    },
    {
      label: "The reservation detail that actually matters",
      body:
        "If Pujol is the one non-negotiable meal of your trip, set a reminder for exactly 30 days before your target date and be online at midnight Mexico City time — popular dates have filled within minutes of the calendar releasing, and there is no back-channel booking route through a concierge service. For Contramar, arriving 10 minutes before opening (11am weekends, 12pm weekdays) is a meaningfully better strategy than showing up at the posted opening time itself, which is often already too late for a same-day walk-in table.",
    },
  ],

  sourcesFooter: "",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups:
//   - "mexico-city-tacos-al-pastor-" (tacos, budget)
//   - "mexico-city-mercado-roma-" (mercadoRoma, moderate)
//   - "mexico-city-pujol-contramar-" (pujolContramar, splurge)
