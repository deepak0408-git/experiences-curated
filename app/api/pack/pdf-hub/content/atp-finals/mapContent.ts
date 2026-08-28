// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/MapSpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const atpFinalsMapSpokeContent = {
  intro:
    "Inalpi Arena isn't just the seating bowl — the tournament runs a real, distinct set of spaces around it, and knowing where things actually are before you arrive means less time spent finding facilities and more time watching tennis. It's the same building that hosted ice hockey at the 2006 Winter Olympics, originally built as Palasport Olimpico — Inalpi Arena is its current sponsor name, and you'll see both used interchangeably by ticket resellers and local sources.",

  siteLayout: {
    label: "Site layout",
    items: [
      { label: "Inalpi Arena — the main venue", body: "183 metres long, 100 metres wide, 4 levels — two above ground, two below, descending 7.5m to court level. General spectators use the north gates on Piazzale Grande Torino; corporate hospitality and media use the south gates on Via Filadelfia 82 — genuinely separate entrances on opposite sides of the building. Each of the arena's four seating sectors also has its own dedicated gate, which keeps queues split rather than funnelling everyone through one door. Gates open a maximum of 2 hours before the first match." },
      { label: "Fan Village", body: "9,500sqm on Piazzale Grande Torino, right next to the arena, split into three zones: Partners Court (sponsor activations), Racquetland (pickleball, mini padel, mini beach tennis, and an eSports \"Simulation Hub\"), and the Food Court, which also hosts the eSeries Finals and a large screen for live entertainment. Entry is ticketed separately from the tennis, roughly €15-30 per session — it isn't a free walk-in add-on to a match ticket." },
    ],
  },

  facilities: {
    label: "Facilities inside the arena",
    items: [
      { label: "Food, drink, and luggage", body: "A Food & Merchandising area sits on the walkway outside the arena, plus a ground-level food court with fast food, pizza, and sushi. All catering runs through CAMST Group, which uses paper or reusable cups rather than individual bottles as a stated sustainability policy. Luggage and helmet deposits are available at both the north gates (Piazzale Grande Torino) and south gates (Via Filadelfia) — useful if you're heading straight from the airport or a day trip." },
      { label: "Accessibility", body: "Accessible seating runs the full ground-floor perimeter with direct outside access — no stairs. Booking for accessible seats is handled by a dedicated service the event organiser chooses, which varies event to event, so confirm arrangements with the ticket office ahead of your visit rather than assuming a standing venue policy. There's no on-site parking, but public street parking nearby includes designated disability spaces." },
    ],
  },

  reEntryNote: {
    label: "Re-entry between sessions",
    body:
      "If you've bought a day/night double ticket, you can wait in the Food & Merchandising area between sessions and re-enter for the night session with your ticket's QR code re-scanned — a genuine, confirmed policy, not a workaround. What isn't confirmed is whether you can step out mid-session and return on the same ticket; the published policy covers the gap between sessions specifically, not a mid-match break, so don't assume you can leave and come back once a session's underway.",
  },

  circuitMapImage: "atp-finals-inalpi-arena-sector-map.jpg",
  mapImageCaption:
    "Sector map via Archistadia, a third-party Italian stadium-guide site — not an official tournament or venue publication. No official seating map is published on nittoatpfinals.com or inalpiarena.it as of this writing; check the official ticketing site's own seat-selection tool for the most current layout when you buy.",

  sustainabilityNote: {
    label: "Sustainability certified",
    body:
      "Inalpi Arena holds UNI EN ISO 20121:2012 certification for event sustainability management — a signal of how professionally the venue is run day to day, beyond just the tournament week.",
  },

  sourcesFooter:
    "Sources: nittoatpfinals.com (venue overview, Fan Village, prices), inalpiarena.it (facilities, accessibility, bag policy), archistadia.it (sector map). Verified 7 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "atp-finals-practice-courts" (practiceCourts)
