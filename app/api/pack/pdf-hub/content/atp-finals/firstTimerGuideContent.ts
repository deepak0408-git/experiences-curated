// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/atp-finals/FirstTimerGuideSpoke.tsx), for
// the Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const atpFinalsFirstTimerGuideSpokeContent = {
  intro:
    "If you've never been to a season-ending finale before, the format and rhythm are genuinely different from a Grand Slam or a regular tour stop — here's the orientation that makes the rest of the week make sense.",

  format: {
    label: "The format, in one paragraph",
    body:
      "Eight singles players and eight doubles teams — the best of the whole season, no qualifying rounds — split into two groups of four, playing round-robin (everyone plays everyone in their group). That runs 15-20 November, two sessions a day. Semifinals are 21 November, the final is 22 November. Every session pairs a doubles match with a singles match, so you're never buying a ticket for just one discipline.",
  },

  essentialApps: {
    label: "Essential apps",
    items: [
      { label: "TO Move (GTT)", body: "The essential transit app — buy and validate GTT bus/tram/metro tickets, see real-time vehicle locations. Install this before you land; it's the app you'll use most on this trip." },
      { label: "FreeNow", body: "Turin's real ride-hailing app — connects you with licensed local taxis at regulated, quoted fares. Standard Uber (UberX) doesn't operate in Italy the way it does elsewhere; Uber here is a premium chauffeur service, not the budget option. FreeNow is the actual equivalent." },
      { label: "Tennis TV / ATP official app", body: "For live scores and schedule updates across every court and match, the official ATP app is the most reliable source — worth having during the round-robin days when tracking which players have already qualified for the semifinals matters." },
    ],
  },

  practicalEssentials: {
    label: "Practical essentials",
    body:
      "Turin runs on the euro, standard EU electrical sockets. English is widely spoken in tourist-facing venues and among younger Turin residents, less reliably so with older generations or in smaller neighborhood spots — a few basic Italian phrases go a long way. Tipping isn't obligatory the way it is in the US; rounding up or leaving small change is standard.",
  },

  gateRules: {
    label: "What's not allowed through the gates",
    body:
      "Suitcases, trolleys, and backpacks — only small handbags or school-style bags up to 40cm are allowed. Outside food and drink, cans, glass or plastic bottles, alcohol, spray cans (including sunscreen and insect repellent), stadium horns, musical instruments, weapons, laser pointers, selfie sticks, tripods, drones, professional cameras and camcorders, tents, sleeping bags, and umbrellas with pointed tips are all prohibited. Compact power banks (max 10cm) and small foldable umbrellas are fine.",
  },

  accessibility: {
    label: "Accessibility",
    body:
      "Inalpi Arena has dedicated wheelchair seating and companion seats on the ground floor around the arena's perimeter with direct external access, elevator access to every seating level, and accessible restrooms on multiple floors. Disabled parking is available and clearly marked on Corso Galileo Ferraris and Corso IV Novembre. Accessible seating for this specific tournament is arranged through the event organiser rather than the venue directly — contact the ticket office ahead of your visit to confirm arrangements.",
  },

  cityBeyondTennis: {
    label: "The city, not just the tennis",
    body:
      "Turin is a genuinely distinct city — the first capital of unified Italy, birthplace of vermouth and gianduja chocolate, home to one of the world's great Egyptian collections. If this is your first trip here, budget real time for the city itself, not just the arena.",
  },

  sourcesFooter:
    "Sources: inalpiarena.it/en/regole (prohibited items and bag policy), turinwhynot.com and the venue's own published accessibility information (wheelchair seating and access).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards (5 sights):
//   - "atp-finals-mole-antonelliana" (moleAntonelliana)
//   - "atp-finals-museo-egizio" (museoEgizio)
//   - "atp-finals-royal-palace" (royalPalace)
//   - "atp-finals-turin-cathedral" (turinCathedral)
//   - "atp-finals-piazza-san-carlo" (piazzaSanCarlo)
