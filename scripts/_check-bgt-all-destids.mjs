import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEventExperiences, destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

const rows = await db.select({ slug: experiences.slug, address: experiences.address, neighborhood: experiences.neighborhood, destinationId: experiences.destinationId })
  .from(sportingEventExperiences)
  .innerJoin(experiences, eq(sportingEventExperiences.experienceId, experiences.id))
  .where(eq(sportingEventExperiences.sportingEventId, EVENT_ID));

const dests = await db.select().from(destinations);
const destMap = Object.fromEntries(dests.map(d => [d.id, d.name]));

let mismatchCount = 0;
for (const r of rows.sort((a,b)=>a.slug.localeCompare(b.slug))) {
  const destName = destMap[r.destinationId] ?? "UNKNOWN";
  const isNagpur = /nagpur|vca|jamtha|deekshabhoomi|tadoba/i.test(r.slug);
  const isAhmedabad = /ahmedabad|motera|modi-stadium|sabarmati|gir-national|kankaria|statue-of-unity/i.test(r.slug);
  const expectedCity = isNagpur ? "Nagpur" : isAhmedabad ? "Ahmedabad" : "Chennai";
  const mismatch = destName !== expectedCity;
  if (mismatch) mismatchCount++;
  console.log(`${mismatch ? "MISMATCH" : "ok      "} ${r.slug.padEnd(35)} destinationId->${destName.padEnd(10)} expected:${expectedCity}`);
}
console.log(`\nTotal mismatches: ${mismatchCount} / ${rows.length}`);
await client.end();
