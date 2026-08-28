// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/MapSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const singaporeGpMapSpokeContent = {
  intro:
    "Knowing where your grandstand sits on the lap matters, but so does knowing where to find a toilet, a meal, a prayer room, or first aid once you're actually inside the circuit — a genuinely different question from \"which stand shows me what.\" Marina Bay Street Circuit splits into four zones plus a restricted Paddock Zone; some tickets grant entry to all four, others cover just one.",

  zones: {
    label: "The four zones",
    items: [
      { label: "Zone 1", body: "The pit straight side: the Pits, the Paddock, the Singapore Flyer, and several of the best-known grandstands (Turn 1, Turn 2, Super Pit). Its own F1 Village runs merchandise stalls, bars, food and drink outlets, and activity stations." },
      { label: "Zone 2", body: "Runs along Republic Boulevard past Marina Bay Sands, dominated visually by the Singapore Flyer, home to the Republic and Promenade grandstands." },
      { label: "Zone 3 — transit only", body: "A connecting corridor along Nicoll Highway and the Esplanade, not a viewing area or ticketed zone in its own right — used to move between Zone 2 and Zone 4." },
      { label: "Zone 4", body: "The largest zone, accessible by every ticket type including Zone 4 Walkabout. Home to the Padang Stage, the Stamford and Padang grandstands, and its own F1 Village with merchandise shops and food stalls." },
    ],
  },

  facilities: {
    label: "Circuit facilities",
    items: [
      { label: "Esplanade Mall", body: "Sits between Zone 1 and Zone 4 and is genuinely underused simply because most visitors don't know it's there. Real toilets, not portable ones, a 7-Eleven for quick supplies, and a water refill station right outside — worth the detour if you're moving between the two zones anyway." },
      { label: "Water refill stations", body: "Free refill points are placed throughout the circuit, not just at Esplanade Mall — bring a reusable bottle rather than relying on buying water once inside, genuinely useful given Singapore's heat hazard designation." },
      { label: "Prayer rooms", body: "No dedicated musollah inside the Circuit Park itself is confirmed — the nearest real options are outside the venue at Suntec City (Tower 3, Level 3, behind a white door across from the lift at Lobby Q) and Marina Square (Basement 1, behind carpark lot 67 in the green zone), both a short walk from Zone 2/3." },
      { label: "First aid and merchandise", body: "First-aid stations sit throughout the venue rather than at one central point — ask any circuit staff or check wayfinding signage near your grandstand for the nearest one. Merchandise stalls run inside both F1 Villages (Zone 1 and Zone 4), not just one." },
    ],
  },

  wayfindingNote: {
    label: "Wayfinding on the day",
    body:
      "Wayfinding signs and information booths sit next to most entry gates. The official Singapore GP app is worth downloading before you arrive, useful beyond tickets for checking which viewing platforms have big screens in sightline and for real-time information across the weekend.",
  },

  circuitMapImage: "singapore-grand-prix-circuit-layout.jpg",
  mapImageCaption:
    "The current 2023+ track layout (unchanged for 2026) — Turns 16-19 were removed in 2023 to create the long back straight down Raffles Avenue. Use it for orientation, not precise navigation.",

  sourcesFooter:
    "Sources: official Singapore GP Circuit Park Map (singaporegp.sg), singaporegp.sg fan zones page, fastway1.com (Zone 1 vs Zone 4), girleatworld.net (Esplanade Mall facilities), halalzilla.com and thesmartlocal.com (prayer room locations). Verified 4 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "singapore-gp-turn1-grandstand" (turn1)
//   - "singapore-gp-stamford-grandstand" (stamford)
//   - "singapore-gp-padang-grandstand" (padang)
//   - "singapore-gp-zone4-walkabout" (walkabout)
//   - "singapore-gp-f1-village" (f1Village)
