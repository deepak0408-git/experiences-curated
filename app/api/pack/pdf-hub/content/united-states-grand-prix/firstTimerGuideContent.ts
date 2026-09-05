// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/united-states-grand-prix/
// FirstTimerGuideSpoke.tsx), for the Full Pack PDF build. Prose half only,
// hand-copied not paraphrased.
//
// Structural note: unlike Abu Dhabi's version (numbered "mistakes" array
// used consistently), this spoke's 5 mistakes each have their own
// hardcoded heading string ("Mistake 1 — ...") directly in JSX rather than
// a shared `number` field pattern — preserved as written below.

export const usGpFirstTimerGuideSpokeContent = {
  h1: "5 mistakes first-time visitors make at COTA",

  intro:
    "The 2026 US Grand Prix is a standard weekend, not a sprint weekend — Austin ran the sprint format for three straight seasons but loses it for 2026. Friday brings two practice sessions (FP1 and FP2), Saturday brings a third practice session (FP3) followed by qualifying, and Sunday is race day itself — the only session where points are actually on the line. Here's what genuinely trips up a first-time visitor, drawn from real detail rather than generic advice.",

  mistakes: [
    {
      number: 1,
      label: "Booking parking too late, or not at all",
      body:
        "Official COTA parking (Lots C, F, K, L, T, R, plus a Park & Ride) starts at US$52/day, with Lot T near Turn 1 the closest and priciest at US$134.50/day — and first-timers consistently underestimate how quickly these sell out. A parking pass issued directly by COTA is required; showing up hoping to buy one at the gate on race day is a real, common way to end up parking far off-site or paying private-lot rates on FM-812 or Elroy Road instead (roughly US$60-150 for the full weekend).",
    },
    {
      number: 2,
      label: "Not scanning your ticket out before leaving the grounds",
      body:
        "If you're using a digital ticket and plan to leave the circuit and come back the same day, your ticket has to be scanned out at the gate before you go — skip that step and you may not be able to scan back in later. This trips up first-timers who duck out for a hotel break or a food run outside the grounds without realizing re-entry isn't automatic.",
    },
    {
      number: 3,
      label: "Bringing the wrong bag or the wrong chair",
      body:
        "Bags larger than 12\" x 12\" x 20\" aren't permitted (up to two bags per person, and they don't need to be clear) — arriving with an oversized bag means a real delay or a trip back to the car. General Admission ticket holders can bring a collapsible chair, but only with legs under 6 inches, and only in GA areas, never the grandstands; seat cushions are fine as long as they have no armrests. Coolers, glass containers, and selfie sticks are all turned away at the gate too.",
    },
    {
      number: 4,
      label: "Assuming General Admission means a bad view",
      body:
        "COTA's GA tickets genuinely offer better value than most other circuits' general admission — you move between open zones around the whole track rather than being fixed to one grandstand seat. The grassy hill near Turn 1 is consistently rated the standout GA vantage point for the whole weekend, not just a fallback option for people who couldn't afford a grandstand.",
    },
    {
      number: 5,
      label: "Not budgeting real time (or a real plan) for the walk and the traffic",
      body:
        "First-timers consistently underestimate how far the walk from parking lot to gate actually is at COTA's scale — the shuttle service from Downtown (Waterloo Park) or Northeast Austin (Travis County Expo Center) drops you much closer to the Grand Plaza entrance, but shuttle passes sell out and need to be booked ahead, not decided on race morning. Rideshare drop-off runs through the McAngus lot specifically, often with its own walk or supplemental shuttle to the gates — budget for that extra leg rather than assuming a rideshare drops you at the entrance itself.",
    },
  ],

  howToUseThreeDays: {
    label: "How to use the three days",
    rows: [
      { label: "Friday — Practice", body: "The quietest, cheapest-feeling day — smaller crowds, a good day to explore fan zones and figure out the circuit layout before it gets busy." },
      { label: "Saturday — Qualifying", body: "More intense than a lot of first-timers expect; grid position genuinely shapes Sunday's race — worth watching properly, not treating as a warm-up." },
      { label: "Sunday — Race", body: "The big one. Arrive early, expect the fullest crowds, and budget real time for both entry and exit." },
    ],
  },

  practicalEssentials: {
    label: "Practical essentials",
    items: [
      { name: "COTA is entirely cashless", body: "Bring a card (Visa, Discover, Mastercard all work) — don't assume cash gets you anything on-site. Water runs around US$4 and food/drink prices generally run high, so budget accordingly." },
      { name: "Free water refill stations", body: "Scattered around the circuit — bring a reusable bottle rather than buying water repeatedly." },
      { name: "Comfortable shoes, genuinely", body: "You will walk a long way over a full day moving between grandstands, fan zones, and food areas." },
      { name: "The official F1 USA / COTA app", body: "Worth downloading before you arrive — it's the best way to find food and beverage stalls, and it's where your digital tickets live for most grandstand tiers." },
    ],
  },

  atmosphereCallout: {
    label: "The atmosphere",
    body:
      "Austin's crowd brings genuine party energy across the whole grid, not just for the favorites — a different feeling from some of F1's more reserved European rounds. It's one of the most beginner-friendly F1 weekends on the calendar: big, loud, unpretentious, genuinely fun even if you don't know every driver.",
  },

  // Pro-gated verdict content, matching FirstTimerGuideSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "What actually matters most, first time",
      body:
        "Book your parking or shuttle pass the moment your tickets are confirmed, not closer to race weekend — this is the single most common regret among first-timers, more than any seat choice. If you're going General Admission, head straight for the Turn 1 hill rather than treating GA as a fallback plan; it's a genuinely strong vantage point in its own right, not a discount version of a grandstand seat.",
    },
  ],

  sourcesFooter: "Sources: circuitoftheamericas.com, austin.gp, Formula1.com, Mercedes-AMG F1.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "us-gp-first-timer-guide" (firstTimerGuide)
