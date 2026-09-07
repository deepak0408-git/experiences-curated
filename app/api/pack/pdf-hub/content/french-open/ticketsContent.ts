// Extracted static prose from TicketsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/TicketsSpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased. DB-computed values
// (live tier pricing via tickets.find) are NOT duplicated here.

export const frenchOpenTicketsSpokeContent = {
  intro:
    "Roland-Garros sells four genuinely different products. A Grounds Pass gets you into every outside court plus Court Simonne-Mathieu — but not Chatrier or Lenglen. A Chatrier or Lenglen ticket is its own separate, show-court purchase. Official hospitality sits above both, bundling premium seating with catering.",

  // Ticket-types list — static label/detail text; price is DB-computed
  // (tier1-4 costLow/costHigh via tickets.find) and interpolated by the
  // route, not frozen here.
  ticketTypes: [
    {
      tierKey: "tier1",
      fallbackLabel: "Ground Pass / Outside Courts",
      detail:
        "Access to every outside court, Simonne-Mathieu's upper level, practice courts, and the fan zones — no reserved seat, general admission. The cheapest ticket at the tournament, and often the best for close-up access to top players.",
    },
    {
      tierKey: "tier2",
      fallbackLabel: "Court Simonne-Mathieu",
      detail:
        "A reserved seat at the greenhouse-wrapped Simonne-Mathieu court, built into the Jardin des Serres d'Auteuil.",
    },
    {
      tierKey: "tier3",
      fallbackLabel: "Court Philippe-Chatrier / Court Suzanne-Lenglen",
      detail:
        "A reserved seat at one of the two main show courts — price climbs by category and by which day of the tournament.",
    },
    {
      tierKey: "tier4",
      fallbackLabel: "Hospitality (Le Pavillon, La Mezzanine, L'Orangerie)",
      detail: "Official Sodexo Live!-run hospitality — see the Luxury Guide for the full tier breakdown.",
    },
  ],

  pricingNote:
    "Single-day prices from the most recently published Roland-Garros pricing (2026 season as reference; 2027 pricing not yet published). See the Cost Guide for the full trip breakdown, and the Luxury Guide for hospitality.",

  howToBuy: {
    label: "How to actually buy a ticket",
    body:
      "Roland-Garros runs on a ballot, not a first-come sale. Registration for the general public draw typically opens in early-to-mid December and closes mid-month; if you're selected, you're emailed a purchase window in the second half of February — though selection only guarantees a shot at buying, not a specific ticket. A second, first-come-first-served sales phase opens in late March, covering Opening Week and outside-court tickets for the second week. Tickets are digital-only via the official Roland-Garros app — there's no print-at-home option. Buy only through tickets.rolandgarros.com, travel.rolandgarros.com, hospitality.rolandgarros.com, or the tournament's named official agencies — the FFT publishes its own warnings about fraudulent resale sites, and its own official resale marketplace (returned tickets sold back at face value) is the only sanctioned resale channel.",
  },

  // Pro-gated verdict content, matching TicketsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which ticket we'd pick",
      body:
        "For a genuine first Roland-Garros, a Grounds Pass for most of your trip plus one Chatrier or Lenglen day for a single marquee session is the sharpest combination. The Grounds Pass gets you a full day across every outside court and Simonne-Mathieu — often with top seeds warming up close enough to hear the ball off the strings — and one show-court day buys the real Grand Slam atmosphere without paying for it every day. Target the first week if price matters more than who's playing; accept the second-week premium only if a specific quarterfinal or later match is the actual point of the trip.",
    },
    {
      label: "Day session or night session?",
      body:
        "Night sessions on Chatrier commit the entire evening to a single, deliberately chosen match — no rotation through multiple matches the way a day session runs. Early in the tournament, before the draw has thinned, a day session is usually the better value precisely because it doesn't narrow you to one match that could end in straight sets inside two hours. Once the draw narrows from the quarterfinals on, that's the point to consider a night session specifically — the tournament schedules its single best remaining matchup there.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards (free tier):
//   - "court-philippe-chatrier-suzanne-lenglen" (chatrierLenglen)
//   - "roland-garros-grounds-pass-tickets" (groundsPass)
// - linkedExperiences lookup for a card (gated, inside isUnlocked):
//   - "roland-garros-night-sessions" (nightSessions)
// - Ticket tier prices: tier1 (costLow only), tier2 (costLow only), tier3 and
//   tier4 (costLow-costHigh range) via tickets.find(t => t.tier === ...).
