// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/LuxurySpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased. Real named
// hospitality tiers with published per-session pricing (table extracted
// verbatim, static hardcoded content in the source, not DB-computed).

export const atpFinalsLuxurySpokeContent = {
  intro:
    "Luxury at the ATP Finals is a stack of decisions, not one purchase — the hospitality ticket is only one part of it. Here's what actually goes into a genuinely upscale week in Turin, before we get to the seating tier itself.",

  premiumTransit: {
    label: "Premium transit",
    body:
      "Transfeero publishes real fixed fares for Turin Caselle Airport to the city centre: a First Class transfer (Mercedes S-Class or BMW 7 Series class) starts from €130.07, including tolls, low-emission-zone fees, meet-and-greet, and 60 minutes' free wait for flight delays. A Standard Sedan (Mercedes E-Class/BMW 5 Series) starts from €72.26 if you want the fixed-rate convenience without the top-tier car. Italy Chauffeur Service also runs an E-Class/S-Class fleet in Turin, but prices per vehicle on request rather than publishing a rate — get a quote directly if you want to compare. Worth booking specifically for arena transfers on hospitality days, since it removes any tram-connection planning entirely.",
  },

  offCircuitVenues: {
    label: "Off-circuit luxury venues",
    venues: [
      { name: "Piano35", body: "A cocktail bar on the 35th floor of the Intesa San Paolo skyscraper, 167.25 metres up — floor-to-ceiling windows, real panoramic views over the entire city and out to the Alps. Turin's genuine high-altitude luxury venue." },
      { name: "La Pista", body: "A rooftop restaurant built on the former Fiat test track at Lingotto, transformed into a landscaped garden by architect Benedetto Camerana — 360-degree views taking in Monviso, the Alps, and the Mole Antonelliana. A genuinely distinctive Turin story, not a generic rooftop." },
    ],
  },

  luxuryHotelsNote:
    "Principi di Piemonte's top-floor rooms carry the same Alpine-arch views that make Piano35 worth visiting.",

  // Real hospitality pricing table — static hardcoded content in the
  // source, published 2026 prices from nittoatpfinals.com/hospitality.
  hospitalityTiers: {
    label: "Real hospitality pricing, four tiers",
    rows: [
      { tier: "Break", includes: "Lower bowl seat, dedicated lounge with open bar for the full session, exclusive entrance, guest accompaniment", price: "€377 – €1,749" },
      { tier: "Smash", includes: "Lower bowl seat, signature dining + open bar at an exclusive restaurant, fast-track entry, cloakroom, welcome gift", price: "€784 – €4,697" },
      { tier: "Ace", includes: "Courtside seat, access to the practice court inside the arena, gourmet dining + open bar, welcome gift, guest services", price: "€1,008 – €5,734" },
      { tier: "ATP No. 1 Club", includes: "New for 2026. Single-day access, reserved lower-bowl corner ticket, dedicated lounge, signature restaurant, behind-the-scenes tour, meet-and-greets with former World No. 1 players, on-court photo experience.", price: "Not published — enquire via ATP Experiences", link: "https://atptourexperiences.com/atp-finals-2026" },
    ],
    priceNote:
      "Real, published 2026 prices from nittoatpfinals.com/hospitality — the low end is a Tuesday/Wednesday group-stage day session, the high end is the Sunday final. ATP No. 1 Club is genuinely new for 2026 with no prior-year price to compare against; we won't estimate one.",
  },

  // Pro-gated verdict content, matching LuxurySpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which hospitality tier we'd pick",
      body:
        "Break is the real entry point most first-timers overlook — from €377 for a group-stage day session, it gets you a lower-bowl seat and a full-session open bar without Smash or Ace's price jump. Ace is worth the step up specifically for the courtside seating and practice-court access — it's the one thing genuinely unavailable at any other price point, official or resold. Smash sits in between: better value than Ace if your priority is the full dining experience across multiple sessions rather than the closest possible seat. The new ATP No. 1 Club, booked via ATP Experiences (atptourexperiences.com/atp-finals-2026) rather than the tournament's own hospitality page, is the right call if you only want one standout day with direct access to a former World No. 1 rather than a multi-day hospitality commitment — enquire directly since pricing isn't published, and check both booking channels since they're listed separately.",
    },
    {
      label: "A luxury day, sequenced",
      body:
        "Book a private chauffeur for your hospitality-day arrival, giving yourself real margin before the session. Afterward, La Pista suits a celebratory dinner if your day included a big singles match — its distinctiveness as a former Fiat test track makes it a genuine story to tell, not just a nice meal. Piano35 works better as a pre-session cocktail stop, given its central location relative to most hotel districts.",
    },
  ],

  sourcesFooter:
    "Sources: transfeero.com (private transfer pricing), nittoatpfinals.com/hospitality (Break/Smash/Ace pricing), atptourexperiences.com and ATP Tour's official ATP No. 1 Club announcement (product detail; pricing not published). Verified 7 Aug 2026 — reconfirm hospitality pricing closer to the event, since published tiers can shift.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "atp-finals-luxury-hospitality" (luxuryHospitality)
//   - "atp-finals-luxury-hotels" (luxuryHotels)
