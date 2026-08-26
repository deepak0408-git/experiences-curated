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
    .where(eq(experiences.title, "Where to Stay in Melbourne for Boxing Day"));

  if (!row) throw new Error("Experience not found — check the real title");

  const updatedPracticalInfo = {
    ...row.practicalInfo,
    website: row.practicalInfo.website.replace(
      "https://www.sofitel-melbourne-collins.com.au",
      "https://www.sofitel-melbourne.com.au"
    ),
    bookingMethod: row.practicalInfo.bookingMethod.replace(
      "sofitel-melbourne-collins.com.au",
      "sofitel-melbourne.com.au"
    ),
  };

  if (updatedPracticalInfo.website === row.practicalInfo.website) throw new Error("website replacement did not match");
  if (updatedPracticalInfo.bookingMethod === row.practicalInfo.bookingMethod) throw new Error("bookingMethod replacement did not match");

  const [result] = await db.update(experiences)
    .set({ practicalInfo: updatedPracticalInfo })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title, practicalInfo: experiences.practicalInfo });

  console.log("Updated:", result.title);
  console.log("Website:", result.practicalInfo.website);
  console.log("Booking method:", result.practicalInfo.bookingMethod);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
