// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/abu-dhabi-grand-prix/FirstTimerGuideSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const abuDhabiGpFirstTimerGuideSpokeContent = {
  intro:
    "Abu Dhabi is F1's season finale, and that changes the texture of the weekend before a single car turns a wheel. Since Yas Marina opened in 2009 as the first-ever F1 twilight race — daylight start, floodlit finish, powered by roughly 4,700 light fixtures and a 600-million-lumen lighting plan built in under 300 days — it's carried a genuine \"closing chapter\" atmosphere no other round on the calendar quite replicates. Titles have been decided here, and the crowd knows it. Here's what genuinely trips up a first-time visitor, drawn from the real detail in this pack rather than generic advice.",

  mistakes: [
    {
      number: 1,
      label: "Treating it like a mid-season round",
      body:
        "Qualifying starts at 18:00 and the race at 17:00 local time, both building through the last part of the afternoon into the twilight-to-night transition — and every ticket tier, grandstand or General Admission, includes access to the nightly Yasalam after-race concerts. This is genuinely bundled, not a separate purchase, and it changes what the day is actually for: a full race day here runs from an afternoon session through to a late-night headline set under the same lights, not a few hours at the track and home for dinner.",
    },
    {
      number: 2,
      label: "Defaulting to AUH without checking DXB",
      body:
        "AUH is 8km from Yas Marina Circuit, genuinely the world's closest international airport to any F1 venue — but for a lot of long-haul origins, DXB carries better fares and more direct routes, at the cost of a roughly 75-minute drive via the E11 instead of a 15-minute one. Booking AUH automatically because it's closer, without checking DXB fares first, is a real and common way to overpay on the single biggest line item of the trip.",
    },
    {
      number: 3,
      label: "Underestimating Yas Island's size",
      body:
        "Between your entry gate, your seat, food and drink, and the concert stage, you can walk significant distances across a single day — this isn't a compact street circuit. Factor this into footwear and timing, especially if you're planning to catch both the race and the full headline concert set on the same evening; a tight back-to-back schedule with no walking buffer is the single most common way first-timers miss part of the show.",
    },
    {
      number: 4,
      label: "Packing for one temperature",
      body:
        "\"Twilight race\" doesn't mean cool — it means two genuinely different conditions in the same seat, in the same day. Race weekend runs warm and dry, around 26°C by day easing to 25°C on race day, with a real but moderate cooling after sunset. Packing only for heat means an uncomfortable evening; packing only for cold means carrying dead weight through the hottest part of the afternoon. Layer for both, and don't skip sun protection just because the day ends under floodlights.",
    },
    {
      number: 5,
      label: "Not planning around race-day traffic peaks",
      body:
        "The heaviest congestion, both on the roads and on the free shuttle network, hits in the hour before the race start and immediately after each night's headline concert — not evenly across the day. A shuttle that's readily available at 2pm can have a real queue by 5:30pm on race day. Arrive well ahead of your session on race day specifically, and build real slack into any same-day departure after the closing concerts.",
    },
  ],

  weekendAtAGlance: {
    label: "The weekend, at a glance",
    rows: [
      { label: "Thursday to Sunday", body: "Qualifying starts at 18:00 and the race at 17:00 local time, both building through the afternoon into the twilight-to-night transition." },
      { label: "Every ticket includes the concerts", body: "The Yasalam after-race concerts run each night of the weekend, and every ticket tier — grandstand or General Admission — includes access. This is genuinely bundled, not a separate purchase." },
      { label: "Dress code is relaxed", body: "Comfortable, breathable clothing suited to the heat is the norm across every ticket tier, hospitality included — this is a practical outdoor event, not a formal occasion." },
    ],
  },

  essentialApps: {
    label: "Essential apps for your first trip",
    items: [
      { name: "Abu Dhabi GP Tickets app", body: "Your ticket is digital-only — install this before you travel, not on arrival." },
      { name: "Careem or Uber", body: "Both operate widely and are typically the most reliable way to move around Yas Island and between Abu Dhabi and Dubai outside of race-day shuttle windows." },
      { name: "F1 official app", body: "Live timing and session schedules, genuinely useful if you're moving between sessions and fan zones across a large venue." },
    ],
  },

  firstTimerTrapCallout: {
    label: "The genuine first-timer trap",
    body:
      "Don't underestimate how large Yas Island is as a physical space. Between your entry gate, your seat, food and drink, and the concert stage, you can walk significant distances across a single day — factor this into footwear and timing, especially if you're planning to catch both the race and the full concert on the same evening.",
  },

  // Pro-gated verdict content, matching FirstTimerGuideSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "What actually matters most, first time",
      body:
        "Plan your evening around catching the headline concert act specifically — most first-timers don't realize until they're already there that it's bundled into every ticket tier, and it's a genuine part of the Abu Dhabi identity, not an optional add-on. If you're also chasing the full race-day experience, build in real walking-time buffers between your seat, amenities, and the concert stage rather than a tight back-to-back schedule — a rushed transition is the single most common way first-timers miss part of the show.",
    },
  ],

  sourcesFooter:
    "Sources: yasmarinacircuit.com and Formula1.com (twilight race format, lighting installation, session schedule, Yasalam concert bundling), AccuWeather (Yas Marina Circuit climate averages).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "first-timer-orientation-abu-dhabi" (orientation)
