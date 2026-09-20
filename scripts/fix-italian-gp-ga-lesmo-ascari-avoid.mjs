import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "italian-gp-ga-lesmo-ascari-mu7cpo5e";

const whatToAvoid = "Don't expect one fence spot to show you the whole Ascari chicane — it's three direction changes in quick succession, and most positions along the fence line only give you a clear look at two of the three apexes. Pick your spot based on which part of the sequence you most want to watch, rather than assuming you'll see the entire chicane from wherever you happen to stop. And don't leave your bleacher spot once you've claimed one at Lesmo 2 to go find food or shade — general admission spots aren't held for you, and a good position given up mid-morning is very unlikely to still be free when you come back.";

try {
  const [result] = await db
    .update(experiences)
    .set({ whatToAvoid })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("Updated:", result);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
