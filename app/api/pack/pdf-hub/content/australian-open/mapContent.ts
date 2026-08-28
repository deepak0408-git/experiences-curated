// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/MapSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const australianOpenMapSpokeContent = {
  intro:
    "Melbourne Park is compact by Grand Slam standards — every major arena sits within a 5-10 minute walk of every other, so a day spent moving between show courts and the outside courts doesn't cost much time in transit.",

  siteLayout: {
    label: "Site layout",
    rows: [
      { label: "Rod Laver Arena", value: "The main show court since 1988, retractable roof — the tournament's marquee venue" },
      { label: "Margaret Court Arena", value: "Second show court, its own retractable roof, own separate ticket" },
      { label: "John Cain Arena", value: "Third roofed venue, general admission grounds access on some tickets, own reserved seating on others" },
      { label: "Show Court 3", value: "Included with a Rod Laver Arena reserved seat, alongside every outside court" },
      { label: "Outside Courts 3-15", value: "No reserved seating — walk-up only, included with any Ground Pass or higher ticket" },
    ],
  },

  circuitMapImage: "australian-open-venue-map.png",
  mapImageCredit: "Map: austadiums.com",

  facilities: [
    { label: "Food and drink", body: "Grand Slam Oval and the food village between Rod Laver and Margaret Court Arena carry real Melbourne restaurant names, not just stadium catering." },
    { label: "Ticket-tier entry", body: "A Rod Laver Arena reserved ticket also covers John Cain Arena, Show Court 3, and every outside court on the same day — but not Margaret Court Arena, which needs its own separate ticket regardless of what else you're holding." },
  ],

  outsideCourtsNote: {
    label: "A first-timer's guide to the outside courts",
    body: "Numbered courts 3-15 are the cheapest, most flexible way to see close-up tennis at the Open — no reserved seat, walk up and sit wherever there's room.",
  },

  accessibility: {
    label: "Facilities & accessibility",
    items: [
      { label: "Step-free throughout the precinct", body: "Melbourne Park is built for it — ramps, lifts, wide entry gates, and priority access lanes at every main entrance. Rod Laver, Margaret Court, and John Cain Arenas all have dedicated wheelchair seating, ease-of-access seating for limited mobility, enhanced-vision seating, and seating near hearing loops." },
      { label: "Accessible toilets", body: "Located near Doors 3, 13, 16, and 20 at Rod Laver Arena, plus inside Railyards and the Upper Deck — and throughout the wider grounds, not only near accessible-seating entrances." },
      { label: "Sensory rooms", body: "Dedicated sensory rooms at AO Ballpark, John Cain Arena, Margaret Court Arena, and Rod Laver Arena, plus complimentary sensory kits and communication boards at information points." },
      { label: "Hearing loops and live captions", body: "Hearing loops are fitted in key venues, and live captions run on screens around Melbourne Park during the tournament." },
      { label: "Booking accessible tickets and a Companion Card seat", body: "Accessible tickets can only be bought through the AO Accessibility Line on 1300 308 999 (Mon-Sun, 9am-5pm AEDT) or by emailing accessibletickets@ticketmaster.com.au — not through general sale. A current Companion Card is required for a Companion Card ticket." },
    ],
  },

  sourcesFooter: "Source: ausopen.com/accessibility, Ticketmaster Australia accessible ticketing.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "rod-laver-arena-inside-main-court" (rodLaver)
//   - "margaret-court-john-cain-arenas" (otherArenas)
