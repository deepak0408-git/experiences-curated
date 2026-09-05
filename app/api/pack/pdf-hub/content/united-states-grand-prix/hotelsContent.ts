// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/HotelsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: unlike Abu Dhabi's Hotels spoke (per-hotel body prose written
// directly in the content module), US GP's free-tier "Three real picks"
// section renders entirely from ONE linkedExperience card
// ("us-gp-where-to-stay") with no separate inline prose per hotel in the
// source JSX — the three hotel write-ups (Hotel Magdalena, Austin Marriott
// Downtown, Embassy Suites) live inside that experience's own body/
// whyItsSpecial fields, not in this spoke file. Nothing invented here to
// fill that gap — flagged below in the DB-derived section.

export const usGpHotelsSpokeContent = {
  intro:
    "Austin doesn't have one obvious neighborhood to base an F1 trip from the way some host cities do — Downtown, South Congress, and the areas around Lady Bird Lake all put you within a genuinely short rideshare or shuttle connection to COTA, so the real decision is what kind of stay you want, not just proximity.",

  threeRealPicks: {
    label: "Three real picks, three budgets",
    // FLAG: source renders a single SpokeExperienceCard for
    // "us-gp-where-to-stay" here with no additional inline prose — no
    // separate per-hotel body text exists in this spoke file itself.
  },

  airbnbAlternative: {
    label: "Prefer an Airbnb or serviced apartment instead?",
    intro:
      "Hotels aren't the only option — Austin has a real short-let market, and for a multi-night trip a self-catered apartment can genuinely beat a hotel room on space and price. If you're searching Airbnb or a serviced-apartment platform rather than booking a hotel directly, these are the areas worth filtering for:",
    neighborhoods: [
      {
        name: "South Congress / Travis Heights",
        body:
          "Walkable to SoCo's shops, murals, and restaurants, with a real stock of converted bungalows and small apartment buildings — a genuinely different feel from a downtown high-rise, at a comparable or lower rate.",
      },
      {
        name: "East Austin",
        body:
          "The neighborhood Franklin Barbecue and Micklethwait Craft Meats both sit in — a real, still-affordable residential district with a large short-let stock, a short rideshare from both downtown and COTA.",
      },
      {
        name: "South Austin, near Zilker",
        body:
          "Closer to Barton Springs Pool and Zilker Park than either downtown or South Congress proper — a genuinely quieter, more residential base for anyone prioritizing the outdoor side of an Austin trip over nightlife proximity.",
      },
    ],
  },

  // Pro-gated verdict + booking-card content, matching HotelsSpoke.tsx's
  // own {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which base we'd pick",
      body:
        "For a genuine first Austin GP, South Congress is the right call if you want the city's own character on your doorstep — Hotel Magdalena puts you inside the SoCo scene itself, walkable to Allens Boots and Jo's Coffee. If you'd rather split time between the circuit and downtown nightlife, Austin Marriott Downtown is the safer, more reliable choice — strong, consistent guest feedback and genuine proximity to Sixth Street and Rainey Street. If value and space matter more than polish, Embassy Suites' two-room suites and included breakfast are a real, honest trade — go in expecting a solid stay, not a design hotel.",
    },
  ],

  bookingCards: {
    label: "Booking windows & timing",
    cards: [
      {
        name: "Hotel Magdalena",
        note:
          "Book directly via bunkhousehotels.com and ask specifically about room location relative to the pool and street-facing sides if noise is a concern — that's the recurring theme in guest feedback, not a universal issue.",
      },
      {
        name: "Austin Marriott Downtown",
        note:
          "Book via marriott.com or a major platform. F1 weekend brings a genuine citywide demand spike on top of the hotel's own strong baseline occupancy — book as early as your travel dates are fixed.",
      },
      {
        name: "Embassy Suites by Hilton Austin Downtown South Congress",
        note:
          "Book via hilton.com. Confirm the current race-weekend rate directly — this property's typical rate runs meaningfully below the other two on a normal weekend, but F1 demand compresses that gap.",
      },
    ],
  },

  sourcesFooter: "Sources: bunkhousehotels.com, marriott.com, hilton.com.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for the single free-tier card:
//   - "us-gp-where-to-stay" (whereToStay) — rendered with hideProCtas,
//     "Three real picks, three budgets" section
// - No other linkedExperiences cards on this spoke.
