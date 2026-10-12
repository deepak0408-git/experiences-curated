// Builds ScoringComponents for each Grand Prix from the DB's
// trip_intelligence_grand_prix_profiles rows — the TypeScript equivalent of
// engine/full_calendar_audit.py's `components` dict construction.
//
// IMPORTANT: the source JSON's subdimension object key order does not
// reliably match rubric A/B order (confirmed for C05/C06 — see
// scripts/_lib/tripIntelligenceSubdimensionNames.mjs's comment for the full
// finding). This resolves subdimensions by NAME, not position, unlike the
// Python reference's `list(...values())[0]/[1]` — a deliberate correction,
// not a port of that fragility.

import type { GrandPrixCandidate, ScoringComponents } from "./types";

const SUBDIMENSION_LETTER_BY_NAME: Record<string, Record<string, "A" | "B">> = {
  // C01 split added 10 Oct 2026 for matching-rubric.patch.json's Q2
  // racing_circuit override (needs Racing Action / Circuit Character
  // weighted independently) — C02/C03 remain intentionally unsplit since
  // neither patch needs their subdimensions.
  C01: { "Racing Action": "A", "Circuit Character": "B" },
  C04: { "Event Spectacle": "A", "Glamour & Exclusivity": "B" },
  C05: { "Viewing Quality": "A", "Viewing Choice": "B" },
  C06: { "Destination Attractions": "A", "Trip Extension": "B" },
  C07: { "Destination Connectivity": "A", "Circuit Access & Logistics": "B" },
  C08: { "Weather Comfort": "A", "On-site Physical Comfort": "B" },
  C09: { "Fan Activities": "A", "Entertainment Festival": "B" },
};

interface SubdimensionEntry {
  score: number;
  weight: number;
}

interface CharacteristicDetail {
  subdimensions: Record<string, SubdimensionEntry>;
  derived_score: number;
}

interface ProfileRow {
  sportingEventId: string;
  sourceSlug: string;
  grandPrixName: string;
  c01RacingActionCircuitExperience: string;
  c02AtmosphereFanPassion: string;
  c03CircuitHeritagePrestige: string;
  c10Affordability: string;
  subdimensionDetail: {
    characteristics: Record<string, CharacteristicDetail>;
  };
}

function resolveAB(
  charKey: string,
  subdimensions: Record<string, SubdimensionEntry>,
): { A: number; B: number; weightA: number; weightB: number } {
  const letterMap = SUBDIMENSION_LETTER_BY_NAME[charKey];
  if (!letterMap) {
    throw new Error(`No A/B letter map for ${charKey} — only C01, C04-C09 split into subdimensions.`);
  }
  const result: Partial<Record<"A" | "B", number>> = {};
  const weights: Partial<Record<"A" | "B", number>> = {};
  for (const [name, data] of Object.entries(subdimensions)) {
    const letter = letterMap[name];
    if (!letter) {
      throw new Error(
        `Unrecognized subdimension name "${name}" for ${charKey}. Known names: ${Object.keys(letterMap).join(", ")}`,
      );
    }
    result[letter] = data.score;
    weights[letter] = data.weight;
  }
  if (result.A === undefined || result.B === undefined || weights.A === undefined || weights.B === undefined) {
    throw new Error(`${charKey} subdimensions resolved incompletely from keys: ${Object.keys(subdimensions).join(", ")}`);
  }
  return { A: result.A, B: result.B, weightA: weights.A, weightB: weights.B };
}

export function buildCandidate(row: ProfileRow): GrandPrixCandidate {
  const characteristics = row.subdimensionDetail.characteristics;

  // C01's A/B subdimensions are unpacked from the jsonb (same mechanism as
  // C04-C09 below) so Q2.racing_circuit can weight Racing Action / Circuit
  // Character independently per matching-rubric.patch.json. Plain C01 stays
  // a real, computed ScoringKey — weightA*A + weightB*B, using the jsonb's
  // own stored weights rather than hardcoding 0.5/0.5 — so every mapping
  // that still targets flat C01 (Q1.racing_first, Q2.legendary,
  // Q2.street_spectacle, Q4.more_f1) and all of matchReasons.ts keep
  // reading identical values to before this split existed.
  const c01Detail = characteristics.C01;
  if (!c01Detail) {
    throw new Error(`Profile ${row.sourceSlug} is missing characteristic C01`);
  }
  const c01 = resolveAB("C01", c01Detail.subdimensions);

  const components: Partial<ScoringComponents> = {
    C01: c01.weightA * c01.A + c01.weightB * c01.B,
    C01A: c01.A,
    C01B: c01.B,
    C02: Number(row.c02AtmosphereFanPassion),
    C03: Number(row.c03CircuitHeritagePrestige),
    C10: Number(row.c10Affordability),
  };

  for (const key of ["C04", "C05", "C06", "C07", "C08", "C09"] as const) {
    const detail = characteristics[key];
    if (!detail) {
      throw new Error(`Profile ${row.sourceSlug} is missing characteristic ${key}`);
    }
    const { A, B } = resolveAB(key, detail.subdimensions);
    (components as Record<string, number>)[`${key}A`] = A;
    (components as Record<string, number>)[`${key}B`] = B;
  }

  return {
    sportingEventId: row.sportingEventId,
    sourceSlug: row.sourceSlug,
    grandPrixName: row.grandPrixName,
    components: components as ScoringComponents,
  };
}

export function buildCandidates(rows: ProfileRow[]): GrandPrixCandidate[] {
  return rows.map(buildCandidate);
}
