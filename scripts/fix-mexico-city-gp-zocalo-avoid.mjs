import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "38723247-3610-4906-baa6-35d5839429fb";

const whatToAvoid = `Don't show up on a Monday expecting to see Templo Mayor — the site and its museum are closed that day, official INAH policy, so check the day of the week before building this into your itinerary rather than discovering it at a locked gate. And don't wander into one of the tourist-facing cantinas or restaurants immediately surrounding the plaza without checking your bill item by item — inflated charges and items added that weren't ordered are a real, recurring complaint specifically in this high-foot-traffic area, not a rare exception.`;

const editorialNote = "History (Tenochtitlán, 1521 conquest, cathedral construction 1573-1813 using Templo Mayor stone, 1978 accidental rediscovery) sourced from InfoMexico.org's Zócalo guide and AbbysHearth.com's Metropolitan Cathedral guide, Sep 2026, cross-checked for consistency. Google ratings via Places API lookup same session: Zócalo/Constitution Plaza 4.7/324,374 reviews, Metropolitan Cathedral 4.7/24,190 reviews, Templo Mayor Museum 4.8/34,995 reviews. Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 3. What to Avoid rebuilt 6 Sep 2026 — the original's first avoid restated bodyContent's own 60-90 minute timing fact. Replaced with 2 genuinely new avoids: Templo Mayor's Monday closure (official INAH policy, confirmed via multiple museum-hours sources, 6 Sep 2026 — not previously mentioned anywhere in this experience) and inflated-bill scams at tourist-facing restaurants immediately around the plaza (sourced from MexicoCity-Trip.com's safety guide, 6 Sep 2026).";

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();
