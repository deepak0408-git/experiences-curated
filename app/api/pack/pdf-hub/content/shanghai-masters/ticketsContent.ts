// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/TicketsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. Real
// per-tier prices (tier1/tier2/tier3 costLow/costHigh) are DB-computed —
// not duplicated here, the PDF route must wire these up.

export const shanghaiMastersTicketsSpokeContent = {
  intro:
    "Qizhong runs three showcourts — Center Court (13,779 seats), Grandstand 2 (5,000 seats), and Grandstand 3 (3,000 seats) — plus dozens of outer practice and qualifying courts across the wider 80-hectare complex. Tickets are structured to let you flex around the draw rather than lock you into one court for the whole trip.",

  ticketTypes: {
    label: "Ticket types",
    rows: [
      {
        tierKey: "tier1",
        fallbackLabel: "Grounds Pass",
        detail: "Access to outer courts and practice areas — watch top-20 players warm up close, with none of the Center Court queueing.",
      },
      {
        tierKey: "tier2",
        fallbackLabel: "Grandstand",
        detail: "A numbered seat in a showcourt — price varies by round and seating tier.",
      },
      {
        tierKey: "tier3",
        fallbackLabel: "Center Court",
        detail: "A numbered seat on the tournament's marquee court — price climbs steeply as the draw narrows toward the quarterfinals and beyond.",
      },
    ],
  },

  oneTicketBothSessions: {
    label: "One ticket, both sessions",
    body:
      "Sessions run day and night — one daily ticket covers both, so a single day pass gets you a full day of tennis rather than a single match window.",
  },

  court17Note: {
    label: "Court 17 practice sessions are included, not extra",
    body:
      "Court 17, the purpose-built 1,200-seat practice stadium, is covered by any Grounds Pass or higher ticket tier — no separate booking needed. It's a real reason the Grounds Pass is worth considering even if you can afford Center Court: on a single afternoon it can put two or three top-20 players on the same practice court within a few hours of each other.",
  },

  sourcesFooter:
    "Sources: tennistours.com, koobit.com, sportsmatik.com, ATP Tour official site. Google Places rating for Qizhong verified 9 Aug 2026 (4.5, 57 reviews).",

  // Pro-gated verdict content, matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which ticket we'd pick",
      body:
        "For a genuine first Shanghai Masters trip, a grounds pass for most of the week plus one Center Court session for a marquee match is the sharpest combination — the grounds pass gets you the closest, cheapest access to top players during practice, and one Center Court booking gets you the real tournament atmosphere without paying for it every day. Center Court's own price swings hard across the tournament — early rounds sit at the lower end of that range, while quarterfinals and the Federer exhibition day onward climb sharply as the draw narrows.",
    },
    {
      label: "Which days to book it for",
      body:
        "This is a real 14-day event, not a fixed schedule — book your Grounds Pass days early (roughly 5-10 October), when the most matches run across the most courts and Court 17's practice sessions are busiest. A Center Court seat is genuinely cheapest in the first week, well before the Federer exhibition date — 16 October already prices at the quarterfinal rate, near the top of the range, so budget for that if seeing Federer is the plan.",
    },
    {
      label: "The Federer exhibition — no separate ticket exists",
      body:
        "\"Roger & Friends\" is folded into the tournament's own ticketing — there is no dedicated Federer-only product to buy. Your access depends entirely on holding a day-session ticket for 16 October specifically; whichever tier you buy for that date is what gets you in, the same as any other day. The catch is demand: exhibition-day sessions sell through faster than an average day in the draw, and since it's not a separate purchase, waiting risks losing the whole day's session, not just the exhibition slot. If seeing Federer is the priority of your trip, buy your 16 October ticket first, before anything else.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "shanghai-masters-ticket-guide" (ticketGuide)
//   - "qizhong-center-court" (centerCourt)
//   - "roger-friends-federer-exhibition" (federer)
