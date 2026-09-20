import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "trackside-corner-lounges-villas-mu9idbfc";

const practicalInfo = {
  hours: "9:00am–6:00pm, Friday–Sunday race weekend (3–5 Sep 2027).",
  costRange: "Not yet published for 2027 — pricing is issued via Monzanet's own downloadable hospitality brochure rather than listed on the page itself; contact the circuit directly for current rates.",
  bookingMethod: "All four lounges are sold directly by the circuit through Monzanet's official hospitality programme, separately from grandstand and general admission tickets. Dolce Vita and Green House run as 2-day (Saturday–Sunday) packages; Garden Lounge and Ultimate Lounge are 3-day. Full package details and the downloadable brochure are on Monzanet's own hospitality page — email garanzini@monzanet.it directly to check current availability and pricing.",
  website: "https://www.monzanet.it/en/hospitality/",
  reservationsRequired: true,
};

const insiderTips = [
  "Garden Lounge has the best parking ratio of the four — one pass per four guests versus one per ten everywhere else — worth factoring in if you're driving as a group rather than taking the train.",
  "Monzanet doesn't publish hospitality pricing on the site itself — it's issued through a downloadable brochure — so email garanzini@monzanet.it directly rather than waiting for a public price list to appear.",
];

const editorialNote = "Sources: monzanet.it/en/hospitality/ (official circuit hospitality page) — Dolce Vita, Garden Lounge, and Ultimate Hospitality location/amenities/contact email confirmed via direct WebFetch, 20 Sep 2026. Green House location/amenities cross-checked against third-party ticket-info aggregators (not cited in copy) since it isn't individually named on Monzanet's own page — flagged as the one lounge without a direct official-site confirmation; revisit once Monzanet's downloadable brochure is obtained. Ascari corner history from formula1.com's 'How every corner at Monza got its name.' GTG: no Monza/Italian GP listings found. Booking.com: N/A. Hero image: user-supplied, Images/Italian GP - Ultimate Lounge.jpg, credited as Representative Image per user instruction. Verified 20 Sep 2026.";

const [result] = await db.update(experiences)
  .set({ practicalInfo, insiderTips, editorialNote })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("✓ Updated:", result);

await client.end();
