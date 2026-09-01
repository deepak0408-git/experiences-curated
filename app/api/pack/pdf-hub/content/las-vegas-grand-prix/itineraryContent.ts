// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/ItinerarySpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Genuinely unusual, deliberate fact from this session's review (not an
// extraction mistake — reproduce as-is): this itinerary has a Wednesday
// arrival day (Hoover Dam + Fountains/Sphere walk + Le Cirque/Guy Savoy
// dinner), added this session, ahead of the original Thu-Sat 3-night frame.
// This is a real 4-day (Wed/Thu/Fri/Sat) structure — extract it as such,
// not an assumed 3-day Thu-Sat frame from an earlier version of this pack.
//
// The free/public "Event rhythm" section (4 day rows) is unconditional in
// the source. The full hour-by-hour ItineraryTable breakdown for all 4 days
// is Pro-gated ({isUnlocked && (...)}), matching TicketsSpoke's own pattern
// — captured under `verdicts` below as the day-by-day table data.

export const lasVegasGpItinerarySpokeContent = {
  h1: "An optional arrival day, then three nights of sessions — how the weekend actually runs",
  eventName: "Las Vegas Grand Prix",

  intro:
    "Every session at the Las Vegas Grand Prix runs at night, which means this weekend has a genuinely different rhythm from a daytime race — there's no early wake-up for first practice, but there is a long afternoon and evening every single day, and what you do with it matters as much as the sessions themselves.",

  eventRhythm: {
    label: "Event rhythm",
    days: [
      {
        label: "Wednesday 18 Nov — optional arrival day",
        detail:
          "No sessions run yet, and the Strip hasn't started closing — the one genuinely free day of the trip. This is the day for sightseeing and a day trip, not Thursday or Friday, since both of those already run into a night session with real road closures beforehand.",
      },
      {
        label: "Thursday 19 Nov",
        detail:
          "Practice 1, 4:30-5:30pm PT. Practice 2, 8:00-9:00pm PT. Soft Strip closures begin 3pm, full closures 5pm. Lightest session-day crowds of the weekend — good for the free Boulevard fan activations and merchandise before Saturday's rush, but the afternoon is genuinely tight once you factor in closures.",
      },
      {
        label: "Friday 20 Nov",
        detail:
          "Practice 3, 4:30-5:30pm PT. Qualifying, 8:00-9:00pm PT. Qualifying is genuinely competitive — real intensity for roughly a quarter of race day's ticket price.",
      },
      {
        label: "Saturday 21 Nov",
        detail:
          "Race, 8:00pm PT start. Road closures begin earliest and hit hardest this day — treat the whole afternoon as arrival time, not just the hour before the session.",
      },
    ],
    timezoneNote: "All times Pacific, per the official 2026 race schedule.",
  },

  // "The circuit's own landmarks" — 2 experience cards, generic
  // <SpokeExperienceCard>, no inline copy beyond the card itself:
  // - "las-vegas-gp-fountains-sphere" (fountainsSphere)
  // - "las-vegas-gp-strip-at-night" (stripAtNight)

  // Pro-gated full hour-by-hour itinerary — matches source's
  // {isUnlocked && (...)} block with 4 ItineraryTable day breakdowns.
  verdicts: [
    {
      label: "The full itinerary, hour by hour",
      days: [
        {
          day: "Wednesday 18 Nov — Arrival day",
          rows: [
            {
              time: "Morning",
              location: "Hoover Dam",
              activity:
                "No sessions, no closures — the only day in the trip with genuine room for the longer of the two day trips. Roughly 45 minutes each way via US-93 South, plus touring time; back on the Strip well before evening. Full guide: Hoover Dam.",
              experienceSlug: "las-vegas-gp-hoover-dam", // hooverDam card
            },
            {
              time: "Late afternoon",
              location: "The Strip",
              activity:
                "Walk the Strip while it's still fully open — catch the Bellagio Fountains (every 30 minutes from 3pm, every 15 minutes from 8pm) and the Sphere's Exosphere display before Thursday's closures start reshaping how you move around. Full guide: Fountains and Sphere.",
              experienceSlug: "las-vegas-gp-fountains-sphere", // fountainsSphere card
            },
            {
              time: "Evening",
              location: "Bellagio or Caesars Palace",
              activity:
                "The one genuinely unhurried sit-down-dinner window of the whole trip — no session to plan around, no closures to beat. Book Le Cirque or Restaurant Guy Savoy here rather than squeezing it into Friday's tighter 2.5-hour gap. Full guide: Bellagio & Caesars Dining.",
              experienceSlug: "las-vegas-gp-bellagio-caesars-dining", // bellagioCaesarsDining card
            },
          ],
        },
        {
          day: "Thursday 19 Nov — Practice day",
          rows: [
            {
              time: "Early morning",
              location: "Red Rock Canyon",
              activity:
                "The shorter of the two day trips — less than 30 minutes from the Strip. Do the 13-mile Scenic Drive (book the Recreation.gov timed-entry slot ahead if visiting between 8am-5pm) and be back on the Strip by early afternoon, well clear of the 3pm soft closures. Full guide: Red Rock Canyon.",
              experienceSlug: "las-vegas-gp-red-rock-canyon", // redRock card
            },
            {
              time: "Early afternoon",
              location: "The Strip",
              activity:
                "Buy official F1 merchandise and catch the free Boulevard Fan Experience (historically 10am-6pm) before soft closures begin at 3pm — today has the lightest session-day crowds of the weekend.",
            },
            { time: "4:30-5:30pm", location: "Your booked zone", activity: "Practice 1." },
            { time: "8:00-9:00pm", location: "Your booked zone", activity: "Practice 2." },
          ],
        },
        {
          day: "Friday 20 Nov — Qualifying day",
          rows: [
            { time: "4:30-5:30pm", location: "Your booked zone", activity: "Practice 3." },
            {
              time: "5:30-8:00pm",
              location: "Near your booked zone",
              activity: "A 2.5-hour gap before Qualifying — enough time to rest or grab a quick meal near your zone.",
            },
            {
              time: "8:00-9:00pm",
              location: "Your booked zone",
              activity:
                "Qualifying — genuine competitive intensity under the same night lights as the race, for roughly a quarter of race day's ticket price.",
            },
          ],
        },
        {
          day: "Saturday 21 Nov — Race day",
          rows: [
            {
              time: "From 3pm",
              location: "En route to your zone",
              activity: "Soft closures begin — head to your zone rather than planning anything else for the afternoon.",
            },
            {
              time: "Before 8pm",
              location: "Sphere Exosphere / Strip",
              activity:
                "The Sphere's Exosphere display runs roughly dusk to midnight nightly — visible from most East Harmon/Koval/T-Mobile zone approaches on the walk in. Full guide: The Strip at Night.",
              experienceSlug: "las-vegas-gp-strip-at-night", // stripAtNight card
            },
            { time: "8:00pm", location: "Your booked zone", activity: "The Race." },
            {
              time: "After the chequered flag",
              location: "Circa Resort & Casino, downtown",
              activity:
                "If you want to keep the night going without another circuit ticket, Circa's free Stadium Swim watch-party infrastructure and sportsbook scene are built for exactly this. Full guide: Watching from a Sportsbook.",
              experienceSlug: "las-vegas-gp-sportsbook-watch", // sportsbook card
            },
          ],
        },
      ],
      closingNote: {
        label: "The one combination that genuinely doesn't fit",
        body:
          "Don't try to combine either day trip with Friday or Saturday — both take a genuine chunk of a half-day round trip, and once soft closures start at 3pm, the afternoon is arrival time, not spare time. Hoover Dam is the longer of the two, so it belongs on Wednesday when there are no sessions or closures at all. Red Rock Canyon is short enough to fit Thursday morning specifically, but even then, be back on the Strip by early afternoon rather than cutting it close against the 3pm closures.",
      },
      // Card, generic <SpokeExperienceCard>, no inline copy beyond the card:
      // - "las-vegas-gp-race-week-free" (raceWeekFree)
    },
  ],

  sourcesFooter:
    "Sources: formula1.com official 2026 session calendar, bellagio.mgmresorts.com fountain schedule, f1lasvegasgp.com A-Z Guide (free Boulevard Fan Experience), circalasvegas.com Stadium Swim page.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "las-vegas-gp-fountains-sphere" (fountainsSphere)
//   - "las-vegas-gp-strip-at-night" (stripAtNight)
//   - "las-vegas-gp-bellagio-caesars-dining" (bellagioCaesarsDining)
//   - "las-vegas-gp-race-week-free" (raceWeekFree)
//   - "las-vegas-gp-sportsbook-watch" (sportsbook)
//   - "las-vegas-gp-hoover-dam" (hooverDam)
//   - "las-vegas-gp-red-rock-canyon" (redRock)
