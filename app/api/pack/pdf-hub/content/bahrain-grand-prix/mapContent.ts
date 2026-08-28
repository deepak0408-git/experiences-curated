// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/MapSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has status="public", no {isUnlocked && (...)} gate on
// this spoke — no `verdicts` field here, matches the source.

export const bahrainGpMapSpokeContent = {
  facilities: [
    {
      label: "The Mall",
      body:
        "Around 15 vendors, RM15-30 range, located between Main Grandstand's North and South wings.",
    },
    {
      label: "Welcome Centre",
      body: "Ticketing, ATM, Lost & Found, and a café.",
    },
    {
      label: "South Paddock",
      body: "Paddock Club, hospitality, medical room, toilets, prayer rooms.",
    },
    {
      label: "Prayer rooms & merchandise",
      body: "Located at Main Grandstand and K1.",
    },
  ],

  perimeterWalkNote: {
    label: "Perimeter walk",
    body: "Re-entry requires a re-tag — keep this in mind if you plan to leave and return.",
  },

  circuitMapImage: "bahrain-grand-prix-grandstand-map.jpg",

  externalGuideNote: {
    label: "2025 MotoGP spectator guide (reference only)",
    body:
      "A real but not-yet-2026-F1-confirmed reference document, linked for general circuit-layout orientation only.",
    url: "https://www.sepangcircuit.com/media/wysiwyg/pdf/MGP25_Spectator_Guide_v3.pdf",
  },

  // All 4 grandstand experience cards shown again here (mainGrandstand, k1,
  // grandstandF, hillstand) — same slugs as the Tickets spoke.
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "main-grandstand-sepang-start-finish" (mainGrandstand)
//   - "k1-grandstand-sepang-turn-1" (k1)
//   - "grandstand-f-sepang-panoramic" (grandstandF)
//   - "hill-stand-c2-sepang-general-admission" (hillstand)
