// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/DayTripsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.

export const shanghaiMastersDayTripsSpokeContent = {
  intro:
    "Shanghai itself has real sightseeing depth worth a spare day between sessions, and two genuine trips out of the city sit within a fast train ride — Hangzhou's West Lake and Suzhou's classical gardens are both feasible in a single day without rushing.",

  inCitySlugs: ["the-bund-shanghai-dusk", "yu-garden-old-city-shanghai", "french-concession-tianzifang-shanghai", "lujiazui-skyline-shanghai"],
  outOfCitySlugs: ["hangzhou-west-lake-day-trip", "suzhou-classical-gardens-day-trip"],

  // Pro-gated verdict content, matching DayTripsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "How we'd pair these",
      body:
        "The Bund and Yu Garden pair well in a single day — both sit in the older, walkable core of the city. French Concession and Lujiazui each deserve their own half-day given the walking involved. Of the two out-of-city trips, Suzhou is the faster round trip (as little as 21 minutes each way) if you only have time for one.",
    },
    {
      label: "The one that deserves its own full day",
      body:
        "Hangzhou is the pick if you can only give one destination a genuinely full day, not a rushed half. West Lake's Su Causeway, Leifeng Pagoda, and Lingyin Temple each reward real time on their own — a single day realistically only covers the causeway as your anchor plus one of the other two properly, not all three. Trying to also fit in a city sight or the tennis the same day means shortchanging one of them; give Hangzhou the full day it actually needs.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards (in-city): theBund, yuGarden,
//   frenchConcession, lujiazui — see inCitySlugs above
// - linkedExperiences lookups for cards (out-of-city): hangzhou, suzhou —
//   see outOfCitySlugs above
