// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/las-vegas-grand-prix/FirstTimerGuideSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} gate anywhere in this
// file — entire spoke content is public/free. No `verdicts` field here.

export const lasVegasGpFirstTimerGuideSpokeContent = {
  h1: "A night race in a 24-hour city — the basics that actually matter",
  eventName: "Las Vegas Grand Prix",

  intro:
    "Every session at this race runs at night, and Las Vegas already runs on its own clock regardless — that combination catches first-timers out more than any other single fact about this weekend. Here's what actually trips people up.",

  mistakes: [
    {
      number: 1,
      label: "Packing for the daytime forecast, not the session you're actually attending",
      body:
        "Every session is a night session, and November desert nights run genuinely cold once the sun's down — mid-40s°F with real wind, even on a day that felt mild at noon. Pack for the coldest session on your schedule, not the mildest part of the day, especially if you're only attending Saturday's race.",
    },
    {
      number: 2,
      label: "Assuming the road you walked in on will still be open",
      body:
        "Soft closures begin at 3pm and full closures at 5pm each day of race weekend, Thursday through Saturday — this is a street circuit built through the middle of the Strip, not a stadium you drive to. A route that worked getting in can be sealed by the time you head back. Download the official Las Vegas Grand Prix app before you land — its real-time closure map and custom walking routes are the single most useful tool for a circuit that reroutes on the fly.",
    },
    {
      number: 3,
      label: "Showing up without a card that works",
      body:
        "Every food, drink, and merchandise purchase on-site is card or mobile payment only — the event is entirely cashless. Confirm your card works internationally before race weekend, not once you're already in line with no other way to pay.",
    },
    {
      number: 4,
      label: "Leaving merchandise shopping for race day",
      body:
        "Strip merchandise stores get significantly more crowded on Saturday than earlier in the week. Buy official F1 merchandise Thursday or Friday instead, and you avoid carrying bags through peak race-night foot traffic on top of it.",
    },
    {
      number: 5,
      label: "Treating the free side of the weekend as an afterthought",
      body:
        "Boulevard fan activations, team fan zones, and sportsbook watch parties don't need a circuit ticket at all — for a budget-conscious first trip, that layer of the weekend is worth building real time around, not squeezing in around a single grandstand session.",
    },
  ],

  // Card, generic <SpokeExperienceCard>, no inline copy beyond the card:
  // - "las-vegas-gp-first-timer-orientation" (orientation)

  freeSideOfWeekendLabel: "You don't need a circuit ticket to be part of the weekend",
  // 2 cards, generic <SpokeExperienceCard>, no inline copy beyond the card:
  // - "las-vegas-gp-race-week-free" (raceWeekFree)
  // - "las-vegas-gp-sportsbook-watch" (sportsbook)

  practicalEssentials: {
    label: "Practical essentials",
    apps: {
      label: "Essential apps to download before you land",
      rows: [
        { name: "Las Vegas Grand Prix app", detail: "Real-time road closures, custom walking routes to your ticketed zone, session schedules — the single most useful tool for the weekend." },
        { name: "Las Vegas Monorail app / website", detail: "Live schedules for the 24/7 race-week service — the most reliable way to move along the Strip once closures begin." },
        { name: "Rideshare app of choice", detail: "Works, but only from designated pickup points (Virgin Hotels Las Vegas, Hughes Center) and gets genuinely slow right after a session ends — a fallback, not a first choice, during peak closure hours." },
        { name: "F1 Official App", detail: "Live timing, session schedules, and driver tracking during the race weekend itself — genuinely useful once you're inside a zone and want to follow the wider session." },
      ],
    },
    accessibility: {
      label: "Accessibility",
      body:
        "Wheelchair-accessible seating and companion seats are available circuit-wide — use the \"Disabled Access\" option on the official F1 tickets site when booking. Escorted, complimentary wheelchairs and push assistance between entrance gates and seated areas are available on request at each Accessibility booth, and crutches, walkers, canes, and personal mobility scooters are all permitted inside the event. Confirm your specific entrance and route with the organizers before travelling — most of the site is paved and interconnected, but not every path is guaranteed step-free.",
    },
    gettingOutAfterward: {
      label: "Getting out afterward",
      body:
        "Harry Reid International Airport sits roughly two miles from the circuit, and airlines add between 14,000 and 25,000 extra seats into Las Vegas for race week — outbound travel is genuinely heavier than a normal weekend, not just anecdotally. Follow the airport's own \"4-3-2-1\" guidance: start arranging transport or returning a rental car a full four hours before your flight, since nearby road closures and detours can add real time even for a short trip to the terminal. Text \"F1LV\" to 31996 for live race-related traffic alerts around the airport.",
    },
  },

  sourcesFooter:
    "Sources: f1lasvegasgp.com official A-Z Guide (cashless payments, road closures, merchandise), lasvegas.gp official accessibility page, 8newsnow.com and news3lv.com airport travel-tips coverage (Harry Reid International Airport race-week guidance).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "las-vegas-gp-first-timer-orientation" (orientation)
//   - "las-vegas-gp-race-week-free" (raceWeekFree)
//   - "las-vegas-gp-sportsbook-watch" (sportsbook)
