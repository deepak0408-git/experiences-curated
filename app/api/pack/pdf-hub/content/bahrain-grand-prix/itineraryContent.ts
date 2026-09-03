// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/ItinerarySpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Session times confirmed 4 Sep 2026 via FIA-announced schedule.
//
// No experience-card lookups (.find(...)) in this source spoke — it's a
// day-by-day narrative table (ItineraryTable component), not card-driven.

export const bahrainGpItinerarySpokeContent = {
  sessionTimesNote: {
    label: "Confirmed session times",
    body:
      "FP1 12:30pm and FP2 4pm Friday, FP3 12:30pm and qualifying 4pm Saturday, race 3pm Sunday — all local time.",
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
