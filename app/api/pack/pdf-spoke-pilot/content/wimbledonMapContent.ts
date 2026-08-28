// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/MapSpoke.tsx), for the Full Pack PDF
// port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Note: MapSpoke.tsx has NO {isUnlocked && (...)} Pro-gated block —
// status="public", the whole spoke is free. No `verdicts` field in this
// file for that reason (matches the source; not an omission).
//
// The official grounds map is a real image (R2-hosted PNG) — web-only,
// its URL is not reproduced here per the task's href/src exclusion rule.
// If the PDF needs the map image, source it directly from MapSpoke.tsx's
// <Image src="..."> at render time, not from this content module.

export const wimbledonMapSpokeContent = {
  intro:
    "Inside the All England Club you'll find 18 courts and about forty years of compressed tradition. What's less obvious from the outside is how accessible it actually is once you know how to move around.",

  siteFacts: {
    label: "Site facts",
    rows: [
      { label: "Address", value: "Church Road, Wimbledon, London SW19 5AE" },
      { label: "Total courts", value: "18, including Centre Court and No. 1 Court" },
      { label: "Best grounds-pass courts", value: "Courts 3, 12, and 18 — Court 3 most often draws a seeded player in the first week" },
    ],
  },

  officialGroundsMap: {
    label: "Official grounds map",
    credit: "Credit: wimbledon.org.",
    // NOTE: image itself (R2-hosted PNG) is web-only — not reproduced here.
  },

  watchingOuterCourtTennis: {
    label: "Watching outer-court tennis well",
    body: "Think match competitiveness over names: a seeded player in a tight early-round match beats watching a big name cruise. Check the Order of Play each morning at wimbledon.com before you arrive — it goes up the night before.",
  },

  aorangiParkPracticeCourts: {
    label: "Aorangi Park practice courts",
    body: "North end of the grounds — walk up and watch, no reserved spots or upgrade needed. Best access in the first few days, when top seeds are still warming up before their early-round matches. Grounds open at 10am but practice can start before that — worth arriving early if you want to catch a specific player.",
  },

  facilitiesAccessibility: {
    label: "Facilities & accessibility",
    items: [
      {
        label: "Accessibility Services kiosk",
        body: "Outside the southwest corner of Centre Court, with a team member also at the Information Point opposite Gate 3. Call 020 8944 1066 or email accessibility@aeltc.com at least a week ahead if you want to arrange support before you arrive.",
      },
      {
        label: "Gate 13 — the quietest entrance",
        body: "There's no dedicated quiet gate, but Gate 13 is the quietest general ticket-holder entrance if crowded queues at the main gates aren't workable for you.",
      },
      {
        label: "Accessibility Waiting Area — an alternative to the Queue",
        body: "In Wimbledon Park, for guests who can't wait in the standard overnight Queue due to access needs — make yourself known to stewards at the Queue Welcome area. Queue card rules still apply; one companion per guest, unless young children are in the group. A buggy runs from Blue Badge parking (Car Park 6) to this area.",
      },
      {
        label: "Quiet Room and Family Room",
        body: "The Quiet Room is in Centre Court's West Hall, opposite Gangway 104. The Family Room is in the Southern Village near Gate 11a, with sensory facilities and equipment available for feeding young children or getting away from the crowds.",
      },
      {
        label: "Accessible toilets and Changing Places",
        body: "Accessible toilets are located throughout the grounds and marked on the site map by left-hand (LH) or right-hand (RH) transfer. Two Changing Places facilities are on-site — next to Court 18 on St Mary's Walk, and south of No.2 Court by the Southern Village Larder.",
      },
      {
        label: "Wheelchair & mobility scooter charging",
        body: "Charging points for electric scooters and wheelchairs are in Centre Court's North East and North West Halls.",
      },
      {
        label: "Wheelchair & mobility scooter parking",
        body: "A limited number of parking spaces for mobility scooters are available inside the grounds — shown on the site map.",
      },
    ],
  },

  centreCourtToursBox: {
    label: "Centre Court tours run outside the Championships only",
    body: "Tours of Centre Court aren't available during the Championships — book for the week before (closes mid-June) or after the tournament ends in mid-July.",
  },

  sourcesFooter: "Source: wimbledon.com, AELTC Accessibility Guide.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookups for cards rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "the-hill-wimbledon" ("The Hill") — needs live experience data,
//     not extracted here.
//   - "wimbledon-outer-courts" ("The Outer Courts") — needs live
//     experience data, not extracted here.
//   - "wimbledon-practice-courts" ("The Practice Courts") — needs live
//     experience data, not extracted here.
//   - "wimbledon-museum-private-tour" ("Wimbledon Museum & Private
//     Tour") — needs live experience data, not extracted here.
