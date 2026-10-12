// Maps each C04-C09 subdimension NAME (as it appears in the source handoff
// JSON's `characteristics.Cxx.subdimensions` keys) to its correct rubric
// letter (A/B), per docs/scoring-rubric.md's own definitions.
//
// This exists because the JSON's object key order does NOT reliably match
// rubric A/B order — confirmed by inspecting all 24 seeded profiles (10 Oct
// 2026): C04/C07/C08/C09 happen to list A before B, but C05 and C06 are
// REVERSED (Viewing Choice listed before Viewing Quality; Trip Extension
// before Destination Attractions). Taking subdimensions[0]/[1] positionally
// — what the Python reference engine's full_calendar_audit.py does via
// `list(...values())[0]/[1]` — would silently swap C05A/C05B and C06A/C06B.
// Always resolve by name through this map, never by object/array position.
//
// C01-C03 have no A/B split in the matching engine (they stay single
// aggregate values per fixed_budget_candidate.py's K-key list) even though
// the rubric defines subdimensions for them too — not included here.
export const SUBDIMENSION_LETTER_BY_NAME = {
  C04: {
    "Event Spectacle": "A",
    "Glamour & Exclusivity": "B",
  },
  C05: {
    "Viewing Quality": "A",
    "Viewing Choice": "B",
  },
  C06: {
    "Destination Attractions": "A",
    "Trip Extension": "B",
  },
  C07: {
    "Destination Connectivity": "A",
    "Circuit Access & Logistics": "B",
  },
  C08: {
    "Weather Comfort": "A",
    "On-site Physical Comfort": "B",
  },
  C09: {
    "Fan Activities": "A",
    "Entertainment Festival": "B",
  },
};

// Resolves a characteristic's subdimensions object into { A: score, B: score }
// by name, throwing loudly if an unrecognized subdimension name appears
// (rather than silently falling back to position).
export function resolveSubdimensionScores(charKey, subdimensions) {
  const letterMap = SUBDIMENSION_LETTER_BY_NAME[charKey];
  if (!letterMap) {
    throw new Error(`No A/B letter map defined for ${charKey} — only C04-C09 have one.`);
  }
  const result = {};
  for (const [name, data] of Object.entries(subdimensions)) {
    const letter = letterMap[name];
    if (!letter) {
      throw new Error(
        `Unrecognized subdimension name "${name}" for ${charKey} — not in SUBDIMENSION_LETTER_BY_NAME. ` +
          `Check for a naming variant (e.g. "Melbourne (Albert Park)"-style suffix) and add it explicitly.`,
      );
    }
    result[letter] = data.score;
  }
  if (result.A === undefined || result.B === undefined) {
    throw new Error(`${charKey} subdimensions resolved incompletely: ${JSON.stringify(result)} from ${JSON.stringify(Object.keys(subdimensions))}`);
  }
  return result;
}
