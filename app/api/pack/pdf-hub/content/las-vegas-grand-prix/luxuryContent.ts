// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/las-vegas-grand-prix/LuxurySpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Per hub-and-spoke skill §2i (Luxury spoke must cover the whole trip, not
// just the top hospitality product) — this spoke's own header comment
// confirms real researched content spans House 44 (Lewis Hamilton-branded
// Paddock Club tier), Trackside Tavern rooftop bar, the official F1
// Afterparty at Sphere (Backstreet Boys), Blacklane fixed-rate chauffeur
// service, and a Bellagio Fountain View Penthouse Suite fact distinct from
// the Trackside Hotels experience's own room categories. All extracted
// below, matching that full-trip scope.

export const lasVegasGpLuxurySpokeContent = {
  h1: "Luxury here is a stack of decisions, not one hospitality ticket",
  eventName: "Las Vegas Grand Prix",

  intro:
    "A genuinely luxury Las Vegas GP weekend spans more than one ticket product — hospitality tier, premium transit, in-circuit amenities beyond the top hospitality suite, and where a high-spend fan goes once the session ends. Here's the real, researched picture across all of it.",

  hospitalityTiers: {
    label: "Hospitality tiers beyond the top one",
    rows: [
      {
        title: "House 44 — the Lewis Hamilton-branded tier",
        detail:
          "A distinct, higher tier within the Paddock Club structure, roughly $4,000 more per 3-day pass than standard Paddock Club — the same garage-level location and paddock tour, with a more curated, branded format layered on top.",
      },
      {
        title: "Trackside Tavern — Paddock Club Rooftop",
        detail:
          "A sports-bar-format hospitality tier sitting on top of the Paddock building itself, with panoramic circuit views, all-inclusive food and drink, and big screens — a genuinely different atmosphere from the main Paddock Club floor below it.",
      },
    ],
  },

  premiumTransitCallout: {
    label: "Premium transit",
    body:
      "Fixed-rate chauffeur services (Blacklane and similar operators) run pre-booked transfers from Harry Reid International Airport directly to any Strip hotel, with the driver waiting a full hour post-landing — a genuine advantage over rideshare during a week when pickup points get congested. Pricing is quoted upfront per route rather than a single flat figure; treat any specific number as one illustrative example, not a guaranteed rate, and cross-reference the Getting There spoke for how road closures affect any private transfer's actual route on race days.",
  },

  afterSessionCallout: {
    label: "Where luxury goes after the session",
    body:
      "The official F1 Afterparty runs at Sphere on Saturday 21 Nov, 11:30pm-1am, headlined by the Backstreet Boys as the event's Official Post-Race Show — a genuine, confirmed event tie-in, not a generic nightlife recommendation. It's not a standalone ticket: access comes bundled with a qualifying 3-day T-Mobile Zone package (GA from $925, grandstand from $1,560, both including taxes and fees), a Venetian Resort hotel-and-race bundle via Vibee from $2,062 per person, or as a $116 add-on if you already hold a qualifying T-Mobile Zone ticket.",
  },

  luxuryHotelFactCallout: {
    label: "One new luxury-hotel fact",
    body:
      "Beyond Bellagio's standard Fountain View room categories, the property also offers a Fountain View Penthouse Suite — a full one-bedroom penthouse category with premium bedding and a private minibar, sitting above the standard Fountain View King/Two Queen rooms in both size and price. Confirm the specific suite number has a genuine track sightline before booking; not every Fountain View-branded category guarantees one.",
  },

  biggestDecisionLabel: "The single biggest luxury decision",
  // Card, generic <SpokeExperienceCard>, no inline copy beyond the card:
  // - "las-vegas-gp-paddock-club" (paddockClub)

  // Pro-gated verdict content, matching LuxurySpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "The combination we'd actually book",
      body:
        "For a genuine first luxury Las Vegas GP, standard Paddock Club for the 3-day pass plus a Fountain View room at Bellagio gives the strongest combination for the money — garage-level access and the paddock tour, paired with a hotel room that doubles as a second viewing spot. House 44's branded premium is worth paying only if the Lewis Hamilton tie-in specifically matters to you; the underlying access is otherwise identical to standard Paddock Club.",
    },
    {
      label: "Booking Paddock Club and House 44",
      body:
        "Neither tier has instant self-serve checkout at this price point — call F1 Experiences directly at +1 888 326 5430 (or hospitality@f1experiences.com) and confirm which specific tier still has availability for your dates before assuming anything you see listed online is still open. Both tiers have a documented history of selling out well before race weekend at this event specifically, so treat this as a call to make months out, not a browse-and-buy decision closer to the date.",
    },
    {
      label: "Booking a premium chauffeur",
      body:
        "Blacklane's Las Vegas airport transfer runs on upfront, fixed pricing with a full hour of post-landing wait time built in — book online or via their app, and get your specific pickup point confirmed in writing before race day, since a driver without a precise pre-cleared spot may not be able to reach you once Strip closures are active. Their site doesn't publish a race-week-specific rate, so treat any quote as needing reconfirmation once F1-weekend demand pricing kicks in.",
    },
    {
      label: "Booking the F1 Afterparty",
      body:
        "Access is bundled, not standalone — via f1lasvegasgp.com/f1-afterparty or tickets.formula1.com, either as part of a qualifying 3-day T-Mobile Zone package (GA from $925, grandstand from $1,560), the Venetian Resort hotel-and-race bundle via Vibee (from $2,062pp), or the $116 add-on if you already hold a qualifying T-Mobile Zone ticket. The add-on route is the cheapest way in if you've already bought T-Mobile Zone tickets separately.",
    },
  ],

  sourcesFooter:
    "Sources: f1experiences.com and tickets.formula1.com (House 44/Paddock Club contact, tier structure), blacklane.com (Las Vegas airport transfer service), f1lasvegasgp.com official F1 Afterparty page and corp.formula1.com (Backstreet Boys Afterparty announcement, ticket package pricing).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "las-vegas-gp-paddock-club" (paddockClub)
