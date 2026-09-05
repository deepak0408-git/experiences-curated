// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/GettingThereSpoke.tsx), for
// the Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased. This spoke is status="public" with no {isUnlocked && (...)}
// block — no verdicts array (same pattern as Abu Dhabi's GettingThere spoke).

export const usGpGettingThereSpokeContent = {
  intro:
    "Circuit of the Americas sits about 15 miles (24km) southeast of downtown Austin and roughly 12 miles from Austin-Bergstrom International Airport (AUS) — genuinely close on paper, and genuinely slow in practice once race weekend traffic sets in.",

  fromAirport: {
    label: "From the airport",
    body:
      "15-20 minutes in normal traffic — treat that as a floor, not an estimate, during the event itself.",
    facts: [
      { label: "Distance to circuit", value: "~12 miles, 15-20 min in normal traffic" },
      { label: "Rideshare (normal)", value: "~$25-40" },
      { label: "Taxi (normal)", value: "~$45-50" },
    ],
  },

  officialShuttle: {
    label: "The official shuttle",
    body:
      "The most reliable way in and out, running continuously from two pickup points — Downtown at Waterloo Park and the Travis County Expo Center — about 30 minutes with no traffic, well over an hour on race day itself. It's popular enough that seats sell out before race day, so book this in advance rather than deciding the morning of.",
  },

  rideshareOnRaceDay: {
    label: "Rideshare on race day",
    body:
      "COTA Blvd is restricted to permitted vehicles during the event, so Uber and Lyft pickup and drop-off happens from the McAngus lot — a genuine 20-30 minute walk from the main gates, not a curbside drop at the entrance. Post-race waits of 2-3 hours are standard, with surge pricing commonly hitting $150-300+ back to downtown.",
    facts: [
      { label: "Pickup point", value: "McAngus lot — 20-30 min walk from gates" },
      { label: "Post-race surge", value: "Commonly $150-300+, 2-3 hr wait" },
    ],
  },

  bestExitTacticCallout: {
    label: "The single best exit tactic",
    body:
      "The worst congestion window runs roughly 1-2 hours after the chequered flag. Leaving your seat about 30 minutes before the race actually ends, or deliberately staying on-site for 45 minutes after the crowd starts moving — food, fan shop, no rush — both beat the bulk of that window. Racing to be first out the gate is, by every account, the worst possible strategy.",
  },

  appsRow: {
    label: "Essential apps for the trip",
    items: [
      { name: "Uber or Lyft", body: "Both operate widely across Austin — genuinely useful for airport transfers and getting around the city, though remember the McAngus lot pickup point applies to both on race day." },
      { name: "Official F1 USA / COTA app", body: "Your ticket lives here for most grandstand tiers, and it's the fastest way to find food and beverage stalls across a circuit large enough that wandering to find something specific wastes real time. Install it before you travel." },
      { name: "CapMetro", body: "Austin's own transit app — useful for getting around downtown and South Congress even though it doesn't reach the circuit itself." },
    ],
  },

  sourcesFooter: "Sources: grandprixpal.com.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "us-gp-getting-to-cota" (gettingToCota)
