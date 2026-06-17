import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "open-pub-walk-birkdale-mqht8lss";

const [result] = await db
  .update(experiences)
  .set({
    practicalInfo: {
      hours: "Most venues open from 10:00–11:00. Coast closed Mon–Tue. Barrique closed Mon. Check individual sites during Open week for extended hours.",
      costRange: "Pint of cask ale £4–5.50. Cocktails £9–12. Barrique pizza from ~£12. Coast dinner à la carte £25–35/head.",
      bookingMethod: "Coast Birkdale takes reservations — book dinner well in advance for Open week at coastbirkdale.com or call 01704 331333. Barrique is walk-ins only; arrive before 19:00. All other venues are walk-in.",
      howToBook: null,
      website: "https://coastbirkdale.com/, https://cafebarnista.co.uk/, https://barriquebirkdale.com/",
      reservationsRequired: false,
    },
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

console.log("✓ Updated:", result.title);
console.log("  Slug:", result.slug);
console.log("→ http://localhost:3000/experience/" + SLUG);

await client.end();
