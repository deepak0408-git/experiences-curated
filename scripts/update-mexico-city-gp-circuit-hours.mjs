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
    slug: "autodromo-hermanos-rodriguez-venue-mtpdn8im",
    hours:
      "Circuit grounds open ahead of each day's first on-track session during race weekend (30 Oct - 1 Nov 2026) — Friday's Practice 1 runs 12:30-13:30, Saturday's Practice 3 runs 11:30-12:30, and Sunday's race starts at 14:00",
  },
  {
    slug: "mexico-city-gp-arrival-queue-mtpdpr7p",
    hours:
      "Gates typically open 2-3 hours ahead of each day's first scheduled session — Friday's Practice 1 runs 12:30-13:30, Saturday's Practice 3 runs 11:30-12:30, and Sunday's race starts at 14:00, so arrive early on any day with a grandstand you care about, since popular stands fill on genuine merit rather than assigned time slots",
  },
  {
    slug: "mexico-city-gp-paddock-club-mtpdkh8d",
    hours:
      "Both tiers run across all 3 days of race weekend (30 Oct - 1 Nov 2026), doors open ahead of each day's first session — Friday's Practice 1 runs 12:30-13:30, Saturday's Practice 3 runs 11:30-12:30, and Sunday's race starts at 14:00",
  },
  {
    slug: "foro-sol-mexico-city-gp-mtpdg1hx",
    hours:
      "Gates open ahead of each day's first session — Friday's Practice 1 runs 12:30-13:30, Saturday's Practice 3 runs 11:30-12:30, and Sunday's race starts at 14:00",
  },
  {
    slug: "mexico-city-gp-fan-zone-mtpdlqj4",
    hours:
      "Fan zones typically open alongside circuit gates each day of the race weekend and run through the day's sessions — Friday's Practice 1 runs 12:30-13:30, Saturday's Practice 3 runs 11:30-12:30, and Sunday's race starts at 14:00",
  },
  {
    slug: "mexico-city-gp-where-to-sit-mtpdhggj",
    hours:
      "Gates open ahead of each day's first session — Friday's Practice 1 runs 12:30-13:30, Saturday's Practice 3 runs 11:30-12:30, and Sunday's race starts at 14:00",
  },
];

for (const { slug, hours } of updates) {
  const [result] = await db
    .update(experiences)
    .set({
      practicalInfo: sql`jsonb_set(practical_info, '{hours}', to_jsonb(${hours}::text))`,
    })
    .where(eq(experiences.slug, slug))
    .returning({ title: experiences.title, slug: experiences.slug });
  console.log("Updated:", result?.title, "|", result?.slug);
}

await client.end();
