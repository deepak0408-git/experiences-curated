// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/ArrivalSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.

export const abuDhabiGpArrivalSpokeContent = {
  intro:
    "Exact 2026 gate-opening times haven't been published yet — expect roughly 2-3 hours before each day's first session, based on the confirmed session schedule. What's already reliable is the traffic and shuttle pattern: this is a genuinely high-traffic weekend, and knowing exactly when it peaks matters more than a blanket arrival rule.",

  shuttleSystems: {
    label: "Two free shuttle systems",
    body:
      "The Circuit Circular Shuttle runs continuously between all major grandstand entrances. The Yas Courtesy Shuttle covers other key points across the island — hotels, the mall, the theme parks. Both are free with any event ticket, no separate booking needed.",
  },

  trafficPeaks: {
    label: "When traffic actually peaks",
    body:
      "The heaviest congestion, both on the roads and on the shuttle network, hits in the hour before the race start and immediately after each night's headline concert — not evenly throughout the day. A shuttle that's readily available at 2pm can have a real queue by 5:30pm on race day. If you're staying on Yas Island itself at a genuinely walkable hotel (Crowne Plaza or the W), walking to your grandstand during these peak windows is often faster than waiting for a shuttle.",
  },

  midSessionBreak: {
    label: "Leaving your seat mid-session",
    body:
      "Whether you can step out for food or the restroom and come back to the same spot depends entirely on your ticket type. In a reserved grandstand (Main, West), your seat is yours for the session regardless of when you return, so a break doesn't cost you your view. Abu Dhabi Hill is genuine general admission — there's no reserved return to your exact spot in an open zone, so the ground you claimed can be gone by the time you get back. If you're in GA, treat a mid-session break as a real trade-off: bring water and snacks in with you rather than planning to step out, especially in the hour before the race start when the crowd around every entrance and food stand is at its densest.",
  },

  honestGapNote: {
    label: "The honest gap here",
    body:
      "Abu Dhabi hasn't published exact 2026 gate-opening times yet, and we won't invent a specific hour. What's reliable is the traffic pattern above — build your arrival around avoiding the two real peak windows (pre-race, post-concert), not just the session schedule. Confirm exact gate times via Formula1.com's official ticket portal closer to race week.",
  },

  // Pro-gated verdict content, matching ArrivalSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "What we'd actually do",
      body:
        "For race day specifically — the single heaviest-traffic day of the weekend — arrive several hours before lights-out rather than just before, both if you're driving in from off-island and if you're relying on the shuttle network. If commuting from off-island (Downtown Abu Dhabi or Dubai), leave real buffer time beyond what worked on Friday or Saturday — race-day congestion around Yas Island's approach roads is meaningfully heavier than any practice or qualifying day.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "getting-around-yas-island-race-day" (gettingAround)
