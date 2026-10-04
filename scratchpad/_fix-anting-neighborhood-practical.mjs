import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-anting-neighborhood-mue5lzhx";

const newPracticalInfo = {
  hours: "Shanghai Auto Museum: Tuesday-Sunday, 9:30 AM-4:30 PM (last entry 4:00 PM), closed Mondays. Anting German Town: no fixed hours — an outdoor district, open to walk through anytime.",
  website: "http://english.jiading.gov.cn/",
  costRange: "Shanghai Auto Museum: RMB30 adult (~US$4), RMB20 student, free under 1.2m. Anting German Town: free to walk through.",
  bookingMethod: "Shanghai Auto Museum: walk-in, no advance booking needed. Anting German Town: no booking required — self-guided walk.",
};

const newGettingThere = "Shanghai Auto Museum: Metro Line 11 to Anting Station, then a 5-minute walk. Anting German Town: Metro Line 11 to Shanghai Automobile City station, then about a 1km walk or short taxi (~RMB12 by Didi). Both are a short ride from Shanghai Circuit station on the same line.";

await db.update(experiences)
  .set({
    practicalInfo: newPracticalInfo,
    gettingThere: newGettingThere,
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated practicalInfo and gettingThere with real museum/German Town detail.");

await client.end();
