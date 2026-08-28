// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/GettingThereSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.

export const atpFinalsGettingThereSpokeContent = {
  intro:
    "Turin's transit map looks deceptively simple — a single metro line — which trips up first-time visitors who assume it covers everything. Inalpi Arena isn't on the metro at all, so getting there means tram, and knowing that before you land saves working it out with luggage on arrival.",

  airportAndTram:
    "Turin Airport (Caselle) has its own SFM train station, running every 30 minutes to Porta Susa (about 30 minutes), where you connect onward via metro or tram. Buy the Integrato B combined ticket (~€4.20) to cover both legs in one purchase. Sebastopoli tram stop (lines 4 and 10) is the real route to Inalpi Arena — about a 5-minute walk from the arena's general admission entrance, with tram 4 running direct from Porta Nuova station.",

  aroundTheCity: {
    label: "Around the city",
    body:
      "A single GTT ticket (~€2) covers 90 minutes across bus, tram, and metro. The free TO Move app handles purchase, validation, and real-time vehicle tracking — worth installing before you land. If you're moving around for more than a day, a 48 or 72-hour Special Tour Ticket is better value than single fares.",
  },

  sessionDaysNote: {
    label: "On session days",
    body:
      "Expect trams 4 and 10 to be genuinely busier than usual on session days — build extra time in before an evening session, when match-goers and regular commuters overlap.",
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "atp-finals-getting-to-inalpi-arena" (tramGuide)
//   - "atp-finals-airport-to-city" (airportGuide)
