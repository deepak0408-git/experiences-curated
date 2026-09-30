import type { ActionTag, QuizAnswers, ScoredSeat, ScoreResult, Seat } from "./types";

// Ticket Intelligence scoring rubric. Pure function — same inputs always
// produce the same output, since the quiz page and the post-payment result
// page both call this independently (answers travel via the Dodo
// return_url query string, not server state — see build notes 25 Sep
// 2026). Deliberately organized by SEAT (grandstand/festival-lawn/
// hospitality), never by price tier — see circuit_seating_profile's own
// schema comment for why tier1-4 is the wrong axis for "what does this
// seat show you."

const TIER_RANK: Record<string, number> = { tier1: 0, tier2: 1, tier3: 2, tier4: 3 };

// Prestige tiebreaker — Paddock Club is F1's genuinely most premium
// hospitality product (real price likely $14,550+/person, the outlier
// behind its 5-star display override in FullResult.tsx), but it shares
// near-identical action tags with Pit Stop Club (both pit_lane,
// start_grid, podium_atmosphere) — without this, the two score IDENTICALLY
// on every question and Paddock Club can never win the tie, since nothing
// in the rubric otherwise distinguishes "most premium of the premiums."
// Small, narrow bonus: only applies for a fan who explicitly signaled
// "spare no expense" (q7=maximize) AND wants the hospitality experience
// itself (q5=lounge) — never changes any other seat's ranking. Bug found
// live 25 Sep 2026: no combination of quiz answers could ever surface
// Paddock Club as the top match.
//
// "House 44 at F1 Paddock Club" added 27 Sep 2026 for Mexico City GP — its
// own real, sourced price outlier (~US$16,338 vs. tier4's other hospitality
// seats), same reasoning as Brazilian GP's Paddock Club. Named uniquely, so
// no collision with the existing "Paddock Club" entry — but note that entry
// itself IS a real, known collision risk (this Set is keyed by seat name
// only, globally across events, not per-event) since Mexico City also has
// its own seat literally named "Paddock Club," which will incorrectly
// inherit this same tiebreaker bonus. Flagged, not fixed here — see
// FullResult.tsx's STAR_OVERRIDE_BY_SEAT_NAME comment for the matching gap.
const PRESTIGE_SEAT_NAMES = new Set([
  "Paddock Club",
  "House 44 at F1 Paddock Club",
  // Chinese GP, 27 Sep 2026 — seat is named "F1 Paddock Club" (matches
  // TicketsSpoke.tsx's own naming), which does NOT match the bare "Paddock
  // Club" key above, so it was silently missing this tiebreaker despite
  // being priced at US$17,145/person, the clearest outlier of any seat at
  // this circuit. Added directly rather than assumed-inherited — a prior
  // pass during seeding wrongly concluded this collided with "Paddock
  // Club" and needed no change; it doesn't collide, it just never matched.
  "F1 Paddock Club",
  // Monaco GP, 30 Sep 2026 — seat is named "F1 Paddock Club / Champions
  // Club" (see seed-monaco-gp-circuit-seating.mjs), which does not match
  // any existing entry above, so it was silently missing this tiebreaker.
  // Founder direction, 30 Sep 2026: Paddock Club always wins the prestige
  // tiebreaker against other tier4 hospitality products, by product design
  // — not contingent on a sourced real-price outlier the way the other
  // entries above are (Monaco's 2027 hospitality pricing is genuinely
  // unpublished, see circuit_seating_profile sourceNote). Added directly,
  // same collision-checking discipline as the Chinese GP entry above.
  "F1 Paddock Club / Champions Club",
]);

// Iconic-corner tiebreaker — Suzuka's Grandstand G ("Grandstand G — 130R")
// and Grandstand O score IDENTICALLY for a high-speed/technical fan (both
// actionTags: ["high_speed"], both tier2, both covered:false, both
// reservedSeating:true) — a coin-flip tie decided by array/DB row order,
// not by anything real. But they aren't actually equivalent: G's zoneLabel
// is Suzuka's own defining corner, 130R itself (Turn 15) — the corner the
// circuit's reputation is built on — while O only catches a brief, partial
// glimpse of 130R on the exit of Turn 14 (see O's own zoneLabel/sourceNote
// in seed-japanese-gp-circuit-seating.mjs). That's a real, sourced
// distinction, not a fabricated one. Small, narrow bonus, same mechanism
// and same restraint as PRESTIGE_SEAT_NAMES: only applies for the exact
// question that's actually tied (q1 = high_speed_or_technical), never
// touches any other seat's ranking or any other question. Founder
// direction, 27 Sep 2026 — G wasn't reliably surfacing as Suzuka's most
// famous corner despite that being the whole reason a fan would pick it.
const ICONIC_CORNER_SEAT_NAMES = new Set(["Grandstand G — 130R"]);

