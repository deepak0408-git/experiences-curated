// Extracted static prose from WeatherSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/WeatherSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.

export const abuDhabiGpWeatherSpokeContent = {
  intro:
    "Abu Dhabi's December race weekend runs consistently warm and dry — average temperatures around 26°C on Friday and Saturday, easing slightly to 25°C on race day, with mostly sunny skies and minimal chance of rain. That sounds simple, but the twilight race format changes the real packing calculation: qualifying starts at 18:00 and the race at 17:00 local time, so you're seated through the last, still-hot part of the afternoon before the sky shifts through sunset — roughly 17:40 in early December — into a fully floodlit finish.",

  forecastLinkUrl: "https://www.accuweather.com/en/ae/yas-marina-circuit/112526_poi/10-day-weather-forecast/112526_poi",

  packList: {
    label: "What to pack — by category",
    items: [
      { label: "Daytime layers", detail: "Short sleeves or a light long-sleeve shirt for the hottest part of the afternoon (Friday/Saturday sessions run in full daylight)." },
      { label: "Evening layer", detail: "A light jacket or sweater — the post-sunset temperature drop is real, even in December in the Gulf, and it's felt more in an open or partially-covered grandstand." },
      { label: "Sun protection", detail: "Sunscreen and a hat — non-negotiable for the daytime sessions, regardless of how the day ends." },
      { label: "Footwear", detail: "Comfortable, breathable shoes — Yas Island is genuinely large, and walking between shuttle stops, fan zones, and your seat adds up over a multi-day visit." },
    ],
  },

  honestTakeawayCallout: {
    label: "The honest weather takeaway",
    body:
      "\"Twilight race\" doesn't mean cool — it means two genuinely different conditions in the same day, in the same seat, without going home to change. Layer rather than commit to one outfit, and don't skip sun protection just because the race itself ends at night.",
  },

  // Pro-gated verdict content, matching WeatherSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "What we'd actually bring",
      body:
        "A packable, genuinely lightweight jacket beats a heavier layer here — the evening drop is moderate (roughly 25-26°C throughout, easing only slightly after dark), not a sharp cold-weather shift, so over-packing for cold is its own real mistake. A portable phone charger is worth including too — between the ticket app, photos, and staying connected through the after-race concert, battery life is a genuine, common problem across a full race day.",
    },
  ],

  sourcesFooter:
    "Sources: AccuWeather (Yas Marina Circuit December climate averages), Formula1.com (confirmed session times).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "twilight-race-packing-guide" (packingGuide)
