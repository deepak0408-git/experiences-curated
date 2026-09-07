// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/HotelsSpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased.

export const frenchOpenHotelsSpokeContent = {
  intro:
    "Roland-Garros sits in the quiet 16th arrondissement, a part of Paris with genuinely few hotels this close to the venue — the real tradeoff most visitors face is between paying a premium to walk to the gates, or crossing the Seine to Boulogne-Billancourt for meaningfully lower rates and a short Métro ride instead.",

  nearTheVenue: {
    label: "Near the venue — Auteuil, 16th arrondissement",
    body:
      "The 16th arrondissement, and Auteuil specifically, is where the tournament's handful of walkable hotels sit — Hôtel Molitor at the luxury end (10-minute walk, see the Luxury Guide), plus a small stock of independent 3-star hotels on quiet residential streets around Porte d'Auteuil and Michel-Ange–Molitor. This is a genuine former village annexed into Paris in 1860 — Art Nouveau villas hidden behind gates, a twice-weekly market, a real neighborhood character most Roland-Garros visitors never get to see (see the full Day Trips guide) — but hotel stock here is genuinely small and sells out first.",
  },

  acrossTheSeine: {
    label: "Across the Seine — Boulogne-Billancourt",
    body:
      "Boulogne-Billancourt is a genuine, functioning Paris suburb directly across the Seine from the stadium's western edge — bakeries, markets, real restaurants, not an anonymous commuter district. Billancourt Métro station (Line 9) connects directly toward Porte d'Auteuil, the stop nearest the venue, and both real accommodation options here run meaningfully below what the 16th arrondissement charges.",
    // DB-derived: two experience cards rendered here (ibis, shortLet) — no
    // additional inline prose per hotel exists in this spoke file.
  },

  // Pro-gated verdict + booking-timing content, matching HotelsSpoke.tsx's
  // own {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd actually book",
      body:
        "For a genuine, dedicated Roland-Garros trip, Ibis Boulogne-Billancourt is the sharpest real booking at this price point — it's consistently well-rated across four independent review platforms, not just one flattering headline score, and the 4-minute drive to the venue with a direct Métro connection beats paying a real premium to be in the 16th arrondissement itself. Reserve Hôtel Molitor for when the whole trip is meant to be a splurge — its own iconic pool is worth the extra cost on its own terms, not just for the shorter walk.",
      // NOTE: source interpolates a live link to the "molitor" experience
      // (if present) into this paragraph via molitor.slug — not extracted
      // as separate static text since the surrounding sentence is the same
      // either way.
    },
    {
      label: "Booking timing",
      body:
        "Roland-Garros runs the same two weeks every late May and early June, with no shoulder-season discount to chase — book as soon as the following year's tournament dates are confirmed, not once your ballot result lands. The 16th arrondissement's small hotel stock fills first; Boulogne-Billancourt gives more breathing room but its own well-rated options still sell out for the tournament's second week and finals weekend.",
    },
    {
      label: "If a hotel isn't the plan — Airbnb and hostels",
      body:
        "Short-term rentals are a real option, but Paris's taxe de séjour works against an Airbnb at tournament-week prices in a way most visitors don't expect: unclassified furnished rentals are taxed at 5% of the per-person nightly rate (before the regional surcharge), capped at €15.93 per person per night, while hotels pay a fixed rate by star rating instead — €5.53 for a 3-star, €8.45 for a 4-star. Once a rental's per-person nightly price passes roughly €50, which tournament-week Boulogne-Billancourt and 16th arrondissement rates routinely do, an unclassified Airbnb becomes more taxed per night than a 4-star hotel room — a real cost the advertised nightly rate doesn't show until checkout. Every legal short-term rental must also display a 13-character registration number on its listing; a listing without one is operating outside Paris's rules, which is a real risk signal worth checking before booking, not just a compliance technicality.\n\nOn the budget end, Paris has a genuine hostel scene rather than just one or two options, though nothing sits directly beside the stadium the way the 16th arrondissement's hotels do. The 3 Ducks Eiffel Tower (6 Place Étienne Pernet, 15th arrondissement) is a real, currently operating hostel — the oldest private hostel in France — a short bus or one-transfer Métro ride from the Auteuil side of the venue via Félix Faure (Line 8). It's the right call if a kitchen, a bar, and dorm-bed pricing matter more than walking distance; check live availability directly on the hostel's own site or Hostelworld, since tournament-week beds go early and quoted off-season rates won't hold.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards (free tier, "Across the Seine —
//   Boulogne-Billancourt" section):
//   - "ibis-boulogne-billancourt-midrange-stay" (ibis)
//   - "boulogne-billancourt-short-let-budget-stay" (shortLet)
// - linkedExperiences lookup for "hotel-molitor-paris-luxury-stay" (molitor)
//   — referenced by name/link inline in the "Where we'd actually book"
//   verdict paragraph, no separate card on this spoke (its card lives in the
//   Luxury spoke).
