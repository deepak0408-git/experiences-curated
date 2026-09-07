// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/MapSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. status=
// "public" — the "what we'd actually check before buying" block is
// Pro-gated in source, kept as a single verdict entry.
//
// The venue map image itself (R2-hosted PNG) is NOT reproduced here — the
// PDF route/document component decides separately whether to embed it;
// this file only carries prose.

export const mexicoCityGpMapSpokeContent = {
  h1: "A circuit built inside a public sports park, threaded through a baseball stadium",

  intro:
    "The Autódromo Hermanos Rodríguez opened in 1959 inside the Magdalena Mixhuca public sports complex, and it still sits there today — which is part of why this circuit doesn't feel like a purpose-built racing facility the way Silverstone or Spa do. When F1 returned in 2015 after a redesign, the track's final sector was cut straight through Foro Sol, a baseball stadium built on the site in the 1990s — nowhere else on the calendar does a Grand Prix run through a venue built for a completely different sport.",

  grandstandPositions: {
    label: "Where each zone actually sits",
    body:
      "The Blue Zone (Grandstands 3-6) lines the run from the start/finish straight through turns 1-3, where cars brake from over 300kph for the first corner — this is where the real racing and overtaking happens. Grandstand 12 (Yellow Zone) covers the slower, technical turns 4-6, with a partial roof over the top rows — one of the only sections offering real shade. Foro Sol (Grandstands 14 and 15, Grey and Brown Zones) forms the stadium section at turns 12-15, where the track threads between what was once a baseball diamond — slower corners, but the loudest, most atmospheric part of the circuit, and the site of the podium ceremony. General admission areas and most remaining grandstands are fully uncovered.",
  },

  facilities: [
    { label: "The Fan Zone", body: "Included with any race ticket, no separate purchase — driver and team principal appearances, F1 simulators, a Pit Stop Challenge, and cultural programming that leans harder into local mariachi and folk-dance performances than most other Grands Prix." },
    { label: "Food & concessions", body: "Spread across temporary stalls and food trucks in different zones rather than one central food court — expect a genuine range from quick street-food-style options to more considered offerings, consistent with the city's wider food culture." },
  ],

  gettingBetweenZones: {
    label: "Getting between zones",
    body:
      "Because the circuit sits inside a working public sports complex rather than a facility built solely for racing, large parts of the race-weekend infrastructure — stages, some food areas, fan zone structures — are temporary builds rather than permanent fixtures. Follow the Metro station matched to your specific gate (see the Getting There guide) to reach your zone directly, rather than crossing the venue on foot from a different entrance.",
  },

  // Pro-gated verdict content — matching MapSpoke.tsx's {isUnlocked} block
  // exactly.
  verdicts: [
    {
      label: "What we'd actually check before buying",
      body:
        "If racing action is the priority, confirm your grandstand sits in the Blue Zone (turns 1-3) before buying — the seating chart alone doesn't always make this obvious. If you specifically want the Foro Sol atmosphere, understand you're trading racing quality for crowd energy, not getting both; neither Foro Sol stand gets you close to the pit lane or paddock, so if garage proximity matters, look at Grandstands 1 and 2 on the front straight instead.",
    },
  ],

  sourcesFooter: "Map: Wikimedia Commons, WL2392, CC BY 4.0.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups:
//   - "mexico-city-gp-where-to-sit-" (whereToSit)
//   - "mexico-city-gp-fan-zone-" (fanZone)
