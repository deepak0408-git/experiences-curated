// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/ArrivalSpoke.tsx), for the Full Pack +
// Travel Brief PDF build. Prose half only, hand-copied not paraphrased. This
// spoke is status="public" with no {isUnlocked && (...)} block — no
// verdicts array. Roland-Garros has no Wimbledon-style overnight Queue —
// arrival strategy here is about morning practice-court access and
// outer-court seating.

export const frenchOpenArrivalSpokeContent = {
  h1: "Before 10am for practice courts, gate-opening for the actual matches",

  intro:
    "Roland-Garros doesn't run an overnight queue system the way Wimbledon does — gates open once each morning and any valid ticket gets you in. The real arrival decision here is about what you do with the first hour once you're inside, not how early you camp outside.",

  whenToArrive: {
    label: "When to arrive",
    scenarios: [
      {
        title: "To catch practice sessions",
        body:
          "Arrive before 10am. Top seeds warming up for that afternoon's matches train in full public view on the grounds' practice courts, and morning arrivals routinely end up a few metres from a top-10 player with no ticket upgrade needed.",
      },
      {
        title: "For a straightforward outer-court day",
        body:
          "Gate-opening time (10am, or 9am from 18-20 May) is early enough — there's no queue-jumping advantage to arriving before gates open, since seating on the outside courts is first-come but the grounds themselves aren't rationed by arrival order.",
      },
      {
        title: "For a Chatrier or Lenglen day-session ticket",
        body:
          "A reserved seat means there's no benefit to arriving right at gate-opening — the seat is yours regardless of arrival time. Most visitors arrive an hour or so ahead to clear security and reach the seat comfortably before the first match starts; check the daily order of play (released the evening before) for your session's actual first-match time.",
      },
      {
        title: "For a Chatrier night session",
        body:
          "Gates open at 18:30; play starts no earlier than 20:15. Arriving right at gate-opening leaves time to watch whatever's still finishing on outside courts before the main event, rather than sitting in an empty Chatrier for 90 minutes.",
      },
    ],
  },

  court14Callout: {
    label: "Court 14 — go early if a French player is drawn there",
    body:
      "Court 14 is a semi-sunken 2,200-seat outer court, and French players specifically want to be scheduled there in week one — the crowd is loud, partisan, and dedicated to noise from the first point to the last. Outer-court seating is unreserved and first-come, so if a home favourite is drawn there, arrive well ahead of that match's scheduled start.",
  },

  sourcesFooter: "Sources: rolandgarros.com, gonomad.com (practice-court viewing tips).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "roland-garros-practice-courts-outside-courts" (practiceCourts)
