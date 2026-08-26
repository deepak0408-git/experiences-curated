import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.title, "SCG Luxury — The Invincibles Lounge & Members Pavilion"));

  if (!row) throw new Error("Experience not found");

  const updatedPracticalInfo = {
    ...row.practicalInfo,
    website: "https://www.officialhospitality.com.au/sydney_cricket_ground",
  };

  const [result] = await db.update(experiences)
    .set({ practicalInfo: updatedPracticalInfo })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title, practicalInfo: experiences.practicalInfo });

  console.log("Updated:", result.title);
  console.log("Website:", result.practicalInfo.website);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
