import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// 13 Sep 2026: curator asked to move the Main Grandstand (#4) hero image to
// North Grandstand (#5) instead — a new image for #4 is coming separately.
// No new R2 upload needed; #5 reuses the already-uploaded Trinidade asset.

const MAIN_GRANDSTAND_ID = "0c54551a-a1e8-4f9a-aa13-df95ed86fbb7";
const NORTH_GRANDSTAND_ID = "921d9090-6e37-475d-8f37-1417062d52fa";

const SHARED = {
  heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/qatar-gp-main-grandstand.jpg",
  heroImageAlt: "Spectators in the grandstand at Losail Circuit",
  heroImageCredit: "Trinidade / CC BY 3.0",
};

const [north] = await db
  .update(experiences)
  .set(SHARED)
  .where(eq(experiences.id, NORTH_GRANDSTAND_ID))
  .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl });
console.log(`✓ ${north.title} now has hero image: ${north.heroImageUrl}`);

const [main] = await db
  .update(experiences)
  .set({ heroImageUrl: null, heroImageAlt: null, heroImageCredit: null })
  .where(eq(experiences.id, MAIN_GRANDSTAND_ID))
  .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl });
console.log(`✓ ${main.title} hero image cleared (was: qatar-gp-main-grandstand.jpg) — awaiting new pick`);

await client.end();
