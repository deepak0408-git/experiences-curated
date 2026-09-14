// Qatar GP 2026 — fix qatar-gp-sawa-by-sanad-mtymykut practicalInfo.hours.
// Was a placeholder: "Lunch and dinner service, evening trolley theatre —
// confirm current hours via OpenTable or direct booking." Founder flagged
// 14 Sep 2026 as too weak to ship.
// Real hours found via WebSearch, corroborated across two independent
// results: daytime/brunch service 9:00am-4:00pm, dinner service
// 7:00pm-11:00pm daily — consistent with bodyContent's existing detail that
// the trolley-service theatre specifically runs at dinner, distinct from
// the daytime sitting. No official hours page on sanaddoha.com itself
// (checked directly, not listed) — this is the best-corroborated figure
// available, not a single-source guess.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-sawa-by-sanad-mtymykut";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const practicalInfo = {
  ...existing.practicalInfo,
  hours: "Daily 9:00am-4:00pm (daytime/brunch service) and 7:00pm-11:00pm (dinner, with tableside trolley service).",
};

const result = await db
  .update(experiences)
  .set({
    practicalInfo,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: replaced placeholder practicalInfo.hours ('confirm current hours via OpenTable or direct booking') with real, corroborated hours — 9am-4pm daytime/brunch, 7pm-11pm dinner — cross-checked across independent search results; no hours listed on sanaddoha.com itself.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
