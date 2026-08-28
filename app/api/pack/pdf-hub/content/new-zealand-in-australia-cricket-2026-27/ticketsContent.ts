// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/TicketsSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not
// paraphrased. TIER_PICKS table is static hardcoded content in the
// source, extracted verbatim.

export const nzAustraliaTicketsSpokeContent = {
  intro:
    "Cricket Australia Test tickets run on two real public tiers — General Admission and Reserved/Reserve Grandstand seating — with a third, genuinely separate corporate-hospitality channel sitting above both (see the Luxury Guide). There's no standard third public \"suite\" tier the way some other sports sell one. What changes from ground to ground isn't the tier structure itself, it's what each tier actually buys you — a grass bank at one ground is a completely different experience from a grass bank at another.",

  groundComparisonIntro:
    "Melbourne and Adelaide are the two grounds where where you sit genuinely changes the day: the MCG is simply the largest of the four, so the gap between a good seat and a bad one is bigger than anywhere else on this tour; Adelaide Oval is the only ground with a real fork in the decision itself, a formal reserved stand against the Hill's grass mound. Perth Stadium and the SCG don't have that same split, so General Admission versus Reserve above already covers what you need to know for those two.",

  // Pro-gated verdict content, matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which tier we'd pick, ground by ground",
      body:
        "General Admission is the right call at most of this tour — it's only worth paying up for Reserve on the specific days where crowd size actually threatens your sightlines, or where Adelaide's heat makes shade a real factor rather than a nice-to-have.",
    },
    {
      label: "Boxing Day at the MCG — the one day this tour treats differently",
      body:
        "Gates open 9am on Days 1-3, play starts 10:30am AEDT, and Day 1 crowds regularly run 70,000-90,000+ — among the largest single-day cricket attendances anywhere in the world. On a GA ticket for this specific day, arriving at gate-open isn't optional caution, it's the difference between a seat with a real sightline and standing at the back of a packed bay. Days 2-5 drop off fast from that peak, so the same GA ticket that's a real gamble on Day 1 is a completely relaxed call by Day 3.",
    },
    {
      label: "The SCG's Pink Test has its own crowd curve",
      body:
        "Jane McGrath Day — historically Day 3 of the New Year Test — is the real crush, not Day 1: 2024's Pink Test drew 37,129 on that day alone, the SCG's biggest Test crowd since the 2017/18 Ashes. Day 5, by contrast, has in past years opened to public entry by donation to the McGrath Foundation once the match is well advanced — worth watching for if your dates are flexible and you're comfortable with the match potentially finishing early.",
    },
    {
      label: "Presale timing",
      body:
        "The free CricketPlus presale membership and exact registration steps are covered in full in the Series Ticket Guide. Join before this series goes on public sale if you want Boxing Day or the Pink Test specifically, since both are the two highest-demand single days of the tour and presale is genuinely first-come.",
    },
  ],

  tierPicksTable: {
    label: "Our pick, ground by ground and day by day",
    rows: [
      { ground: "Perth Stadium", day: "Any day", pick: "General Admission", why: "No single day carries outsized crowd pressure here — GA holds up fine throughout." },
      { ground: "Adelaide Oval", day: "Any day", pick: "Square-on in the Western Grandstand", why: "Test start is ~10am; the Hill has no shade and no backrest for a 6+ hour day, and square-on seats give the widest tactical view of field placings." },
      { ground: "MCG", day: "Boxing Day (Day 1)", pick: "Ponsford Stand, lower tier if offered", why: "Day 1 crowds run 70,000-90,000+; Ponsford's lower tier (section M30 area) is rated the best value cricket viewing at the ground and picks up shade earliest — a 'Southern Stand' ticket isn't the same seat as a Ponsford one." },
      { ground: "MCG", day: "Days 2-5", pick: "General Admission", why: "Crowd drops off fast after Day 1 — GA is a relaxed call, and availability opens up too." },
      { ground: "SCG", day: "Jane McGrath Day (Day 3)", pick: "Brewongle Stand if available", why: "The real Pink Test crush — 37,000+ in 2024, the SCG's biggest Test crowd since 2017/18. Brewongle is well-regarded for both view and shade; the Doug Walters and Bill O'Reilly stands face into the afternoon sun and are worth avoiding for a full day in the seat." },
      { ground: "SCG", day: "Other days", pick: "General Admission", why: "Standard Test-day crowd, no special pressure." },
    ],
  },

  sourcesFooter:
    "Sources: cricket.com.au (CricketPlus mechanics), mcg.org.au and premiumseats.com.au (MCG Boxing Day gate times, historical crowd figures, and stand-by-stand seating detail), sydneycricketground.com.au and thecricketblog.info (SCG Pink Test historical attendance and Day 5 donation-entry precedent), shadedseats.com (SCG stand sun/shade orientation), saca.com.au and shadedseats.com (Adelaide Oval Hill vs. Reserve shade/seating). Historical crowd and gate-time figures are from prior seasons at each venue — 2026-27 specifics will be confirmed closer to the series.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "nz-australia-series-ticket-guide" (ticketGuide)
//   - "mcg-boxing-day-seating-comparison" (mcgComparison)
//   - "adelaide-oval-hill-vs-reserve" (adelaideComparison)
