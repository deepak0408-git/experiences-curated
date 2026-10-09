import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "narendra-modi-stadium-mueclmpw";

const OLD_PARA3 = `That result has nothing directly to do with the Test format this pack covers, and Australia's record in the shorter format doesn't predict how a five-day Test here will play out. But walking into this specific ground, for this specific rivalry, carries a weight that a neutral stadium wouldn't. The pitch itself is generally rated good for both batting and bowling, offering pace and bounce for quicks with some assistance for spin through the middle overs, a genuinely balanced surface rather than one that favours a single discipline.`;

const NEW_PARA3_AND_RECORDS = `That result has nothing directly to do with the Test format this pack covers, and Australia's record in the shorter format doesn't predict how a five-day Test here will play out. But walking into this specific ground, for this specific rivalry, carries a weight that a neutral stadium wouldn't. The pitch itself is generally rated good for both batting and bowling, offering pace and bounce for quicks with some assistance for spin through the middle overs, a genuinely balanced surface rather than one that favours a single discipline.

This ground, under its earlier name of Motera / Sardar Patel Stadium, has also hosted three individual records that go well beyond that single 2023 night. On 7 March 1987, Sunil Gavaskar became the first batter in history to reach 10,000 Test runs here, with a late cut off Pakistan's Ijaz Faqih. On 8 February 1994, Kapil Dev took the wicket of Sri Lanka's Hashan Tillakaratne here to reach 432 Test wickets, overtaking Richard Hadlee's record to become the leading wicket-taker in Test history at the time, a moment the ground marked by releasing 432 balloons. And on 20 November 2009, Sachin Tendulkar became the first cricketer to pass 30,000 international runs, also at this ground, in a Test against Sri Lanka. Three of the format's most significant individual milestones, all set on the same patch of turf, decades apart.`;

const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD_PARA3)) {
  console.error("Target paragraph not found verbatim — aborting without writing.");
  process.exit(1);
}

const updatedBody = row.bodyContent.replace(OLD_PARA3, NEW_PARA3_AND_RECORDS);

const [result] = await db.update(experiences)
  .set({ bodyContent: updatedBody })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
console.log("\n--- New body ---\n");
console.log(updatedBody);
process.exit(0);
