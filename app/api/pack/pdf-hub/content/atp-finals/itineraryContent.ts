// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/ItinerarySpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.
//
// Real, confirmed 2026 structure (15-20 Nov round robin, 21 Nov
// semifinals, 22 Nov final) — no day/night uncertainty here.

export const atpFinalsItinerarySpokeContent = {
  eventRhythmIntro:
    "The ATP Finals doesn't run like a Grand Slam, where the draw thins out day by day — round-robin means the first six days (15-20 November) all carry the same weight, each with two sessions (afternoon and evening) guaranteeing a doubles and a singles match involving top-8 players. There's no \"weak\" day in that stretch the way an early knockout round can feel thin.",

  laterRoundsNote:
    "21 November shifts to semifinals — two sessions, early afternoon and evening. 22 November is finals day, a single session at 3pm, the one day with no second sitting. That structure shapes how a week here should be planned: a multi-day trip has real flexibility to build a Barolo day trip or a full city day into the round-robin stretch, since missing one group-stage session doesn't cost you as much as missing a semifinal or final would.",

  weekShape: {
    days: [
      { day: "Arrival (before 15 Nov)", detail: "Settle in, install the TO Move and FreeNow apps, and get oriented — Piazza San Carlo for an early aperitivo is a good first evening." },
      { day: "Group stage days (15-20 Nov)", detail: "Two sessions daily. Build in a city day (Mole Antonelliana, Museo Egizio, Royal Palace) or the Barolo day trip on whichever day suits your session tickets least." },
      { day: "Semifinals (21 Nov)", detail: "Two sessions — protect this day if you have tickets, since round-robin qualification determines who's actually playing." },
      { day: "Final (22 Nov)", detail: "Single 3pm session — the whole day builds toward this, no second sitting to fall back on if plans shift." },
    ],
  },

  timesNotFixedNote: {
    label: "Times aren't fixed until closer to the event",
    body:
      "The tournament itself states session times and the program are indicative and may change closer to the event — build in flexibility around exact match times, especially in the group stage where the day/evening split can shift.",
  },

  // Full hour-by-hour tables for a 4-day trip are Pro-gated in the source
  // — real, confirmed content, included in full below.
  hourByHourItinerary: {
    intro:
      "Built for a short trip timed around the tournament's biggest sessions — arrive the day before a group-stage evening, use the middle two days for the city and Barolo, and let the final day overlap with whichever of semifinals or final your tickets cover. If your own trip is longer, drop the extra nights into more group-stage days using the same city/food picks below.",
    days: [
      {
        day: "Day 1 — Arrival",
        rows: [
          { time: "Afternoon", location: "Turin Airport (Caselle) → hotel", activity: "Take the SFM train (every 30 min, ~30 min) to Porta Susa, buying the Integrato B combined ticket (~€4.20) to cover the onward metro/tram leg in one purchase. Install TO Move (for GTT transit) and FreeNow (Turin's real ride-hailing app — standard UberX doesn't operate here) before you land." },
          { time: "Evening", location: "Piazza San Carlo", activity: "An early aperitivo at one of the square's historic cafés — the natural first-evening move, and it sets up the vermouth tradition you'll be drinking all week. Early night ahead of tomorrow's session." },
        ],
      },
      {
        day: "Day 2 — Group-stage day",
        rows: [
          { time: "Morning", location: "Mole Antonelliana or Museo Egizio", activity: "Pick one — both are a genuine half-morning, not a rushed hour. Save the other for a spare morning later in the trip if you have one." },
          { time: "Midday", location: "Caffè Al Bicerin", activity: "The original bicerin, at the café that's served it since 1763 — go before lunch crowds build." },
          { time: "Afternoon session", location: "Inalpi Arena, north gates (Piazzale Grande Torino)", activity: "General admission uses the north side, the same side as the Fan Village — arrive a little early for time in the Play Garden or food court first. Take tram 4 or 10 from Sebastopoli stop, about a 5-minute walk from the entrance; tram 4 runs direct from Porta Nuova." },
          { time: "Evening", location: "Scannabue or Ristorante Consorzio", activity: "Agnolotti del plin and tajarin — book ahead. Save Razzo for a night you want one tasting-menu-level dinner rather than two more relaxed ones." },
        ],
      },
      {
        day: "Day 3 — Barolo day trip",
        rows: [
          { time: "Morning", location: "Turin → Barolo (by car, ~50 min)", activity: "Depart by mid-morning at the latest — plan the day around the group-stage session you're least attached to, since the drive plus a genuine half-day in the wine hills doesn't leave margin for an afternoon session back in Turin." },
          { time: "Midday–afternoon", location: "Barolo / Serralunga d'Alba / Castiglione Falletto", activity: "Two winery visits plus one village stop is a realistic day — Fontanafredda's confirmed 90-minute Serralunga tasting is the easiest to book with a fixed November slot." },
          { time: "Evening", location: "Return to Turin", activity: "No session tonight by design — this is the one day built with zero tennis commitments, so there's no clock to watch on the way back." },
        ],
      },
      {
        day: "Day 4 — Finals day",
        rows: [
          { time: "Morning", location: "Hotel / city", activity: "Keep the morning light — this is the day everything else in the trip has been built around, so no half-day trips or long walks that eat into your margin." },
          { time: "Before the session", location: "Inalpi Arena — confirm your gate", activity: "Smash, Ace, and ATP No. 1 Club hospitality guests enter through separate south gates on Corso Sebastopoli — a different physical side of the building, not just a different queue. At 183 metres long, walking to the wrong entrance genuinely costs time; confirm which gate your ticket type uses before you arrive." },
          { time: "Semifinal (21 Nov) or Final (22 Nov)", location: "Your booked seat", activity: "Semifinals run two sessions, early afternoon and evening — protect the whole day if you're attending. Finals day is a single 3pm session with no second sitting to fall back on if plans shift." },
          { time: "Evening / departure", location: "Hotel → Turin Airport (Caselle)", activity: "If your final session is 22 November, avoid flying out the same night — exit crowds and the adrenaline of a title match don't mix well with a tight connection. Building in a morning-after departure gives real margin instead of rushing straight from Centre Court to the airport." },
        ],
      },
    ],
  },
};
