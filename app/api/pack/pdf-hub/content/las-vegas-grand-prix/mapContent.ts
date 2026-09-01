// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/MapSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} gate anywhere in this
// file — entire spoke content is public/free. No `verdicts` field here.
//
// This spoke's "Turn by turn" section is an interactive image overlay
// (TRACK_LABELS positioned as % over a circuit-layout image) — the PDF
// obviously can't replicate the image overlay itself, so the same
// turn-by-turn textual facts (real street/zone names per corner cluster)
// are extracted below as a plain data list instead.

export const lasVegasGpMapSpokeContent = {
  h1: "A 3.85-mile circuit built through the city, not around it",
  eventName: "Las Vegas Grand Prix",

  intro:
    "The Las Vegas Strip Circuit is a 3.85-mile, 17-turn street circuit starting and finishing at Grand Prix Plaza — a 39-acre, 300,000-square-foot pit and paddock complex on the corner of Harmon Avenue and Koval Lane. The circuit splits into named zones: East Harmon (start/finish, Main Grandstand), West Harmon (final corner, top-speed straight), Koval (Turn 3, DRS zone), Flamingo (Koval Straight GA), and T-Mobile Zone beneath the Sphere.",

  // "The landmarks the circuit runs past" — 2 experience cards, generic
  // <SpokeExperienceCard>, no inline copy beyond the card itself:
  // - "las-vegas-gp-fountains-sphere" (fountainsSphere)
  // - "las-vegas-gp-strip-casinos" (casinos)

  facilities: [
    {
      label: "Grand Prix Plaza",
      body:
        "The permanent pit/paddock complex at the circuit's start/finish, 4400 Koval Ln. Outside race week it runs as a seasonal public attraction (F1 DRIVE karting, F1 X theater, F1 HUB retail and lounge, no ticket needed for the HUB) — public operations pause each year ahead of race-week construction, so check current hours before visiting off-season.",
    },
    {
      label: "Zone connectivity",
      body:
        "East Harmon, West Harmon, and Koval Zones connect on foot, giving grandstand ticket holders wider access to fan activations and the Heineken Silver Stage. General Admission zones (Flamingo, T-Mobile) are locked to their own single zone.",
    },
    {
      label: "Water refill stations",
      body:
        "15 free refill stations are placed across every F1-controlled fan zone — bring a reusable bottle, or buy one on-site (plastic/silicone containers up to 24oz can also be brought in empty).",
    },
    {
      label: "First aid",
      body:
        "Multiple first-aid stations sit throughout the venue rather than at one central point — check the event map or official app for the nearest one to your zone.",
    },
    {
      label: "Food and beverage",
      body:
        "Available for purchase in every zone — GA zones sell casual on-site vendor food, while hospitality tiers include full catering. The event runs entirely cashless.",
    },
  ],

  // "Turn by turn" — real textual data extracted from the TRACK_LABELS
  // positions in the source (the interactive image overlay itself cannot
  // be replicated in a static PDF, so these are pulled as a plain list).
  turnByTurn: [
    { zone: "East Harmon Zone", turns: "Turns 1-4" },
    { zone: "Koval Lane", turns: "Turns 4-5" },
    { zone: "Westchester Ln", turns: "Turn 6" },
    { zone: "Sphere chicane", turns: "Turns 7-9" },
    { zone: "Sands Ave", turns: "Turns 9-12" },
    { zone: "The Strip", turns: "Turns 12-14" },
    { zone: "East Harmon Ave", turns: "Turns 14-17" },
  ],
  turnByTurnCaption:
    "The 2023 track layout, unchanged since the circuit opened. Use it for orientation, not precise navigation. Credit: Hazim Fikri A., CC BY-SA 4.0, via Wikimedia Commons.",

  zoneStrategy: {
    label: "How to use the zones to your advantage",
    rows: [
      {
        title: "Reserved grandstand tickets (East Harmon, West Harmon, Koval)",
        detail:
          "These three zones connect on foot, so a Main Grandstand, West Harmon, or Turn 3 ticket gives you wider access to fan activations and the Heineken Silver Stage across the weekend — don't treat your grandstand as the only place worth being between sessions.",
      },
      {
        title: "Flamingo Zone GA — locked to one zone",
        detail:
          "Confirm this is genuinely your zone before arrival — a Flamingo ticket doesn't let you wander into T-Mobile Zone or any grandstand zone, and there's no way to upgrade or switch once you're inside. The trade-off: standing-room access to the Koval Straight/Turn 5G braking zone, the cheapest real racing view on the circuit.",
      },
      {
        title: "T-Mobile Zone at Sphere — its own self-contained draw",
        detail:
          "Also single-zone-locked, but the Sphere backdrop and its own nightly concert stage make it less of a compromise than a typical GA zone — worth choosing on its own merits, not just as the cheaper option.",
      },
    ],
  },

  circuitMapImage:
    "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/las-vegas-grand-prix-circuit-layout.jpg",

  sourcesFooter:
    "Sources: f1lasvegasgp.com official A-Z Guide (water refill, first aid), gpdestinations.com and oversteer48.com (zone layout, turn-by-turn street/landmark detail), formula1.com (circuit facts and figures, DRS zones), en.wikipedia.org (circuit specifications).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "las-vegas-gp-fountains-sphere" (fountainsSphere)
//   - "las-vegas-gp-strip-casinos" (casinos)
