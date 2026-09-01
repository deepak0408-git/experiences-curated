// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/GettingThereSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased. Source spoke status is "public" (no Pro gate on the main
// content) — the one Pro-gated block ("The route we'd actually plan") is
// captured under `verdicts` below, matching every other spoke's pattern.

export const lasVegasGpGettingThereSpokeContent = {
  h1: "The Strip closes to build the circuit — plan around that, not around traffic",
  eventName: "Las Vegas Grand Prix",

  intro:
    "The Las Vegas Grand Prix runs through the middle of the Strip, which means the roads you'd normally use to get around are the same roads that close to build the circuit. Soft closures begin at 3pm each day of race weekend — Thursday through Saturday — with full closures following at 5pm, staying in place into the early hours the next morning. Driving is actively discouraged during this window; once full closures are in effect, a car genuinely cannot get you where you need to go on the Strip.",

  transitOptionsTable: {
    label: "Your three real options",
    rows: [
      {
        title: "Walking",
        detail:
          "If you're staying anywhere on the Strip, walking is often the most predictable choice — you already know your route, and it avoids the crowd bottlenecks that build up around monorail platforms and rideshare zones right after sessions end.",
      },
      {
        title: "Las Vegas Monorail",
        detail:
          "Runs 24 hours during race weekend. The Flamingo/Caesars Palace and Horseshoe/Paris stations both drop you within a short walk of major circuit entry zones.",
      },
      {
        title: "Rideshare",
        detail:
          "Operates from designated pickup and drop-off points only — Virgin Hotels Las Vegas (closest to the start/finish straight and East Harmon Zone) and the Hughes Center (closest to T-Mobile Zone at Sphere). Both get genuinely busy right after a session ends.",
      },
    ],
  },

  monorailFareBox: {
    label: "Paying for the monorail",
    title: "Las Vegas Monorail",
    body:
      "Single ride from roughly US$6, tap-to-pay at station kiosks — no advance booking or transit card needed. Runs 24 hours during race weekend specifically, well past its normal operating hours.",
  },

  rideshareCallout: {
    label: "Rideshare — why it isn't always the faster call",
    body:
      "Rideshare fares surge significantly around session start and end times, and both designated pickup points (Virgin Hotels Las Vegas, Hughes Center) see genuine crowd surges the moment a session finishes — curbside pickup elsewhere on the Strip isn't available once closures are active. A 15-20 minute walk to your zone directly is often faster and cheaper than waiting out a rideshare queue at peak times, not just a fallback if the app fails you.",
  },

  appDownloadCallout: {
    label: "Download the official app before you land",
    body:
      "The official Las Vegas Grand Prix app shows real-time road openings and closures and can build a custom walking route from wherever you are to your specific ticketed zone — genuinely useful on a street circuit where the road you walked in on might be closed by the time you head back.",
  },

  // Pro-gated verdict content, matching GettingThereSpoke.tsx's own
  // {isUnlocked && (...)}-equivalent block (this spoke actually renders this
  // section unconditionally, outside any isUnlocked check, in the current
  // source — but per the shared pattern with other public spokes carrying
  // a "we'd actually plan" section, kept as a verdicts entry for the PDF's
  // free/public section since no gate wraps it here).
  verdicts: [],

  routeWeWouldPlan: {
    label: "The route we'd actually plan",
    body:
      "If your hotel sits between Virgin Hotels Las Vegas and the Hughes Center, note which one aligns with your ticketed zone before booking a rideshare — picking the wrong pickup point can mean a longer walk than heading to your zone directly. Don't plan to drive anywhere near the Strip during soft-closure hours (from 3pm) expecting to beat the full 5pm closure — cutting it close risks getting stuck on the wrong side of a barrier with no way through.",
  },

  sourcesFooter:
    "Sources: formula1.com official \"How to get to and from the Las Vegas Grand Prix\" article (closure timing, monorail, rideshare pickup points), f1lasvegasgp.com A-Z Guide.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card rendered via generic
//   <SpokeExperienceCard>:
//   - "las-vegas-gp-getting-around" (transit experience)
