import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "narendra-modi-stadium-mueclmpw";

const KEPT_TIP = "Because this ground is genuinely enormous, factor in real walking time and queueing once inside — getting from the gates to a seat, or to concessions and back, takes noticeably longer here than at a normal-sized stadium.";

const [result] = await db.update(experiences)
  .set({ insiderTips: [KEPT_TIP] })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, insiderTips: experiences.insiderTips, status: experiences.status });

console.log(result);
process.exit(0);
