import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-where-to-stay-mud1vfyd";

const newPracticalInfo = {
  hours: "Check-in: Courtyard Shanghai Jiading 2:00 PM, Hyatt Regency Shanghai Jiading 3:00 PM, Campanile Shanghai Bund Hotel 2:00 PM, Okura Garden Hotel Shanghai 2:00 PM, Waldorf Astoria Shanghai on the Bund 3:00 PM — all per each hotel's official site, check-out 12:00 PM at all five.",
  website: "https://www.marriott.com/en-us/hotels/shajd-courtyard-shanghai-jiading/overview/, https://www.hyatt.com/hyatt-regency/en-US/sharj-hyatt-regency-shanghai-jiading, https://shanghai-bund.campanile.com/en-us/, https://www.gardenhotelshanghai.com/, https://www.hilton.com/en/hotels/shawawa-waldorf-astoria-shanghai-on-the-bund/",
  costRange: "Jiading district and budget downtown hotels generally run more affordably than moderate and luxury downtown properties — confirm current rates directly with each hotel",
  bookingMethod: "Book directly through each hotel's own official site.",
};

const newWhatToAvoid = "Don't book a downtown hotel purely on Bund or French Concession address without checking its actual walk to a Metro Line 11 connection — not every downtown neighborhood sits near that specific line, and a short-looking distance on a map can still mean a transfer or a longer walk than expected on race morning. Don't leave hotel booking until close to the event — F1 weekends draw real demand at this circuit, and the best-located, best-reviewed rooms at every tier (Jiading and downtown alike) are the first to sell out as race week approaches.";

await db.update(experiences)
  .set({
    practicalInfo: newPracticalInfo,
    whatToAvoid: newWhatToAvoid,
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated practicalInfo and whatToAvoid for", SLUG);
console.log(JSON.stringify(newPracticalInfo, null, 2));
console.log(newWhatToAvoid);

await client.end();
