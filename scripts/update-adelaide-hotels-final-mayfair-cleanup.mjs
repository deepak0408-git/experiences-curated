import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent })
    .from(experiences)
    .where(eq(experiences.title, "Where to Stay in Adelaide — City vs. North Adelaide"));

  if (!row) throw new Error("Experience not found");

  const bodyContent = row.bodyContent.replace(
    "Choose the Mayfair, or another CBD hotel on North Terrace, if you're treating Adelaide as a city stop with cricket as one part of a longer visit,",
    "Choose the InterContinental, or another CBD hotel in the Riverbank Precinct, if you're treating Adelaide as a city stop with cricket as one part of a longer visit,"
  );

  if (bodyContent === row.bodyContent) throw new Error("Replacement did not match — search bodyContent manually");

  const [result] = await db.update(experiences)
    .set({ bodyContent })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title, bodyContent: experiences.bodyContent });

  console.log("Updated:", result.title);
  console.log("\n--- Full bodyContent, check for any remaining Mayfair mentions ---\n");
  console.log(result.bodyContent);
  console.log("\n--- Mayfair mention count ---");
  console.log((result.bodyContent.match(/Mayfair/g) || []).length);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
