// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/TicketsSpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased. Real per-tier
// prices (tier1-4 costLow/costHigh, eventTierLabel) are DB-computed — not
// duplicated here.

export const atpFinalsTicketsSpokeContent = {
  intro:
    "The ATP Finals sells four real ticket tiers, from a Tribuna Galleria seat up to Premium Hospitality. Unlike some relocated or newly-hosted events, this pricing is genuinely published and current — these are real, confirmed figures, not historical estimates.",

  whyPricesVary: {
    label: "Why prices vary by day",
    body:
      "The figures above reflect a specific group-stage weekday session — pricing genuinely varies by which day and session you buy, since group-stage days early in the week carry different demand than semifinal or final weekend. Check the official ticket site for the exact day you want.",
  },

  officialBuyLink: "https://tickets.nittoatpfinals.com/en",

  // Pro-gated verdict content, matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which tier we'd pick",
      body:
        "Tribuna Platea 2 (tier2) is the sweet spot for a first ATP Finals trip — a meaningfully better sightline than Tribuna Galleria for a real but not extreme price jump, and every group-stage session guarantees top-8 players regardless of tier, so you're not paying for match quality, you're paying for proximity and comfort. If budget is the priority, Tribuna Galleria (tier1) still gets you a genuine top-8 match — round-robin means there's no cheap-seat compromise on who's playing, unlike a knockout event where a budget ticket can mean an early exit's empty court.",
    },
    {
      label: "Which day to buy",
      body:
        "Group-stage days (15-20 Nov) are the better value than semifinal or final weekend for the same tier — you get a guaranteed top-8 singles and doubles match on every one of those six days, at pricing that hasn't yet priced in finals-weekend demand. If you can hold off on choosing your exact day until the draw is announced, do.",
    },
    {
      label: "Considering Premium Hospitality?",
      body:
        "Tier4 (Premium Hospitality — Break/Smash/Ace) is a genuinely different product from the seating tiers above it, not just a better view — courtside access, signature dining, real behind-the-scenes elements. The full breakdown of what each hospitality package actually includes lives in the Luxury Guide.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "atp-finals-ticket-guide" (ticketGuide)
//   - "atp-finals-luxury-hospitality" (luxuryHospitality)
