// Qatar GP 2026 Fan Zone — remove practical_info.website and the "access"
// framing (costRange + bookingMethod) per curator instruction 14 Sep 2026.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-fan-zone-mtympq8u";

const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
  .from(experiences).where(eq(experiences.slug, SLUG));
if (!row) throw new Error("Experience not found: " + SLUG);

const { website, costRange, bookingMethod, ...rest } = row.practicalInfo;

await db.update(experiences).set({ practicalInfo: rest }).where(eq(experiences.id, row.id));

console.log("Removed website, costRange, bookingMethod for", SLUG, "-> remaining:", JSON.stringify(rest));
await client.end();
