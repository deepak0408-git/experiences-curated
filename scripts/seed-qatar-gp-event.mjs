// Seeds the Doha destination and Qatar Grand Prix 2026 sporting event.
// Pattern mirrors scripts/seed-brazilian-gp-event.mjs (São Paulo GP) per
// event-builder skill §8. Hub-and-spoke is the mandatory default packFormat
// for new events (CLAUDE.md, 1 Aug 2026 rule) — set explicitly below.
//
// Research (12 Sep 2026):
// - Race weekend: 27-29 Nov 2026, standard weekend (Qatar dropped from the
//   2026 sprint calendar — Canada/Netherlands/Singapore took the new sprint
//   slots). Source: formula1.com/en/racing/2026/qatar, cross-checked via
//   web search against multiple 2026 calendar summaries.
// - Circuit: Lusail International Circuit, 5.419km, 57 laps, on the
//   outskirts of Doha.
// - Nearest airport: DOH (Hamad International) — Qatar's sole major
//   international gateway, user-approved 12 Sep 2026.
// - Ticketing: official F1 tickets portal exists but the specific product-ID
//   URL (tickets.formula1.com/en/f1-XXXX-qatar) could not be verified
//   (403'd on fetch) — using the general F1 Qatar race page instead of
//   guessing an opaque ticket-portal ID, per event-builder skill's rule
//   against inventing IDs in URLs.

import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

async function main() {
  // 1. Destination: Doha
  const [destination] = await sql`
    INSERT INTO destinations (
      name, slug, country_code, region, destination_type,
      nearest_airport_iata, currency, language, timezone,
      editorial_overview
    ) VALUES (
      'Doha', 'doha', 'QA', NULL, 'city',
      'DOH', 'QAR', 'Arabic', 'Asia/Qatar',
      ${"Doha is Qatar's capital and the base for any Grand Prix trip here — the Lusail International Circuit sits on the city's northern outskirts, a purpose-built venue that hosted its first F1 race in 2021 and has quickly built a reputation among drivers for its fast, flowing layout. The city itself is a study in rapid contrast: a glittering, ultramodern skyline along the Corniche a short drive from the circuit, alongside the older souqs and a genuinely serious museum and dining scene built on Qatar's wealth. For a November race weekend, expect warm, dry evenings — most of the on-track action happens after dark under floodlights, which is as much a part of the Qatar GP's identity as the circuit itself."}
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id, name, slug
  `;

  let destRow = destination;
  if (!destRow) {
    [destRow] = await sql`SELECT id, name, slug FROM destinations WHERE slug = 'doha'`;
    console.log("Destination already existed:", destRow);
  } else {
    console.log("Destination created:", destRow);
  }

  // 2. Sporting event: Qatar Grand Prix 2026
  const [event] = await sql`
    INSERT INTO sporting_events (
      name, slug, sport, tournament_series, edition_year,
      destination_id, venue_name, venue_address,
      start_date, end_date, recurrence, ticketing_url, editorial_overview,
      is_hidden, pack_status, pack_format, pack_currency
    ) VALUES (
      'Qatar Grand Prix 2026', 'qatar-grand-prix', 'formula_one', 'Formula 1', 2026,
      ${destRow.id}, 'Lusail International Circuit', 'Lusail International Circuit, Doha, Qatar',
      '2026-11-27', '2026-11-29', 'annual',
      'https://www.formula1.com/en/racing/2026/qatar',
      ${"Formula 1 heads to Lusail for a floodlit desert race weekend — a fast, flowing 5.4km circuit on Doha's northern outskirts that drivers rate among the best additions to the modern calendar. Most of the action happens after dark, turning the circuit into a sharp contrast of glowing car lights against the desert night. It's one of the most affordable race weekends on the calendar to attend, backed by serious government investment in the event, paired with a Doha stopover that mixes an ultramodern skyline with the city's museums, souqs, and a dining scene built on real wealth."},
      true, 'planned', 'hub_and_spoke', 'USD'
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id, name, slug, is_hidden, pack_status, pack_format
  `;

  let eventRow = event;
  if (!eventRow) {
    [eventRow] = await sql`SELECT id, name, slug, is_hidden, pack_status, pack_format FROM sporting_events WHERE slug = 'qatar-grand-prix'`;
    console.log("Event already existed:", eventRow);
  } else {
    console.log("Event created:", eventRow);
  }

  console.log("\nDone. Next steps per event-builder / hub-and-spoke-event-pack skill:");
  console.log("- Confirm experience list with user before writing any content (CLAUDE.md Experience lists rule)");
  console.log("- Season Planner cost data (hotel/ticket/bands/flight rows) — §8b, needs separate approval pass");
  console.log("- Hero image for the event + destination");
  console.log("- Pre-trip brief lines (do NOT write yet — too far out, 27 Nov 2026)");
}

main().then(() => sql.end()).catch(async (err) => {
  console.error(err);
  await sql.end();
  process.exit(1);
});
