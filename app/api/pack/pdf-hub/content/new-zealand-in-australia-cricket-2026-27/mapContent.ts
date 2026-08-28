// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/MapSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const nzAustraliaMapSpokeContent = {
  intro:
    "Each of the four Test venues on this tour has its own real character, beyond simply being a cricket ground. Perth Stadium is the newest and most purpose-built; Adelaide Oval pairs cricket history with the city's own heritage skyline; the MCG is the largest and most institutional of the four; the SCG carries more than 140 years of the sport's own history inside its own walls.",

  venues: [
    { name: "Perth Stadium", body: "Opened 2018, the newest venue on this tour by a wide margin — built with its own train station integrated directly into the venue, genuinely walkable food and bar precincts inside the concourse, and a design that keeps every seat closer to the action than most modern stadiums manage." },
    { name: "Adelaide Oval", body: "The one ground on this tour where the setting is as much a part of the experience as the cricket — St Peter's Cathedral rises directly behind the northern end, and the heritage scoreboard remains in active use alongside modern digital screens." },
    { name: "The MCG", body: "The largest venue on the tour by capacity, and the institutional home of Australian cricket — the National Sports Museum sits inside the ground itself, worth building time around if you're there outside match hours." },
    { name: "The SCG", body: "The most historic ground on the tour, hosting Test cricket since 1882 — the heritage Members' Pavilion (1886) still stands, and the ground's own real character sits closer to a traditional English cricket ground than any of the other three, more modern venues." },
  ],

  accessibility: {
    label: "Facilities & accessibility",
    venues: [
      { name: "Perth Stadium", body: "450 wheelchair positions and 327 Enhanced Amenity seats — well above the minimum required. Priority access to the left of each gate, lifts at sections 103, 110, 126, 136, and 147, and 2 Changing Places facilities (behind sections 111 and 537). ACROD parking is genuinely limited — register online, opens 3 weeks before each game and closes 9am the Monday before." },
      { name: "Adelaide Oval", body: "275 wheelchair places plus 119 Easy Access seats, grouped across all levels. All three main gates (South, East, North) are step-free, with ramps near every stairway and lifts near every escalator. One accessible ticket window per entrance, with a hearing loop. Book via 1300 665 915 or Adelaide Oval's own access request form." },
      { name: "The MCG", body: "Accessible seating on Levels 1, 2, and 4 of the Olympic Stand, and Levels 1 and 2 of the Shane Warne (formerly Great Southern) Stand — check the MCG's own Accessibility Map before booking, since coverage differs stand to stand. A free mobility shuttle runs during events, and there's a Changing Places facility on-site. Pre-book via Ticketek's Accessible Seating Hotline, 1300 665 915." },
      { name: "The SCG", body: "Wheelchair and companion seating in grandstand bays ORLY 1, ORLY 5, and ORLY 9, plus concourse bays 29 and 30 in the Brewongle Stand. Enter via accessible Gate E, where a staff member directs you through to the O'Reilly lift. Book via Ticketek's Accessible Ticket Booking line, 1300 655 915." },
    ],
  },

  sourcesFooter:
    "Sources: each venue's official site (Perth Stadium, Adelaide Oval, MCG, SCG); cricket.com.au venue history pages; optusstadium.com.au Access and Inclusion Fact Sheet; adelaideoval.com.au Access Information; mcg.org.au Accessibility and Inclusion; sydneycricketground.com.au Accessibility.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "perth-stadium-series-opener" (perthStadium)
//   - "adelaide-oval-most-beautiful-ground" (adelaideOval)
//   - "mcg-boxing-day-test" (mcg)
//   - "scg-fourth-test-sydney-summer" (scg)
