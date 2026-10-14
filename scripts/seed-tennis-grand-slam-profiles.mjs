// Seeds the 14-characteristic ratings table for all 4 Tennis Grand Slams,
// from Tennis Grand Slam Trip Intelligence Development Implementation
// Specification v1.0 §4 (the only characteristic data approved so far).
// sportingEventId values verified directly against the live DB (not
// assumed) — see plan "concurrent-zooming-treehouse", 13 Oct 2026.

import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

const RUBRIC_VERSION = "tennis-spec-v1.0";

const PROFILES = [
  {
    sportingEventId: "1ced8699-d5ce-49fb-add4-6ebc6f251ec6", // Australian Open 2027
    sourceSlug: "ao",
    grandSlamName: "Australian Open",
    d01aHeritageIconicAppeal: 4, d01bModernSpectacle: 5,
    d03aShowcourtExperience: 5, d03bOutsideCourtDiscovery: 5, d03cPlayerProximityPractice: 4,
    d04aGroundsAtmosphere: 5,
    d05aCrowdEnergyIntensity: 4, d05bSpectatorCultureEtiquette: 3,
    d06aHostCityExploration: 5, d06bRegionalExploration: 5,
    d07aAccessibilityConnectivity: 5, d07bOnSiteComfortFacilities: 3,
    d08aAttendanceAffordability: 5, d08bDestinationCosts: 4,
  },
  {
    sportingEventId: "e6f2b585-196e-4842-8648-753a40979f4f", // French Open 2027
    sourceSlug: "rg",
    grandSlamName: "French Open",
    d01aHeritageIconicAppeal: 5, d01bModernSpectacle: 4,
    d03aShowcourtExperience: 5, d03bOutsideCourtDiscovery: 5, d03cPlayerProximityPractice: 4,
    d04aGroundsAtmosphere: 4,
    d05aCrowdEnergyIntensity: 4, d05bSpectatorCultureEtiquette: 3,
    d06aHostCityExploration: 5, d06bRegionalExploration: 5,
    d07aAccessibilityConnectivity: 4, d07bOnSiteComfortFacilities: 4,
    d08aAttendanceAffordability: 3, d08bDestinationCosts: 2,
  },
  {
    sportingEventId: "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf", // Wimbledon 2027
    sourceSlug: "wim",
    grandSlamName: "Wimbledon",
    d01aHeritageIconicAppeal: 5, d01bModernSpectacle: 3,
    d03aShowcourtExperience: 5, d03bOutsideCourtDiscovery: 4, d03cPlayerProximityPractice: 4,
    d04aGroundsAtmosphere: 4,
    d05aCrowdEnergyIntensity: 2, d05bSpectatorCultureEtiquette: 4,
    d06aHostCityExploration: 5, d06bRegionalExploration: 5,
    d07aAccessibilityConnectivity: 4, d07bOnSiteComfortFacilities: 4,
    d08aAttendanceAffordability: 4, d08bDestinationCosts: 3,
  },
  {
    sportingEventId: "91f298a3-ca22-49c3-9c8e-5a200f0026c9", // US Open 2027
    sourceSlug: "uso",
    grandSlamName: "US Open",
    d01aHeritageIconicAppeal: 4, d01bModernSpectacle: 5,
    d03aShowcourtExperience: 5, d03bOutsideCourtDiscovery: 5, d03cPlayerProximityPractice: 5,
    d04aGroundsAtmosphere: 5,
    d05aCrowdEnergyIntensity: 5, d05bSpectatorCultureEtiquette: 3,
    d06aHostCityExploration: 5, d06bRegionalExploration: 5,
    d07aAccessibilityConnectivity: 5, d07bOnSiteComfortFacilities: 3,
    d08aAttendanceAffordability: 2, d08bDestinationCosts: 3,
  },
];

for (const p of PROFILES) {
  await sql`
    insert into trip_intelligence_tennis_grand_slam_profiles (
      sporting_event_id, source_slug, grand_slam_name,
      d01a_heritage_iconic_appeal, d01b_modern_spectacle,
      d03a_showcourt_experience, d03b_outside_court_discovery, d03c_player_proximity_practice,
      d04a_grounds_atmosphere,
      d05a_crowd_energy_intensity, d05b_spectator_culture_etiquette,
      d06a_host_city_exploration, d06b_regional_exploration,
      d07a_accessibility_connectivity, d07b_on_site_comfort_facilities,
      d08a_attendance_affordability, d08b_destination_costs,
      rubric_version
    ) values (
      ${p.sportingEventId}, ${p.sourceSlug}, ${p.grandSlamName},
      ${p.d01aHeritageIconicAppeal}, ${p.d01bModernSpectacle},
      ${p.d03aShowcourtExperience}, ${p.d03bOutsideCourtDiscovery}, ${p.d03cPlayerProximityPractice},
      ${p.d04aGroundsAtmosphere},
      ${p.d05aCrowdEnergyIntensity}, ${p.d05bSpectatorCultureEtiquette},
      ${p.d06aHostCityExploration}, ${p.d06bRegionalExploration},
      ${p.d07aAccessibilityConnectivity}, ${p.d07bOnSiteComfortFacilities},
      ${p.d08aAttendanceAffordability}, ${p.d08bDestinationCosts},
      ${RUBRIC_VERSION}
    )
    on conflict (sporting_event_id) do nothing
  `;
  console.log(`Seeded ${p.grandSlamName} (${p.sourceSlug})`);
}

await sql.end();