// Main-straight tiebreaker — Suzuka's Grandstand V1 and V2 score IDENTICALLY
// on every question (same actionTags, same tier3, same covered:true, same
// reservedSeating:true) — another coin-flip decided by DB row order. Not
// actually equivalent: V2 is confirmed (this pack's own seeded 'Grandstand
// V1/V2' experience + seed sourceNote) to sit higher, clear of the fencing
// obstruction V1 has, with genuinely unrestricted sightlines, 3 screens,
// exclusive Saturday driver-interview access, and a real top-of-tier3 price
// (~US$709+) vs V1's lower, partially obstructed view. V2 is the real
// superior seat of the pair, not an arbitrary pick — same narrow mechanism
// as ICONIC_CORNER_SEAT_NAMES, applies only to the question that's actually
// tied (q1 = start_grid, since both share start_grid/pit_lane/podium_
// atmosphere tags). Founder direction, 27 Sep 2026.
const SUPERIOR_TWIN_SEAT_NAMES = new Set(["Grandstand V2 — Main Straight Upper"]);

// Paddock-tour tiebreaker — British GP's Champions Club scores below Red
// Bull Pole Position and Starting Grid despite being a genuinely different,
// arguably more premium product for a specific kind of fan: it includes a
// guided F1 Paddock tour (confirmed via founder-provided product
// description, 30 Sep 2026 — see seed-british-grand-prix-circuit-seating.mjs
// sourceNote), which neither Red Bull Pole Position nor Starting Grid offer.
// The underlying gap is real and structural — nothing in actionTags or the
// current quiz captures "wants behind-the-scenes paddock access" as a
// signal, since actionTags describes track sightline, not hospitality
// amenity depth — but adding a new schema field/quiz question for this one
// seat wasn't judged worth it yet (founder direction, 30 Sep 2026: narrow
// tiebreaker now, matching SUPERIOR_TWIN_SEAT_NAMES's restraint, revisit
// only if this becomes a recurring cross-event pattern). Keyed to q5=lounge
// (off-track priorities) since the paddock tour is fundamentally an
// off-track, not on-track, differentiator.
const PADDOCK_TOUR_SEAT_NAMES = new Set(["Champions Club"]);

// Featured-grandstand tiebreaker — Suzuka's Grandstand Q2 is this pack's own
// named, written-up overtaking/technical-corner grandstand (dedicated
// experience: 'Q2 Grandstand'), sourced as sitting higher than Q1 with a
// clear, unobstructed view of the Astemo Chicane — but it only reliably
// outscores generic tier2 overtaking/technical rivals (Grandstand P, H) when
// a fan happens to also pick Q3=essential or Q7=maximize/balanced. A fan who
// wants overtaking action but is weather-indifferent and budget-economical
// currently loses Q2 to P/H on tier rank alone, even though Q2 is the
// circuit's actual featured stand for that exact preference. Small, narrow
// bonus — same mechanism as the others, applies only to the tied question
// (q1 = overtaking), never touches Q3/Q7 scoring itself. Founder direction,
// 27 Sep 2026.
const FEATURED_OVERTAKING_SEAT_NAMES = new Set(["Grandstand Q2"]);

// Q2 reason-text override, by seat name — "open lawn zone, room to move
// around" is the correct default for a genuine grass/festival-lawn GA area
// (e.g. a Heineken Village-style zone), but is factually wrong for a
// festival_lawn seat that's actually paved trackside standing, not lawn.
// Monaco's Zone Z (trackside standing between Nouvelle Chicane and Tabac)
// is this case — flagged live by the founder 30 Sep 2026. Secteur Rocher is
// NOT in this set — it's genuinely rocky/wooded hillside terrain (Le
// Rocher), a third distinct case from both "lawn" and "trackside standing,"
// covered by its own override set below rather than this one (founder
// correction, 30 Sep 2026, after an earlier pass wrongly grouped the two
// together). Same narrow, name-keyed mechanism as the tiebreaker Sets
// above — only overrides the reason text for named seats, never changes
// scoring. Add a seat name here only when a future festival_lawn seat is
// genuinely flat trackside standing, not lawn and not rocky/hillside.
const TRACKSIDE_STANDING_SEAT_NAMES = new Set(["Zone Z"]);

