import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "38723247-3610-4906-baa6-35d5839429fb";

const costRange = "Zócalo and Metropolitan Cathedral: free. Templo Mayor Museum: 100 MXN (roughly US$5.92) Tuesday-Saturday; free on Sundays for Mexican citizens and foreign residents with valid ID, but foreign visitors without residency pay the standard fee any day.";

const editorialNote = "History (Tenochtitlán, 1521 conquest, cathedral construction 1573-1813 using Templo Mayor stone, 1978 accidental rediscovery) sourced from InfoMexico.org's Zócalo guide and AbbysHearth.com's Metropolitan Cathedral guide, Sep 2026, cross-checked for consistency. Google ratings via Places API lookup same session: Zócalo/Constitution Plaza 4.7/324,374 reviews, Metropolitan Cathedral 4.7/24,190 reviews, Templo Mayor Museum 4.8/34,995 reviews. Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 3. What to Avoid rebuilt 6 Sep 2026 — the original's first avoid restated bodyContent's own 60-90 minute timing fact. Replaced with 2 genuinely new avoids: Templo Mayor's Monday closure (official INAH policy, confirmed via multiple museum-hours sources, 6 Sep 2026 — not previously mentioned anywhere in this experience) and inflated-bill scams at tourist-facing restaurants immediately around the plaza (sourced from MexicoCity-Trip.com's safety guide, 6 Sep 2026). Templo Mayor entry fee corrected 7 Sep 2026 — replaced the vague '~US$5 equivalent' estimate with the real peso figure (100 MXN, confirmed directly on the official templomayor.inah.gob.mx English page, which explicitly states no nationality-based price differential — a separate AI-search summary had claimed a 210/105 MXN foreigner/resident split 'effective Jan 1 2026,' but that contradicted the official page's own text and wasn't independently verifiable, so it was not used) converted to USD at today's real rate (0.05917, api.frankfurter.dev, 7 Sep 2026) = US$5.92.";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

const [result] = await db
  .update(experiences)
  .set({
    practicalInfo: { ...existing.practicalInfo, costRange },
    editorialNote,
    lastVerifiedDate: "2026-09-07",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();
