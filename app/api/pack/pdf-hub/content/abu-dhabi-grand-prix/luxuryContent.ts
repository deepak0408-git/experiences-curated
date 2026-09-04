// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/LuxurySpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// IMPORTANT divergence from Bahrain's Luxury spoke: Paddock Club's intro
// prose + card + closing line all moved INTO the {isUnlocked && (...)}
// block on 4 Sep 2026 (was previously free content) — the founder wanted
// F1's own Paddock Club product itself gated, not just its booking
// mechanics. This content module reflects that — paddockClub is nested
// inside verdicts[0], not a top-level free field.

export const abuDhabiGpLuxurySpokeContent = {
  intro:
    "A luxury Abu Dhabi GP weekend is a stack of decisions, not one purchase — and the season-finale framing raises the stakes on all of them. Beyond the obvious top hospitality tier, a genuinely luxury weekend here spans a suspended VIP venue built into the track's own architecture, a real superyacht marina scene, premium hotel stays split between Yas Island and Dubai, and an after-dark circuit that's become as much part of Abu Dhabi's identity as the race itself.",

  skybridgeTerrace: {
    label: "Hospitality beyond the top tier",
    body:
      "Skybridge Terrace is genuinely unique among Grand Prix hospitality venues anywhere on the calendar — the only VIP space built directly over the track itself, inside the W Abu Dhabi's grid-shell bridge between Turns 13-14. It's a categorically different product from a trackside hospitality suite, not just a pricier one.",
  },

  marinaScene: {
    label: "The marina scene — real, and genuinely part of the finale",
    body:
      "Yas Marina is one of the very few Grand Prix venues where the circuit is built directly around a working superyacht marina, and the season-finale weekend has made this scene as much a part of Abu Dhabi's identity as the race itself — Amber Lounge and other yacht-hospitality operators specifically frame it as the season's closing party.",
  },

  afterParties: {
    label: "Off-circuit — the after-parties",
    body:
      "The Yasalam concerts (Zara Larsson and Lewis Capaldi on Thursday, Imagine Dragons on Saturday, The Chainsmokers and The Script closing out Sunday) are the official, ticketed spectacle — staged at Etihad Park, the Middle East's largest open-air entertainment venue, a short walk from the North Grandstand. They're bundled into every ticket tier, GA included, and the headline reason most fans plan their evenings around race week at all; a Golden Circle upgrade also exists as a real, separate paid add-on for closest-to-stage positioning and fast-track entry, if the seat matters as much as the headline act itself. But Abu Dhabi's race week runs a genuinely separate, parallel nightlife scene beyond those official stages, and for many fans on hospitality or yacht packages specifically, this is where the actual after-dark experience happens: White Abu Dhabi, W's WET Deck, and Garden on Yas all run dedicated race-week programming most fans don't know to plan for.",
  },

  privateTransit: {
    label: "Private transit — the E11 in style",
    intro:
      "Yas Island operates as a genuinely restricted-access zone during race weekend — only pre-approved vehicles and chauffeurs get beyond the key checkpoints, which makes a private transfer a real practical upgrade over a standard taxi, not just a comfort choice. It matters even more if you're commuting from Downtown Abu Dhabi or making the 90-minute run from Dubai, where the honest arrival-timing math around race-day traffic is a real planning question in its own right.",
    ratesNote:
      "Real published hourly rates from an Abu Dhabi-based operator: Toyota Prado from AED 100, Mercedes-Benz S-Class or Cadillac Escalade from AED 350, Mercedes-Benz V-Class from AED 250, GMC Yukon from AED 700, up to a Rolls-Royce Ghost from AED 1,699 — a genuine spread from a comfortable airport run to a proper statement arrival. All quotes include a professional driver and VIP routing for the restricted-access zone.",
  },

  ultraLuxuryStays: {
    label: "Ultra-luxury stays",
    body:
      "The real, new luxury fact worth knowing here: W Abu Dhabi's genuine architectural link to the circuit (the hotel the cars drive through) is unmatched by any other property on the calendar, and Atlantis The Royal in Dubai (the real current ultra-luxury pick, since Burj Al Arab is closed for renovation until late 2027) is worth the 90-minute trade for guests treating the trip as a wider UAE holiday. Both get the full breakdown — room types, booking windows, what a race-week rate actually looks like — in the Hotels guide.",
  },

  // Pro-gated content, matching LuxurySpoke.tsx's own {isUnlocked && (...)}
  // block. Paddock Club's intro/card/closing line are nested here since
  // they're gated too, not free (see file header note).
  verdicts: [
    {
      label: "The single biggest luxury decision: F1 Paddock Club",
      body:
        "Paddock Club is F1's own official hospitality product, run the same way at every round — pit-lane proximity, daily pit-lane walks, premium open bars, and a program of trackside entertainment. Abu Dhabi's edition carries extra weight as the season finale, and the confirmed real pricing here spans a very wide range depending on tier.",
      priceInterpolation: "tier4", // paddockPrice, 3-day package
      closingLine:
        "A grandstand sells you one great view of the racing. Paddock Club sells you the whole day around it — and at Abu Dhabi specifically, that includes the Yasalam concerts on the same ticket, from a hospitality position rather than the general crowd.",
    },
    {
      label: "Booking the marina and Skybridge Terrace",
      body:
        "There's no single official booking channel for a yacht berth — this is a private charter market. Ahoy Club and Burgess both run dedicated Abu Dhabi GP programs with trackside Yas Marina berths, working on an enquiry basis rather than fixed listings; berths start from roughly $3,500 and scale with vessel size, with a full charter package for the weekend able to reach six figures. Book months ahead through a real charter brokerage — trackside berths are consistently described as the hardest inventory to secure for the whole event, and check-in terms are set per individual charter agreement, not a standard booking flow. For Skybridge Terrace, real published pricing runs roughly AED 1,700 for a single-day package up to AED 11,000+ for the full 3-day package — get a current quote from more than one authorized operator (F1 Experiences, ZK Sports, Premium Access) rather than treating the first number you see as the market rate, since pricing has varied significantly by source for this specific venue. It's not sold through the standard circuit ticket portal.",
    },
    {
      label: "Booking private transit",
      body:
        "Book at least a few days ahead for race weekend specifically — Yas Island's restricted-access zone means a chauffeur needs a pre-approved permit to get you past the checkpoints closest to the circuit, and that arrangement takes real lead time compared to a normal city booking. Mala Limousines (phone +971 502 819 865, WhatsApp +971 585 750 167) is a genuine Abu Dhabi-based operator running dedicated F1 service with VIP routing; confirm your exact pickup point, vehicle, and whether the quoted rate already accounts for race-weekend demand before you book, since hourly rates can run above the published baseline during the event itself.",
    },
    {
      label: "Paddock Club and after-party access",
      body:
        "For Paddock Club specifically, book through F1 Experiences or an authorized reseller — for a season finale, the best suite locations (nearer the podium end of the pit lane) sell out fastest, and repeat/priority-client allocations often open before the general on-sale. If this is a return booking, contact your account representative directly rather than waiting for public sale. For White Abu Dhabi's biggest race-week nights, table or VIP bookings are essential — don't assume walk-in entry on the Saturday of race weekend specifically.",
    },
  ],

  sourcesFooter:
    "Sources: f1experiences.com, premiumaccess.team (Skybridge Terrace pricing/booking), ahoyclub.com, burgessyachts.com (yacht charter pricing/booking), limousines.ae (private transit pricing/booking).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "skybridge-terrace-w-abu-dhabi" (skybridge) — free, Hospitality section
//   - "yas-marina-yacht-charter" (yachtCharter) — free, marina section
//   - "yasalam-after-parties" (afterParties) — free, after-parties section
//   - "f1-paddock-club-yas-marina" (paddockClub) — GATED, verdicts[0] only
// - practicalInfo.bookingMethod for paddockClub — real DB field, rendered
//   as "Book only through official channels" if present, inside the
//   unlocked block after the 4 verdict paragraphs above.
