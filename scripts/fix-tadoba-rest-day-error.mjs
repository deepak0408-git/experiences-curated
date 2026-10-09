import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "tadoba-tiger-safari-muec6gu2";

const OLD_OPENING = `Tadoba-Andhari Tiger Reserve is the honest reason to build a rest day into your Nagpur stop. It's Maharashtra's oldest and largest national park, and it has one of the highest tiger-sighting rates of any reserve in India, which matters because plenty of tiger reserves sell the dream and deliver a long, sighting-free drive instead.`;

const NEW_OPENING = `Tadoba-Andhari Tiger Reserve is the honest reason to arrive in Nagpur a day or two before the Test starts, or stay on after it ends, rather than flying in and out around the five playing days alone. Test cricket runs five straight days with no built-in rest day, so this only works as a pre- or post-match addition to your Nagpur stop, not something slotted into the series itself. It's Maharashtra's oldest and largest national park, and it has one of the highest tiger-sighting rates of any reserve in India, which matters because plenty of tiger reserves sell the dream and deliver a long, sighting-free drive instead.`;

const OLD_PARA3_END = `It's entirely doable if you leave before dawn, and plenty of visitors do exactly that, but if your Nagpur schedule already has you at the ground some of the same days, an overnight near the park on a rest day between sessions is the more comfortable version of this trip, not a luxury.`;

const NEW_PARA3_END = `It's entirely doable if you leave before dawn, and plenty of visitors do exactly that, but since Test cricket doesn't build in a rest day between sessions, the realistic way to do this comfortably is to schedule it for a day before the Test starts or after it finishes, with an overnight near the park rather than trying to squeeze it in around five straight days at the ground.`;

const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD_OPENING)) {
  console.error("Opening sentence not found verbatim — aborting.");
  process.exit(1);
}
if (!row.bodyContent.includes(OLD_PARA3_END)) {
  console.error("Para 3 ending not found verbatim — aborting.");
  process.exit(1);
}

const updatedBody = row.bodyContent
  .replace(OLD_OPENING, NEW_OPENING)
  .replace(OLD_PARA3_END, NEW_PARA3_END);

const [result] = await db.update(experiences)
  .set({ bodyContent: updatedBody })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
console.log("\n--- New body ---\n");
console.log(updatedBody);
process.exit(0);
