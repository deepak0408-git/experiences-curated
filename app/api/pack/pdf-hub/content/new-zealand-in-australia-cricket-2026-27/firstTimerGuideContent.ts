// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/
// FirstTimerGuideSpoke.tsx), for the Full Pack PDF build. Prose half only,
// hand-copied not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const nzAustraliaFirstTimerGuideSpokeContent = {
  intro:
    "This is the first-ever four-Test Trans-Tasman series between New Zealand and Australia, and New Zealand's first tour of Australia since 2019-20 — a genuinely historic scale for a rivalry that Australia spent decades not taking seriously as a Test opponent at all.",

  rivalryFacts: {
    label: "The rivalry you're actually watching",
    items: [
      { title: "Australia barely played New Zealand for decades", detail: "The two sides met just 7 times in the 39 years between their first-ever Test in 1946 and the introduction of a proper bilateral trophy in 1985 — Australia simply didn't rate New Zealand as a fixture worth scheduling regularly. The Trans-Tasman Trophy exists specifically because that had to change." },
      { title: "New Zealand's first win over Australia took until 1974", detail: "It came at Lancaster Park, Christchurch — a five-wicket win built on Glenn Turner's 101 and 110 not out, still one of the great double-centuries in New Zealand cricket history. It's the moment the rivalry became a real contest rather than a formality." },
      { title: "Australia still leads the trophy 12-3", detail: "Despite New Zealand's golden generation winning the inaugural World Test Championship in 2021 under Kane Williamson and holding the world No.1 Test ranking, Australia has won 12 of 19 Trans-Tasman Trophy series to New Zealand's 3 — this series is a genuine chance to close that gap on Australian soil." },
      { title: "New Zealand hasn't beaten Australia in a knockout since 1981", detail: "Including the 2015 World Cup final, played at this same MCG, where Mitchell Starc bowled Brendon McCullum for a golden duck in the first over — one of the most replayed moments in World Cup history, and still a live wound for New Zealand fans travelling to Melbourne for this Test." },
    ],
  },

  traditions: {
    label: "Real traditions worth knowing",
    items: [
      { title: "The Boxing Day Test is its own institution", detail: "The MCG's 3rd Test, starting 26 December, is the single biggest date on the Southern Hemisphere cricket calendar — Australians build entire Christmas/New Year travel plans around it, and the atmosphere reflects that scale." },
      { title: "Beige is a real colour to know", detail: "New Zealand's traveling support wears beige, deliberately — see the Beige Brigade experience for the real story." },
    ],
  },

  mistakes: {
    label: "Mistakes most first-timers make",
    items: [
      { title: "Assuming every day of a Test looks the same", detail: "A Test's rhythm changes day to day — the first day often favours bowlers with a fresh pitch and new ball, the pitch typically flattens by days 3-4, and a match heading into day 5 has a genuinely different tension than day 1. Don't judge the whole experience off a single day." },
      { title: "Not checking what's not allowed through the gates", detail: "All four grounds share the same core rules: no glass bottles or cans, no outside alcohol, and a small-bag-only policy — anything too large to fit under your seat will be refused or checked at the gate. The exact bag-size limit differs slightly venue to venue (roughly A4-sized at the MCG, 30x40cm at the SCG), so travel light and expect a bag search at every ground." },
      { title: "Under-planning the gaps between Tests", detail: "This is a five-week tour with real gaps between legs — treat those gaps as genuine trip-planning opportunities, not dead time to rush through." },
      { title: "Booking Melbourne accommodation late", detail: "Boxing Day week is Melbourne's highest hotel-demand window of the entire year, independent of cricket — book that leg first." },
    ],
  },

  tourInNumbers: {
    label: "This tour, in real numbers",
    body:
      "4 Tests, 4 cities, roughly 4,300km of internal travel if you attend every leg — genuinely one of the largest single-tour footprints on the international cricket calendar.",
  },

  sourcesFooter:
    "Sources: cricket.com.au, ICC Test cricket format rules, MCG official Boxing Day Test history, Wikipedia (Trans-Tasman Trophy history and series record, cross-referenced against Grokipedia and Cricket Today), RNZ/NZ History (1974 first Test win over Australia), ESPNcricinfo and BBC Sport (2015 World Cup final, McCullum dismissal), NZ Herald (2021 World Test Championship win, golden-era ranking context), mcg.org.au and Ticketek (MCG Conditions of Entry), optusstadium.com.au (Perth Stadium Conditions of Entry), adelaideoval.com.au (Adelaide Oval Conditions of Entry), sydneycricketground.com.au (SCG Conditions of Entry) — bag and prohibited-item rules verified against each venue's own current entry conditions.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "beige-brigade-nz-traveling-support" (beigeBrigade)
