import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const events = [
  { id: "b1816396-6d71-4693-a53f-05bccb2d8a8e", name: "Belgian GP", destId: "101b815a-ba64-4484-aad6-63721a44ed85" },
  { id: "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e", name: "Italian GP", destId: "0b0d8f9a-911d-4cc7-8049-50e4685958ca" },
  { id: "8f45cb75-f205-458b-8f31-48551e6d7cb8", name: "Abu Dhabi GP", destId: "d4d2ed49-0217-441d-8d1f-38c9b03db2ca" },
  { id: "91f298a3-ca22-49c3-9c8e-5a200f0026c9", name: "US Open", destId: "fb782de2-bbe6-410f-b466-2a4e628cda10" },
];

for (const e of events) {
  console.log(`\n=== ${e.name} ===`);

  const hotels = await sql`SELECT tier FROM planner_hotel_tier_cost WHERE destination_id = ${e.destId} ORDER BY tier`;
  const hotelTiers = hotels.map(h => h.tier);
  const hotelExpected = ["budget", "moderate", "splurge", "luxury", "general"];
  const hotelMissing = hotelExpected.filter(t => !hotelTiers.includes(t));
  console.log(`Hotel tiers: [${hotelTiers.join(", ")}]`, hotelMissing.length ? `MISSING: ${hotelMissing.join(", ")}` : "✓ complete");

  const tickets = await sql`SELECT tier, event_tier_label FROM planner_ticket_tier_cost WHERE sporting_event_id = ${e.id} ORDER BY tier`;
  const ticketTiers = tickets.map(t => t.tier);
  const ticketExpected = ["tier1", "tier2", "tier3", "tier4", "general"];
  const ticketMissing = ticketExpected.filter(t => !ticketTiers.includes(t));
  const ticketNullLabels = tickets.filter(t => t.tier !== "general" && t.event_tier_label === null);
  console.log(`Ticket tiers: [${ticketTiers.join(", ")}]`, ticketMissing.length ? `MISSING: ${ticketMissing.join(", ")}` : "✓ complete", ticketNullLabels.length ? `NULL LABELS: ${ticketNullLabels.map(t=>t.tier).join(",")}` : "");

  const flights = await sql`SELECT origin_market, seasonal_band FROM planner_flight_cost WHERE destination_id = ${e.destId}`;
  console.log(`Flight rows: ${flights.length}`, flights.length === 0 ? "MISSING ENTIRELY" : "");

  const bands = await sql`SELECT * FROM planner_destination_bands WHERE destination_id = ${e.destId}`;
  console.log(`Destination bands (local travel/food): ${bands.length ? "✓ present" : "MISSING"}`);
}

await sql.end();
