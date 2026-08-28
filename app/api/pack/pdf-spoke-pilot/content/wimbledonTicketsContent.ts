// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/TicketsSpoke.tsx), for the Full Pack PDF
// port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Same shape as the Cost pilot (wimbledonCostContent.ts) — one module per
// event/spoke, prose keyed by section, verdicts kept as a separate
// Pro-gated array matching TicketsSpoke.tsx's own {isUnlocked && (...)} block.

export const wimbledonTicketsSpokeContent = {
  intro:
    "Centre Court tickets are harder to get than the public Ballot suggests — accepting that early makes for a better trip. There are 3 real routes in, and they work completely differently: the free public Ballot (a lottery, no control over court or date), the overnight Queue (guaranteed grounds access, a real shot at a Show Court through resale), and Debentures (a five-year investment product, not a ticket most fans ever buy new — but its single-day resale tickets are a real, if pricey, way in).",

  // "All 3 routes, compared" — RouteComparisonTable. This table is static
  // hardcoded content (const ROUTES array in TicketsSpoke.tsx), not
  // DB-computed, so it's extracted verbatim here rather than left for the
  // route to recompute.
  routeComparisonTable: {
    label: "All 3 routes, compared",
    columns: ["Route", "Cost", "Control over court/day", "Booking lead time", "Odds of getting in"],
    rows: [
      {
        name: "Public Ballot",
        cost: "Free to enter",
        control: "None — random court/day",
        leadTime: "~9 months (applies previous Sept, results by Nov)",
        odds: "~1 in 10 overall (unofficial), lower for Centre Court",
      },
      {
        name: "The Queue",
        cost: "Day-pass/court price, paid on entry",
        control: "You choose the day; court via 3pm resale",
        leadTime: "Same day (overnight queue for Centre Court)",
        odds: "Guaranteed grounds access; resale into a Show Court not guaranteed",
      },
      {
        name: "Debenture resale",
        cost: "High, volatile secondary-market price",
        control: "You choose the exact day and court",
        leadTime: "As available — check resale platforms/broker",
        odds: "Guaranteed once purchased",
      },
    ],
  },

  route1Ballot: {
    label: "Route 1 — The public Ballot",
    body:
      "Free to enter, run by the All England Lawn Tennis Club (AELTC) through your myWimbledon account. Applications open in September the year before (2026's ballot ran 2–21 September 2025) and results land by October–November — so a Ballot entry for a given Championships closes out around 9 months before the tournament. You can't request a specific court or day — a win is randomly allocated to Centre Court, No.1 Court, No.2 Court, or No.3 Court, and tickets are non-transferable (reselling a Ballot ticket voids it). A successful application usually comes with 2 tickets. Wimbledon doesn't publish official odds, but independent estimates put overall success at roughly 1 in 10 — significantly lower for the highest-demand Centre Court sessions specifically.",
  },

  route2Queue: {
    label: "Route 2 — The Queue (day tickets)",
    intro:
      "The Queue is Wimbledon's famous walk-up line for day tickets — no ballot luck, no advance booking, just showing up and waiting your turn. It's genuinely well-organised (numbered cards, an official Queue Guide, stewards throughout) and guarantees grounds access; how early you need to arrive just depends on which court you're after.",
    rows: [
      {
        label: "For Centre Court and No. 1 Court",
        detail:
          "Join by midday the day before and camp overnight. Queue cards are issued from mid-afternoon, one per person present. Day tickets are released to queuers at 9:30am.",
      },
      {
        label: "For a grounds pass only",
        detail: "Arriving by 5-6am on the morning is usually enough — the line moves steadily once gates open at 10:30am.",
      },
    ],
    resaleQueueBox: {
      label: "The 3pm resale queue — how to actually register",
      body:
        "Ticket Resale is virtual now, run through the Wimbledon App on your phone, not a physical line. To join: download the Wimbledon App, sign in to your myWimbledon account, then register in person at either the Queue Village (8:30am–2:30pm) or the Ticket Resale Kiosk at Parkside, next to No.1 Court (10am–2:30pm) — a steward scans your myWimbledon QR code to enrol you. You're then free to roam the grounds while the app tracks your place in the virtual queue. When a ticket comes up, you get an SMS with a window to return to Parkside and buy it. Sales run 3pm–9pm, subject to availability. One hard requirement: you can't use Ticket Resale unless you've already entered the grounds that day — a Grounds Pass alone qualifies you.",
    },
  },

  route3Debentures: {
    label: "Route 3 — Debentures",
    body:
      "A Debenture isn't a ticket — it's a tradeable 5-year security that guarantees the holder the same numbered Centre Court or No.1 Court seat for every day of the Championships across that whole span, plus access to private restaurants and lounges. New issues are genuinely expensive and run on separate cycles per court: the current Centre Court series (2026–2030) issued at £116,000 per seat, paid in 3 instalments; the No.1 Court series (2027–2031) issued at £73,000. Both sold out on issue — new buyers can't apply directly to the AELTC. What's actually relevant for most fans: existing Debenture holders can resell individual single-day tickets they're not using themselves, through verified resale platforms or the AELTC's official broker. Prices swing hard with demand — a genuinely volatile secondary market, not a fixed rate card, so treat any specific figure you see quoted as a snapshot, not a guarantee.",
  },

  sourcesFooter:
    "Sources: help.wimbledon.com and greenandpurple.com (Ballot mechanics, cross-checked); greenandpurple.com (resale-queue registration locations/hours, cross-checked against a second independent guide); wimbledon.com official press release + theticketingbusiness.com + whalesbook.com (Debenture issue prices, cross-checked); greenandpurple.com (overseas federation allocation, Debenture ownership restrictions). Debenture secondary-market pricing intentionally not quoted to a specific resale-site figure — see note above.",

  // Pro-gated verdict content — only included in Full Pack mode, matching
  // TicketsSpoke.tsx's own {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which route we'd pick",
      body:
        "For a genuine first Wimbledon trip, plan around the Queue, not the Ballot — the Ballot is a real long shot for Centre Court specifically (roughly 1 in 10 overall, worse for Centre Court), applications close around 9 months out, and a win gives you zero control over which court or day you get. A Queue day ticket guarantees you're on the grounds with access to the outer courts and Henman Hill, plus a real shot at trading up into a Show Court through the 3pm resale — you control the day, you know the cost upfront, and you're not gambling 9 months of trip planning on a random draw. Save the Ballot as a genuinely free, no-downside bonus entry alongside a Queue-anchored plan, not your primary strategy. Reserve Debentures for a special-occasion splurge specifically — finals weekend or a marquee match — not a first-timer's default, given the price and the volatility of what you'll actually pay. Dress up if you land a Centre Court seat by any route — it carries an expectation the outer courts don't.",
    },
    {
      label: "Timing the resale queue",
      body:
        "Register the moment you're through the gates, not later in the day — the Queue Village window (8:30am–2:30pm) opens well before the Parkside kiosk (10am–2:30pm), so registering at Queue Village on your way in is the earliest you can lock in your place. The app then lets you roam freely, so there's no real cost to registering early even if you don't plan to buy. No. 1 Court is worth considering over Centre Court when a resale slot comes up: it seats fewer (12,345 vs 14,979) with better sightlines for most seats, and its own retractable roof (since 2019) means play isn't stopped by rain either — don't assume Centre Court is automatically the better resale pickup.",
    },
    {
      label: "If you're travelling from outside the UK",
      body:
        "Two things work differently for international fans. First, the AELTC allocates a real block of tickets directly to overseas national tennis federations and associations, distributed to their own affiliated clubs — worth checking with your home country's tennis federation, since this is a genuinely separate channel from the public Ballot, not just a rebrand of it. Second, Debenture ownership itself is restricted for residents of several countries (including the US, Canada, Australia, Japan, and South Africa) — but that restriction is on owning a Debenture, not on buying a Debenture holder's resold single-day ticket, which remains open to anyone. The Queue and the public Ballot both work identically for overseas and UK visitors — no separate process, no separate odds.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookups for cards rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "wimbledon-centre-court" (Centre Court experience) — needs live
//     experience data, not extracted here.
//   - "wimbledon-no1-court" (No.1 Court experience) — needs live
//     experience data, not extracted here.