// A third festival_lawn reason-text case: RESERVED standing — the seat has
// reservedSeating=true (a guaranteed, assigned position within the zone,
// not first-come-first-served roaming) but is still seatType=festival_lawn
// rather than grandstand, since there's no numbered individual chair.
// British GP's General Admission Plus (Abbey GA+, Vale GA+, etc.) is this
// case — Silverstone's own product copy is explicit: "a guaranteed standing
// spot," not an open roam-anywhere zone. Flagged live by the founder 30 Sep
// 2026 ("are you sure Abbey+ is open lawn zone????") after the default
// "open lawn zone, room to move around" text rendered for it. Distinct from
// TRACKSIDE_STANDING_SEAT_NAMES (flat trackside standing, still unreserved/
// roam-within-zone) — this set is for standing zones that are additionally
// RESERVED. Also drives partial Q2="fixed" credit below, same mechanism as
// the existing unreserved-grandstand partial-credit line.
const RESERVED_STANDING_SEAT_NAMES = new Set([
  "Vale GA+",
  "Copse A GA+",
  "Copse C GA+",
  "Abbey GA+",
  "Luffield Complex GA+",
  "Luffield Terrace GA+",
]);

// Same mechanism, for a genuinely rocky/wooded hillside GA zone — distinct
// from both "lawn" (grass) and "trackside standing" (flat, paved). Monaco's
// Secteur Rocher (Le Rocher hill) is the first and so far only case.
const ROCKY_HILLSIDE_SEAT_NAMES = new Set(["Secteur Rocher"]);

// Hard filters — a seat that fails these is excluded from scoring
// entirely, never just penalized. Currently: minAge (e.g. Heineken
// Village's 18+ restriction) against the Q4 "family with young children"
// answer.
function passesHardFilters(seat: Seat, answers: QuizAnswers): boolean {
  if (answers.q4 === "family" && seat.minAge !== null && seat.minAge >= 18) {
    return false;
  }
  return true;
}

