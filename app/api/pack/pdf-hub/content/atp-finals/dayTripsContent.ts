// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/DayTripsSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.

export const atpFinalsDayTripsSpokeContent = {
  intro:
    "The ATP Finals' round-robin schedule means you're not tied to the arena every single day of your trip — the group stage runs six days with two sessions daily, which leaves real room to build a day trip or a non-tennis day into a longer visit.",

  // Pro-gated verdict content, matching DayTripsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "How to fit Barolo into the tournament week",
      body:
        "Plan your Barolo day around a session you're comfortable missing entirely, not one you're hoping to catch on return — the roughly 1.5-hour drive each way, plus a genuine half-day in the region itself, doesn't leave realistic margin for an afternoon session on the same day. If your trip spans multiple group-stage days, pick the day with the players or matchup you're least attached to for the day trip, and protect your must-see sessions on either side of it.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "atp-finals-barolo-langhe-daytrip" (barolo)
//   - "atp-finals-juventus-museum" (juventusMuseum)
