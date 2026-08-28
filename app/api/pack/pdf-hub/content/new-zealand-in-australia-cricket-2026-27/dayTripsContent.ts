// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/DayTripsSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not
// paraphrased. 8 real day trips across 4 cities — the deepest Day Trips
// content of any event built so far.

export const nzAustraliaDayTripsSpokeContent = {
  intro:
    "This tour's five-week span leaves real room for exactly this kind of travel — a wine-region day outside each city, plus a genuine city day for Melbourne and Sydney specifically, one wildlife experience that spans two of the four legs, and one full 12-13 hour day away from the cricket entirely on the Great Ocean Road. None of this needs to be booked as a single package; the tour's own gaps between Tests leave the time for it — though the Great Ocean Road specifically needs a whole day sacrificed, not a spare afternoon.",

  experienceSlugs: [
    "fremantle-day-trip-from-perth",
    "mclaren-vale-adelaide-wine-daytrip",
    "yarra-valley-melbourne-wine-daytrip",
    "blue-mountains-day-trip-from-sydney",
    "melbourne-laneways-coffee-city-day",
    "sydney-harbour-beaches-city-day",
    "wildlife-down-under-featherdale-phillip-island",
    "great-ocean-road-twelve-apostles-daytrip",
  ],

  // Pro-gated verdict content, matching DayTripsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Our verdict — one per leg, here's which one",
      body:
        "You genuinely can't do all eight if you're attending all four Tests — the gaps between legs are real but not endless once you account for domestic flights. Realistically pick one day trip per leg, not two. Perth: Fremantle — it's the only real option on this leg, and it earns its place: walkable, a genuine change of pace from the CBD, and doesn't compete against anything else worth doing here. Adelaide: McLaren Vale — same logic as Fremantle, the only real contender on this leg, and a proper half-day wine-region trip rather than a rushed add-on. Melbourne: The Yarra Valley over the Great Ocean Road — it's the one genuinely relaxing option in a leg that's otherwise dominated by Boxing Day crowds and logistics. Save the Great Ocean Road for a future trip unless you're willing to sacrifice a full day of play — it's a 12-13 hour round trip, not a half-day option. Sydney: The Blue Mountains — Sydney's leg has the most natural slack of all four, and the Blue Mountains is the one experience on this whole list you can't approximate anywhere else on the trip.",
    },
  ],

  cityStayAlternative: {
    label: "If you'd rather stay in the city — top 3 in Melbourne and Sydney",
    intro:
      "Not everyone wants a day outside the city — both Melbourne and Sydney genuinely reward a day spent in town instead, and here's what actually earns a spot if that's your call.",
    melbourne: [
      "Royal Botanic Gardens Victoria — free entry, open 7:30am-7:30pm in summer, right on the Yarra and a short walk or tram ride (route 8) from the CBD",
      "Queen Victoria Market for lunch — a working market since the 1870s (skip Mondays and Wednesday daytime, both closed — check current hours)",
      "The City Circle Tram — a free heritage tram looping the CBD and Docklands every 12 minutes, 9:30am-5pm, with audio commentary past Melbourne Museum, Parliament House, and Federation Square — a good way to link the other two stops without walking the whole day",
    ],
    sydney: [
      "Circular Quay — the Opera House and Harbour Bridge up close, plus the Royal Botanic Garden and The Rocks",
      "The Manly ferry from Circular Quay, on a standard Opal fare, for the harbour views and Manly's own beach",
      "Or the Bondi to Coogee Coastal Walk — 6km, 2-3 hours, five beaches in sequence (pick this or Manly, not both — each is a full day on its own)",
    ],
  },
};
