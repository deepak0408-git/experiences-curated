import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

// --- Top 5 Concierge-tier (howToBook) picks for Belgian GP, decided 13 Oct 2026:
// Paddock Club, Eau Rouge Gold 3, Pouhon Silver 3, Camping at the Circuit,
// Romantik Hotel Le Val d'Amblève. Each passes at least one of: a real VIP/
// hospitality tier above the standard product; a genuine lead-time trap;
// a named insider contact or premium operator. See
// feedback_pro_concierge_scope.md for the standing rule this follows.

// 1. Paddock Club — ADD howToBook (was missing entirely despite being the
// single strongest Concierge case in the pack — the flagship hospitality tier).
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info,
    '{howToBook}',
    '"Paddock Club is sold exclusively through F1 Experiences — call +1 718-682-7493 (Mon-Fri, 09:00-18:00 GMT) or request a quote at f1experiences.com. Unlike grandstand tickets, Paddock Club does not go on general sale on a fixed release date; F1 Experiences takes bookings on a rolling basis until the weekend sells out, which for Spa typically happens months ahead given the limited capacity in the pit building itself. If you are booking for a group of 4 or more, call rather than book online — F1 Experiences can usually hold adjacent or clustered tables for groups booked as a single enquiry, which the online checkout does not guarantee. Ask specifically about the driver and team-personnel talks schedule when you book: these slots are not fixed weeks out and confirming your preferred day (Friday is typically quieter, Saturday draws the biggest-name guests) is worth doing at point of booking rather than leaving to chance."'::jsonb
  )
  WHERE id = 'ae6b94d2-84e5-455a-b143-f4dfc26e5562'
`;

// 2. Track Experiences / RSRSpa — DEMOTE: clear howToBook, fold the one
// genuinely useful bit (named contact Sylvain Kerten for groups) into a
// trimmed public bookingMethod instead.
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info - 'howToBook',
    '{bookingMethod}',
    '"Taxi Laps and Public Driving Experience bookable at spa-francorchamps.be; for groups or custom arrangements, contact Sylvain Kerten on +32 (0)87 29 37 19. RSRSpa trackdays at rsrspa.com or drive@rsrspa.com."'::jsonb
  )
  WHERE id = '1ca53bb0-083a-48e0-a34e-0b2a85fac3b5'
`;

// 3. Van der Valk Hotel Spa — DEMOTE: clear howToBook, fold the room-request
// tip and thermes-booking trap into bookingMethod.
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info - 'howToBook',
    '{bookingMethod}',
    '"Book direct at vandervalkhotelspa.be or via Booking.com. For race weekend, email reception@valkspa.be or call +32 87 27 97 00 to request an upper-floor room with a Place Royale view and to confirm group availability — the thermal package bundles the room with thermes access, but the thermes itself still needs a separate booking at thermesdespa.com."'::jsonb
  )
  WHERE id = '644b621d-75d5-4981-8bdb-f052ddf81c85'
`;

// 4. Spa Town / Thermes — DEMOTE: clear howToBook, fold the Thursday-evening
// timing tip (the one genuinely sharp insight) into bookingMethod.
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info - 'howToBook',
    '{bookingMethod}',
    '"Book Les Thermes de Spa in advance at thermesdespa.com — Thursday evening (from 17:30, weekday rate) is quieter and cheaper than a daytime race-weekend slot. Pouhon and the park are walk-in only. For the Casino de Spa, bring photo ID (21+) and dress smart casual."'::jsonb
  )
  WHERE id = '0c44c56e-8d7a-4f0b-96f2-ab8d6a95ef3f'
`;

// 5. Stavelot Abbey — DEMOTE: clear howToBook (logistics-only, no VIP tier
// or named premium operator), keep bookingMethod as-is (already short).

await sql`
  UPDATE experiences
  SET practical_info = practical_info - 'howToBook'
  WHERE id = '88f15c8f-52d6-42e0-a4f2-c3c63a88a28e'
`;

