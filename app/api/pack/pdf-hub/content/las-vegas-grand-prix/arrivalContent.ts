// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/ArrivalSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} gate anywhere in this
// file — entire spoke content is public/free. No `verdicts` field here
// (the closing "timing we'd actually plan" section is unconditional, not
// Pro-gated, in the current source).

export const lasVegasGpArrivalSpokeContent = {
  h1: "Real session times are confirmed — road closures are what actually sets your arrival window",
  eventName: "Las Vegas Grand Prix",

  intro:
    "Real session times are now confirmed: Practice 1 (4:30-5:30pm PT) and Practice 2 (8:00-9:00pm PT) run Thursday 19 Nov, Practice 3 (4:30-5:30pm PT) and Qualifying (8:00-9:00pm PT) run Friday 20 Nov, and the Race starts 8:00pm PT Saturday 21 Nov. Specific gate-opening times haven't been published separately — what actually determines how early you need to leave your hotel is the road-closure pattern: soft closures begin at 3pm and full closures at 5pm each day. Plan your arrival around beating the closure window at your specific entrance, well ahead of that day's first session.",

  whatToExpectTable: {
    label: "What to expect at entry",
    rows: [
      {
        title: "Security and ticket scanning",
        detail:
          "Arrive earlier than you think — security, ticket scanning, and crowd flow can add real time, and detours around road closures are normal for a street circuit, not a sign something's gone wrong.",
      },
      {
        title: "General Admission is single-zone",
        detail:
          "A GA ticket only grants access to its specific zone for that day — you can't move between zones on the same ticket, so know exactly which entrance you need before you arrive.",
      },
      {
        title: "Have everything on your phone",
        detail:
          "Save tickets, maps, and a meeting point with anyone you're traveling with before you leave your hotel — cell service can be patchy in dense crowds right at entry gates.",
      },
    ],
  },

  arrivalStrategyByTier: {
    label: "Arrival strategy actually differs by tier",
    rows: [
      {
        title: "Reserved grandstands (Main Grandstand, West Harmon, Turn 3)",
        detail:
          "Your seat is yours regardless of arrival time, so getting there early is about clearing security before the closer-to-session crush, not claiming ground. At Main Grandstand specifically, blocks PG1-103 and PG1-115 rows 32-40 sit under the Skybox overhang and lose the pit-lane sightline — every other row in those blocks is clear, so it's worth knowing before you're seated, not after.",
      },
      {
        title: "General Admission (Flamingo Zone, T-Mobile Zone at Sphere)",
        detail:
          "No reserved spot means arrival time genuinely determines your view — viewing platforms are first-come, first-served, and the best sightlines toward the Koval Straight/Turn 5G braking zone fill up fastest. Arrive well before your session starts, especially for Saturday's race.",
      },
    ],
  },

  appCallout: {
    label: "Use the official app for real-time routing",
    body:
      "The Las Vegas Grand Prix app shows real-time road openings and closures and builds a custom walking route from wherever you are to your specific ticketed zone — the most reliable way to know exactly when to leave and which entrance is actually open.",
  },

  // Card, generic <SpokeExperienceCard>, no inline copy beyond the card:
  // - "las-vegas-gp-flamingo-ga" (flamingoGA) — under label "What General
  //   Admission gets you"

  timingWeWouldPlan: {
    label: "The timing we'd actually plan around",
    body:
      "Build in real buffer before the 5pm full closure if you're not already on the Strip — once it hits, there's no driving around it, only walking. If your hotel sits close to your ticketed zone's entrance, leaving right as soft closures begin (3pm) gives the most predictable walk in before the heaviest crowds build. For Saturday's race specifically, treat the whole afternoon as arrival time, not just the hour before the session — this is the one day road closures start earliest and crowds peak hardest.",
  },

  sourcesFooter:
    "Sources: formula1.com 2026 session calendar, f1lasvegasgp.com official A-Z Guide (road closures, gate/zone entrances), f1lasvegasgp.com and tickets.formula1.com grandstand pages (block/row sightline detail).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "las-vegas-gp-flamingo-ga" (flamingoGA)
