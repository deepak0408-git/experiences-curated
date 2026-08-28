// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/GettingThereSpoke.tsx), for
// the Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.

export const singaporeGpGettingThereSpokeContent = {
  intro:
    "Singapore's MRT is the backbone of race weekend, and the system genuinely adapts for it: train service is extended to 1am on Grand Prix weekend, well past normal closing, so getting back from a late session or a headline concert set doesn't mean racing the last train. Here's how the system actually works, in the order you'll use it: which station to head for, how to pay, what to do if it's too crowded, and when a taxi genuinely isn't the answer.",

  stations: {
    label: "Which station, which line",
    rows: [
      { label: "Raffles Place — North-South & East-West Lines", value: "Closest to the Zone 1 side (pit straight, Turn 1/2, the Padang). A cross-platform interchange, so switching between the two lines here is genuinely fast." },
      { label: "City Hall — North-South & East-West Lines", value: "Serves the Padang/Stamford side of the circuit, near the Padang Stage." },
      { label: "Promenade — Circle & Downtown Lines", value: "Puts you closest to Marina Bay Sands and the Zone 2 grandstands (Republic, Promenade). The Downtown Line also connects direct to Bayfront and Chinatown for hotel access." },
      { label: "Esplanade — Circle Line", value: "Closest to the Esplanade waterfront side and the Wharf area, one stop from Promenade." },
    ],
    footnote:
      "None of these four are on the same single line, so check which one lines up with your ticket's zone and gate before race day, not after you've exited the wrong station.",
  },

  payment: {
    label: "Paying for it",
    options: [
      { label: "Singapore Tourist Pass", body: "Unlimited travel on basic buses, MRT, and LRT. $17 (1-day) to $45 (5-day). Worth it past roughly 10 trips across your stay — below that, a standard transit card is better value." },
      { label: "EZ-Link / NETS FlashPay", body: "S$10 total (S$5 non-refundable card fee, S$5 starting credit), works like a standard tap card. Better value than the Tourist Pass if you're not maximising trip count." },
      { label: "Contactless bank card", body: "Taps directly onto readers — no physical transit card needed if you'd rather skip buying one." },
    ],
  },

  busBackup: {
    label: "When the MRT is overcrowded — real bus backup",
    body:
      "Platforms at Promenade and City Hall genuinely do overcrowd after sessions end and the Padang Stage set finishes. Buses 106, 107, 133, 57, and 574 all serve the Marina Bay area as a real alternative, not a theoretical one — worth knowing the route numbers before race night, not scrambling to look them up on a packed platform.",
  },

  grabWarning: {
    label: "Grab and taxis — why they genuinely aren't reliable here",
    body:
      "Rolling road closures around Marina Bay Street Circuit shut and reopen roads on a staged schedule across the weekend, not once for the whole event — a pickup point that worked Thursday can be sealed Saturday, and viable routes shift by the hour. Once closures are in force, ride-hail and taxi drivers actively avoid the circuit perimeter, so a matched fare often doesn't mean a car actually arrives. Expect Grab surge pricing of 3-5x normal fares during peak race-weekend hours, on top of the standard 25% peak-hour and 50% midnight-6am surcharges that apply anyway, and post-race wait times regularly exceeding 45-60 minutes even when a car does show. Treat Grab and taxis as a last resort on race day itself, not a backup plan — the MRT and named bus routes above are genuinely more reliable.",
  },

  extendedHoursNote: {
    label: "Extended hours, not unlimited flexibility",
    body:
      "MRT service runs to 1am specifically for Grand Prix weekend, but don't treat that as a safety net if you're staying somewhere the MRT doesn't directly serve. Plan your last connection, especially after a late Padang Stage set — and don't treat Grab or a taxi as the fallback either, once circuit road closures are active, ride-hail becomes genuinely unreliable, not just pricier.",
  },

  sourcesFooter:
    "Sources: blog.sgtrains.com, thesingaporetouristpass.com.sg (official pricing), ezlink.simplygo.com.sg, landtransportguru.net (station/line data), singapore-spirit.com and tripmoo.net (Grab/taxi surge pricing and race-weekend restrictions). Verified 3 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "singapore-gp-getting-around" (transit)
