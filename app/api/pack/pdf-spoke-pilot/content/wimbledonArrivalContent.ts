// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/ArrivalSpoke.tsx), for the Full Pack PDF
// port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Note: ArrivalSpoke.tsx has NO {isUnlocked && (...)} Pro-gated block —
// status="public", the whole spoke is free. No `verdicts` field in this
// file for that reason (matches the source; not an omission).

export const wimbledonArrivalSpokeContent = {
  intro:
    "The Queue is one of Wimbledon's real, functioning traditions — an organised, friendly overnight line for day tickets, run by the club itself, not an informal scramble. How early you need to arrive depends entirely on what you're queuing for.",

  whenToArrive: {
    label: "When to arrive",
    centreCourt: {
      label: "For Centre Court",
      body: "Join by midday the day before and camp overnight. Queue cards are issued from mid-afternoon, one per person present — the whole party needs to be there to be counted.",
    },
    groundsPass: {
      label: "For a grounds pass",
      body: "Arriving by 5-6am on the morning is usually enough — the line moves steadily once gates open at 10:30am.",
    },
  },

  gatesOpenBox: {
    label: "Gates open at 10:30am daily",
    body: "Day tickets are released to queuers at 9:30am, ahead of the 10:30am gate opening. Bring layers, a waterproof, and something to sit on — the wait is real regardless of how well-organised the line is.",
  },

  sourcesFooter: "Source: wimbledon.com, AELTC published Queue guidance and gate times.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookup for a card rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "the-wimbledon-queue" ("The Wimbledon Queue") — needs live
//     experience data, not extracted here.
