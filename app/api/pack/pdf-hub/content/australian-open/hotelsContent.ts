// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/HotelsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.

export const australianOpenHotelsSpokeContent = {
  intro:
    "Unlike a venue built on the edge of a city, Melbourne Park sits close enough to the CBD that both a precinct-adjacent stay and a central-city stay are genuinely walkable or a short tram ride — this is a real lifestyle choice, not a proximity compromise either way.",

  moderateHotelNote: {
    label: "Real prices, 4-star tier",
    body: "A solid 4-star hotel in central Melbourne runs a real, DB-computed range outside the summer sporting peak — see the full Cost Guide for every tier.",
  },

  pricingTrap: {
    label: "Summer sporting calendar pricing trap",
    body:
      "Late December through late January is one of the most in-demand accommodation stretches Melbourne sees all year — the Australian Open draws well over a million visitors across its own fortnight, and it follows directly on from the Boxing Day Test and New Year's stretch in December. Book months ahead, not weeks.",
  },

  // Pro-gated verdict content, matching HotelsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd actually book",
      body:
        "For a first Australian Open, book East Melbourne over the CBD. Melbourne's January weather is genuinely volatile — a 15-20°C swing inside a single day is normal, and heatwave spikes above 35°C happen — so a short walk back to your room if a session gets interrupted or the heat turns matters more here than at most Grand Slams. The CBD is the better call specifically if you're planning to spend real time on Collins Street's restaurant scene or want to be close to Federation Square and the wider city for non-tennis days.",
    },
    {
      label: "If a hotel isn't the plan — Airbnb and hostels",
      body:
        "Short-term rentals are a real option, but Victoria's Short Stay Levy adds 7.5% to the total booking fee (nightly rate, cleaning fee, and GST all included) on any Airbnb or similar platform stay — the levy doesn't apply to hotels, motels, or hostels. Beyond the levy, hosts openly price up for this exact period and many set minimum-stay requirements once the tournament dates lock in. Richmond and South Yarra have noticeably more apartment-style rental stock than East Melbourne's hotel-dominated core, both a short tram ride from Melbourne Park rather than a walk. On the budget end, Melbourne has a genuine hostel scene — Bounce Melbourne, directly across from Flinders Street Station, and Space Hotel on Russell Street in the CBD are both real, currently operating hostels with dorm and private rooms. Availability for AO week specifically tends to disappear five to seven months out, well before the general presale even opens.",
    },
    {
      label: "Booking timing",
      body:
        "Book before the Boxing Day Test week hits in December — the same accommodation stock that fills up for cricket fans is what you're competing for a few weeks later for the Open, and Melbourne's summer sporting calendar means rates rise in steps as December progresses rather than jumping all at once.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "where-to-stay-melbourne-boxing-day" (stayGuide)
