// Builds CharacteristicComponents for each Grand Slam from the DB's
// trip_intelligence_tennis_grand_slam_profiles rows. Unlike F1's
// buildCandidates.ts, there's no jsonb subdimension unpacking here — the
// spec's 14 characteristics are stored as flat numeric columns.

import type { CharacteristicComponents, GrandSlamCandidate } from "./types";

interface ProfileRow {
  sportingEventId: string;
  sourceSlug: string;
  grandSlamName: string;
  d01aHeritageIconicAppeal: string;
  d01bModernSpectacle: string;
  d03aShowcourtExperience: string;
  d03bOutsideCourtDiscovery: string;
  d03cPlayerProximityPractice: string;
  d04aGroundsAtmosphere: string;
  d05aCrowdEnergyIntensity: string;
  d05bSpectatorCultureEtiquette: string;
  d06aHostCityExploration: string;
  d06bRegionalExploration: string;
  d07aAccessibilityConnectivity: string;
  d07bOnSiteComfortFacilities: string;
  d08aAttendanceAffordability: string;
  d08bDestinationCosts: string;
}

function isValidSourceSlug(slug: string): slug is GrandSlamCandidate["sourceSlug"] {
  return slug === "ao" || slug === "rg" || slug === "wim" || slug === "uso";
}

export function buildCandidate(row: ProfileRow): GrandSlamCandidate {
  if (!isValidSourceSlug(row.sourceSlug)) {
    throw new Error(`Unrecognized Tennis Grand Slam sourceSlug "${row.sourceSlug}" — expected ao/rg/wim/uso.`);
  }

  const components: CharacteristicComponents = {
    D01A: Number(row.d01aHeritageIconicAppeal),
    D01B: Number(row.d01bModernSpectacle),
    D03A: Number(row.d03aShowcourtExperience),
    D03B: Number(row.d03bOutsideCourtDiscovery),
    D03C: Number(row.d03cPlayerProximityPractice),
    D04A: Number(row.d04aGroundsAtmosphere),
    D05A: Number(row.d05aCrowdEnergyIntensity),
    D05B: Number(row.d05bSpectatorCultureEtiquette),
    D06A: Number(row.d06aHostCityExploration),
    D06B: Number(row.d06bRegionalExploration),
    D07A: Number(row.d07aAccessibilityConnectivity),
    D07B: Number(row.d07bOnSiteComfortFacilities),
    D08A: Number(row.d08aAttendanceAffordability),
    D08B: Number(row.d08bDestinationCosts),
  };

  return {
    sportingEventId: row.sportingEventId,
    sourceSlug: row.sourceSlug,
    grandSlamName: row.grandSlamName,
    components,
  };
}

export function buildCandidates(rows: ProfileRow[]): GrandSlamCandidate[] {
  return rows.map(buildCandidate);
}
