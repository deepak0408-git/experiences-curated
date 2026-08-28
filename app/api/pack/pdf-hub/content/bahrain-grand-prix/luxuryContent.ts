// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/LuxurySpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: this spoke's status is "teaser" in the source (not "public") — the
// intro/package prose below is the free/teaser content; the booking
// contacts section is Pro-gated ({isUnlocked && (...)}), matching every
// other spoke's pattern.

export const bahrainGpLuxurySpokeContent = {
  intro:
    "Luxury at a relocated, first-in-9-years Sepang race isn't as built-out as at an established calendar stop — there's no second F1 hospitality tier confirmed below Paddock Club yet. What genuinely exists: Sepang's own Corporate Suites, real private chauffeur options built for the circuit's distance from KL, a real luxury skyline venue in the city, and Paddock Club itself as the one confirmed hospitality product above a standard ticket.",

  corporateSuites: {
    label: "Corporate Suites — the one other hospitality option at the circuit",
    body:
      "Sepang's Main Grandstand includes 18 air-conditioned Corporate Suites (sofa seating, 2 restrooms, 4 TVs, a pantry area) — a real, standing circuit facility, not an F1-specific hospitality product like Paddock Club, and its availability and 2026 F1 pricing aren't published.",
  },

  privateTransit: {
    label: "Private transit — Kuala Lumpur to Sepang",
    body:
      "Sepang sits roughly 45-60km south of KL and 10-15km from KLIA, far enough that a private transfer is a genuine luxury upgrade over public transport on race days, not just a convenience. Real KL/Sepang-based operators run fleets from executive sedans through Alphard/Vellfire premium MPVs.",
  },

  skylineVenue: {
    label: "A real skyline venue in KL",
    body:
      "A confirmed Petronas Twin Towers view from a rooftop infinity pool and lounge — a genuine luxury venue in the city, not an official F1 tie-in.",
  },

  luxuryHotelsNote: {
    label: "Luxury hotels",
    body:
      "The Hotels guide already covers Mandarin Oriental, Banyan Tree, and JW Marriott as the real KL luxury-tier stays, plus Sama-Sama at the airport.",
    links: [
      { label: "Mandarin Oriental", url: "https://www.booking.com/hotel/my/mandarin-oriental-kuala-lumpur.en-gb.html" },
      { label: "Banyan Tree", url: "https://www.booking.com/hotel/my/banyan-tree-kuala-lumpur-kuala-lumpur.en-gb.html" },
      { label: "JW Marriott", url: "https://www.marriott.com/en-us/hotels/kuldt-jw-marriott-hotel-kuala-lumpur/overview/" },
    ],
    // "Sama-Sama full guide" is a live experience-card link, not a static
    // URL — see DB-derived data note below.
  },

  paddockClub: {
    label: "The single biggest luxury decision: F1 Paddock Club",
    intro:
      "Paddock Club is F1's own hospitality product, run the same way at every race — and it's back at Sepang for the first time since 2017.",
    included: [
      { label: "All-day dining", detail: "Chef stations, tasting counters, seasonal menus — no extra charges" },
      { label: "Open bar", detail: "Champagne, fine wines, premium spirits, plus soft drinks" },
      { label: "Pit lane walks", detail: "Scheduled daily — observe teams prepping cars up close" },
      { label: "Podium & garage access", detail: "Team garage views plus podium celebration access" },
      { label: "Support race access", detail: "F2, F3, Porsche Supercup where applicable, plus a guided paddock tour" },
      { label: "Extras", detail: "Official programmes, pit radio scanner, F1 merchandise" },
    ],
    priceNote:
      "Confirmed 3-day Paddock Club pricing for Sepang 2026 starts at roughly US$6,188 per person.",
    closingLine:
      "A grandstand sells you one great view of the racing. Paddock Club sells you the whole day around it — the view is just one part of a much bigger product.",
  },

  // Pro-gated content — matching LuxurySpoke.tsx's own {isUnlocked && (...)}
  // block. This is booking-contact detail, not a "which we'd pick" verdict
  // in the usual shape, but functions the same way (Pro-only tactical info).
  verdicts: [
    {
      label: "Booking Corporate Suites and private transit",
      body:
        "For Corporate Suites, don't wait for pricing to appear online — it likely never will for a single race weekend. Call +60 3 8778 2200 or email hafiz.mahidin@sepangcircuit.com directly (for groups of 10 or more, that's the right contact; smaller groups can use the same line or the enquiry form at sepangcircuit.com/enquiry). Office hours are 9:30am-5:30pm Monday-Friday, closed weekends and public holidays. State Formula 1 2026 (2-4 Oct) explicitly, and ask what suite capacity and pricing look like this early — a relocated, first-in-9-years race means the circuit itself may not have finalised F1-specific suite packages until closer to the date. For private transit, LimoTaxi is genuinely based at KLIA, Sepang, Selangor. Real published from-prices: Economy Sedan from RM100, Premium MPV from RM180, Luxury MPV from RM250, Family Van from RM350. Book via WhatsApp or phone on +60 11-5711 4879 — request an Alphard or Vellfire specifically if space and comfort matter more than the published from-price. Confirm your exact pickup/drop-off points when you message.",
    },
    {
      label: "Booking the KL skyline venue for race weekend",
      body:
        "SkyBar at Traders Hotel Kuala Lumpur is the real venue — book your table through Traders Hotel's own reservations channel ahead of race weekend rather than walking in. If you're staying at Banyan Tree instead, its own Vertigo sky bar (53rd floor) is the more convenient choice.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups:
//   - "f1-paddock-club" (paddockClub) — the main hospitality experience card
//   - "sama-sama-hotel" (samaSama) — "Sama-Sama full guide" link
// - paddockClub?.practicalInfo?.bookingMethod and
//   paddockClub?.practicalInfo?.hours are rendered conditionally under the
//   Pro-gated block ("Book only through official channels" / "Access &
//   timing") — live DB fields, not extracted here.
