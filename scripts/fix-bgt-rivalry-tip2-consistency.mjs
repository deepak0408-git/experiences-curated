import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "bgt-rivalry-history-mueczn6b";

const TIP_1 = "Australia arrives on the back of a 3-1 series win in 2024-25, their first series win over India at home or away since 2014-15, so this tour carries a different tone than the previous four series did — don't assume you're walking into another India procession.";

const TIP_2 = "India's overall head-to-head lead, 10 series wins to Australia's 6, means a lot of the pre-series discussion will focus on whether India can reclaim the trophy after losing it in 2024-25, rather than whether Australia can simply stay competitive — worth knowing that framing before you follow local coverage in any of the three host cities.";

const [result] = await db.update(experiences)
  .set({ insiderTips: [TIP_1, TIP_2] })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, insiderTips: experiences.insiderTips, status: experiences.status });

console.log(result);
process.exit(0);
