// Tennis Grand Slam Trip Intelligence — ranking and tie handling, per
// spec §6. Kept separate from scoreGrandSlam.ts so tie-detection logic is
// independently auditable. Supports 1/2/3/4-way ties — never manufactures
// a sole winner out of an exact tie.

import type { CandidateScore, TieGroup } from "./types";

const TIE_TOLERANCE = 1e-8;

/**
 * Sorts by full-precision finalScore descending, then groups adjacent
 * candidates within TIE_TOLERANCE of each other into the same rank group.
 * Comparisons chain transitively down the sorted list (A ties B, B ties C
 * => all three group together), matching how "tied for first" naturally
 * reads when there are more than 2 candidates.
 */
export function rankCandidates(scores: CandidateScore[]): TieGroup[] {
  const sorted = [...scores].sort((a, b) => b.finalScore - a.finalScore);

  const groups: TieGroup[] = [];
  let currentGroup: CandidateScore[] = [];
  let rank = 1;

  for (const candidate of sorted) {
    if (currentGroup.length === 0) {
      currentGroup.push(candidate);
      continue;
    }
    const last = currentGroup[currentGroup.length - 1];
    if (Math.abs(last.finalScore - candidate.finalScore) <= TIE_TOLERANCE) {
      currentGroup.push(candidate);
    } else {
      groups.push({ rank, candidates: currentGroup });
      rank += currentGroup.length;
      currentGroup = [candidate];
    }
  }
  if (currentGroup.length > 0) {
    groups.push({ rank, candidates: currentGroup });
  }

  return groups;
}

export function isFourWayTie(tieGroups: TieGroup[]): boolean {
  return tieGroups.length === 1 && tieGroups[0].candidates.length === 4;
}
