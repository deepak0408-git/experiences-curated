import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "c53ee61b-2137-4264-b955-de5f46fa1d11";

const whatToAvoid = `Don't keep your phone in a back pocket or wear a backpack on your back during rush-hour-level crowding on Line 9 — pickpocketing on Mexico City's Metro happens almost exclusively in exactly this kind of packed, shoving-match crowd, and race weekend trains run at that density for hours around each session. Keep bags on your chest, phone somewhere zipped and in front of you, and use the women-only carriages (Vagones Exclusivos) where available if that applies to you — they're genuinely safer in a crush like this. And don't assume you can leave right after the chequered flag and get straight home — post-race buses from the circuit don't start running until an hour after the race ends, with the last one around 18:30, so budget for a real wait if you're relying on circuit-organized transport rather than walking straight to the Metro yourself.`;

const editorialNote = "Metro station-to-gate mapping, race-day station closures (Ciudad Deportiva, Puebla, Pantitlán), and rideshare access limitations sourced from TheF1Spectator.com's official transport guide for the Mexican Grand Prix and oversteer48.com's travel/transport guide, Sep 2026. Metro fare corrected to the real flat rate (5 pesos, ~US$0.30) via CDMX government's official Metro FAQ page, 6 Sep 2026 — previously a vague 'a few pesos' placeholder, flagged by founder. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate facts already in bodyContent — replaced with 2 genuinely new avoids: Metro pickpocketing risk during high-density crowding (sourced from multiple Tripadvisor CDMX Metro reviews and themexicohandbook.com's street-safety guide, describing an established, ongoing pattern, not race-specific but directly relevant given race-weekend crowd density) and post-race circuit bus timing (buses start 1 hour after the race ends, last departure ~18:30, sourced from TheF1Spectator.com's transport guide).";

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();
