import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "us-open-luxury-hospitality-muv8p3m4";

const howToBook =
  "Email usopenpremier@usta.com directly rather than only submitting the website inquiry form — the inbox is the real channel the hospitality team monitors for tier availability questions. Ask specifically whether Blue Room access is still open before settling for Club level — it sells out first and isn't always marked unavailable on the site itself. If you're booking for a group rather than a couple, ask in the same email which Luxury Suite tier is on offer and whether it includes the player-appearance inclusion, since that varies by suite level and isn't listed publicly.";

const [existing] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, SLUG));
const updated = { ...existing.practicalInfo, howToBook };

const result = await db
  .update(experiences)
  .set({ practicalInfo: updated })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, practicalInfo: experiences.practicalInfo });

console.log(JSON.stringify(result, null, 2));
process.exit(0);