function scoreSeat(seat: Seat, answers: QuizAnswers): ScoredSeat {
  let score = 0;
  const reasons: string[] = [];

  // Q1 — track action preference (highest weight: the core "what do you
  // want to see" question).
  const actionMatch: Record<string, ActionTag[]> = {
    overtaking: ["overtaking"],
    start_grid: ["start_grid", "podium_atmosphere"],
    high_speed_or_technical: ["high_speed", "technical_corner"],
    atmosphere: [], // no direct tag match — scored via Q5 instead
  };
  const wantedTags = actionMatch[answers.q1] ?? [];
  const matchedTags = seat.actionTags.filter((t) => wantedTags.includes(t));
  if (matchedTags.length > 0) {
    score += 3 * matchedTags.length;
    reasons.push(`sees ${matchedTags.join(" and ").replace(/_/g, " ")}`);
  }

  // Q2 — fixed seat vs flexible. Grandstand/hospitality = fixed;
  // festival_lawn = flexible (roam within the zone) UNLESS it's a reserved
  // standing product (RESERVED_STANDING_SEAT_NAMES — a guaranteed, assigned
  // position within the zone, not roam-anywhere), which gets partial credit
  // on Q2="fixed" too. Unreserved grandstands are a partial match for
  // "flexible" fans (not truly assigned, though still a fixed stand) — same
  // small partial-credit pattern, applied symmetrically in both directions.
  if (answers.q2 === "fixed") {
    if (seat.seatType === "grandstand" || seat.seatType === "hospitality") {
      score += 2;
      if (seat.reservedSeating) reasons.push("numbered, guaranteed seat");
    } else if (seat.seatType === "festival_lawn" && RESERVED_STANDING_SEAT_NAMES.has(seat.seatName)) {
      score += 0.5;
      reasons.push("guaranteed standing spot");
    }
  } else {
    if (seat.seatType === "festival_lawn") {
      score += 2;
      let lawnReason = "open lawn zone, room to move around";
      if (RESERVED_STANDING_SEAT_NAMES.has(seat.seatName)) {
        lawnReason = "reserved standing area, guaranteed spot";
      } else if (TRACKSIDE_STANDING_SEAT_NAMES.has(seat.seatName)) {
        lawnReason = "trackside standing zone, room to move around";
      } else if (ROCKY_HILLSIDE_SEAT_NAMES.has(seat.seatName)) {
        lawnReason = "rocky hillside standing zone, room to move around";
      }
      reasons.push(lawnReason);
    } else if (seat.seatType === "grandstand" && seat.reservedSeating === false) {
      score += 0.5;
    }
  }

  // Q3 — weather protection.
  if (answers.q3 === "essential") {
    if (seat.covered === true) {
      score += 3;
      reasons.push("fully covered");
    } else if (seat.covered === false) {
      score -= 3;
    }
  } else if (answers.q3 === "preferred") {
    if (seat.covered === true) score += 1;
  }
  // "dont_care" — no scoring effect.

  // Q4 — group & mobility. Families/accessibility lean toward covered,
  // reserved (less arrive-early pressure), and non-standing seat types.
  // "assigned seating" implies an individual numbered chair — true for
  // grandstand/hospitality, but factually wrong for a reserved festival_lawn
  // product like GA+ (a guaranteed position within a standing zone, no
  // numbered chair). Flagged live by the founder 30 Sep 2026 on British
  // GP's Copse A GA+ result. The underlying "no need to arrive early"
  // benefit is real for both cases — only the phrasing needs to differ.
  if (answers.q4 === "family" || answers.q4 === "accessibility") {
    if (seat.reservedSeating === true) {
      score += 2;
      if (seat.seatType === "festival_lawn") {
        reasons.push("reserved spot — no need to arrive early to claim your place");
      } else {
        reasons.push("assigned seating — no need to arrive early to claim a spot");
      }
    }
    if (seat.seatType === "festival_lawn") score -= 1; // standing/lawn less ideal
  }

  // Q5 — off-track priorities.
  if (answers.q5 === "lounge" && seat.seatType === "hospitality") {
    score += 3;
    reasons.push("lounge seating with food and drink included");
  }
  if (answers.q5 === "fan_zones" && seat.seatType === "festival_lawn") {
    score += 2;
    reasons.push("closest to the fan zone atmosphere");
  }
  // Q1 "atmosphere" answer also leans on Q5 fan_zones/concerts — a fan who
  // wants "just being there" over a specific track view fits festival_lawn
  // or grandstand-with-fan-zone-access equally; no additional scoring here
  // beyond what Q5 already captures, to avoid double-counting the same
  // underlying preference.

  // Q7 — budget philosophy, scored against relative tier rank (never a
  // displayed $ figure — see circuit_seating_profile sourceNote entries
  // for why some tiers are ordinal-only).
  const tierRank = seat.tier ? TIER_RANK[seat.tier] : null;
  if (tierRank !== null) {
    if (answers.q7 === "economy") {
      score += (3 - tierRank) * 1.5; // reward cheaper tiers
      if (tierRank === 0) reasons.push("one of the most affordable options at this circuit");
    } else if (answers.q7 === "maximize") {
      score += tierRank * 1.5; // reward pricier tiers
      if (tierRank === 3) reasons.push("the most premium option at this circuit");
    }
    // "balanced" — mild preference for tier2/tier3 (the middle), avoids
    // both extremes without a strong pull either way.
    else if (answers.q7 === "balanced") {
      score += tierRank === 1 || tierRank === 2 ? 1.5 : 0;
    }
  }

  // Prestige tiebreaker — see PRESTIGE_SEAT_NAMES comment above. Small
  // (smaller than any single question's full weight) so it only breaks
  // genuine ties, never overrides a fan's actual stated preferences.
  if (answers.q7 === "maximize" && answers.q5 === "lounge" && PRESTIGE_SEAT_NAMES.has(seat.seatName)) {
    score += 0.5;
    reasons.push("the single most exclusive hospitality option at this circuit");
  }

  // Iconic-corner tiebreaker — see ICONIC_CORNER_SEAT_NAMES comment above.
  if (answers.q1 === "high_speed_or_technical" && ICONIC_CORNER_SEAT_NAMES.has(seat.seatName)) {
    score += 0.5;
    reasons.push("overlooks 130R, the corner that defines Suzuka");
  }

  // Main-straight tiebreaker — see SUPERIOR_TWIN_SEAT_NAMES comment above.
  if (answers.q1 === "start_grid" && SUPERIOR_TWIN_SEAT_NAMES.has(seat.seatName)) {
    score += 0.5;
    reasons.push("Suzuka's highest main-straight grandstand, with unrestricted sightlines");
  }

  // Paddock-tour tiebreaker — see PADDOCK_TOUR_SEAT_NAMES comment above.
  if (answers.q5 === "lounge" && PADDOCK_TOUR_SEAT_NAMES.has(seat.seatName)) {
    score += 0.5;
    reasons.push("includes a guided F1 Paddock tour");
  }

  // Featured-grandstand tiebreaker — see FEATURED_OVERTAKING_SEAT_NAMES
  // comment above.
  if (answers.q1 === "overtaking" && FEATURED_OVERTAKING_SEAT_NAMES.has(seat.seatName)) {
    score += 0.5;
    reasons.push("Suzuka's premium overtaking grandstand, clear of the fencing lower stands have");
  }

  return { seat, score, reasons };
}

export function scoreSeats(seats: Seat[], answers: QuizAnswers): ScoreResult {
  const eligible = seats.filter((s) => passesHardFilters(s, answers));
  const excludedCount = seats.length - eligible.length;

  const scored = eligible.map((s) => scoreSeat(s, answers)).sort((a, b) => b.score - a.score);

  return {
    top: scored[0],
    runnerUp: scored[1] ?? null,
    thirdPlace: scored[2] ?? null, // added 27 Sep 2026 — same sorted array, one more slot
    excludedCount,
  };
}
