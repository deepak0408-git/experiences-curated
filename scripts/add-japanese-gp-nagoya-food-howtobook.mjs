import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "japanese-gp-nagoya-food-scene";

// Real, sourced Pro-tier booking tactics, added 1 Oct 2026 per founder
// request to find genuine howToBook content for this experience (it had
// bookingMethod but no howToBook — the field that actually powers the
// "How to Book" Concierge Pick treatment on hub-and-spoke pages).
// Sources: houraiken.com's contact page (phone reservations only for the
// main Jingu-area locations, currently showing phone lines closed —
// confirmed via Tabelog and houraiken.com directly) and the walk-in/
// register-then-visit-Atsuta-Shrine workaround (confirmed via Tripadvisor
// FAQ + Tabelog reviews); Yabaton's Sakae Matsuzakaya branch phone numbers
// (052-262-8830 / 052-269-1027, phone lines closed per Tabelog, online
// booking available instead — confirmed via Tabelog and Yabaton's own
// site).
const HOW_TO_BOOK =
  "Atsuta Hōraiken doesn't take phone reservations for its main Jingu-area locations and has no online booking — the real workaround locals use is to walk in, register your name and party size, then use the wait to visit Atsuta Shrine next door (a genuine sightseeing stop, not dead time) and return when your table's ready. Yabaton's Sakae Matsuzakaya branch does take reservations, but its phone lines are frequently closed — book online through Yabaton's own site instead of trying to call.";

const [current] = await sql`SELECT title, practical_info FROM experiences WHERE slug = ${SLUG}`;
const updated = { ...current.practical_info, howToBook: HOW_TO_BOOK };

await sql`UPDATE experiences SET practical_info = ${sql.json(updated)} WHERE slug = ${SLUG}`;
console.log(`✓ ${current.title} — howToBook added`);

await sql.end();
