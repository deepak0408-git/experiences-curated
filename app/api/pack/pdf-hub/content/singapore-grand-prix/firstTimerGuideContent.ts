// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/singapore-grand-prix/FirstTimerGuideSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const singaporeGpFirstTimerGuideSpokeContent = {
  intro:
    "Singapore isn't a race you can wing on generic Grand Prix knowledge. The night-race format, the zone system, and a genuine heat hazard designation are specific enough to catch out a first-timer who's only been to a daytime European race before — here's what actually trips people up.",

  mistakes: [
    { number: 1, label: "Treating it as a normal daytime race weekend", body: "This is F1's only true night race, run entirely under floodlights. That flips the usual rhythm: real daytime is available before each day's sessions start, most other Grand Prix cities don't give you that trade-off, and a first-timer who plans around a normal 10am-to-4pm schedule wastes it sitting in a hotel room. Build sightseeing into the mornings deliberately, not as an afterthought." },
    { number: 2, label: "Assuming your ticket covers the whole circuit", body: "Marina Bay Street Circuit splits into four numbered zones plus a restricted Paddock Zone, and most tickets only cover one. Zone 1 holds the Paddock, the Singapore Flyer, and several of the best-known grandstands; Zone 4 holds the Padang Stage. Buying a ticket without checking which zone it actually grants access to is the single most common first-timer regret here, especially for anyone who cares which concert stage they can reach." },
    { number: 3, label: "Underestimating the heat, or overestimating the umbrella", body: "Singapore was declared F1's first-ever official \"heat hazard\" race — real, current recognition of how demanding the daytime heat and humidity genuinely are, even though the race itself runs at night. Separately: large and golf-style umbrellas are banned inside every grandstand, and even a permitted small one can only be opened in a genuinely heavy downpour, not casually, since it blocks the view behind you. A poncho is the practical default, hydration and pacing are not optional extras." },
    { number: 4, label: "Planning Grab or a taxi as your race-night backup", body: "Rolling road closures around the circuit shut and reopen on a staged schedule across the whole weekend, not once for the whole event — a pickup point that worked Thursday can be sealed Saturday. Once closures are active, ride-hail and taxi drivers actively avoid the perimeter, surge pricing regularly hits 3-5x, and post-race waits run 45-60 minutes even when a car is matched. The MRT, extended to 1am specifically for race weekend, is the genuinely reliable option — treat Grab as a last resort, not a fallback." },
    { number: 5, label: "Missing that this is also a music festival", body: "Ten stages run all weekend, headlined this year by Lana Del Rey, The Killers, and JJ Lin, culminating each night on the Padang Stage. A first-timer who treats the concerts as background noise misses half of why this specific weekend is unlike any other stop on the calendar — check which zone your ticket covers if a specific headliner actually matters to you, since not every ticket reaches the Padang Stage.", experienceSlug: "singapore-gp-padang-stage-concerts" },
  ],

  practicalEssentials: {
    label: "Practical essentials",
    gateRules: {
      label: "What's not allowed through the gates",
      body:
        "One clear plastic bottle of water or soft drink, 600ml or under — no other outside food or drink. Bag checks happen at every gate and every Paddock Club entrance, and anyone entering the entertainment area gets checked too — refusal can mean no entry, no refund. Beyond food and drink, expect the usual large-event restrictions: professional/detachable-lens cameras, tripods and selfie sticks, drones, large umbrellas, folding chairs, and glass containers are all confiscated on discovery.",
    },
    essentialApps: {
      label: "Essential apps to download before you land",
      items: [
        { label: "F1 Official App", body: "Live timing and the race control messages feed — yellow flags, safety car deployments, investigations, and penalties as they're issued. Also useful for checking which viewing platforms have big screens in sightline." },
        { label: "SimplyGo", body: "Lets you tap a credit or debit card directly on MRT/bus fare gates without buying a physical EZ-Link card first — the simplest option if you'd rather not carry an extra card." },
        { label: "Grab", body: "Singapore's dominant ride-hailing app, useful for every day of the trip except race night itself — see Mistake 4 above for why it genuinely isn't reliable once circuit road closures are active." },
      ],
    },
    whatToCarry: {
      label: "What to actually carry",
      body:
        "Your ticket and photo ID, cash alongside cards (not every vendor takes cards), a reusable water bottle for the refill stations placed around the circuit, and a portable power bank — heavy phone use across a hot, crowded weekend drains a battery fast.",
    },
    accessibility: {
      label: "Accessibility",
      body:
        "Singapore GP runs dedicated Wheelchair Accessible Platforms at multiple points around the circuit (including Turn 1 and Empress), each letting a wheelchair user bring up to two companions, who purchase the same ticket and get seating beside the wheelchair slots. Wheelchair users and companions typically use Gate 4 (nearest MRT: Raffles Place). Not every path through the Circuit Park is wheelchair-friendly, some walkways, gates, and over/underpasses restrict access, so call the organisers directly (+65 6229 7777) to confirm your specific platform and route before travelling.",
    },
    gettingOutAfterward: {
      label: "Getting out afterward",
      body:
        "Changi Airport sits on the East-West Line, roughly 50 minutes by MRT from Raffles Place next to Marina Bay — plan that into any tight departure the morning after the race. MRT service is extended to 1am specifically for race weekend, but arrive at your station 15-20 minutes before the last train, crowds move slower than usual. A taxi to the airport normally runs about 30 minutes, but treat that as optimistic on race night specifically.",
    },
  },

  sourcesFooter:
    "Sources: singaporegp.sg official prohibited items and accessibility pages, f1-singapore.com, blog.sgtrains.com (MRT extended hours and airport transit), singapore-spirit.com (Grab surge pricing and road-closure behaviour), BBC Sport (heat hazard designation). Verified 3 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "singapore-gp-first-timer-orientation" (orientation)
//   - "singapore-gp-padang-stage-concerts" (padangStage)
