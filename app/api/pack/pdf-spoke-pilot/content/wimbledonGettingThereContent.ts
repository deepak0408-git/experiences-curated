// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/GettingThereSpoke.tsx), for the Full Pack
// PDF port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Note: GettingThereSpoke.tsx has NO {isUnlocked && (...)} Pro-gated block
// — status="public", the whole spoke is free. No `verdicts` field in this
// file for that reason (matches the source; not an omission).

export const wimbledonGettingThereSpokeContent = {
  intro:
    "There's received wisdom about the District line that's mostly wrong, and a simpler route most guides don't mention. Below is the real train route, plus what to do if you're driving, taking a taxi, or arriving by bus.",

  trainRoute: {
    label: "The fastest real route — by train",
    body:
      "South Western Railway from London Waterloo to Wimbledon takes just 21 minutes, no change required — tap in with contactless or Oyster, no advance booking needed. The District line (Underground) terminates at the same station but is slower from most of central London, despite being the more commonly suggested route. If you're coming from the south side of the grounds, Southfields station (District line) is the better call — exit and follow Church Road south for a 15-minute walk to the southern gates.",
    factRow: { label: "Fastest route", value: "SWR train, London Waterloo → Wimbledon (21 min)" },
  },

  bus: {
    label: "Bus",
    body:
      "The 493 and 57 both stop close to Wimbledon Park and the AELTC grounds, and are a genuinely useful option if you're already staying in SW19 or nearby South London rather than coming in from central London — the same Oyster/contactless tap-in applies, and London's Zone 1–2 daily price cap (£8.90, frozen for 2026) covers bus journeys too. From further out, the train is faster and more reliable for match-day crowds than a bus route through local traffic.",
  },

  taxi: {
    label: "Taxi / rideshare",
    body:
      "A black cab or Uber from central London runs roughly 30–50 minutes each way depending on traffic and time of day — genuinely slower and pricier than the train for most of the Fortnight, since match-day traffic around SW19 backs up badly in the hour either side of gates opening and closing. Worth it late at night after the last Tube/rail departures, or if you're traveling with young children or heavy bags — otherwise the train is the better call every day of the Championships.",
  },

  driving: {
    label: "Driving & parking",
    body:
      "Driving is genuinely the least recommended option — central London traffic, the Ultra Low Emission Zone, and very limited parking near the grounds make it slower and more expensive than the train for almost everyone. If you do drive, the All England Club's own car park requires tickets purchased well in advance via wimbledon.com — they sell out. Wimbledon Park cricket ground runs as day-of overflow parking but fills by mid-morning on high-attendance days, so it's not a reliable fallback.",
  },

  planYourJourneyBox: {
    label: "Plan your exact journey",
    body:
      "Transport for London's own journey planner covers the last-mile walk from Wimbledon station to the All England Club gates, and any live disruption on the day.",
    ctaText: "Plan your journey on TfL →",
  },

  sourcesFooter: "Sources: Transport for London (tfl.gov.uk), wimbledon.com (parking and car park booking).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookup for a card rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "traveling-to-the-all-england-club" ("Traveling to the All England
//     Club" — plain wayfinding content per the spoke's own header comment,
//     its howToBook field was cleared 15 Aug 2026 so it no longer carries
//     the Concierge-pick badge) — needs live experience data, not
//     extracted here.
