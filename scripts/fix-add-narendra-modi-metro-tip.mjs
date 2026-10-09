import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "narendra-modi-stadium-mueclmpw";

const TIP_1 = "Because this ground is genuinely enormous, factor in real walking time and queueing once inside — getting from the gates to a seat, or to concessions and back, takes noticeably longer here than at a normal-sized stadium.";
const TIP_2 = "Skip the car entirely if you can — the Motera Stadium metro station on the Red Line drops you within walking distance of the main gate, and avoids the parking queues that build up around the ground's roughly 3,000 car and 10,000 two-wheeler spaces on match day.";

const [result] = await db.update(experiences)
  .set({ insiderTips: [TIP_1, TIP_2] })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, insiderTips: experiences.insiderTips, status: experiences.status });

console.log(result);
process.exit(0);
