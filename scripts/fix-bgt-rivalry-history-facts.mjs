import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "bgt-rivalry-history-mueczn6b";

const OLD_BODY_SENTENCE = `India has won the last four series in a row, and 10 of the 16 contested overall, against 5 for Australia and one drawn. That head-to-head alone tells you India has had the better of this rivalry for most of its modern history, but the number understates how close and how dramatic individual series have been.`;

const NEW_BODY_SENTENCE = `Australia won the most recent series, 3-1 in 2024-25, ending a run of four straight India wins, and India still holds the overall head-to-head, 10 series wins to Australia's 6 from 17 contested, with one drawn. That head-to-head alone tells you India has had the better of this rivalry for most of its modern history, but the number understates how close and how dramatic individual series have been, and Australia's win in the most recent series is itself proof the gap can close fast.`;

const OLD_TIP_1 = "If you only read up on two matches before this tour, make them 2001 Kolkata and 2021 Gabba — both are widely available in full and both explain, better than any stats table, why this rivalry carries the weight it does.";

const NEW_TIP_1 = "Australia arrives on the back of a 3-1 series win in 2024-25, their first series win over India at home or away since 2014-15, so this tour carries a different tone than the previous four series did — don't assume you're walking into another India procession.";

const OLD_AVOID_1 = "Don't assume recent history (India's four straight series wins) means this tour is a foregone conclusion — several of those series, including 2020-21, were won from genuinely desperate positions, and this rivalry has a well-established pattern of swinging hard within a single series.";

const NEW_AVOID_1 = "Don't assume India goes into this series as the form team — Australia won the most recent Border-Gavaskar series 3-1 in 2024-25, so recent momentum actually sits with Australia, not India's historical overall lead.";

const [row] = await db.select({
  bodyContent: experiences.bodyContent,
  insiderTips: experiences.insiderTips,
  whatToAvoid: experiences.whatToAvoid,
}).from(experiences).where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD_BODY_SENTENCE)) {
  console.error("Body sentence not found verbatim — aborting.");
  process.exit(1);
}
if (row.insiderTips[0] !== OLD_TIP_1) {
  console.error("Insider tip 1 mismatch — aborting.");
  process.exit(1);
}
if (!row.whatToAvoid.includes(OLD_AVOID_1)) {
  console.error("What-to-avoid sentence not found verbatim — aborting.");
  process.exit(1);
}

const newBody = row.bodyContent.replace(OLD_BODY_SENTENCE, NEW_BODY_SENTENCE);
const newTips = [NEW_TIP_1, row.insiderTips[1]];
const newAvoid = row.whatToAvoid.replace(OLD_AVOID_1, NEW_AVOID_1);

const [result] = await db.update(experiences)
  .set({
    bodyContent: newBody,
    insiderTips: newTips,
    whatToAvoid: newAvoid,
    practicalInfo: null,
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status, practicalInfo: experiences.practicalInfo });

console.log("Updated:", result);
console.log("\n--- New body ---\n", newBody);
console.log("\n--- New tips ---\n", newTips);
console.log("\n--- New avoid ---\n", newAvoid);
process.exit(0);
