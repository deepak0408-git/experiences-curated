import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({
  bodyContent: experiences.bodyContent,
  whyItsSpecial: experiences.whyItsSpecial,
  whatToAvoid: experiences.whatToAvoid,
  insiderTips: experiences.insiderTips,
}).from(experiences).where(eq(experiences.slug, "italian-gp-ga-lesmo-ascari-mu7cpo5e"));
console.log(JSON.stringify(row, null, 2));
await client.end();
