import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-grandstand-a-mud1hlfu";

const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

if (!row) {
  console.error("Row not found");
  process.exit(1);
}

const newPracticalInfo = {
  ...row.practicalInfo,
  bookingMethod: "Tickets at ticketing.formula1.com/china. Hospitality packages (Starter, Hero, Podium | A): reserve a priority-access deposit at f1experiences.com/2027-chinese-grand-prix.",
};

const newWhatToAvoid = "Don't skip the passport registration step until race week — it's a genuine requirement for every attendee at this circuit, not a formality, and leaving it late adds real friction right before the event. Don't plan on a quick hour-long Metro ride on race day itself — Line 11 gets heavily congested with race traffic heading to the circuit, so leave earlier than the normal journey time would suggest.";

await db.update(experiences)
  .set({ practicalInfo: newPracticalInfo, whatToAvoid: newWhatToAvoid })
  .where(eq(experiences.slug, SLUG));

console.log("practicalInfo.bookingMethod ->", newPracticalInfo.bookingMethod);
console.log("whatToAvoid ->", newWhatToAvoid);

await client.end();
