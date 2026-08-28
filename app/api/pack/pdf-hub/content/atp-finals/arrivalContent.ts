// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/ArrivalSpoke.tsx), for the Full Pack +
// Travel Brief PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has no `verdicts`-style {isUnlocked && (...)} content
// block beyond what's captured below — the arrival guidance here is all
// free/public in the source.

export const atpFinalsArrivalSpokeContent = {
  intro:
    "Arrival strategy here is genuinely simpler than at most sports events, and it's worth saying why: every ATP Finals ticket, from Tribuna Galleria up to Premium Hospitality, is a fully reserved seat — there's no general-admission tier, no unreserved block to stake out, and no weather-exposed embankment to claim ground on. Your seat is yours whenever you arrive. What actually matters is picking the right entrance and not cutting your arrival too close on session days.",

  twoEntrances: {
    label: "Two entrances — check which one is yours",
    body:
      "Standard match tickets (Tribuna Galleria, Tribuna Platea, and the tier below Premium Hospitality) use the north gates on Piazzale Grande Torino — the same side as the Fan Village, so arriving with some time to spare gives you the Play Garden or food court before your session rather than a walk-straight-to-your-seat arrival. Premium Hospitality guests (Smash, Ace, ATP No. 1 Club) enter through separate south gates on Corso Sebastopoli — a genuinely different side of the building, not just a different queue at the same door. At 183 metres long, walking around to the wrong entrance is a real, time-costing mistake, so confirm which gate your ticket type uses before you arrive, not once you're on the wrong side.",
  },

  arrivalTiming: {
    label: "When to actually arrive",
    body:
      "Since every seat is reserved, there's no arrival-time penalty on where you sit — the real reason to arrive early is everything around the match, not the match itself. Every session pairs a doubles match with a singles match, so arriving in time for the doubles (rather than timing your arrival to the singles start) means you don't miss real tennis while you're still finding your seat. On session days, build extra time into your tram journey specifically — trams 4 and 10 run noticeably busier as match-goers and regular commuters overlap.",
  },

  gateOpeningNote: {
    label: "Gate-opening times",
    body:
      "Exact gate-opening times ahead of each session aren't published by the tournament yet — we won't invent a specific hour. Check nittoatpfinals.com closer to the event for confirmed times.",
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "atp-finals-inalpi-arena" (inalpiArena)
