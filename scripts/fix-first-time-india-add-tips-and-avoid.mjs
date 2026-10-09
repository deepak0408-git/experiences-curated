import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "first-time-india-mued2mc4";

const [row] = await db.select({ insiderTips: experiences.insiderTips, whatToAvoid: experiences.whatToAvoid }).from(experiences).where(eq(experiences.slug, SLUG));

const NEW_TIPS = [
  ...row.insiderTips,
  "India runs on Type C, D, and M plugs at 230V — most phone and laptop chargers are dual-voltage and only need a plug adapter, not a converter, but double-check anything you're bringing that isn't, a hairdryer or an old device, before you plug it in.",
  "Stick to cooked, hot food and peel your own fruit rather than eating pre-cut fruit or raw salad from a street stall — it's a small habit that prevents most of the first-48-hours stomach trouble that catches out new visitors, alongside the tap water rule already covered here.",
  "If you want a photo at a crowded landmark, ask a fellow tourist rather than someone who approaches offering to take it for you — a polite offer followed by a demand for payment afterward is a known pattern at sites like this, not a local custom.",
];

const NEW_AVOID = row.whatToAvoid + " Don't accept an unsolicited offer of help, a photo, directions, a \"special price\", from someone who approaches you first at a crowded tourist site — genuine hospitality here is real and common, covered elsewhere in this pack, but the specific pattern of a stranger initiating contact at a landmark and then asking for money afterward is a known scam setup, not the same thing. Don't eat raw, pre-cut fruit or uncooked salad from street vendors, even if everything else at the stall looks appealing — it's one of the most common, avoidable causes of the stomach issues that otherwise healthy travelers blame on \"the food\" generally rather than this one specific habit.";

const [result] = await db.update(experiences)
  .set({ insiderTips: NEW_TIPS, whatToAvoid: NEW_AVOID })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
console.log("\n--- Tips ---");
NEW_TIPS.forEach((t, i) => console.log(`${i + 1}. ${t}`));
console.log("\n--- Avoid ---\n", NEW_AVOID);
process.exit(0);
