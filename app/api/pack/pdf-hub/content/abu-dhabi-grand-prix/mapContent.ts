// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/MapSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. This spoke
// is status="public" with no {isUnlocked && (...)} block — no verdicts.

export const abuDhabiGpMapSpokeContent = {
  intro:
    "Yas Marina Circuit, designed by Hermann Tilke and opened in 2009, made history immediately as the world's first-ever F1 twilight race venue — a daylight start transitioning into a fully floodlit finish, powered by a lighting installation of roughly 4,700 fixtures and a 600-million-lumen plan built in under 300 days.",

  // Real, founder-approved circuit map image — same file referenced by
  // TicketsSpoke.tsx. Hand-labeled by Claude 4 Sep 2026, verified against
  // the official abudhabi.gp/en/map-of-the-grandstands-21 layout.
  circuitMapImage: "abu-dhabi-grand-prix-grandstand-map.jpg",

  grandstandPositions: {
    label: "Where each grandstand actually sits",
    body:
      "Main Grandstand runs along the start/finish straight, directly across from the pit lane and garages — it's the one stand with a real sightline to the podium as well as the start and first-corner action. North Grandstand wraps the outside of Turn 5, the circuit's hairpin, covering the full entry, apex, and exit. West Grandstand sits at Turns 6-7, right where the first DRS zone ends — the circuit's main braking and overtaking zone. Marina Grandstand runs along the outside of the back straight between Turns 8 and 9, facing across the water to the infield section where the track curves around the marina itself (Turns 10 through 13). South Grandstand sits at Turn 9 — known as Marsa Corner — covering the braking zone into it. Together, the five stands ring almost the entire lap, so which one you pick really is a choice about what kind of racing you want in front of you, not just a price point.",
  },

  facilities: [
    { label: "Main Oasis", body: "The circuit's largest fan zone, next to the Main Grandstand — food, drink, and merchandise, and the natural landmark to orient around if you're new to the venue's layout." },
    { label: "On-site Medical Center", body: "Yas Marina Circuit runs its own Medical Center, with National Ambulance as the exclusive emergency care provider at the venue — genuine on-site first-aid infrastructure, not an off-site fallback." },
    { label: "Shuttle network", body: "The Circuit Circular Shuttle connects every major grandstand entrance; the Yas Courtesy Shuttle covers the rest of the island — both free, wheelchair-friendly, and included with any ticket." },
  ],

  accessibility: {
    label: "Accessibility — real, specific provisions",
    body:
      "The circuit offers step-free entry, wheelchair-friendly shuttles, accessible parking, and reserved seating throughout the venue, with particular reserved allocations in the Main and North grandstands. Dedicated tickets for visitors with reduced mobility are available on request — contact the circuit directly via WhatsApp (+971 800 927) or the call centre (800927 or +971 2 4979000) to arrange this ahead of your visit. Public transit to the circuit is genuinely accessible too — modern buses run priority seating and ramps, and taxis across Abu Dhabi are equipped for wheelchairs and mobility scooters.",
    limitation:
      "One honest limitation: guided track tours of the circuit itself (separate from race-weekend grandstand access) aren't suitable for visitors with mobility impairments or wheelchair users — this applies specifically to behind-the-scenes track tours, not to grandstand or general race-weekend attendance, which the provisions above genuinely cover.",
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "yas-marina-circuit-facilities" (facilities)
