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
  .where(eq(experiences.slug, "paris-landmarks-louvre-notre-dame"));

const oldLouvre =
  "The ticket also covers same-day or next-day entry to the nearby Musée national Eugène-Delacroix. Book well ahead — slots for popular dates and times fill up weeks in advance. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13363865620386383060)";

const newLouvre =
  "The ticket also covers same-day or next-day entry to the nearby Musée national Eugène-Delacroix. Book well ahead — slots for popular dates and times fill up weeks in advance. With limited time, three works cover the essential Louvre: the Mona Lisa (Denon Wing, 1st floor, Room 700), the Venus de Milo (Sully Wing, ground floor, Room 345), and the Winged Victory of Samothrace (Denon Wing, 1st floor, at the top of the Daru Staircase) — all three sit close enough together to hit in under an hour if that's all the time a match day allows. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13363865620386383060)";

if (!row.bodyContent.includes(oldLouvre)) {
  throw new Error("Expected sentence not found in body_content — aborting to avoid a silent no-op.");
}

const bodyContent = row.bodyContent.replace(oldLouvre, newLouvre);

const editorialNote =
  (row.editorialNote ?? "") +
  " Added 7 Sep 2026: top-3-artifact guidance for a time-limited visit (Mona Lisa, Venus de Milo, Winged Victory of Samothrace) with real room/wing locations, sourced from multiple Louvre visitor guides. Top-level address field corrected to list both landmarks — previously only had the Louvre's, matching an earlier gap found on other multi-venue experiences in this pack.";

await db.update(experiences)
  .set({
    bodyContent,
    editorialNote,
    address: "Louvre: Rue de Rivoli, 75001 Paris; Notre-Dame: 6 Parvis Notre-Dame – Place Jean-Paul II, 75004 Paris",
  })
  .where(eq(experiences.slug, "paris-landmarks-louvre-notre-dame"));

console.log("✓ paris-landmarks-louvre-notre-dame — top-3-artifact guidance added, both addresses now in top-level address field");

await client.end();
