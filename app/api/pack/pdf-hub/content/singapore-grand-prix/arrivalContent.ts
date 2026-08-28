// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/ArrivalSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Gate/zone/MRT mapping sourced directly from the official Singapore GP
// Circuit Park Map, confirmed current — GATES is static hardcoded content
// in the source, extracted verbatim.

export const singaporeGpArrivalSpokeContent = {
  intro:
    "Eight named gates ring the circuit — 3A and 3B share the Stamford name, which is why some guides say \"nine\" — each tied to a specific zone and MRT station, not interchangeable. Your recommended gate is printed on the back of your ticket; check it rather than guessing from whichever entrance looks closest on a map, since a Zone 1 ticket at a Zone 4 gate means walking the long way around, not a quick fix.",

  gates: {
    label: "Every gate, by zone and MRT",
    rows: [
      { name: "Gate 1 — Republic Blvd", landmark: "The Wharf, Zone 1 side", mrt: "Nicoll Highway (CC5)" },
      { name: "Gate 2 — Temasek Ave", landmark: "Millenia Walk, Zone 2 side", mrt: "Promenade (CC4/DT15)" },
      { name: "Gate 3A / 3B — Stamford", landmark: "Swissôtel The Stamford, Civilian War Memorial, Zone 4 side", mrt: "City Hall (EW13/NS25) or Esplanade (CC3)" },
      { name: "Gate 4 — Empress", landmark: "Asian Civilisations Museum, Zone 4 side", mrt: "Raffles Place (EW14/NS26)" },
      { name: "Gate 5 — Fullerton", landmark: "One Fullerton, The Fullerton Hotel", mrt: "Raffles Place (EW14/NS26)" },
      { name: "Gate 6 — Jubilee", landmark: "Esplanade Park", mrt: "Esplanade (CC3) or City Hall (EW13/NS25)" },
      { name: "Gate 7 — Marina Square", landmark: "PARKROYAL Collection Marina Bay, Zone 2 side", mrt: "Promenade (CC4/DT15)" },
      { name: "Gate 8 — Helix", landmark: "ArtScience Museum, Bayfront side", mrt: "Bayfront (CE1/DT16)" },
    ],
  },

  sessionTiming: {
    label: "When to actually arrive, by session",
    body:
      "2026 is a Sprint weekend — Friday: Practice 1, 4:30-5:30pm, then Sprint Qualifying, 8:30-9:14pm. Saturday: the Sprint race, 5-6pm, then Qualifying, 9-10pm. Sunday: the Grand Prix itself, 8pm. Arrive 60-90 minutes before whichever session you're there for — gates typically open a few hours ahead of the day's first session, but exact 2026 gate-opening times aren't published yet, so build in the buffer rather than cutting it close on an unconfirmed number.",
  },

  arrivalStrategyByStand: [
    { label: "Reserved grandstands (Turn 1, Stamford, and most named stands)", body: "Your seat is yours regardless of arrival time, so the 60-90 minute window is really about clearing security without the closer-to-session-time crush and having time in the Fan Zone, not claiming ground." },
    { label: "Padang Grandstand", body: "Its real draw is proximity to the Padang Stage, not the racing view — if you're also going for the concert, arrive with enough buffer to do both without rushing between the two." },
    { label: "Zone 4 Walkabout (general admission)", body: "No reserved seat means arrival time genuinely determines your view — get to a viewing platform early if a specific sightline (or being close for the Padang Stage set after) matters to you, rather than taking whatever's left once the zone fills up." },
  ],

  securityTip: {
    label: "Getting through security faster",
    body:
      "Most gates have an express lane for anyone entering without a bag — bags get searched, so travelling light genuinely speeds up entry. One clear plastic bottle of water or soft drink, 600ml or under, is the only outside drink allowed through; everything else gets left behind or confiscated.",
  },

  // Pro-gated content, matching ArrivalSpoke.tsx's own {isUnlocked && (...)}
  // block.
  verdicts: [
    {
      label: "Leaving your seat mid-session",
      body:
        "At Turn 1, Stamford, and every other reserved grandstand, your seat is yours for the whole session regardless of when you step out, so a food or bathroom break doesn't cost you your view. Padang is the same for the seat itself, but factor in walking time back from Padang Stage if you left for the concert. Zone 4 Walkabout is different: there's no reserved return to your exact spot, so treat a mid-session break as a real trade-off, bring water and snacks in with you rather than planning to step out and back.",
    },
  ],

  sourcesFooter:
    "Sources: official Singapore GP Circuit Park Map (singaporegp.sg, gate/zone/MRT data), formula1.com 2026 session calendar, singaporegp.sg prohibited items page (600ml bottle rule). Verified 3 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "singapore-gp-first-timer-orientation" (orientation)
//   - "singapore-gp-turn1-grandstand" (turn1)
//   - "singapore-gp-stamford-grandstand" (stamford)
//   - "singapore-gp-padang-grandstand" (padang)
//   - "singapore-gp-zone4-walkabout" (walkabout)
//   - "singapore-gp-f1-village" (f1Village)
