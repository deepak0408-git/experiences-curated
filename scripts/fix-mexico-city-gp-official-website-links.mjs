import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq, sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const updates = [
  {
    slug: "mexico-city-gp-fan-zone-mtpdlqj4",
    website: "https://www.mexicogp.mx/informacion",
  },
  {
    slug: "mexico-city-gp-arrival-queue-mtpdpr7p",
    website: "https://www.mexicogp.mx/informacion",
  },
  {
    slug: "mexico-city-gp-ticket-guide-mtpdisxk",
    website: "https://tickets.formula1.com/en/f1-4861-mexico, https://www.mexicogp.mx/boletos-generales",
  },
  {
    slug: "mexico-city-gp-where-to-sit-mtpdhggj",
    website: "https://www.mexicogp.mx/mapa-del-circuito, https://tickets.formula1.com/en/f1-4861-mexico",
  },
  {
    slug: "foro-sol-mexico-city-gp-mtpdg1hx",
    website: "https://tickets.formula1.com/en/f1-4861-mexico, https://www.mexicogp.mx/mapa-del-circuito",
  },
  {
    slug: "autodromo-hermanos-rodriguez-venue-mtpdn8im",
    website: "https://www.mexicogp.mx",
  },
];

for (const { slug, website } of updates) {
  const [result] = await db
    .update(experiences)
    .set({
      practicalInfo: sql`jsonb_set(practical_info, '{website}', to_jsonb(${website}::text))`,
    })
    .where(eq(experiences.slug, slug))
    .returning({ title: experiences.title, slug: experiences.slug });
  console.log("Updated:", result?.title, "|", result?.slug, "->", website);
}

await client.end();
