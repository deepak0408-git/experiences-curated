import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// One-off fix: replace f1italy.com (a reseller, not the primary source) with
// monzanet.it/en/tickets/ for ticket-purchase links, and monzanet.it/en/ for
// Fan Zone/track invasion content, across every Italian GP experience.
// EXCEPTION (explicit founder decision): the Arrival & Queue Guide's
// f1italy.com/en/rules-for-visitors-8 link stays — neither monzanet.it nor
// ticketing.formula1.com currently publish an equivalent visitor-rules page
// with the bag-policy/security content that experience cites, confirmed via
// direct check, 19 Sep 2026.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const TICKETS_URL = "https://www.monzanet.it/en/tickets/";
const MONZANET_HOME = "https://www.monzanet.it/en/";

const updates = [
  {
    id: "f059b7d6-c6c1-4bb6-81a7-cb5a72e67643", // Paddock Club & Champions Club
    website: TICKETS_URL,
    bookingMethod: "Champions Club and Paddock Club are sold through Monzanet.it, Formula1.com, or F1 Experiences; House 44 is sold directly through F1 Paddock Club and Soho House and tends to sell out fastest of the three.",
  },
  {
    id: "e88a5b99-286a-4335-8fa9-7cbb79bd11f3", // The Tifosi
    website: MONZANET_HOME,
    bookingMethod: "No separate ticket — any race day ticket gets you the full atmosphere and, if confirmed for the season, the post-race track invasion. Check monzanet.it closer to the date, as invasion access isn't guaranteed every year.",
  },
  {
    id: "037780a7-2d9b-4ee9-84ac-b4bc094614f2", // Getting to the Circuit
    bookingMethod: "Trenord tickets (€3.10 single) at the station or via the app — no advance booking needed. Driving? Blue and Red parking zones sell through monzanet.it/en/tickets/ and go fast, so book with your grandstand ticket.",
  },
  {
    id: "741de32c-5d71-4873-842b-288504c0f15d", // Fan Zone
    website: MONZANET_HOME,
  },
  {
    id: "99540487-ee1b-47a2-a527-67d0857a2502", // Grandstand 22
    website: TICKETS_URL,
    bookingMethod: "Buy directly at monzanet.it/en/tickets/ — tickets delivered as print-at-home PDF within 48 hours.",
    howToBook: "Grandstand 22 sells slower than Grandstand 26 but does sell out, typically by June for a September race. Check monzanet.it/en/tickets/ now — if 3-day tickets are live, buy immediately. Booking as a group? Monzanet.it guarantees adjacent seating automatically. If official tickets are gone, tickets.gp aggregates legitimate resellers, usually at or near face value — avoid Viagogo as a first choice, since pricing inflates fast when stock is low. Want hospitality above the grandstand tier? Champions Club (open bar, driver Q&A, grid walk) or Paddock Club (pit lane access, unlimited F&B) sell 6–8 months out — contact F1 Experiences directly at f1experiences.com.",
  },
  {
    id: "d69d0936-8008-42f0-b200-2b2114e79a77", // Grandstand 26
    website: TICKETS_URL,
    bookingMethod: "Book 3-day passes via monzanet.it/en/tickets/ — check availability for 26B/C or join the waitlist for 26A.",
    howToBook: "Grandstand 26A sold out through official channels before June 2026. If you missed it, your routes in: StubHub and Viagogo carry resale tickets, typically 30–50% over face value — check seller ratings carefully. F1 Experiences' Champions Club and Paddock Club packages bundle premium grandstand access with hospitality (f1experiences.com). On Location Experiences, the official F1 hospitality partner, sells inclusive packages with grandstand seating and pit lane access (onlocationexp.com). GTG (getthegig.com) is worth checking for Italian GP hospitality and grandstand bundles too. For 26B/C specifically, the official waitlist at monzanet.it/en/tickets/ releases tickets when corporate allocations are returned, usually 4–6 weeks before race day.",
  },
  {
    id: "6d3c5952-331b-42ca-a74c-f16f80c1b617", // Grandstand 1
    website: TICKETS_URL,
    bookingMethod: "Book via the official monzanet.it ticket store once 2027 sales open — join the site's notification waitlist to be alerted.",
  },
  {
    id: "50e258cd-b43a-4fb6-beea-808d47e42c02", // Grandstand 5
    website: TICKETS_URL,
    bookingMethod: "Book directly via monzanet.it/en/tickets/ — 3-day reserved seating only, no single-day option shown.",
  },
  {
    id: "fe5196be-cd64-415b-ad22-4ed6af43f2f3", // GA Lesmo & Ascari
    website: TICKETS_URL,
    bookingMethod: "Buy general admission (Prato) tickets via monzanet.it/en/tickets/ — no reserved seat, entry to the park's GA sections only.",
  },
];

for (const u of updates) {
  const [before] = await client`SELECT title, practical_info FROM experiences WHERE id = ${u.id}`;
  const merged = { ...before.practical_info };
  if (u.website) merged.website = u.website;
  if (u.bookingMethod) merged.bookingMethod = u.bookingMethod;
  if (u.howToBook) merged.howToBook = u.howToBook;

  const [after] = await client`
    UPDATE experiences SET practical_info = ${client.json(merged)}, updated_at = now()
    WHERE id = ${u.id}
    RETURNING title, practical_info->>'website' as website
  `;
  console.log(`✓ ${after.title} -> ${after.website}`);
}

// Also fix body_content on Getting to the Circuit and Grandstand 22, which
// mention f1italy.com inline in prose, not just in practicalInfo.
const [gettingThere] = await client`SELECT body_content FROM experiences WHERE id = '037780a7-2d9b-4ee9-84ac-b4bc094614f2'`;
const fixedGettingThereBody = gettingThere.body_content.replace(
  /check f1italy\.com for 2026 schedule and fares/i,
  "check monzanet.it for 2026 schedule and fares"
);
await client`UPDATE experiences SET body_content = ${fixedGettingThereBody}, updated_at = now() WHERE id = '037780a7-2d9b-4ee9-84ac-b4bc094614f2'`;
console.log("✓ Getting to the Circuit body_content fixed");

const [gs22] = await client`SELECT body_content FROM experiences WHERE id = '99540487-ee1b-47a2-a527-67d0857a2502'`;
const fixedGs22Body = gs22.body_content.replace(
  /Buy via the official f1italy\.com/i,
  "Buy via the official monzanet.it"
);
await client`UPDATE experiences SET body_content = ${fixedGs22Body}, updated_at = now() WHERE id = '99540487-ee1b-47a2-a527-67d0857a2502'`;
console.log("✓ Grandstand 22 body_content fixed");

await client.end();
