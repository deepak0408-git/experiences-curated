// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/MapSpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased. This spoke is
// status="public" with no {isUnlocked && (...)} block — no verdicts array.

export const frenchOpenMapSpokeContent = {
  h1: "Three show courts, a botanical-garden court, and a museum inside the grounds",

  intro:
    "Stade Roland-Garros packs three show courts, more than a dozen outer courts, and a genuine museum into a compact site in the 16th arrondissement. What's less obvious from a broadcast feed is how each court has its own distinct character — this is the grounds-level guide to what's actually where.",

  siteFacts: {
    label: "Site facts",
    rows: [
      { label: "Address", value: "2 Avenue Gordon Bennett, 75016 Paris, France" },
      { label: "Court Philippe-Chatrier", value: "15,225 seats, red clay since 1928, retractable roof since 2020" },
      { label: "Court Suzanne-Lenglen", value: "10,068 seats, built 1994, retractable roof since 2020" },
      { label: "Court Simonne-Mathieu", value: "5,000 seats, opened 2019, wrapped in working greenhouses in the Jardin des Serres d'Auteuil" },
    ],
  },

  // Real venue map image — official Roland-Garros grounds map, uploaded to
  // R2. Real aspect-[1200/1867] (portrait, per ZoomableImage's
  // aspectClassName in the source), not a generic 4:3.
  groundsMapImage: "french-open-grounds-map-v2.jpg",
  groundsMapImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/french-open-grounds-map-v2.jpg",
  groundsMapCredit: "Credit: map-of-paris.com. Click the map to zoom in.",

  court14: {
    label: "Court 14 — the loudest room on the grounds",
    body:
      "Semi-sunken, 2,200 seats, inaugurated 2018, in the Fonds des Princes extension. French players actively want to be drawn here in the first week — the crowd is close, loud, and partisan in a way the bigger show courts rarely match. Outer-court seating is unreserved and first-come.",
  },

  watchingOuterCourtWell: {
    label: "Watching outer-court tennis well",
    body:
      "Check the daily order of play the evening before at rolandgarros.com — first-round matches at Courts 6, 7, 9, 12, and 13 regularly feature ranked professionals in front of crowds small enough to hear the players talking to themselves between points.",
  },

  foodAndFacilities: {
    label: "Food and facilities on-site",
    items: [
      {
        name: "Concessions across the grounds",
        body: "Bar des Mousquetaires, a main food court (croque-monsieur, galettes), and grocery-style stands near Suzanne-Lenglen, Court 6, and Fonds des Princes. See the full Where to Eat guide.",
      },
      {
        name: "Le Jardin des Chefs",
        body: "A chef-led culinary hub built into the Jardin des Serres d'Auteuil near Court Simonne-Mathieu — a 2026-specific initiative; confirm it recurs for 2027 closer to the tournament.",
      },
    ],
  },

  sourcesFooter: "Sources: rolandgarros.com, stade.rolandgarros.com.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "roland-garros-stadium-tour-tenniseum" (tenniseum)
