import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "italian-gp-first-timer-guide-mu7ckouk";

const GETTING_THERE =
  "Take the S8, S9 or S11 suburban train from Milano Porta Garibaldi (20–25 mins, €3.10) to Biassono-Lesmo Parco. From there: walk 20 minutes through Parco di Monza to the circuit gates, or take the Black Line shuttle bus. Allow 90 minutes total from central Milan to your seat on race day.";

try {
  const [existing] = await db
    .select({ practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.slug, SLUG));

  const { costRange, bookingMethod, ...rest } = existing.practicalInfo ?? {};

  const [result] = await db
    .update(experiences)
    .set({ practicalInfo: rest, gettingThere: GETTING_THERE })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, practicalInfo: experiences.practicalInfo, gettingThere: experiences.gettingThere });

  console.log("Updated:", JSON.stringify(result, null, 2));
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
