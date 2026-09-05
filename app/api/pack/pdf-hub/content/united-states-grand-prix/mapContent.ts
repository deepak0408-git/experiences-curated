// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/MapSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. This spoke
// is status="public" with no {isUnlocked && (...)} block — no verdicts,
// same pattern as Abu Dhabi's Map spoke.

export const usGpMapSpokeContent = {
  h1: "A 3.4-mile circuit, four ticketed viewing areas",

  intro:
    "Circuit of the Americas opened in 2012 as the first purpose-built F1 circuit in the United States in a generation — a 3.4-mile, 20-turn layout with the steepest elevation change of any circuit on the calendar, the 133-foot climb into Turn 1.",

  // Real venue map image — uploaded 5 Sep 2026 from "Images/US GP - Austin
  // Map.png", the official COTA grandstand map with numbered turns (1-19)
  // and grandstand zone labels. Real 2000x1307 aspect ratio (source uses
  // aspect-[2000/1307], not a generic 4:3).
  circuitMapImage: "united-states-grand-prix-venue-map.png",
  circuitMapImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/united-states-grand-prix-venue-map.png",

  grandstandPositions: {
    label: "Where the grandstands actually sit",
    body:
      "Main Grandstand runs along the start-finish straight opposite the pit garages — the one seat that covers the grid, the pit stops, and the podium ceremony in a single sightline, though only three corners of the lap are actually visible from it. Turn 1 \"Big Red\" sits at the base of the circuit's signature 133-ft climb into a blind hairpin — the most dramatic single corner on the property, and consistently one of the first grandstands to sell out. Turn 15's stadium section puts five corners (12 through 15, plus part of the back straight) in one sightline from a single grandstand, genuinely unusual for a modern circuit. General Admission isn't fixed to one spot at all — GA zones ring multiple sections of the circuit, including around Turn 1 and Turn 6, so ticket holders can move between vantage points across the day rather than committing to a single view.",
  },

  facilities: [
    {
      label: "Grand Plaza",
      body: "The main entrance and fan-zone hub, with the COTA Culinary Experience's food villages, merchandise, and permanent restrooms — the natural landmark to orient around if you're new to the venue.",
    },
    {
      label: "On-site Medical Center and first aid",
      body: "Permanent first-aid stations sit in the Grand Plaza, the Main Grandstand, and the Paddock Medical Center. In an emergency, notify the nearest staff member or text COTA directly at 69050 with your location and situation — genuine on-site infrastructure, not an off-site fallback.",
    },
    {
      label: "Cashless, everywhere",
      body: "COTA is a fully cashless venue — card or mobile payment only at every food, drink, and merchandise stand. The official app is the fastest way to locate specific food stalls and restrooms once you're inside, since the circuit's footprint is large enough that wandering wastes real time.",
    },
  ],

  accessibility: {
    label: "Accessibility — real, specific provisions",
    body:
      "COTA offers accessible parking (request ADA parking at the time of purchase, with a state-issued placard or plate), ADA-compliant ramps and elevators throughout the facility, an accessible shuttle to and from entrances, and mobility-scooter rentals. For race weekend specifically, accessible seating is available in the Main Grandstand, Turn 12, and Turn 15 — Turn 15 in particular has both stair and ramp access, standard-sized seats with backs, and dedicated wheeled-device spaces on its ADA platform. Permanent accessible restrooms sit in the Main Grandstand, Grand Plaza, and Turn 1, with additional ADA-accessible port-a-potties placed throughout the grounds during the event itself.",
    additional:
      "The venue's ADA Task Force has also added sensory rooms in the Grand Plaza — a genuine, specific accommodation beyond the standard mobility provisions. For accessibility questions or to arrange accommodations ahead of your visit, contact COTA directly rather than assuming a walk-up solution will exist on race day.",
  },

  sourcesFooter: "Sources: circuitoftheamericas.com (venue policies, ADA accessibility).",
};

// DB-derived data NOT extracted here — none required for card lookups; this
// spoke renders no linkedExperiences card (unlike Abu Dhabi's Map spoke,
// which links a "facilities" experience — US GP's version has no
// equivalent SpokeExperienceCard call in the source file).
