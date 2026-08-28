// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/GettingThereSpoke.tsx),
// for the Full Pack + Travel Brief PDF build. Prose half only, hand-copied
// not paraphrased.

export const nzAustraliaGettingThereSpokeContent = {
  intro:
    "This is a genuinely different logistics problem from a single-city or single-country event pack. Perth to Adelaide to Melbourne to Sydney is roughly 4,300km end to end — Australia is enormous, and there is no practical rail option connecting all four host cities on any timeline a Test tour actually allows. Every leg is a domestic flight, full stop.",

  fourLegs: {
    label: "The four legs",
    rows: [
      { route: "Perth → Adelaide", detail: "~50 flights/week, roughly 2h50-3h15 flight time. Qantas, Jetstar, and Virgin Australia all fly this route." },
      { route: "Adelaide → Melbourne", detail: "~18 flights/day, roughly 1h20 flight time — one of the most frequent domestic routes in the country." },
      { route: "Melbourne → Sydney", detail: "One of the world's top-10 busiest domestic air routes. Multiple flights per hour across Qantas, Jetstar, and Virgin Australia." },
      { route: "Sydney → home", detail: "Your international departure — book this leg last, once your Fourth Test dates are locked." },
    ],
  },

  ruledOutNote: {
    label: "Ruled out — and why",
    body:
      "The Indian Pacific train (Perth-Adelaide-Sydney) takes 2 nights one-way — genuinely impractical against a multi-Test itinerary with real dates to hit. The Overland (Adelaide-Melbourne) runs roughly 10.5 hours, once a week — workable only if your schedule happens to align with its single weekly departure. Flying is the only realistic way to see all four Tests on this tour.",
  },

  essentialApps: {
    label: "Essential apps for this trip",
    items: [
      { label: "Transit journey planner", value: "Each city runs its own app — Transperth (Perth), Adelaide Metro, PTV (Melbourne, myki-based), and Opal Travel (Sydney). Install the one for your current city, not all four at once." },
      { label: "Ride-hailing", value: "Uber and DiDi both operate reliably across all four cities — no tourist-eligibility restrictions in Australia, unlike some destinations." },
      { label: "Flight booking/tracking", value: "Qantas, Jetstar, and Virgin Australia all have their own apps for check-in and real-time gate/delay info — worth having whichever airline you're flying installed before your first domestic leg." },
    ],
  },

  bookingTip: {
    label: "Book domestic legs early, and watch sale patterns",
    body:
      "Domestic Australian airfares move with real seasonal demand, and a four-Test tour means booking four separate one-way domestic legs, not one round trip — each leg should be booked as soon as your dates for that city are fixed, not bundled together and left until closer to the trip. Qantas and Jetstar both run regular sale periods; Jetstar specifically tends to undercut on price at the cost of stricter baggage/change policies, worth checking against your actual itinerary flexibility before booking the cheapest fare by default.",
  },

  sourcesFooter:
    "Sources: Qantas, Jetstar, and Virgin Australia route/frequency data; Great Southern Rail (Indian Pacific, The Overland) schedules.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "getting-between-four-cities-flights-not-trains" (transitGuide)
