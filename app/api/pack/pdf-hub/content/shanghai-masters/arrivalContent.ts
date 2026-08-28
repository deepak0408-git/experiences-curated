// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/ArrivalSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.

export const shanghaiMastersArrivalSpokeContent = {
  intro:
    "Two separate arrivals matter for this trip: landing in Shanghai, and getting into Qizhong itself once you're there. Unlike a fully-reserved-seating event, Shanghai Masters sells a genuine Grounds Pass alongside numbered seats — so which gate you use and how early you show up both actually matter, not just which airport you land at.",

  airports: {
    label: "Which airport you'll land at",
    rows: [
      { label: "Pudong (PVG)", value: "Primary international hub, ~60% of Shanghai flights, ~30km from the city centre. Expect this if you're flying internationally direct into Shanghai." },
      { label: "Hongqiao (SHA)", value: "More domestic/regional East Asian flights, ~13km from the city centre. More convenient for onward city travel if you land here." },
    ],
  },

  venueEntry: {
    label: "Getting into the venue itself",
    body:
      "Will-call ticket collection is at Gate #2 — if you're picking up physical tickets rather than using a mobile ticket, build that into your timing. The tournament shuttle from Xinzhuang and Zhuanqiao metro stations terminates between Gates 1 and 2, so most fans arriving by public transit will naturally come in through that side of the 80-hectare complex regardless of which court they're headed to.",
  },

  arrivalStrategy: {
    label: "When to actually arrive",
    body:
      "A Grounds Pass has no reserved seat, so arriving early genuinely earns you better viewing at the outer courts and Court 17's practice sessions — this is the one part of Shanghai Masters where showing up early has a real payoff, unlike a fully-reserved event. If you're holding a numbered Grandstand or Center Court ticket, your seat is yours whenever you arrive, so the early-arrival advantage is about getting through Gate 1-2, browsing the wider complex, and settling in before your session — not about claiming a spot.",
  },

  honestGapNote: {
    label: "Gate-by-ticket-type mapping and opening times",
    body:
      "Unlike some Masters 1000 venues, the official site doesn't publish which specific entrance each ticket tier uses, or exact gate-opening times ahead of a session — we won't invent either. Check en.rolexshanghaimasters.com closer to the event, or contact the tournament directly, for confirmed details.",
  },

  sourcesFooter:
    "Sources: travelchinaguide.com, remitly.com, letstraveltochina.com (airport split and distances, cross-checked across 2 sources); 247tickets.com (Gate #2 will-call location). Verified 10 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "shanghai-maglev-airport-question" (maglev)
