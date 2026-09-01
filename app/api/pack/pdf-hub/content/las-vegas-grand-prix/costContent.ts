// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/CostSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. Nothing
// DB-computed is duplicated here — see the "DB-derived data" comment block
// at the bottom for what the PDF route needs to wire up itself via
// getSpokeData().
//
// Genuinely unusual, deliberate facts from this session's review (not
// extraction mistakes — reproduce as-is):
// - TRIP_NIGHTS = 3 (matches Bahrain GP's constant, not Wimbledon's 4).
// - The North America flight range EXCLUDES Philadelphia as a seed-data
//   outlier ($415-702 vs. every other NA market topping out at $458),
//   flagged not fixed at the source per founder direction 1 Sep 2026. The
//   PDF route's own flight-range recomputation must apply this same
//   exclusion, not a plain North-America filter.
// - Ticket tier labels: tier1 = Flamingo Zone GA, tier2 = West Harmon/Turn 3
//   Grandstand, tier3 = Main Grandstand, tier4 = Paddock Club.

export const lasVegasGpCostSpokeContent = {
  h1: "Hotel, ticket, and daily-spend numbers for race weekend",
  eventName: "Las Vegas Grand Prix",

  intro:
    "Las Vegas is not a cheap city to visit during race weekend — hotel rates on the Strip spike hard for the Grand Prix, and ticket prices run well above most other Grands Prix on the calendar. The numbers below cover a genuine full-trip estimate — hotel, food, local transport, and a ticket — not just the parts that were easy to price.",

  tripNights: 3,

  profiles: [
    {
      label: "Budget",
      ticketTier: "tier1",
      hotelNote: "Off-Strip value base, Circa or similar",
      ticketNote: "Flamingo Zone GA",
    },
    {
      label: "Moderate",
      ticketTier: "tier2",
      hotelNote: "Mid-range Strip hotel, easy walk or Monorail to grandstands",
      ticketNote: "West Harmon / Turn 3 Grandstand",
    },
    {
      label: "Splurge",
      ticketTier: "tier3",
      hotelNote: "Upscale Strip hotel, real proximity to the circuit",
      ticketNote: "Main Grandstand",
    },
    {
      label: "Luxury",
      ticketTier: "tier4",
      hotelNote: "Track-view room at Bellagio, Aria, or Paris Las Vegas",
      ticketNote: "Paddock Club",
    },
  ],

  moderateTripCaption:
    "A mid-range Strip hotel, food, local transport, and a West Harmon/Turn 3 grandstand ticket, for 3 nights. Excludes flights, see why ↓",

  flightsCallout: {
    label: "What about flights?",
    // flightRange itself is DB-derived, not extracted here.
    body:
      "Flying in from further afield — Europe, Asia — costs meaningfully more, so we're not folding every region into one misleading blended number here. Tell the Planner where you're starting from and it'll give you a real range for your actual route.",
    ctaLabel: "Check flight costs from your city →",
  },

  // Pro-gated verdict content — matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block. The source spoke embeds live ticket-tier
  // prices inline inside its verdict text (e.g. "{tier3 &&
  // formatMoneyRange(...)}") — the PDF route must recompute and interpolate
  // these the same way, not freeze a static figure here.
  verdicts: [
    {
      label: "Which ticket tier we'd pick",
      body:
        "For a genuine first Las Vegas GP, the Main Grandstand is the strongest single seat on the circuit — start/finish, pit lane views, the full ceremony. If watching real racing matters more than proximity to the ceremony, West Harmon or Turn 3 is the sharper pick for the price. Flamingo Zone GA is the honest budget option — standing room, real racing view, a fraction of any grandstand's price.",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "If a track-view room is the priority, that premium is worth paying at Bellagio, Aria, or Paris Las Vegas — nowhere else on the Strip lets a hotel room double as a grandstand seat. If budget matters more than the view, Circa downtown or Virgin Hotels off-Strip deliver real savings without sacrificing an easy ride into race weekend via the 24/7 Monorail.",
    },
    {
      label: "Book track-view hotel rooms early — genuinely months ahead",
      body:
        "Track-view room categories at Bellagio, Aria, and Paris Las Vegas have a documented history of selling out months before race weekend — book the room before the ticket if a track-view stay matters to you.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - Cost-tier math: hotels/tickets/destinationBand/flights, TRIP_NIGHTS = 3,
//   North-America-only flight filter EXCLUDING Philadelphia (deliberate
//   outlier exclusion, see header note above — not a plain regional filter).
// - linkedExperiences lookups for cards / booking cards:
//   - "las-vegas-gp-off-strip-hotels" (offStrip) — AreaBookingCard, uses
//     practicalInfo.bookingMethod / practicalInfo.website live fields
//   - "las-vegas-gp-trackside-hotels" (trackside) — AreaBookingCard, same
//     live practicalInfo fields
