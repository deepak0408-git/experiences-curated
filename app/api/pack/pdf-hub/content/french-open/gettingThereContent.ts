// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/GettingThereSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased. This spoke is status="public" with no {isUnlocked && (...)}
// block — no verdicts array (same pattern as US GP's GettingThere spoke).

export const frenchOpenGettingThereSpokeContent = {
  intro:
    "Stade Roland-Garros sits in the 16th arrondissement at the southern edge of the Bois de Boulogne. The Métro gets you there directly on one line for almost every starting point in Paris — below is the real route, plus taxi, driving, and app guidance for match days specifically.",

  metroRoute: {
    label: "The fastest real route — by Métro",
    body:
      "Porte d'Auteuil (Métro Line 9) is the closest stop to the main grounds, a 10-minute walk from the entrance gates. Porte de Saint-Cloud (Line 9) and Michel-Ange–Molitor (Lines 9 and 10) are both realistic 15-20 minute walk alternatives when Porte d'Auteuil gets jammed with match-day crowds — genuinely common in the hour either side of gates opening. RATP runs the whole network; a weekly Navigo Découverte pass (around €32.40 plus a one-off €5 card fee) covers unlimited Métro, bus, and RER travel across all zones and is the best value for a multi-day stay.",
    facts: [
      { label: "Fastest route", value: "Métro Line 9 to Porte d'Auteuil (10-min walk to the gates)" },
    ],
  },

  taxiRideshare: {
    label: "Taxi / rideshare",
    body:
      "A taxi or Uber into the 16th arrondissement is genuinely slower and pricier than the Métro during match hours — the streets around the stadium see real congestion in the hour either side of each day's first and last sessions. Worth it late in the evening after a night session, when Métro frequency drops, or if you're travelling with young children or heavy bags — otherwise Line 9 is the better call.",
  },

  drivingParking: {
    label: "Driving & parking",
    body:
      "Driving is the least recommended option — central Paris traffic, limited match-day parking directly around the venue, and the same congestion that slows taxis all make this genuinely harder than the Métro for almost everyone. If you do drive, book any official on-site or nearby parking well ahead through the official Roland-Garros site rather than expecting to find something on the day.",
  },

  apps: {
    label: "The apps worth having on your phone",
    body:
      "Citymapper or the official RATP app for real-time Métro/RER journey planning — both cover live disruption, which matters on a high-traffic tournament day. Uber or Bolt both operate normally in Paris for the taxi/rideshare option above, no tourist-eligibility restriction on either.",
  },

  sourcesFooter: "Sources: RATP (ratp.fr), Île-de-France Mobilités (Navigo pass pricing).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "roland-garros-travel-official-packages" (rgTravel)
// - destinationBand.localTravelNote — rendered only if present, own
//   "Getting around, cheaply" callout box.
