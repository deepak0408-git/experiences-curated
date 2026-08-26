import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const [result] = await db.update(experiences)
    .set({
      title: "The Real Food Guide — Perth, Adelaide, Melbourne & Sydney",
      subtitle: "Melbourne's laneway coffee scene, plus real picks in Perth, Adelaide and Sydney",
    })
    .where(eq(experiences.title, "Where NZ Fans Actually Eat — A City-by-City Guide"))
    .returning({ id: experiences.id, title: experiences.title, subtitle: experiences.subtitle });

  console.log("Updated:", result.title, `(${result.title.length} chars)`);
  console.log("Subtitle:", result.subtitle);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
