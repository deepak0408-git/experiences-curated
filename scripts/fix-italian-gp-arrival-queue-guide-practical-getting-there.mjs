import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "italian-gp-arrival-queue-guide-mu7cja19";

const practicalInfo = {
  hours: "Gates open 07:00 on Friday, Saturday, and Sunday of race weekend (3-5 Sep 2027, subject to confirmation)",
  website: "https://www.f1italy.com/en/rules-for-visitors-8",
};

const gettingThere = "Take the S8, S9 or S11 suburban train from Milano Porta Garibaldi (20–25 mins, €3.10) to Biassono-Lesmo Parco. From there: walk 20 minutes through Parco di Monza to the circuit gates, or take the Black Line shuttle bus. Allow 90 minutes total from central Milan to your seat on race day.";

try {
  const [result] = await db
    .update(experiences)
    .set({ practicalInfo, gettingThere, lastVerifiedDate: "2026-09-19" })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("Updated:", result);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
