import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db
  .select({ bodyContent: experiences.bodyContent, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, "montmartre-neighborhood"));

const oldSentence =
  "It's touristy in the way any famous square with this much foot traffic inevitably becomes, but the practice itself, artists working live in a public square, is a genuine continuation rather than a staged recreation.";

const newSentence =
  "It's touristy in the way any famous square with this much foot traffic inevitably becomes, but the practice itself, artists working live in a public square, is a genuine continuation rather than a staged recreation. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=17629937811604957282)";

if (!row.bodyContent.includes(oldSentence)) {
  throw new Error("Expected sentence not found in body_content — aborting to avoid a silent no-op.");
}

const bodyContent = row.bodyContent.replace(oldSentence, newSentence);

const editorialNote =
  (row.editorialNote ?? "") +
  " Place du Tertre Google rating (4.5/5, 20,391 reviews) added 7 Sep 2026 — confirmed via Google Places API and the founder's own Google Maps screenshot. Moulin de la Galette intentionally left without a rating link — the only Google match for that name is a restaurant trading on the historic windmill's name, not the landmark itself, so attaching its rating would misattribute it.";

await db.update(experiences)
  .set({ bodyContent, editorialNote })
  .where(eq(experiences.slug, "montmartre-neighborhood"));

console.log("✓ montmartre-neighborhood — Place du Tertre rating added, Moulin de la Galette left unrated (correctly)");

await client.end();
