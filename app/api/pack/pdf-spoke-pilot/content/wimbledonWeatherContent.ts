// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/WeatherSpoke.tsx), for the Full Pack PDF
// port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Note: WeatherSpoke.tsx has NO {isUnlocked && (...)} Pro-gated block —
// status="public", the whole spoke is free. No `verdicts` field in this
// file for that reason (matches the source; not an omission).

export const wimbledonWeatherSpokeContent = {
  intro:
    "London weather in late June/early July swings widely — layer for a 15°C morning and a 28°C afternoon on the same day. Rain is a genuine possibility across the Fortnight, but it rarely cancels a full day's play.",

  typicalConditions: {
    label: "Typical conditions",
    rows: [
      { label: "Temperature range", value: "15-28°C (59-82°F), day to day and hour to hour" },
      { label: "Rain", value: "Variable, genuinely likely on any given day" },
      { label: "Roofs", value: "Centre Court and No. 1 Court close automatically; outer courts pause" },
    ],
  },

  whenItRains: {
    label: "When it rains",
    body:
      "Most delays run 30-60 minutes, rarely a full cancellation — Centre Court and No. 1 Court both have retractable roofs that close automatically. Head to Henman Hill with an umbrella to watch show courts on the big screen while you wait. Rain delays are actually a good time to try the 3pm resale queue (see the Ticket Guide) — fewer people are thinking about it.",
    crossLink: "See the full Ticket Guide.",
  },

  whatToPack: {
    label: "What to pack",
    clothing: {
      label: "Clothing",
      body:
        "Layers you can shed — a t-shirt-and-jumper combo under a packable waterproof covers the full 15–28°C swing in one bag. A wide-brimmed hat or cap; direct sun on the outer courts and The Hill has no shade for hours at a time. Genuinely comfortable, broken-in walking shoes — the grounds are hilly gravel paths, not flat pavement, and a full day covers several miles on your feet even without queueing.",
    },
    wetWeather: {
      label: "Wet weather",
      body:
        "A compact umbrella and a proper waterproof jacket, not just a showerproof one — rain delays mean standing around outdoors, not sheltering indoors. A dry bag or ziplock for your phone if you're queueing overnight; ground moisture gets into everything by morning.",
    },
    onTheGrounds: {
      label: "On the grounds — what's allowed",
      body:
        "One bag per person, max 40cm × 30cm × 30cm — hard-sided cases, cool-boxes, and picnic hampers aren't allowed regardless of size, so a soft rucksack is the practical choice. A small picnic is genuinely fine if it fits your bag allowance. Alcohol is allowed within real limits — one bottle of wine/Champagne (750ml) or two cans of beer/premixed aperitif per person, no spirits or fortified wine, and corked bottles must be opened before you take them into a seating area. Cameras with a standard lens are fine; anything over 300mm, plus tripods, monopods, and selfie sticks, are not.",
    },
    queueSpecific: {
      label: "Queue-specific, if you're camping overnight",
      body:
        "A proper tent (small camping tents are allowed and common in the Queue), a sleeping bag rated for a genuinely cool English summer night, cash for early-morning coffee and pastries sold along the queue line, and a portable phone charger — you'll be checking your queue position and killing hours overnight.",
    },
  },

  forecastBox: {
    body: "The figures above are seasonal norms, not a forecast — check a live forecast once you're within range of your travel dates.",
    ctaText: "AccuWeather forecast for SW19 →",
  },

  sourcesFooter: "Sources: AccuWeather (seasonal norms), help.wimbledon.com (bag size, camera, and alcohol policy).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookup for a card rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "wimbledon-when-it-rains" ("When It Rains" experience) — needs live
//     experience data, not extracted here.
