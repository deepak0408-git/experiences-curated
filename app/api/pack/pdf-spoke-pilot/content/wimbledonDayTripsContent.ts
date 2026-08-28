// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/DayTripsSpoke.tsx), for the Full Pack PDF
// port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Same shape as the Cost pilot (wimbledonCostContent.ts) — one module per
// event/spoke, prose keyed by section, verdicts kept as a separate
// Pro-gated array matching DayTripsSpoke.tsx's own {isUnlocked && (...)}
// block.

export const wimbledonDayTripsSpokeContent = {
  intro:
    "With the Championships running two full weeks, there's real room to build a genuine day away from SW19 into a longer trip — either a proper outward day trip to Windsor and Eton, or a shorter rest day inside London itself.",

  windsorEton: {
    label: "Windsor & Eton — a real day out",
    body:
      "Direct South Western Railway trains run from London Waterloo to Windsor & Eton Riverside in under an hour — the same terminus you're already using for the 21-minute Wimbledon train (see the Getting There guide), so no need to switch bases for the day. Windsor Castle and Eton sit five minutes apart on foot across Windsor Bridge — a realistic single day covering both.",
    crossLink: "See the full Getting There guide.",
  },

  restDay: {
    label: "Or a rest day without leaving London",
    body: "For a shorter break that doesn't need a full day committed to travel, London itself is right there — a short train ride from the grounds.",
  },

  sourcesFooter: "Sources: rct.uk (Royal Collection Trust — Windsor Castle hours and pricing), South Western Railway published timetables.",

  // Pro-gated verdict content — only included in Full Pack mode, matching
  // DayTripsSpoke.tsx's own {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "When to take it",
      body:
        "Early-round weekdays (Tuesday through Thursday of the first week) are the easiest days to give up — the corporate groups clear out and a grounds pass covers everything that matters on the days you are on-site, so missing one mid-week day costs the least, whether you spend it in Windsor or on a shorter London rest day. Avoid pulling either around Middle Saturday or finals weekend, when the tournament's best atmosphere is concentrated into a handful of specific days.",
    },
    {
      label: "Fitting Windsor into the Fortnight",
      body:
        "Book Windsor Castle in advance via rct.uk for both the cheaper rate and a guaranteed entry slot — especially if your chosen day falls during the Fortnight, when demand from both tournament visitors and regular tourism can overlap. Plan to leave Waterloo by mid-morning: the castle plus Eton's High Street is a genuine full day, and there's no realistic way to fit an afternoon session back at SW19 on the same day.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookups for cards rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "windsor-castle-long-walk" ("Windsor Castle & The Long Walk" —
//     shared with BMW PGA Championship's pack per the spoke's own header
//     comment) — needs live experience data, not extracted here.
//   - "eton-across-river-windsor" ("Eton — Across the River from
//     Windsor" — also shared with BMW PGA Championship's pack) — needs
//     live experience data, not extracted here.
//   - "london-rest-day" ("The Rest Day", in-London) — needs live
//     experience data, not extracted here.
//   - "brixton-village-market-row" ("Brixton Village & Market Row") —
//     needs live experience data, not extracted here.
