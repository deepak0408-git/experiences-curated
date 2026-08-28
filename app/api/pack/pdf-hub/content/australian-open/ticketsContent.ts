// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/TicketsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased. Real
// per-tier prices (tier1-4) are DB-computed — not duplicated here.

export const australianOpenTicketsSpokeContent = {
  intro:
    "The Australian Open sells four genuinely different products, not just cheap-vs-expensive versions of the same seat. A Rod Laver Arena reserved ticket also grants access to Melbourne Arena (John Cain Arena), Show Court 3, and every outside court on the same day — but not Margaret Court Arena, which needs its own separate ticket.",

  ticketTypes: {
    label: "Ticket types",
    rows: [
      { fallbackLabel: "Ground Pass", detail: "Access to every outside court and the grounds — no reserved seat, walk-up only. The cheapest ticket at the Open, and often the best for close-up access to top players in the first week." },
      { fallbackLabel: "Grandstand", detail: "A numbered seat at John Cain Arena or Kia Arena — price varies by round and session." },
      { fallbackLabel: "Show Court Reserved Seating (Rod Laver Arena & Margaret Court Arena)", detail: "A numbered seat at Rod Laver or Margaret Court Arena — price climbs steeply as the draw narrows toward the second week." },
      { fallbackLabel: "Hospitality", detail: "AO Reserve hospitality — see the Luxury Guide for the full tier breakdown." },
    ],
  },

  presaleWindows: {
    label: "Presale windows open six months out",
    body:
      "For the 2027 tournament: an Accessibility presale opened 28 July 2026, a Mastercard presale followed 5 August, the AO Extras presale ran 6-12 August, and general public on-sale opened 13 August 2026. If you're reading this after those dates, best availability — especially for finals sessions — is already behind you; check the official AO resale marketplace linked from ausopen.com/tickets before any third-party reseller.",
  },

  // Pro-gated verdict content, matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which ticket we'd pick",
      body:
        "For a genuine first Australian Open, a Ground Pass for most of your trip plus one Grandstand or Show Court Reserved seat for a single marquee session is the sharpest combination. The Ground Pass gets you a full day of tennis across every outside court — often with top-20 players warming up close enough to hear the ball off the strings — and one reserved-seat session buys the real arena atmosphere without paying for it every day. Prices climb hard as the draw narrows: book your reserved seat for the first week if price matters, or accept the second-week premium if a specific quarterfinal or later match is the whole point of your trip.",
    },
    {
      label: "Day session or night session?",
      body:
        "Night session tickets only exist at Rod Laver Arena, so buying one locks you into that single arena for the evening, whereas a day session ticket at any reserved arena still leaves the rest of the grounds open to you beforehand. Early in the tournament, when a night session isn't guaranteed to carry a big name, a day session is usually the better pick precisely because it doesn't narrow your options. Once the draw thins from the quarterfinals on, night sessions are where the marquee matches sit — that's the point to switch your one reserved-seat session to a night ticket if seeing a specific star matters more than value.",
    },
    {
      label: "Where to sit if you buy a reserved seat",
      body:
        "The full seating breakdown — where the sun sits through a January afternoon session, and which sections are worth the upgrade.",
      experienceSlug: "rod-laver-arena-seating-comparison",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "ao-ticket-guide-grounds-session-finals" (ticketGuide)
//   - "outside-courts-grounds-pass-strategy" (outsideCourts)
//   - "rod-laver-arena-seating-comparison" (seatingGuide)
