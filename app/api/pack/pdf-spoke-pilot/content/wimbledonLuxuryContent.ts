// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/LuxurySpoke.tsx), for the Full Pack PDF
// port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Note: unlike Cost/Tickets/etc., the `packages` array below is NOT
// DB-computed — LuxurySpoke.tsx hardcodes it as a local const, with prices
// already converted to USD at build time (per the spoke's own header
// comment: converted at £1 = $1.3491, checked 14 Aug 2026). It's genuinely
// static prose/data, not something getSpokeData() returns, so it's
// extracted in full here rather than left for the PDF route to recompute.
// If these prices are ever re-converted at a different FX rate, this file
// and LuxurySpoke.tsx both need updating by hand — there is no shared
// source of truth for them today.
//
// Same shape as the Cost pilot (wimbledonCostContent.ts) — prose keyed by
// section, verdicts kept as a separate Pro-gated array matching
// LuxurySpoke.tsx's own {isUnlocked && (...)} block.

export const wimbledonLuxurySpokeContent = {
  intro:
    "Luxury at Wimbledon is a stack of decisions, not one purchase — where you stay and how you eat around the grounds matter as much as which hospitality package you book. Wimbledon runs 6 official hospitality packages through Keith Prowse, its official hospitality partner, ranging from The Lawn's garden atmosphere to Le Gavroche's Michelin-pedigree tasting menu.",

  premiumTransit: {
    label: "Premium transit",
    body:
      "Multiple licensed operators run fixed-price chauffeur transfers from Heathrow to SW19 — a saloon runs from roughly £55 with meet-and-greet and flight tracking included, with executive cars and larger MPVs available for groups. Fixed at booking, no show-court-day surge pricing. Worth arranging specifically for a hospitality day or a finals-weekend arrival, when you don't want train timing to be the thing that could go wrong.",
  },

  offVenueLuxury: {
    label: "Off-venue luxury",
    name: "Wimbledon Afternoon Tea, The Dorchester",
    rating: { value: "4.6", reviewCount: "4,575 Google reviews" },
    body:
      "A genuine annual tradition, not a generic hotel tea dressed up for the occasion — The Dorchester's pastry team builds a real Wimbledon-themed menu served at The Promenade on Park Lane, running from the Fortnight's opening day. A real central-London alternative to a village pub on a rest day, or a proper occasion before an evening session if you're based centrally. Book via restaurants.TDL@dorchestercollection.com or +44 (0)20 7629 8888 — pricing varies by champagne pairing, so confirm the current rate when you book.",
  },

  // Static hardcoded package data — not DB-computed, extracted in full
  // (see file header note above).
  hospitalityPackages: {
    label: "The 6 official hospitality packages",
    priceNote: "Prices shown are \"from,\" ex VAT, per person, converted from the real GBP prices on Keith Prowse's own site.",
    packages: [
      {
        name: "The Lawn",
        price: "$1,707",
        status: "available",
        detail:
          "The original Keith Prowse hospitality space — an English-style garden with live music, a giant outdoor screen, a whisky and cigar bar, and guaranteed courtside seats on Centre Court or No.1 Court on your chosen date.",
      },
      {
        name: "The Treehouse",
        price: "$1,774",
        status: "available",
        detail:
          "A dedicated concierge, live DJs, and a private balcony overlooking the garden and lake — plus a genuinely distinctive touch: an olde-style sweet shoppe, a pamper space, and a slide down into The Lawn Garden.",
      },
      {
        name: "Rosewater Pavilion",
        price: "$3,474",
        status: "available",
        detail:
          "A four-course à la carte menu celebrating British ingredients, afternoon tea, strawberries and cream, and a complimentary bar running all day. Private tables for 2 to 12 guests, an outdoor terrace, live music, and private fast-track access through Gate 10.",
      },
      {
        name: "Rosewater Pavilion Private Dining",
        price: "$3,474",
        status: "available",
        detail:
          "The same Rosewater Pavilion package, booked as a private table specifically — same price, same inclusions, for parties who want the dedicated-table version rather than the shared pavilion floor.",
      },
      {
        name: "Centre Court Skyview Suites",
        price: "$3,717",
        status: "sold out",
        detail:
          "The most exclusive tier on offer — a private suite for 10 or 20 guests, a champagne reception, a four-course à la carte menu, a personal hostess, and a chauffeur car service within the M25. Sold out for this edition.",
      },
      {
        name: "Le Gavroche at The Lawn",
        price: "$3,771",
        status: "available",
        detail:
          "Chef Michel Roux's five-course 'Menu Exceptionnel', the Le Gavroche Cheese Trolley, and an Assiette du Chef dessert selection, with wine pairings Roux selected himself. Private tables for 2, 4, or 6, directly opposite Gate 5, with a private terrace and dedicated concierge — Le Gavroche's first return since the original restaurant closed in January 2024 after 57 years.",
      },
    ],
  },

  bookEarlyBox: {
    label: "Book early — packages sell out, sometimes months ahead",
    body:
      "Centre Court Skyview Suites is already sold out for this edition — a real example of how far ahead these packages move. Finals weekend and semi-final days are the first to go across every package; book as soon as the Championships dates are confirmed, not once you've decided which days to attend.",
  },

  premiumStayLabel: "A premium stay",

  sourcesFooter:
    "Sources: keithprowse.co.uk (package prices and inclusions), wimbledon.com official news article on the Le Gavroche launch, ukairporttransferservices.co.uk (Heathrow transfer pricing), dorchestercollection.com and londonist.com (Wimbledon Afternoon Tea).",

  // Pro-gated verdict content — only included in Full Pack mode, matching
  // LuxurySpoke.tsx's own {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which package we'd pick",
      body:
        "The Lawn is the sharpest entry point — the lowest price of the 6, and it already includes the garden, live music, and whisky bar that most of the other packages build on top of. Le Gavroche is the pick if the meal itself is the point of the day, not just a backdrop to the tennis — Michel Roux's tasting menu is a genuine culinary event, not standard hospitality catering dressed up. Rosewater Pavilion sits in between: real fine dining and a private table, without Le Gavroche's specific chef pedigree or price. Skip Skyview Suites' price bracket unless a large private group (10 or 20) is the actual plan — for 1 or 2 guests, Le Gavroche or Rosewater Pavilion's smaller private tables deliver the same exclusivity for less.",
    },
    {
      label: "A luxury day, sequenced",
      body:
        "Base yourself at Hotel du Vin Cannizaro House inside Cannizaro Park — a genuine country-house feel a short walk from the grounds, which matters more on a hospitality day when you want a proper unwind afterward rather than a Tube journey back into central London. Dress up for whichever package you book the same way you would for a Centre Court seat (see the Ticket Guide) — the whole day, from breakfast at the hotel through to hospitality, carries a more formal register than a grounds-pass day. The Dorchester's Wimbledon Afternoon Tea is the sharper call for a rest day rather than a grounds day — book it for the day before or after your hospitality package, not the same afternoon, since neither is a rushed experience and stacking them undercuts both. It also works well as the send-off after finals weekend, back in central London before you fly out.",
      crossLink: "See the full Ticket Guide.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookups for cards rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "wimbledon-the-lawn-hospitality" ("The Lawn" hospitality
//     experience) — needs live experience data, not extracted here.
//   - "wimbledon-cannizaro-house" (Hotel du Vin Cannizaro House — the
//     "premium stay" pick, also cross-referenced from the Hotels spoke) —
//     needs live experience data, not extracted here.
