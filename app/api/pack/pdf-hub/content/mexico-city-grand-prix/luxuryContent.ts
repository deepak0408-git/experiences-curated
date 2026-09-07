// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/LuxurySpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const mexicoCityGpLuxurySpokeContent = {
  h1: "A whole trip of luxury decisions, not one hospitality product",

  intro:
    "A luxury Mexico City GP weekend is a stack of decisions, not one purchase. Beyond the obvious top hospitality tier, a genuinely luxury trip here spans a real private-transit market, a rooftop and nightlife scene with a genuine F1 afterparty history, and premium hotel options across three very different neighborhoods.",

  hospitalityLadder: {
    label: "Hospitality tiers beyond the top one",
    body:
      "F1 Experiences sells two real hospitality tiers here, not just one: the Champions Club, positioned lower than full Paddock Club but still genuinely premium — a 3-day package with hospitality, a guided paddock tour, and grid-walk access — and the official F1 Paddock Club and House 44 at F1 Paddock Club™, from US$8,502 for the 3-day package. Both include real pit-lane proximity and hospitality service — the difference is suite position and depth of access, not one being a watered-down version of the other. Champions Club is sold directly through F1 Experiences, not the official ticketing site — confirm current pricing there before booking.",
  },

  rooftopScene: {
    label: "Off-circuit — the rooftop scene",
    body:
      "Mexico City has a genuine rooftop-bar culture that predates the race, and two spots specifically carry real pedigree: Area Bar, attached to Hotel Habita on Avenida Presidente Masaryk in Polanco, draws a real celebrity-adjacent crowd with a lower VIP terrace and pool; and the rooftop at Hotel CondesaDF (the same hotel featured in the Where to Stay guide) looks out over Parque España toward Chapultepec Castle. Polanco's club scene also carries genuine F1 history — one of the neighborhood's well-known clubs has hosted actual Formula 1 afterparties and international-artist concerts in past seasons, not just marketing-copy \"VIP nights.\"",
  },

  premiumTransit: {
    label: "Private transit",
    body:
      "The circuit sits in the eastern part of the city, a genuine distance from the luxury hotel corridors in Polanco and Roma Norte, and race weekend brings real road closures and reversible-lane schemes across the city — a private transfer is a real practical upgrade over rideshare here, not just a comfort choice, since Uber and DiDi can't get near the actual gates anyway (see the Getting There guide).",
    rates:
      "Real current Mexico City hourly rates for a private car: a sedan runs roughly 600-900 MXN/hour in central zones, an SUV roughly 900-1,300 MXN/hour, with airport pickups adding 1,200-1,800 MXN on top. These are general Mexico City rates, not race-specific pricing — expect a premium above these figures for race weekend itself given genuinely elevated demand.",
  },

  luxuryHotelFact: {
    label: "Ultra-luxury stays",
    body:
      "The real new luxury fact worth knowing here: Las Alcobas in Polanco is an intimate, five-star Luxury Collection property, formerly a private residence redesigned entirely by Yabu Pushelberg — a genuinely different tier of stay from the area's larger international chain hotels. It gets the full breakdown, room types, and booking detail in the Where to Stay guide.",
  },

  // Pro-gated verdict content — matching LuxurySpoke.tsx's {isUnlocked}
  // block exactly. verdicts[0] is the Paddock Club intro paragraph pair
  // that wraps the paddockClub experience card in source — the PDF route
  // renders this first, then the card, per the US GP luxury builder
  // pattern (genericSectionBuilders.ts lx.verdicts[0]).
  verdicts: [
    {
      label: "The single biggest luxury decision: F1 Paddock Club & Champions Club",
      body:
        "Paddock Club is F1's own official hospitality product, run the same way at every round — pit-lane proximity, daily pit-lane walks, premium open bars, and trackside entertainment. Champions Club sits a genuine step below it in price and suite position, but still puts you in a real hospitality environment rather than the general crowd.\n\nA grandstand sells you one great view of the racing. Paddock Club or Champions Club sells you the whole day around it — food, bars, and real proximity to the sport itself, not just a better seat.",
    },
    {
      label: "Booking Paddock Club and Champions Club",
      body:
        "Call F1 Experiences directly at +1 718-682-7493 rather than relying only on the online booking flow — Mexico City's overall demand is unusually high for this race, and hospitality inventory has sold out before race week in past seasons. A phone call gets you real availability by suite section, which the standard website checkout won't show. Ask about Champions Club as a real fallback in the same call if Paddock Club is already tight — it carries real overlap in what you get at a meaningfully lower price point.",
    },
    {
      label: "Booking private transit",
      body:
        "Book at least a few days ahead of race weekend specifically — demand for private cars spikes across the city during the Grand Prix, on top of the same weekend's Día de Muertos crowds. Confirm your exact pickup point, vehicle type, and whether the quoted rate already reflects race-weekend demand before you book, since hourly rates can run meaningfully above the general baseline during the event itself.",
    },
    {
      label: "Rooftop and nightlife access",
      body:
        "For Area Bar or Polanco's bigger clubs on the Saturday of race weekend specifically, table or VIP bookings are genuinely worth arranging ahead rather than assuming walk-in entry — race weekend nights here draw real crowds beyond the usual weekend traffic. Hotel CondesaDF's rooftop is more accessible without a reservation, but arriving before sunset improves your odds of a table with the Chapultepec Castle view.",
    },
  ],

  sourcesFooter: "",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "mexico-city-gp-paddock-club-" (paddockClub, inside verdicts[0])
