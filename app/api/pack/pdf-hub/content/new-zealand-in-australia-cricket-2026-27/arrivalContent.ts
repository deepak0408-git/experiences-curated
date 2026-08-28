// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/ArrivalSpoke.tsx),
// for the Full Pack + Travel Brief PDF build. Prose half only, hand-copied
// not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const nzAustraliaArrivalSpokeContent = {
  intro:
    "General Admission at any of the four grounds means unreserved seating on the day — arriving early genuinely earns you a better spot, the same way it does at any Test venue. What changes ground to ground is how much that actually matters: Perth Stadium's own dedicated train station removes most of the arrival friction other grounds have, while the MCG on Boxing Day is genuinely one of the highest-attendance single days in world cricket and needs real margin built in.",

  boxingDayNote: {
    label: "Boxing Day at the MCG is a different scale of arrival",
    body:
      "The MCG's own Boxing Day Test regularly draws crowds among the largest single-day cricket attendances anywhere in the world. If you're on a General Admission ticket for this specific day, treat arrival timing with real seriousness — get to the ground meaningfully earlier than you would for any other Test on this tour, since both the transport network and the gates themselves are handling a genuinely different volume of people than a standard Test day at any of the other three grounds.",
  },

  gateOpeningNote: {
    label: "Exact gate-opening times aren't published yet",
    body:
      "Cricket Australia hasn't published session start times or gate-opening times for this specific 2026-27 series as of this writing — we won't invent them. Expect gates to open roughly 1-2 hours before the scheduled first-session start, in line with standard CA Test match practice, and confirm exact times via cricket.com.au closer to each Test.",
  },

  sourcesFooter:
    "Sources: cricket.com.au (standard CA Test-match arrival practice); each venue's own transit network (Transperth, Adelaide Metro, PTV, Opal Travel).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "perth-stadium-series-opener" (perthStadium)
//   - "adelaide-oval-most-beautiful-ground" (adelaideOval)
//   - "mcg-boxing-day-test" (mcg)
//   - "scg-fourth-test-sydney-summer" (scg)
