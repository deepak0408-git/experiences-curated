// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/LuxurySpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. The
// deepest Luxury spoke of any event built so far — 10 real named AO
// Reserve packages with confirmed AUD pricing (kept in AUD, not converted
// to US$, per CLAUDE.md's currency-sourcing rule: these are third-party
// prices, not our own pack pricing).
//
// Note: source spoke deliberately swaps its free/gated split vs. every
// other Luxury spoke — the corporate-hospitality experience card sits
// free (teaser), while both real cost/value/seating tables sit gated, per
// direct founder direction (27 Aug 2026). This is an AO-specific
// divergence, not a pattern used elsewhere — carried through as-is here.

export const australianOpenLuxurySpokeContent = {
  intro:
    "Luxury at the Australian Open is a stack of decisions, not one purchase — AO Reserve is only one part of it, even though it has more genuinely distinct tiers than most Grand Slam hospitality programs. Here's what actually goes into a genuinely upscale Open, before the top tier itself.",

  aoReserveIntro: {
    label: "AO Reserve — the Australian Open's luxury experience",
    body:
      "AO Reserve runs ten distinct products, not one hospitality package — five named-chef dining rooms that book directly online, and five inquiry-only spaces that need a direct call rather than a standard checkout. The dining rooms are the accessible end of this spectrum; the inquiry-only spaces are where real availability tightens fastest once the draw firms up.",
  },

  premiumTransit: {
    label: "Premium transit",
    body:
      "Melbourne-based operators like Chauffeur Link run a dedicated Australian Open service — fixed, all-inclusive rates quoted at booking rather than surge pricing on match days, pickup from Melbourne Airport or your hotel, and drop-off at the designated Melbourne Park zones or directly on Olympic Boulevard by John Cain Arena. Drivers track flights and match overruns, so a delayed session or a late arrival doesn't leave you stranded.",
  },

  offVenueLuxury: {
    label: "Off-venue luxury — the arena hotels",
    hotel: {
      name: "Pullman East Melbourne",
      rating: { value: "4.3", source: "Google" },
      body: "Already the standout pick in the Where to Stay guide — it looks directly across at the MCG and Melbourne Park precinct, and some rooms are bookable specifically for that view.",
    },
    venue: {
      name: "Stella Restaurant and Bar, South Yarra",
      rating: { value: "4.7", source: "Google" },
      body: "A genuine four-level destination on Chapel Street, not a generic hotel bar dressed up for the occasion — ground-floor pizzeria, first-floor dining with a fireplace, and an open-air rooftop terrace on top. Melbourne's food and bar scene, not a single circuit-side venue, is the real off-venue luxury story at this Slam.",
    },
  },

  // AO Reserve's 10 real named packages — static hardcoded content in the
  // source, extracted verbatim. Only the 5 "dining rooms" book online; the
  // 5 "inquiry" packages need a direct call.
  diningRoomPackages: [
    { name: "Riverside Social", venue: "Rod Laver Arena Lower Bowl, Sections 8-12", price: "AU$599pp", laterPrice: null, detail: "A rooftop lounge on River Terrace with Melbourne skyline and river views — roving canapés and food stations, a 5-hour classic beverage package, and live entertainment." },
    { name: "The Bistro by SK Steak & Oyster", venue: "Rod Laver Arena Lower Bowl, Sections 8-11", price: "AU$599pp", laterPrice: "AU$699pp", detail: "Brisbane restaurant SK Steak & Oyster's own dining room on Centrepiece Level 1 — a 3-course seated menu, 5-hour signature beverage package, and an al fresco bar overlooking Garden Square." },
    { name: "AO Glasshouse by Dominique Crenn", venue: "Rod Laver Arena Lower Bowl, Section 8, 11 or 12", price: "AU$599pp", laterPrice: "AU$1,449pp (Quarterfinals onward — night sessions only, plus lunch for the Men's Semifinal)", detail: "A light-filled dining room on Olympic Boulevard built around a 3-course set menu and a 2-hour signature beverage package." },
    { name: "Champions Rooftop by Peter Gilmore", venue: "Rod Laver Arena Lower Bowl, Sections 8, 9 & 11", price: "AU$599pp", laterPrice: "AU$2,499pp (Semifinals onward)", detail: "Chef Peter Gilmore's rooftop dining room on Rod Laver Arena Level 4 — canapés and a premium roving menu, al fresco seating, a 3-hour premium beverage package, a cocktail on arrival, and a visit from a tennis legend." },
    { name: "The Gallery by Daniela Maiorano", venue: "John Cain Arena Level 2 — not a Rod Laver Arena seat", price: "AU$599pp", laterPrice: "AU$1,449pp", detail: "An Italian-focused lounge on the balcony bar overlooking the AO precinct, curated by chef Daniela Maiorano — canapés and elevated roving dining, plus a 5-hour classic beverage package." },
  ],

  inquiryPackages: [
    { name: "On Court presented by Piper-Heidsieck", venue: "Rod Laver Arena Underground — RLA On-Court seats", price: "AU$2,999pp", detail: "The most exclusive on-court seating AO Reserve sells — an omakase dining experience by chef Shimpei Raikuni of Brisbane's Sushi Room, a Piper-Heidsieck Champagne Lounge, a 6-hour premium beverage package, and private chauffeur service." },
    { name: "Suites", venue: "Rod Laver Arena Level 4 — private, in-suite arena-facing seating", price: "AU$944pp", detail: "A private suite for 12 or 18 guests — premium grazing-style dining and a 6-hour signature beverage package, with a dedicated host from first serve to the final point." },
    { name: "Bar Suite by Caretaker's Cottage", venue: "Rod Laver Arena Level 4 — private, in-box arena-facing seating", price: "AU$999pp", detail: "A private space for 14, with cocktails curated by Caretaker's Cottage — named Best Bar in Australasia 2024 and 2025, ranked #19 on The World's 50 Best Bars. Grazing-style dining, a 6-hour beverage package. Only one available per session." },
    { name: "Club 1905 by Simon Rogan", venue: "Centrepiece Level 2 — Rod Laver Arena Lower Baseline, Sections 8-12", price: "AU$36,490pp", detail: "AO Reserve's top tier — the same Rod Laver Arena Lower Baseline seat and the same restaurant table for every one of the tournament's 27 sessions, first round to finals, with dining curated by three-Michelin-star chef Simon Rogan." },
    { name: "Private Rooms — The Lounge", venue: "Rod Laver Arena Level 3 — Lower Bowl, Section 1", price: "AU$1,249pp", detail: "A private group hosting space for up to 60, with direct Rod Laver Arena access and a self-serve grazing menu by chef Stephen Nairn." },
  ],

  packagesPriceNote:
    "Prices shown are \"from,\" per person, incl. GST, in AUD, from ausopentravel.com. The 5 named-chef dining rooms (Riverside Social, The Bistro, AO Glasshouse, Champions Rooftop, The Gallery) all start at AU$599pp in Week 1, with some stepping up to a higher \"from\" price once availability shifts to later rounds — The Gallery seats at John Cain Arena, not Rod Laver Arena like the other four. The remaining 5 (On Court, Suites, Bar Suite, Club 1905, The Lounge) are inquiry-only, with a single \"from\" price and no Week 1/later-round split shown — enquire directly with AO Reserve for a current quote and availability against your dates.",

  // Pro-gated verdict/contact content, matching LuxurySpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "AO Reserve — the real contact",
      body:
        "For a private suite or one of the inquiry-only spaces, call AO Reserve directly on +61 1800 955 610 rather than relying only on the online enquiry form — premium sessions and finals-week suite availability narrow fast once the draw firms up. Ask specifically about suite size (12-person or 18-person) and whether Club 1905's chef takeover or the Kia Pavilion has any capacity left for your dates.",
    },
    {
      label: "Which tier is actually worth it",
      body:
        "A Show Court Reserved seat is the sharper buy at any point in the tournament if a great view is genuinely all you want — every AO Reserve tier runs at a real premium over a standard seat for the same match. Riverside Social is the honest entry point: same AU$599pp as every other dining room in Week 1, but it's the one built around the rooftop and river view rather than a chef's tasting menu. The Bistro is the pick if food is genuinely the point — a proper 3-course sit-down, not roving canapés, for barely more than the entry tier. Skip the step-up to Champions Rooftop or AO Glasshouse unless you're already committed to a Quarterfinal-onward session. Of the inquiry-only tier, Suites and Private Rooms — The Lounge are the two worth calling about first: both start below several of the online dining rooms despite being fully private. Club 1905 only makes sense as a season-long commitment (the same seat and table for all 27 sessions) — pricing it against a single session misreads what you're actually buying.",
    },
    {
      label: "A luxury day, sequenced",
      body:
        "Base at Pullman East Melbourne and request a precinct-facing room specifically — on a hospitality day you want the short walk over to Melbourne Park, not a tram connection to manage on top of everything else. Don't try to fit a full outside-court circuit in beforehand if you're booked into one of the dining rooms: arrive close to your beverage package's start time and let the extended, unhurried time in the room be the morning. The Rod Laver Arena dining rooms all sit inside the same 5-10 minute walking radius as the show courts, so there's no need to build in extra transit time — the one exception is The Gallery, which seats at John Cain Arena, a genuine walk away from the other four. Finals weekend is the one stretch where this sequencing matters most and the one where availability across every tier disappears first — book the package before locking in which day you'll actually attend, not after.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "corporate-hospitality-premium-suites" (hospitality)
