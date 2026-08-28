// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/ArrivalSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const australianOpenArrivalSpokeContent = {
  intro:
    "How early you should arrive at Melbourne Park depends entirely on which ticket you're holding — a reserved seat means your spot is yours whenever you arrive, but a Ground Pass has no assigned seating anywhere, so the earlier you're through the gates, the better your access to the outside courts.",

  groundPassNote: {
    label: "Ground Pass — arrive early, it genuinely matters",
    body:
      "Gates typically open around 10am during the day session. Outside courts fill up gradually through the morning — by early afternoon on a weekend, standing room is common at the more popular courts. Arriving close to gate-opening is the one part of an Australian Open visit where showing up early has a real, direct payoff: closer viewing, more courts seen before crowds build, and a better shot at seeing a higher-ranked player warming up before their session.",
  },

  reservedSeatNote: {
    label: "Reserved seat — arrive on your own schedule",
    body:
      "A Grandstand, Show Court Reserved, or Hospitality ticket holds your seat regardless of arrival time — the early-arrival advantage here is about getting settled, browsing the wider precinct, and finding your gate before your session starts, not about claiming a spot. Still worth building in real margin, since Melbourne Park is a large complex and walking to the wrong entrance costs genuine time.",
  },

  gateOpeningNote: {
    label: "Exact gate-opening times aren't published yet",
    body:
      "The 2027 tournament's exact daily gate-opening times haven't been published as of this writing — based on the pattern in recent years, expect gates to open roughly 1-2 hours before the day session's first match. Confirm exact times via ausopen.com closer to the tournament.",
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "outside-courts-grounds-pass-strategy" (outsideCourts)