// 6. Ardennes Beyond the Circuit — DEMOTE: clear howToBook, fold the one
// genuine sell-out trap (Han-sur-Lesse July slots) into bookingMethod.
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info - 'howToBook',
    '{bookingMethod}',
    '"La Roche and Durbuy: walk-in. Han-sur-Lesse caves and wildlife park: advance online booking mandatory at tickets.grotte-de-han.be — July slots sell out, book weeks ahead. Le Sanglier des Ardennes in Durbuy: call +32 86 21 32 62 ahead for any evening in July."'::jsonb
  )
  WHERE id = '0156b0e4-5cd2-4679-8dac-5f751cb3a46a'
`;

// 7. Kemmel Straight — DEMOTE: clear howToBook, keep the F1 Experiences
// upgrade mention but trim it into bookingMethod.
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info - 'howToBook',
    '{bookingMethod}',
    '"Bronze general admission tickets sold via the official F1 ticketing site — widely available but buy early to secure circuit shuttle access. For a premium version with grandstand seating, F1 Experiences offers the Ardennes Club Gold 2 package (f1experiences.com/2027-belgian-grand-prix/ardennes-club-gold-2)."'::jsonb
  )
  WHERE id = 'ef526456-69f3-4a80-b96a-5c8f4200072b'
`;

// --- Trim bloated public bookingMethod on experiences that never had
// howToBook and aren't in the top 5 — these were carrying paragraph-length
// tactical detail (phone numbers, specific timing windows) in the PUBLIC
// field, which should be short per the howToBook/bookingMethod split.

// Street Food — trim to essentials, drop restaurant-by-restaurant tactics.
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info,
    '{bookingMethod}',
    '"No booking required for circuit stalls. Village restaurants in Francorchamps and Stavelot take direct reservations — book Saturday and Sunday evenings at least 2-3 weeks ahead, since race weekend fills them fast."'::jsonb
  )
  WHERE id = '596e7721-8008-46ed-bb24-8006f9748456'
`;

// Getting to the Circuit — trim to essentials, drop the full SNCB/zone detail.
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info,
    '{bookingMethod}',
    '"City Shuttle and parking: book at spagrandprix.com once sales open — parking sells by colour-coded zone and the closest (Yellow) goes first. TEC bus from Verviers-Central: buy on board, line 394 or 395. Your GP e-ticket includes an SNCB rail discount code — apply it at sncb.be."'::jsonb
  )
  WHERE id = 'b9424db5-4f4f-4bd1-80f5-64dbdbefb7b8'
`;

// Domino Steak House — DEMOTE: clear howToBook (this is a restaurant with a
// phone number, not a Concierge-tier case), trim bookingMethod to match.
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info - 'howToBook',
    '{bookingMethod}',
    '"Online reservations at dominosteakhouse.com/reservation-en-ligne, or call +32 87 77 15 05 for groups of 6+. Book 3-4 weeks ahead for Saturday dinner or Sunday lunch during race weekend."'::jsonb
  )
  WHERE id = 'bfd5e48d-dcba-4951-a006-23fa2a588dee'
`;

// Your Belgian GP Ticket Guide — trim; this is the ticket-tier overview, not
// a single hospitality product, so its own bookingMethod should stay short
// and point to the individual grandstand experiences for tactical detail.
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info,
    '{bookingMethod}',
    '"Buy direct at tickets.formula1.com or through official agents including spagrandprix.com/en/tickets and motorsporttickets.com. Avoid third-party resellers not listed as official partners."'::jsonb
  )
  WHERE id = 'e69ecc8e-6065-4abe-b56f-498f177b3edc'
`;

// --- Verify final state ---
const rows = await sql`
  SELECT e.id, e.title,
         e.practical_info->>'howToBook' AS how_to_book,
         e.practical_info->>'bookingMethod' AS booking_method
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = 'b1816396-6d71-4693-a53f-05bccb2d8a8e'
  ORDER BY e.title
`;

const withHowToBook = rows.filter((r) => r.how_to_book);
console.log("Experiences with howToBook (" + withHowToBook.length + "):");
for (const r of withHowToBook) console.log("  - " + r.title);

console.log("\nAll bookingMethod lengths:");
for (const r of rows) {
  console.log("  " + (r.booking_method?.length ?? 0) + " chars — " + r.title);
}

await sql.end();
