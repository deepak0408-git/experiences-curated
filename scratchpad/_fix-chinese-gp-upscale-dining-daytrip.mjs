import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-upscale-dining-mud20jh1";

const OLD_PARA = "This isn't a quick stop. Getting here from Jiading means committing to the roughly hour-long Metro Line 11 journey each way, plus the dinner itself, so it's realistically a full-evening plan rather than something to fold into a session day. Build it into a rest day, or the evening before or after the race weekend, rather than trying to squeeze it between Saturday qualifying and Sunday's race.";

const NEW_PARA = "This isn't a quick stop. Getting here from Jiading means committing to the roughly hour-long Metro Line 11 journey each way, plus the dinner itself, so it's realistically a full-evening plan rather than something to fold into a session day. Build it into a rest day, or the evening before or after the race weekend, rather than trying to squeeze it between Saturday qualifying and Sunday's race. It's a genuinely good way to close out a day spent exploring Shanghai and the Bund — walk the waterfront, see the city by daylight, then sit down here as the evening's natural finish rather than treating dinner as a separate trip back downtown.";

const [row] = await db.select({ bodyContent: experiences.bodyContent })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD_PARA)) {
  console.error("Target paragraph not found — aborting");
  process.exit(1);
}

const newBody = row.bodyContent.replace(OLD_PARA, NEW_PARA);

await db.update(experiences)
  .set({ bodyContent: newBody })
  .where(eq(experiences.slug, SLUG));

console.log("Updated body with day-trip closing framing.");

await client.end();
