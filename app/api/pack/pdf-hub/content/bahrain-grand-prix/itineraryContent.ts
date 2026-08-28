// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/ItinerarySpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Real open question flagged in the source: day vs. night race is
// unconfirmed for 2026. Sepang has no permanent floodlights and hosted
// 1999-2017 in daylight, but 2026 reporting is mixed — the spoke explicitly
// says it will update the moment F1 confirms. The day-by-day shape below
// holds regardless of that outcome. Carry this uncertainty note into the
// PDF verbatim — do not resolve it one way or the other.
//
// No experience-card lookups (.find(...)) in this source spoke — it's a
// day-by-day narrative table (ItineraryTable component), not card-driven.

export const bahrainGpItinerarySpokeContent = {
  dayNightUncertaintyNote: {
    label: "Day or night race? Still unconfirmed",
    body:
      "Sepang has no permanent floodlights and hosted races 1999-2017 in daylight, but 2026 reporting on race timing is mixed. We'll update this the moment F1 confirms — the day-by-day shape below holds regardless.",
  },

  days: [
    {
      label: "Thursday — Arrival",
      summary: "Arrival day. Petronas Twin Towers visit.",
    },
    {
      label: "Friday — Practice",
      summary: "Practice sessions 1 & 2, plus a Batu Caves half-day.",
    },
    {
      label: "Saturday — Qualifying",
      summary: "Qualifying, plus a Putrajaya morning.",
    },
    {
      label: "Sunday — Race Day",
      summary: "Race day.",
    },
    {
      label: "Monday — Optional",
      summary: "Optional full day at Genting Highlands.",
    },
  ],

  // Full hour-by-hour tables for all 5 days are Pro-gated in the source
  // (ItineraryTable component with time/location/activity rows) — matches
  // TicketsSpoke's own {isUnlocked && (...)} pattern. The PDF route should
  // render the day-by-day shape above as the free/public content and only
  // include the hour-by-hour detail under Pro-gating, consistent with how
  // the web spoke gates it.
};
