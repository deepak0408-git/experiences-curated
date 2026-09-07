// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/HotelsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const mexicoCityGpHotelsSpokeContent = {
  h1: "Roma Norte, Condesa, or Polanco — three real, different trips",

  intro:
    "Where to stay for Mexico City is a genuine three-way call between neighborhoods, not a default choice. Roma Norte is the walkable, food-forward pick — the neighborhood most first-timers end up recommending to the next first-timer. Condesa sits right next door with the same safety profile but a quieter, greener pace built around two large parks. Polanco is the polished, secure option — the city's answer to Beverly Hills, at the cost of being furthest from the circuit of the three.",

  threeRealPicks: { label: "Roma Norte, Condesa & Polanco" },

  bookEarlyCallout: {
    label: "Book early — this year specifically",
    body:
      "2026 race weekend (30 October–1 November) lands directly on top of Mexico City's Día de Muertos Grand Parade weekend — one of the biggest tourism draws in the city's calendar, entirely independent of the race. Hotel demand across all three neighborhoods will run higher than a typical Mexico City GP weekend. Book earlier than you normally would for this trip.",
  },

  // Pro-gated verdict content — matching HotelsSpoke.tsx's {isUnlocked}
  // block exactly.
  verdicts: [
    {
      label: "Which neighborhood we'd pick",
      body:
        "For a genuine first Mexico City GP, Roma Norte is the right default — it puts you closest to the neighborhood energy that makes this city worth visiting beyond the race, and it's a straightforward taxi or rideshare to the circuit on race days. If you want the same real culture with a calmer pace at the end of each night, Condesa is the better call — the two large parks genuinely change how a loud race weekend feels once you're back at the hotel. Polanco is the right choice specifically if a polished, secure, internationally-familiar base matters more to you than neighborhood immersion — just factor in the extra travel time to the circuit on every single race day, since it's a real, not marginal, difference from the other two.",
    },
  ],

  bookingCards: {
    label: "Booking windows & timing",
    cards: [
      { name: "Roma Norte & Condesa hotels", note: "Given the Día de Muertos overlap, aim to book at least 2-3 months ahead rather than the shorter window that might work for a typical Mexico City trip — both neighborhoods will see genuinely elevated demand this specific year." },
      { name: "Polanco hotels", note: "Book via the links below, or (for the JW Marriott specifically) Marriott's own loyalty program for potential point redemptions. The same early-booking logic applies — December-level demand hitting in late October this year." },
      { name: "Airbnb / serviced apartments", note: "Mexico City has a real, large short-let market in all three neighborhoods. For a multi-night trip, a self-catered apartment can genuinely beat a hotel room on space and price — search Roma Norte or Condesa specifically if walkability matters, since Polanco's stock skews more toward corporate/business travelers." },
    ],
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups:
//   - "mexico-city-where-to-stay-roma-norte-"
//   - "mexico-city-where-to-stay-condesa-"
//   - "mexico-city-where-to-stay-polanco-"
