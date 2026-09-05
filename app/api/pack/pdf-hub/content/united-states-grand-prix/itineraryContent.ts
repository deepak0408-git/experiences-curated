// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/ItinerarySpoke.tsx), for
// the Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Unlike Abu Dhabi's Itinerary spoke (4 core days + optional Monday day
// trip, 5 days total), US GP's shape is a standard 3-day weekend (Fri-Sun)
// PLUS a new, separately-ticketed optional Thursday (Grand PrixView
// Thursday, 22 October, F1 Academy track action) PLUS an optional extra
// bookend day (Hill Country/Fredericksburg or San Antonio) either before or
// after — 5 days total across two different optional-day mechanisms, not
// one.

export const usGpItinerarySpokeContent = {
  h1: "A standard weekend, plus a real extra day worth planning for",

  intro:
    "Austin runs a standard 3-day Grand Prix weekend for 2026 — Friday through Sunday, no sprint race — plus a new, separately-ticketed fourth day (Grand PrixView Thursday, 22 October) built around F1 Academy track action. That means a full trip genuinely spans four days if you add the Thursday preview, not the usual three.",

  intro2:
    "Within the weekend, each day has a different job. Friday is the quietest and cheapest-feeling — practice sessions, smaller crowds, a good day to explore Austin's own neighborhoods before the weekend gets busy, and the first Super Stage concert (Maroon 5) in the evening. Saturday builds through qualifying into the second headline concert (Post Malone). Sunday is the race and Alesso's closing set. If your travel dates allow it, adding a day either before or after for Hill Country/Fredericksburg or San Antonio turns a tight race-only trip into a fuller Texas visit.",

  days: [
    { label: "Thursday — Optional Grand PrixView Thursday", summary: "F1 Academy track action and early Fan Zone access — a separate ticket from the main weekend, from $20" },
    { label: "Friday — Practice", summary: "Circuit sessions in the afternoon, Maroon 5 headlines the Super Stage in the evening" },
    { label: "Saturday — Qualifying", summary: "Qualifying session, then Post Malone headlines the biggest concert night of the weekend" },
    { label: "Sunday — Race", summary: "Arrival timing by grandstand, the race itself, Alesso closes out the weekend" },
    { label: "Optional extra day", summary: "Texas Hill Country/Fredericksburg or San Antonio — either works well as a bookend day before or after the core weekend" },
  ],

  // Pro-gated hour-by-hour tables, matching ItinerarySpoke.tsx's own
  // {isUnlocked && (...)} block. All static — no DB-computed values or
  // live experience lookups appear in this spoke's itinerary tables.
  hourByHour: [
    {
      day: "Thursday — Grand PrixView Thursday (optional)",
      rows: [
        { time: "Morning", location: "Arrival, hotel check-in", activity: "Land, settle in — this day works well as a soft landing before the main weekend's intensity picks up." },
        { time: "Afternoon", location: "Circuit of the Americas", activity: "F1 Academy track action and early Fan Zone access, on a separate ticket from the main race-weekend pass." },
        { time: "Evening", location: "South Congress or Sixth Street", activity: "A relaxed first evening in the city — South Congress for boots and murals, or Sixth Street if you want the nightlife right away." },
      ],
    },
    {
      day: "Friday — Practice day",
      rows: [
        { time: "Morning", location: "Franklin Barbecue", activity: "If the line matters to you, this is the day to do it — Friday's queue is typically shorter than the weekend rush that follows." },
        { time: "Afternoon", location: "Your booked grandstand", activity: "Practice sessions (FP1 and FP2) — the lowest-pressure viewing of the weekend, worth using to test your seat's sightlines." },
        { time: "Evening", location: "Germania Insurance Super Stage", activity: "Maroon 5 headlines tonight — included on every ticket tier, GA included." },
      ],
    },
    {
      day: "Saturday — Qualifying day",
      rows: [
        { time: "Morning", location: "Lady Bird Lake or Zilker Park", activity: "A daytime outdoor activity before the afternoon session — kayaking on the lake, or a swim at Barton Springs Pool." },
        { time: "Afternoon", location: "Your booked grandstand", activity: "Qualifying — shorter than the race, and it sets Sunday's grid." },
        { time: "Evening", location: "Germania Insurance Super Stage", activity: "Post Malone headlines tonight — the single biggest concert draw of the weekend. Plan your exit route in advance." },
      ],
    },
    {
      day: "Sunday — Race day",
      rows: [
        { time: "Several hours before gates", location: "Your booked grandstand or GA zone", activity: "Race day carries the heaviest traffic and shuttle demand of the weekend — arrive well ahead of the session, not just before it." },
        { time: "Afternoon", location: "Your booked grandstand", activity: "The race itself." },
        { time: "After the chequered flag", location: "Germania Insurance Super Stage", activity: "Alesso closes out the weekend. Expect the heaviest post-event traffic of the whole trip — build real slack into any same-day flight, and consider the 30-min-early or 45-min-late exit tactic from the Getting There guide." },
      ],
    },
    {
      day: "Optional extra day",
      rows: [
        { time: "Full day", location: "Texas Hill Country & Fredericksburg", activity: "A 90-minute drive west via US-290 — 3-5 wineries, lunch, and a walk down Fredericksburg's Main Street. Better as a full dedicated day than a squeeze between track sessions." },
        { time: "Full day (alternative)", location: "San Antonio", activity: "80 miles south via I-35 — the Alamo, the River Walk, and (if time allows) San Antonio Missions National Historical Park. Reserve your free Alamo Church timed-entry ticket online before you go." },
      ],
    },
  ],

  sourcesFooter: "Sources: circuitoftheamericas.com, cbsaustin.com, austinmonthly.com.",
};

// DB-derived data NOT extracted here — none. This spoke renders no
// linkedExperiences cards and computes no DB-derived values.
