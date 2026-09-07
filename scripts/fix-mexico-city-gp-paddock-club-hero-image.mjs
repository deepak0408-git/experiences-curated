import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const heroImageUrl = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/mexico-city-gp-paddock-club.jpg";
const heroImageCredit = "Jason Puddephatt, CC BY 4.0";

try {
  const [result] = await db
    .update(experiences)
    .set({ heroImageUrl, heroImageCredit })
    .where(like(experiences.slug, "mexico-city-gp-paddock-club-%"))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("Updated:", result?.title, "|", result?.id, "|", result?.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
