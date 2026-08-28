// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/ItinerarySpoke.tsx), for the Full Pack
// PDF port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Unlike Cost/Tickets/etc., almost all of this spoke's content — including
// the day-by-day cards and the full hour-by-hour itinerary tables — is
// static hardcoded prose (ported from TOURNAMENT_RHYTHM["wimbledon-2026"]
// per the spoke's own header comment), not computed from getSpokeData().
// It's extracted in full here, including the Pro-gated hour-by-hour
// itinerary, which is kept inside `verdicts` since it's rendered only
// inside the same {isUnlocked && (...)} block as the rest of the verdict
// content in ItinerarySpoke.tsx.

export const wimbledonItinerarySpokeContent = {
  intro:
    "Wimbledon runs as a single-elimination draw across two weeks, and the character of the grounds changes sharply as the tournament narrows — the same building, a genuinely different atmosphere depending on which day you're there.",

  shapeOfTheFortnight: {
    label: "The shape of the Fortnight",
    days: [
      {
        day: "Opening Monday",
        detail:
          "The day the grounds feel genuinely electric — and genuinely overwhelming. Top seeds are on Centre Court and No. 1 Court from day one, but the outer courts are where the draw opens up — players ranked 60 to 120 on courts you can walk right up to. Get in before 11am; the gates flood.",
      },
      {
        day: "Early-round weekdays (Tue-Thu, week 1)",
        detail:
          "Quietly the best days to be there. The corporate groups clear out, the proper fans stay, and a grounds pass covers everything that matters. Fewer people, more access, and you can drop in and out of four matches in an afternoon without jostling for standing room.",
      },
      {
        day: "Middle Saturday",
        detail:
          "Every local knows this one. Third round done, 32 players left, and the tennis quality has genuinely jumped. The grounds are full but the energy earns it. Centre Court tickets are essentially gone unless planned months ahead; Henman Hill and the outer courts on this day are a better story anyway.",
      },
      {
        day: "Week 2 weekdays (Mon-Thu)",
        detail:
          "The draw thins to 16, then 8. Outer courts go quiet — fewer matches, bigger gaps in the schedule. What you get instead is actual seats, actual calm, and the best tennis of the tournament.",
      },
      {
        day: "Semi-finals (Thu-Fri)",
        detail:
          "Thursday is the Ladies' semis, Friday the Men's. The formality of the place tightens noticeably. Most of the crowd watches from pubs while the grounds go quiet. If you want pure tennis with no distraction, these are your days.",
      },
      {
        day: "Finals Weekend",
        detail:
          "Saturday is the Ladies' Singles final and Men's Doubles. Sunday is the Men's Singles final and Ladies' Doubles. The trophy presentations are part of the event. Worth doing once — but it's also the most formal, least spontaneous version of Wimbledon.",
      },
    ],
  },

  sourcesFooter: "Source: wimbledon.com, AELTC published schedule.",

  // Pro-gated verdict content — only included in Full Pack mode, matching
  // ItinerarySpoke.tsx's own {isUnlocked && (...)} block. Includes the full
  // 6-day hour-by-hour itinerary tables, which are static prose (not
  // DB-computed) and only appear inside this Pro-gated block in the source.
  verdicts: [
    {
      label: "Which days we'd actually pick",
      body:
        "For a genuine first Wimbledon trip, the early-round weekdays of week 1 are the sharpest window — the corporate crowds are gone, a grounds pass covers real access to a wide range of matches, and you can move freely between four or five courts in a single afternoon. Middle Saturday is the single best day for atmosphere if you can only pick one, even though Centre Court itself is essentially unreachable by then without advance planning.",
    },
    {
      label: "What finals weekend actually trades off",
      body:
        "The tournament worth travelling for is the one with roaming outer courts and unexpected results — that peaks around the quarterfinals, a few days before finals weekend's trophy presentations and heightened formality. Book finals weekend for the occasion itself, not expecting the loose, wander-the-grounds energy of the first week.",
    },
  ],

  hourByHourItinerary: {
    label: "The full itinerary, hour by hour — a 6-day trip",
    intro:
      "Built around two grounds days during the sharpest week-1 window, one lighter day inside London, and a genuine two-day outward trip to Windsor and Eton — the shape that gets the most out of a Fortnight visit without needing tickets for every single day. If your own trip is shorter, drop the Windsor days first; if it's longer, add extra grounds days using the same early-week logic.",
    days: [
      {
        day: "Day 1 — Arrival",
        rows: [
          {
            time: "Afternoon",
            location: "Heathrow / Gatwick → SW19 or Waterloo",
            activity:
              "Settle in and drop bags — SW19 village if you're staying near the grounds, or a Waterloo-area hotel if you're basing centrally (see the Where to Stay guide for both). No grounds visit today; save your energy for tomorrow's early start.",
          },
          {
            time: "Evening",
            location: "The Dog and Fox or Fire Stables, Wimbledon Village",
            activity: "An early dinner and an early night — tomorrow's queue day rewards being properly rested, not a late first evening.",
          },
        ],
      },
      {
        day: "Day 2 — First grounds day",
        rows: [
          {
            time: "Early morning",
            location: "The Queue",
            activity:
              "Arrive by mid-morning at the latest if you're queueing for a day ticket — gates open 10:30am, tickets released to queuers from 9:30am. See the Ticket Guide for the full Queue-vs-Ballot-vs-resale comparison if you haven't decided your route yet.",
          },
          {
            time: "Midday",
            location: "Outer courts (3, 12, 18)",
            activity: "The best early-round tennis is here, not on Centre Court — seeded players in genuinely competitive matches, courts you can walk right up to.",
          },
          {
            time: "Afternoon",
            location: "Henman Hill",
            activity: "Strawberries and cream, the Hill's own Pimm's tent, and a show court on the big screen if you want a break from queuing for individual courts.",
          },
          {
            time: "Evening",
            location: "The Rose & Crown, Wimbledon Village",
            activity: "The village's own historic pub-with-rooms — book ahead if it's a big match day, since the post-day crowd fills it fast.",
          },
        ],
      },
      {
        day: "Day 3 — Second grounds day",
        rows: [
          {
            time: "Morning",
            location: "Aorangi Park practice courts",
            activity: "North end of the grounds, walk up and watch — best access in the first few days while top seeds are still warming up. No reserved spots needed.",
          },
          {
            time: "Midday",
            location: "Wimbledon Museum & Private Tour",
            activity: "A genuine change of pace from queuing — trophies and player memorabilia from 1877 onward, 90 minutes with a Blue Badge Guide if you book the standard tour.",
          },
          {
            time: "Afternoon",
            location: "Centre Court or No. 1 Court",
            activity: "Whichever show-court ticket you've secured — Debenture, resale, or Show Courts tier (see the Ticket Guide for the real comparison of all three routes).",
          },
          {
            time: "Evening",
            location: "The Black Lamb, Wimbledon Village",
            activity: "Book at least two weeks ahead for an evening sitting during the Fortnight — Wednesdays have live jazz from 7pm if the timing works for your trip.",
          },
        ],
      },
      {
        day: "Day 4 — London rest day",
        rows: [
          {
            time: "Morning",
            location: "Central London",
            activity:
              "A genuine day away from SW19 — see the Day Trips guide for the full route. Early-round weekdays (Tuesday through Thursday) are the easiest days to give up; the corporate crowds are gone from the grounds either way.",
          },
          {
            time: "Afternoon",
            location: "Brixton Village & Market Row, or Wimbledon Afternoon Tea at The Dorchester",
            activity:
              "Brixton for a different, non-tournament side of London. If today is a splurge day instead, The Dorchester's Wimbledon Afternoon Tea (see the Luxury Guide) is a real, event-themed alternative — book ahead, and treat it as the whole afternoon, not a quick stop.",
          },
          {
            time: "Evening",
            location: "Back to your base",
            activity: "An early night if tomorrow starts a Windsor day trip — it's a genuinely full day out.",
          },
        ],
      },
      {
        day: "Day 5 — Windsor & Eton day trip",
        rows: [
          {
            time: "Morning",
            location: "Waterloo → Windsor & Eton Riverside",
            activity: "Direct South Western Railway train, under an hour — the same terminus as the Wimbledon train, so no need to switch bases for the day. Leave by mid-morning; this is a full day, not a half-day add-on.",
          },
          {
            time: "Midday",
            location: "Windsor Castle & The Long Walk",
            activity: "Book in advance via rct.uk for the cheaper rate and a guaranteed entry slot. The State Apartments and the 2.5-mile Long Walk are a genuine half-day on their own.",
          },
          {
            time: "Afternoon",
            location: "Eton — Across the River from Windsor",
            activity: "Five minutes on foot over Windsor Bridge — Eton High Street's tea rooms, antique shops, and the 15th-century Cockpit Inn, plus a look at Eton College if timings allow.",
          },
          {
            time: "Evening",
            location: "Windsor & Eton Riverside → Waterloo",
            activity: "No grounds session today by design — this is the one day built with zero tennis commitments.",
          },
        ],
      },
      {
        day: "Day 6 — Departure",
        rows: [
          {
            time: "Morning",
            location: "Hotel → Heathrow / Gatwick",
            activity: "If your last grounds day ran into finals weekend or a late-evening match, avoid booking an early-morning flight the next day — build in real margin rather than rushing straight from Centre Court to the airport.",
          },
        ],
      },
    ],
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookup for a card rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "sw19-during-the-fortnight" ("SW19 During the Fortnight" — this
//     spoke's primary anchor card) — needs live experience data, not
//     extracted here.
