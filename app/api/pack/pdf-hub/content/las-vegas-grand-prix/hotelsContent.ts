// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/HotelsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.

export const lasVegasGpHotelsSpokeContent = {
  h1: "A hotel room can double as a grandstand seat — if you book the right one",
  eventName: "Las Vegas Grand Prix",

  intro:
    "No other Grand Prix on the calendar lets your hotel room double as a viewing spot. The Strip circuit runs directly past a stretch of the biggest resorts on the Strip, and where you stay is one of the real, genuine decisions this trip involves — not just a place to sleep between sessions.",

  // 2 experience cards, generic <SpokeExperienceCard>, no inline copy beyond
  // the card itself:
  // - "las-vegas-gp-trackside-hotels" (trackside) — Trackside Hotels (Bellagio/Aria/Paris LV)
  // - "las-vegas-gp-off-strip-hotels" (offStrip) — Off-Strip Hotels (Circa/Virgin)

  neighborhoodsTable: {
    label: "Self-catered and value neighborhoods",
    rows: [
      {
        name: "East Harmon / Koval corridor",
        detail:
          "Directly adjacent to the East Harmon and Koval Zone grandstand entrances — real, walkable proximity to the circuit's mid-tier and premium seating, without the Bellagio/Paris track-view premium. Several extended-stay and boutique properties sit within a 5-10 minute walk of the grandstand gates.",
        transit: "Walking distance to East Harmon Zone entrance — no transit needed.",
      },
      {
        name: "Convention Center District (near Virgin Hotels)",
        detail:
          "A genuinely useful base if you're not chasing a Strip-front room — this is F1's own official rideshare pickup zone for the East Harmon Zone, meaning the organizers themselves consider it a smart logistics choice, not a compromise.",
        transit: "Official F1 rideshare pickup point; short drive or rideshare to circuit entrances.",
      },
      {
        name: "Fremont Street / Downtown",
        detail:
          "The best value base on this list — Circa and similar downtown properties run well below Strip rates even during race weekend, with the added bonus of Stadium Swim's free race-day watch party. The trade-off is real distance from the circuit itself.",
        transit: "Roughly 10 minutes by car, an hour on foot; 24/7 Monorail during race week connects downtown to Strip stations.",
      },
    ],
  },

  // Pro-gated verdict content, matching HotelsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which area we'd actually book",
      body:
        "If a track-view room genuinely matters to your trip, Bellagio's Fountain View rooms or Paris Las Vegas's Versailles Balcony Rooms are worth the premium — nothing else on the Strip replicates watching the race from your own balcony. Confirm the specific room category in writing before paying the premium; not every room in the right tower has an actual track sightline. If value matters more than the view, Circa downtown delivers real savings and a genuinely different, free way to be part of race weekend via Stadium Swim.",
    },
    {
      label: "Book track-view rooms months ahead, not weeks",
      body:
        "Track-view room categories at Bellagio, Aria, and Paris Las Vegas have a documented history of selling out well before race weekend, often months in advance. If this matters to your trip, book the room before locking in a ticket tier.",
    },
  ],

  bookingCards: [
    {
      name: "Bellagio",
      url: "https://bellagio.mgmresorts.com",
      note:
        "Ask specifically for Fountain View King or Fountain View Two Queen — even within that named category, a track sightline isn't guaranteed on every booking, so get the exact room number or written confirmation before paying the premium. Note the Fountain Club hospitality package (front-row track + fountains views) is a separate, independently ticketed F1 product — it is not included with any room booking.",
    },
    {
      name: "Aria",
      url: "https://aria.mgmresorts.com",
      note:
        "Aria's track-facing rooms sit in the Turns 14-16 zone, a different stretch of the lap than Bellagio/Paris's fountain straight — confirm the specific room category directly with the hotel before paying any premium rate, since resort-wide booking doesn't guarantee the view.",
    },
    {
      name: "Paris Las Vegas",
      url: "https://www.caesars.com/paris-las-vegas",
      note:
        "Ask specifically for a Versailles Tower Balcony Room — this is the named category with the genuine Turns 13-14 sightline, not a standard Strip-view room. Club Paris hospitality (trackside terrace, rooftop lounge, food and drink included) is a separate ticketed product from the room itself.",
    },
    {
      name: "Circa Resort & Casino",
      url: "https://www.circalasvegas.com",
      note: "Downtown, not trackside — the trade-off is real distance for real savings, plus Stadium Swim's free race-day watch party.",
    },
    {
      name: "Virgin Hotels Las Vegas",
      url: "https://virginhotelslv.com",
      note: "Off-Strip value base with an easy Monorail-adjacent ride into race weekend. Book earlier than a non-race-weekend Vegas trip — race-week dates move fast.",
    },
  ],

  sourcesFooter:
    "Sources: Google Maps (live ratings, linked from each hotel's own experience page), each hotel's official direct-booking site.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "las-vegas-gp-trackside-hotels" (trackside)
//   - "las-vegas-gp-off-strip-hotels" (offStrip)
