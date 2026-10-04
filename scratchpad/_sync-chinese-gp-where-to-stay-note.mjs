import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const newNote = "Sourced from formula1.com/en/racing/2027/china (official — Metro Line 11, ~60min journey). Jiading neighborhood content (Nanxiang Old Street, Twin Towers, Guyi Garden, Nanxiang Temple, xiaolongbao origin) via WebSearch of Tripadvisor/travelchinaguide aggregated results, 2 Oct 2026. Google Places API (New) lookups: Courtyard Shanghai Jiading 4.0/68 reviews, Hyatt Regency Shanghai Jiading 4.6/34 reviews (thinner sample, flagged honestly in copy per §2c) — 23 Sep 2026; Campanile Shanghai Bund Hotel 4.3/544 reviews, Okura Garden Hotel Shanghai 4.4/325 reviews, Waldorf Astoria Shanghai on the Bund 4.5/605 reviews (matched to the actual hotel entity, not brand/operator page) — 2 Oct 2026. Check-in times and official hotel website URLs via WebSearch of each hotel's official domain (marriott.com, hyatt.com, shanghai-bund.campanile.com, gardenhotelshanghai.com, hilton.com), 2 Oct 2026 — Marriott and Hyatt pages returned HTTP 403 on direct fetch, so those two check-in times rely on WebSearch-aggregated snippets citing the official domain rather than a direct page read; flagged for spot-check if precision matters later. MULTI_VENUE_RATINGS entry in app/experience/[slug]/page.tsx updated to venueCount: 5.";

await db.update(experiences)
  .set({ editorialNote: newNote })
  .where(eq(experiences.slug, "chinese-gp-where-to-stay-mud1vfyd"));

console.log("Editorial note synced.");
await client.end();
