// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/HotelsSpoke.tsx), for the Full Pack PDF
// port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Same shape as the Cost pilot (wimbledonCostContent.ts) — one module per
// event/spoke, prose keyed by section, verdicts kept as a separate
// Pro-gated array matching HotelsSpoke.tsx's own {isUnlocked && (...)} block.

export const wimbledonHotelsSpokeContent = {
  intro:
    "Two honest options: SW19 and central London. The case for SW19 is straightforward — you're 15 minutes from the gates, the village has decent food and pubs, and you pick up the local atmosphere that makes the trip feel like more than a day out. The case for central London is that it works better if you're using Wimbledon as one day in a longer trip and don't mind the commute each way.",

  villageAtmosphere: {
    label: "What Wimbledon Village is actually like during the Fortnight",
    body:
      "For fifty weeks of the year, Wimbledon Village is a quiet South London high street. For two weeks in late June and early July, it becomes something else — the High Street and Church Road fill with fans in light summer clothes carrying rolled-up programmes, from several dozen countries, all somehow in the same square mile at once. The Dog and Fox, a Victorian pub directly on the walking route from the station, opens its windows and serves straight to the pavement; its terrace runs standing-room by mid-afternoon on first-week days. The Rose & Crown gets physically decorated for the Fortnight — a marquee extends the courtyard, big screens show Centre Court live, and by late afternoon it fills with the crowd that's just left the grounds. Fire Stables on Church Road opens early to serve breakfast to fans walking toward the gates. One thing worth knowing: the Village proper (High Street, the pub gardens) is a 15-minute walk uphill from Wimbledon station, and a separate destination from the residential streets immediately around the AELTC — budget time to move between the two if you're doing both in a day.",
  },

  sw19Picks: {
    label: "SW19 — 2 real picks",
    // Rendered via generic <SpokeExperienceCard>, no inline description text
    // in the spoke file — see DB-derived data note below.
  },

  centralLondonPicks: {
    label: "Central London — 2 real picks near Waterloo",
    intro:
      "Both sit a short walk from Waterloo — the real South Western Railway terminus for the direct, no-change 21-minute train to Wimbledon (see the Getting There guide), so you keep the same fast route even basing yourself centrally.",
    crossLink: "See the full Getting There guide.",
    // Rendered via generic <SpokeExperienceCard>, no inline description text
    // in the spoke file — see DB-derived data note below.
  },

  // Pro-gated verdict content — only included in Full Pack mode, matching
  // HotelsSpoke.tsx's own {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd actually book",
      body:
        "For a genuine Wimbledon trip — not a one-day detour from a longer London stay — book the village over central London. Hotel du Vin Cannizaro House sits inside Cannizaro Park itself, a real country-house feel a short walk from the grounds; The Rose & Crown is the village's own historic pub-with-rooms, simpler and closer to the daily rhythm of match mornings and post-day pints locals actually keep. If Wimbledon is genuinely one day inside a longer London stay, Park Plaza County Hall is the sharper central pick over NOX Waterloo — the same Waterloo train access at a real 4-star level, worth the difference if you're spending most nights in London anyway rather than SW19. NOX Waterloo earns its place on price and character both — a real budget aparthotel on a genuine local market street, not a chain, this close to Waterloo is genuinely rare in central London.",
    },
    {
      label: "Booking timing",
      body:
        "SW19's hotel stock is genuinely small next to central London's, and the Fortnight is a fixed, short, high-demand window every year — book as soon as the following year's Championships dates are confirmed, not once you've decided which days you're going. Waiting until ticket results land (Ballot results arrive by October–November) is already late for the village's best rooms; central London's larger hotel stock gives you more breathing room, but the Waterloo-adjacent properties specifically still fill for finals weekend.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookups for cards rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "wimbledon-cannizaro-house" (Hotel du Vin Cannizaro House) — needs
//     live experience data, not extracted here.
//   - "wimbledon-rose-crown" (The Rose & Crown) — needs live experience
//     data, not extracted here.
//   - "sw19-during-the-fortnight" (SW19 During the Fortnight — the
//     Itinerary spoke's primary anchor experience, cross-referenced here)
//     — needs live experience data, not extracted here.
//   - "nox-waterloo" (NOX Waterloo) — needs live experience data, not
//     extracted here.
//   - "park-plaza-county-hall-london" (Park Plaza County Hall) — needs
//     live experience data, not extracted here.
