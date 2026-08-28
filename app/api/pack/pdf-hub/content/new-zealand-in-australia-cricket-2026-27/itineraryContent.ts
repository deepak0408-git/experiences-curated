// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/ItinerarySpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not
// paraphrased. TOUR_SCHEDULE is static hardcoded content in the source,
// extracted verbatim.

export const nzAustraliaItinerarySpokeContent = {
  intro:
    "This is a genuinely large tour to plan around — four Tests, four cities, roughly 4,300km of internal travel, and real gaps between legs that are long enough to matter but not so long that a rough plan isn't worth having before you go.",

  schedule: {
    label: "The real schedule",
    rows: [
      { date: "9-13 Dec", type: "1st Test", venue: "Perth Stadium", city: "Perth" },
      { date: "17-21 Dec", type: "2nd Test", venue: "Adelaide Oval", city: "Adelaide" },
      { date: "26-30 Dec", type: "3rd Test (Boxing Day)", venue: "MCG", city: "Melbourne" },
      { date: "4-8 Jan", type: "4th Test", venue: "SCG", city: "Sydney" },
    ],
  },

  gaps: {
    label: "The shape of the gaps",
    items: [
      { label: "Perth → Adelaide", detail: "4 days between the end of the 1st Test and the start of the 2nd — enough for a genuine McLaren Vale day trip and a single travel day, not much more." },
      { label: "Adelaide → Melbourne", detail: "5 days — the longest gap of the tour, and the one with the most real room for a day trip plus a proper rest day before Boxing Day's crowds and intensity." },
      { label: "Melbourne → Sydney", detail: "5 days — Boxing Day Test ends 30 December, the 4th Test starts 4 January, spanning New Year's itself. A genuinely different kind of gap, shaped as much by the calendar as the cricket." },
    ],
  },

  // Pro-gated verdict + 11-day itinerary content, matching ItinerarySpoke.tsx's
  // own {isUnlocked && (...)} block. Real, confirmed content (schedule is
  // the official 2026-27 tour schedule).
  verdicts: [
    {
      label: "Which legs we'd actually attend",
      body:
        "If you can only do one leg, Melbourne's Boxing Day Test is the real answer — biggest atmosphere, easiest to build a short standalone trip around, real December weather. If you can do two, Melbourne and Sydney back to back is the pairing most fans actually choose — the gap between them spans New Year's itself, which turns a travel gap into a genuine trip highlight rather than dead time.",
    },
  ],

  elevenDayItinerary: {
    label: "A real 11-day itinerary — Melbourne and Sydney, 25 Dec–4 Jan",
    intro:
      "Not everyone is doing all four Tests — the Boxing Day and Fourth Test legs, back to back with New Year's in between, are the two most fans actually build a trip around. This is the shape that works for exactly that trip, arriving in time for Christmas in Melbourne and leaving after the Sydney Test gets underway.",
    blocks: [
      {
        title: "Melbourne — Days 1-6",
        rows: [
          { day: "Day 1 (25 Dec)", activity: "Arrive Melbourne, settle in, Christmas Day — most restaurants close early or run a set Christmas menu, so book ahead or plan for a quiet night in." },
          { day: "Days 2-3 (26-27 Dec)", activity: "3rd Test (Boxing Day) at the MCG — build in real arrival margin for Day 1's 70,000-90,000+ crowd." },
          { day: "Days 4-6 (28-30 Dec)", activity: "Melbourne sights — Royal Botanic Gardens Victoria, Queen Victoria Market, and the free City Circle Tram. Melbourne's laneway coffee and street art scene also fits well here if that's more your pace." },
        ],
      },
      {
        title: "Sydney — Days 7-11",
        rows: [
          { day: "Day 7 (31 Dec)", activity: "Domestic flight Melbourne → Sydney (one of the world's busiest routes, frequent departures). New Year's Eve under the Harbour Bridge — claim a vantage point early: Mrs Macquarie's Point, Observatory Hill, or Dawes Point are the regularly recommended free spots, and they fill from mid-afternoon." },
          { day: "Day 8 (1 Jan)", activity: "Rest day — a late, easy morning after NYE, no fixed plan needed." },
          { day: "Day 9 (2 Jan)", activity: "Sydney city day — Circular Quay, the Opera House and Harbour Bridge up close, the Manly ferry or the Bondi to Coogee Coastal Walk." },
          { day: "Day 10 (3 Jan)", activity: "Blue Mountains day trip." },
          { day: "Day 11 (4 Jan)", activity: "4th Test begins at the SCG. The Test runs 4-8 Jan, so plan your departure around however many of the 5 days you're staying for." },
        ],
      },
    ],
  },

  sourcesFooter:
    "Source: cricket.com.au official 2026-27 schedule. NYE vantage points: sydneynewyearseve.com and sydneytourism.org (Mrs Macquarie's Point, Observatory Hill, Dawes Point).",
};
