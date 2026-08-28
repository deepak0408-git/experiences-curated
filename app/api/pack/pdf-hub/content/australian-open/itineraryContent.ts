// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/ItinerarySpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Real, confirmed 2027 structure (qualifying/exhibitions 11-16 Jan, main
// draw 17-31 Jan) — no day/night uncertainty here, though exact session
// times aren't published yet (stated honestly, not invented).

export const australianOpenItinerarySpokeContent = {
  eventRhythmIntro:
    "The tournament most people think of as \"the Australian Open\" is really the back half of a longer window. Qualifying and exhibition matches run 11-16 January, largely unnoticed by anyone who arrives for the main draw — then the 15-day main draw itself runs 17-31 January, moving from a wide field across every court in the first week to a handful of matches on the two biggest arenas by the second.",

  practiceWeekIntro:
    "The National Tennis Centre's practice courts, adjacent to the main precinct, run open sessions during the week before qualifying even starts — the least-known, most underrated part of the whole event, and genuinely cheap relative to main-draw ticket prices.",

  fortnightShape: {
    label: "The shape of the Fortnight",
    days: [
      { day: "Opening Week (11-16 Jan)", detail: "Qualifying and exhibition matches, plus open practice at the National Tennis Centre — the cheapest, least crowded window to see players up close before the main draw starts." },
      { day: "First week of the main draw (17-23 Jan)", detail: "The most matches on the most courts — outer courts and Ground Pass access are at their best here, before the draw narrows." },
      { day: "Second week (24-27 Jan)", detail: "Fewer matches, higher stakes — quarterfinals onward concentrate onto Rod Laver and Margaret Court Arena." },
      { day: "Semifinals and finals (28-31 Jan)", detail: "The tournament's biggest sessions, and its highest reserved-seat prices — see the Cost Guide for how sharply this stretch climbs." },
    ],
  },

  lateNightNote:
    "Night sessions carry their own real risk, at Rod Laver Arena and Margaret Court Arena alike: this is the Grand Slam most associated with genuinely late finishes, some running past 4am under lights — Rod Laver specifically has hosted the tournament's most extreme cases. New ATP/WTA scheduling rules introduced in 2024 are actively working to prevent this going forward, but the history is real and worth knowing before you book a night ticket at either arena and plan an early flight the next morning.",

  timesNotFixedNote: {
    label: "Exact session times can still shift",
    body:
      "The round-by-round dates above are the real, confirmed 2027 tournament structure — but exact daily session start times aren't set until closer to the tournament. Check the official day-by-day order of play once it's published via ausopen.com.",
  },

  // Full hour-by-hour tables for a 5-day trip are Pro-gated in the source
  // — real, confirmed content, included in full below.
  hourByHourItinerary: {
    intro:
      "Built for a trip timed around a first-week reserved seat and a day-trip window — arrive with a day to spare, use the middle days for early-draw matches and the outside courts, take a full day away from tennis, and finish with your booked session.",
    days: [
      {
        day: "Day 1 — Arrival",
        rows: [
          { time: "Afternoon", location: "Flinders Street or Southern Cross → hotel", activity: "Settle in and get oriented. If you're staying East Melbourne, walk the route to Melbourne Park you'll use every match day — Batman Avenue along the Yarra." },
          { time: "Evening", location: "Federation Square & the CBD laneways", activity: "An evening walk through Hosier Lane and the surrounding laneways — the classic first-night move, a short walk from Flinders Street Station." },
        ],
      },
      {
        day: "Day 2 — Ground Pass day",
        rows: [
          { time: "Morning", location: "Melbourne Park, gates open ~10am", activity: "Arrive close to gate-opening — a Ground Pass has no reserved seat, so early arrival genuinely earns better outer-court viewing." },
          { time: "Midday", location: "Grand Slam Oval & the Food Village", activity: "Lunch at one of the real Melbourne restaurant stalls, not generic stadium catering." },
          { time: "Afternoon", location: "Outside Courts 3-15", activity: "Move between numbered courts — early rounds mean top-20 players warming up close, with genuine standing room by early afternoon on a busy day." },
        ],
      },
      {
        day: "Day 3 — Reserved-seat day",
        rows: [
          { time: "Morning", location: "Hotel / city", activity: "A lighter morning — today's ticket is a reserved seat, so there's no early-arrival advantage the way there was on your Ground Pass day." },
          { time: "Session", location: "Rod Laver Arena or Margaret Court Arena", activity: "Your booked reserved seat — see the Ticket Guide for how the tier structure and pricing work." },
          { time: "Evening", location: "CBD or East Melbourne", activity: "Dinner — book ahead if going somewhere specific, since match days genuinely fill up nearby restaurants." },
        ],
      },
      {
        day: "Day 4 — Day trip",
        rows: [
          { time: "Morning", location: "Melbourne → Great Ocean Road or Yarra Valley", activity: "Depart with no session booked today — see the Day Trips guide for the real time commitment of each." },
          { time: "Midday–evening", location: "Twelve Apostles or Yarra Valley wineries", activity: "A genuine day away from tennis, built with no clock to watch on the way back." },
        ],
      },
      {
        day: "Day 5 — Departure",
        rows: [
          { time: "Morning", location: "Hotel → airport", activity: "If your last session was a night match, book a relaxed next-morning departure rather than risking a same-day exit." },
        ],
      },
    ],
  },

  sourcesFooter: "Exact 2027 session times haven't been published yet — confirm via ausopen.com closer to the tournament.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "practice-week-national-tennis-centre" (practiceWeek)
//   - "late-night-melbourne-park-midnight-finishes" (lateNight)
