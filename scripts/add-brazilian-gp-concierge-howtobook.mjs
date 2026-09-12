import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Pro-gated "How to Book" tactical detail for the Brazilian GP's 5 Concierge
// picks (Paddock/Champions Club, Ticket Guide, Hotel Emiliano, Heineken
// Village, Maní) — seeded 12 Sep 2026. SpokeExperienceCard's "Concierge pick"
// label is driven purely by practicalInfo.howToBook being non-empty, so none
// of these 5 showed the badge until this ran. All contacts/prices verified
// directly against each operator's own site or the official F1/brasilf1.com
// ticketing pages before writing — never fabricated, per
// feedback_affiliate_link_generation and feedback_verify_safe_claims_concretely.
const UPDATES = [
  {
    slug: "brazilian-gp-hospitality-paddock-club-mtx6t3tb",
    howToBook:
      "The 3-Day Paddock Club package was already showing sold out on f1experiences.com as of Sep 2026 — call the North America line (+1.888.326.5430) or your regional F1 Experiences number directly and ask to be added to the cancellation/release waitlist rather than repeatedly refreshing the site; hospitality resellers do sometimes get late releases the main site doesn't show. If Paddock Club stays unavailable, ask the same rep about Champions Club as the realistic fallback — it's a separate, usually less oversubscribed tier sold through the same F1 Experiences channel.",
  },
  {
    slug: "brazilian-gp-ticket-guide-mtx6r39p",
    howToBook:
      "Buy directly at tickets.formula1.com/en/f1-3325-brazil — it's the only channel guaranteed to show real-time official inventory. Grandstand M (Turn 1) is historically the first to sell out given how well-known that corner is, so if it's still showing available, that's the one to lock in fastest, not last. Note that only Grandstands B and M are reserved seating — every other stand is unreserved within its section, so arriving right at gate-open on race day (not just before lights-out) genuinely changes your seat quality in those stands.",
  },
  {
    slug: "brazilian-gp-hotel-emiliano-mtx6y6xb",
    howToBook:
      "Call the hotel's direct reservations line — +55 (11) 3728-2002 — rather than booking through a third-party site; as an SLH (Small Luxury Hotels of the World) property, booking direct or via SLH's own channel is what typically qualifies you for SLH member perks (room upgrade subject to availability, early check-in/late check-out) that an OTA booking won't. If the direct line is busy or you don't get through, the hotel's general number is +55 (11) 3069-4369, and their contact form is at emiliano.com.br/en/fale-conosco/. Race-weekend rates run well above the US$290–360 baseline, so book earlier rather than closer to Nov 2026.",
  },
  {
    slug: "brazilian-gp-heineken-village-mtxwby4o",
    howToBook:
      "Buy the moment the season's tickets go live at eventim.com.br/f1saopaulo — for the prior edition, sales opened at noon on a specific date and the organizers explicitly warned the sector sells out quickly, which held true; treat any 'on sale soon' notice on f1saopaulo.com.br as your actual buying window, not a soft suggestion. The Lawn (Gramado) sector has a genuine half-price rate for eligible buyers that the Star (Estrela) sector doesn't offer at all — if budget matters more than the open bar, Lawn's half-price tier is the real money-saving lever here, not a lesser version of the same deal. Remember this is a single 3-day pass only, no single-day option, and 18+ with ID checked at the gate.",
  },
  {
    slug: "brazilian-gp-mani-mtx758my",
    howToBook:
      "Book via the dedicated reservations line +55 11 97473-8994 or reservasmani@manimanioca.com.br rather than the general restaurant number — this is the line actually staffed for booking requests, per the restaurant's own site. The online system at usetag.me/grupomani works too if you'd rather not call internationally. Because the dining room is genuinely small (three connected spaces in a converted house), race-weekend dinner service fills up well ahead — call or email as soon as your dates are fixed rather than waiting until you land. Remember Maní is closed Mondays, so don't build a Monday-night plan around it.",
  },
];

for (const { slug, howToBook } of UPDATES) {
  const [row] = await sql`SELECT title, practical_info FROM experiences WHERE slug = ${slug}`;
  if (!row) {
    console.error(`✗ No experience found for slug ${slug}`);
    continue;
  }
  const practicalInfo = { ...(row.practical_info ?? {}), howToBook };
  await sql`UPDATE experiences SET practical_info = ${sql.json(practicalInfo)} WHERE slug = ${slug}`;
  console.log(`✓ ${row.title} — howToBook (Concierge pick) added`);
}

await sql.end();
