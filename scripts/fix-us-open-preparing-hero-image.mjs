import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "preparing-for-us-open-mq4wj388";
const HERO_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-cost.jpg";
const ALT = "Preparing for your US Open visit";

const result = await db
  .update(experiences)
  .set({ heroImageUrl: HERO_URL, heroImageAlt: ALT, heroImageCredit: null })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl });

console.log("Updated:", result);
process.exit(0);
