import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const IC_MAPS_URI = "https://maps.google.com/?cid=7173748620512840815&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

try {
  const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent, editorialNote: experiences.editorialNote })
    .from(experiences)
    .where(eq(experiences.title, "Where to Stay in Adelaide — City vs. North Adelaide"));

  if (!row) throw new Error("Experience not found");

  const bodyContent = row.bodyContent.replace(
    "which the Oval Hotel, wrapped around a stadium in parkland, genuinely doesn't offer on non-match days.",
    `which the Oval Hotel, wrapped around a stadium in parkland, genuinely doesn't offer on non-match days. [See live rating and reviews on Google Maps](${IC_MAPS_URI})`
  );

  const editorialNote = row.editorialNote.replace(
    "InterContinental Adelaide's own Google Places rating/review-count lookup and its Google Maps rating link still need to be pulled the same way before this experience is finalized.",
    "InterContinental Adelaide Google Places API lookup (4.3/2,825 reviews) captured 17 Aug 2026 — real, well-attested rating, no thin-review concern."
  );

  if (bodyContent === row.bodyContent) throw new Error("bodyContent replacement did not match");
  if (editorialNote === row.editorialNote) throw new Error("editorialNote replacement did not match");

  const [result] = await db.update(experiences)
    .set({ bodyContent, editorialNote })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title });

  console.log("Updated:", result.title);
  console.log("\n--- IC paragraph ---\n");
  console.log(bodyContent.split("\n\n")[2]);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
