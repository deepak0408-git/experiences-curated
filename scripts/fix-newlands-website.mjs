import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "getting-to-newlands-mrlzm9wi";

try {
  const [existing] = await db.select({ practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.slug, SLUG));

  const [result] = await db.update(experiences)
    .set({
      practicalInfo: {
        ...existing.practicalInfo,
        website: "https://cttrains.co.za/ss_route_select.php",
      },
    })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated website field:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
} finally {
  await client.end();
}
