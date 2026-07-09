import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq, sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// ─── 1. Declassify Lake Como — not a genuine Concierge pick ───────────────────
const LAKE_COMO_ID = "9eb867ba-b849-4976-8771-b2572a6af816";
const lakeComoBookingMethod =
  "Book hotels directly or via Booking.com; ferry and train tickets are bought separately through Navigazione Laghi and Trenord. Know before you book: there's no direct train from Varenna or Bellagio to Monza — budget close to two hours door to door via Milano Centrale, not the 40 minutes some older guides suggest. Hotel Olivedo only operates February–October, so check dates for shoulder-season travel.";

await db
  .update(experiences)
  .set({
    practicalInfo: sql`jsonb_set(
      jsonb_set(practical_info, '{bookingMethod}', ${JSON.stringify(lakeComoBookingMethod)}::jsonb),
      '{howToBook}', 'null'::jsonb
    )`,
  })
  .where(eq(experiences.id, LAKE_COMO_ID));
console.log("✓ Declassified Lake Como — howToBook cleared, bookingMethod updated");

// ─── 2. Rewrite the 5 genuine Concierge picks — second person, no "client" framing ──
const CONCIERGE_UPDATES = [
  {
    id: "c224cf19-3793-46d4-97d5-ec7b01fa1515", // Hotel de la Ville
    howToBook:
      "Rooms typically sell out by February or March for a September race weekend — book as soon as the calendar is confirmed, usually the previous autumn. Book direct (info@hoteldelaville.com / +39 039 39421) for the best shot at a room upgrade and flexible dates. Ask about their driving experience package with Pure Sport, which bundles circuit time with your stay. If the hotel's full, On Location Experiences and F1 Experiences sometimes bundle Hotel de la Ville rooms into hospitality packages — check onlocationexp.com and f1experiences.com.",
  },
  {
    id: "301d49b0-3e98-425c-8ae2-b5a9a745bbdb", // Alfa Romeo Museum
    howToBook:
      "If you specifically want to see the Fangio 159, confirm it's on display before you go — the museum rotates roughly a quarter of its collection through the public floors, and pieces occasionally move to loan exhibitions elsewhere. The Sunday storage room tour is the better pick over the standard Saturday tour if you're a serious enthusiast: it's the only way into the roughly 180 cars not normally on public display, though it's small groups only and needs booking well ahead. No car? The direct shuttle from Milano Centrale is simpler than the metro-plus-bus route, even though it runs on a fixed daily schedule rather than on demand.",
  },
  {
    id: "99540487-ee1b-47a2-a527-67d0857a2502", // Grandstand 22
    howToBook:
      "Grandstand 22 sells slower than Grandstand 26 but does sell out, typically by June for a September race. Check f1italy.com/en/ticket-info/grandstand-22 now — if 3-day tickets are live, buy immediately. Booking as a group? f1italy.com guarantees adjacent seating automatically. If official tickets are gone, tickets.gp aggregates legitimate resellers, usually at or near face value — avoid Viagogo as a first choice, since pricing inflates fast when stock is low. Want hospitality above the grandstand tier? Champions Club (open bar, driver Q&A, grid walk) or Paddock Club (pit lane access, unlimited F&B) sell 6–8 months out — contact F1 Experiences directly at f1experiences.com.",
  },
  {
    id: "grandstand-26-placeholder", // resolved below
    howToBook:
      "Grandstand 26A sold out through official channels before June 2026. If you missed it, your routes in: StubHub and Viagogo carry resale tickets, typically 30–50% over face value — check seller ratings carefully. F1 Experiences' Champions Club and Paddock Club packages bundle premium grandstand access with hospitality (f1experiences.com). On Location Experiences, the official F1 hospitality partner, sells inclusive packages with grandstand seating and pit lane access (onlocationexp.com). GTG (getthegig.com) is worth checking for Italian GP hospitality and grandstand bundles too. For 26B/C specifically, the official waitlist at f1italy.com releases tickets when corporate allocations are returned, usually 4–6 weeks before race day.",
  },
  {
    id: "f059b7d6-c6c1-4bb6-81a7-cb5a72e67643", // Paddock Club & Champions Club
    howToBook:
      "Want paddock access without the House 44 premium? Book standard Paddock Club directly through f1experiences.com or an authorised reseller like Motorsport Tickets — it moves slower than House 44 and typically still has availability into the summer of race year. Specifically want House 44? Move in Q1: it sold out for Monza 2026 well ahead of the weekend, and Soho House's own event notes list it as one of a handful of races on the 2026 world tour, so allocation is tight everywhere it appears, not just Monza. Champions Club Centrale is the more forgiving booking window of the three and a solid fallback if Paddock Club sells out. Booking for a group? F1 Experiences and GP Tours both handle multi-seat allocations and can sometimes secure inventory that's gone from the public-facing sites.",
  },
];

// Resolve the real Grandstand 26 ID
const [gs26] = await client`SELECT id FROM experiences WHERE title LIKE 'Grandstand 26%' AND sporting_event_id = 'b93770c0-3d96-4e81-b3d0-c1e3a788fd8e'`;
CONCIERGE_UPDATES.find(u => u.id === "grandstand-26-placeholder").id = gs26.id;

for (const { id, howToBook } of CONCIERGE_UPDATES) {
  const [result] = await db
    .update(experiences)
    .set({
      practicalInfo: sql`jsonb_set(practical_info, '{howToBook}', ${JSON.stringify(howToBook)}::jsonb)`,
    })
    .where(eq(experiences.id, id))
    .returning({ title: experiences.title });
  console.log(`✓ Rewrote howToBook for "${result?.title ?? id}"`);
}

console.log("\nDone. Concierge picks for Italian GP: Grandstand 22, Grandstand 26, Paddock Club, Hotel de la Ville, Alfa Romeo Museum (5 of 16, ~31% — flagging this is slightly above the 20% target, worth a look).");
await client.end();
