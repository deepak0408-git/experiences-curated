// Extracted static prose from CostSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/CostSpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased.
//
// TRIP_NIGHTS = 3, Europe-only flight filter, NO exclusion list (source
// filters flights.region === "Europe" with no originMarket exclusions).
// Note: this CostSpoke only pairs tier2 across all 4 profile cards in the
// source's actual render (profiles map uses `tripTotal(p.hotel, tier2Ticket)`
// for every profile, not a per-profile ticket tier) — flagged, not fixed,
// since Bahrain/Shanghai/Singapore all pair distinct tiers per profile and
// this is a real divergence in the source, not an extraction error.

export const atpFinalsCostSpokeContent = {
  intro:
    "Turin is a genuinely affordable major European host city — hotels and daily costs run well below London or Paris equivalents. The real range in this trip's cost comes from the ticket tier: a group-stage Tribuna Galleria seat and a Premium Hospitality package are two very different trips, even on the same day.",

  profiles: [
    { tier: "Budget", hotelNote: "A basic, well-reviewed hotel", ticketNote: "Tribuna Galleria ticket" },
    { tier: "Moderate", hotelNote: "A solid 3-4 star hotel", ticketNote: "Tribuna Platea 2 ticket" },
    { tier: "Splurge", hotelNote: "An upscale hotel", ticketNote: "Higher-tier ticket" },
    { tier: "Luxury", hotelNote: "Turin's top hotels", ticketNote: "Premium hospitality — see the Luxury Guide" },
  ],

  flightsNote:
    "Flying in from further afield costs meaningfully more, so we're not folding every region into one misleading blended number here. Tell the Planner where you're starting from and it'll give you a real range for your actual route.",

  // Pro-gated verdict content, matching CostSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which ticket tier we'd pick",
      body:
        "Round-robin means every session ticket guarantees top-8 players, so the jump from Tribuna Galleria to Tribuna Platea 2 buys you a meaningfully better view for a genuinely worthwhile price difference — that's the sweet spot for a first ATP Finals trip. Premium Hospitality (tier4) is a different product entirely, not just a better seat.",
    },
    {
      label: "Which day gives the best value",
      body:
        "Group-stage days (15-20 Nov) beat semifinal or final weekend on value for the same tier — every one of those six days guarantees a genuine top-8 singles and doubles match, at pricing that hasn't yet priced in finals-weekend demand. If you can hold off choosing your exact day until the draw is announced, that's worth more than picking a specific weekday now.",
    },
    {
      label: "Where we'd spend the hotel budget",
      body:
        "Put the money into a central Turin location over anything closer to the arena — nothing is genuinely walkable to Inalpi Arena regardless of price point, so proximity isn't a real luxury lever here. Moderate-tier hotels near Porta Nuova or the historic squares give you the best version of the actual city for the two-thirds of your trip you're not at a match.",
    },
  ],
};
