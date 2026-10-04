import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const UPDATES = {
  "chinese-gp-grandstand-b-mud1kmje": "Tickets at ticketing.formula1.com/china. F1 Experiences Starter and Hero packages both offer a Grandstand B option: reserve a priority-access deposit at f1experiences.com/2027-chinese-grand-prix.",
  "chinese-gp-grandstand-h-mud1lhsi": "Tickets at ticketing.formula1.com/china. F1 Experiences packages naming a Grandstand H/K option: reserve a priority-access deposit at f1experiences.com/2027-chinese-grand-prix.",
  "chinese-gp-grandstand-k-mud1jr50": "Tickets at ticketing.formula1.com/china. F1 Experiences packages naming a Grandstand H/K option: reserve a priority-access deposit at f1experiences.com/2027-chinese-grand-prix.",
  "chinese-gp-grandstand-e-muqmz384": "Not yet on sale for 2027 — Grandstand E hasn't appeared on ticketing.formula1.com/china yet (only A, B, H, and K are listed there so far). Register for pre-sale access on that official site and watch for this stand to appear before buying.",
};

for (const [slug, bookingMethod] of Object.entries(UPDATES)) {
  const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.slug, slug));

  if (!row) {
    console.error(`NOT FOUND: ${slug}`);
    continue;
  }

  const newPracticalInfo = { ...row.practicalInfo, bookingMethod };

  await db.update(experiences)
    .set({ practicalInfo: newPracticalInfo })
    .where(eq(experiences.slug, slug));

  console.log(`Updated ${slug}:`, bookingMethod);
}

await client.end();
