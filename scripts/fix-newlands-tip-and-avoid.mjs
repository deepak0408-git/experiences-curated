import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "getting-to-newlands-mrlzm9wi";

const insiderTips = [
  "Set your Uber or Bolt pickup point to Newlands Swimming Pool specifically — it's the venue's actual dedicated e-hailing point, not a workaround, and it keeps you clear of the crowd bottleneck right at the stadium gates.",
  "Buy a 1st class (MetroPlus) ticket rather than 3rd class at the Cape Town Station counter — the fare difference is small, and on a packed match-day service it buys you a quieter, less crowded carriage for a 20-minute ride.",
];

const whatToAvoid = "Don't assume any parking lot near the ground is unreserved and walk-up — some, like the upper Groote Schuur High School lot, are reserved and ticket-only, and turning up without checking means driving around looking for one of the smaller cash lots instead. On the train itself, avoid empty or near-empty carriages, especially outside peak match-arrival times — stick to carriages with other cricket-day passengers, and keep bags close on a crowded service, the same common-sense precaution as any commuter rail line running through a big city.";

try {
  const [result] = await db.update(experiences)
    .set({ insiderTips, whatToAvoid })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated tip + avoid:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
} finally {
  await client.end();
}
