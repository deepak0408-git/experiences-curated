import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const MEMORIAL_ARCH_MAPS_URI = "https://maps.google.com/?cid=16772892996276056957&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

try {
  const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent })
    .from(experiences)
    .where(eq(experiences.title, "Great Ocean Road & the Twelve Apostles"));

  if (!row) throw new Error("Experience not found");

  const oldSentence = `A guided coach tour solves this cleanly: Go West Tours, a family-run operator with 16+ years on this exact route, runs a full-day Great Ocean Road Eco Tour departing Melbourne and returning roughly 12-13 hours later, with a beachside morning tea stop in Torquay, the official Great Ocean Road Memorial Arch, and stops through Port Campbell National Park at the day's main destinations. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5361473362131534395&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`;

  const newSentence = `A guided coach tour solves this cleanly: Go West Tours, a family-run operator with 16+ years on this exact route, runs a full-day Great Ocean Road Eco Tour departing Melbourne and returning roughly 12-13 hours later, with a beachside morning tea stop in Torquay, the official Great Ocean Road Memorial Arch, and stops through Port Campbell National Park at the day's main destinations. [See live rating and reviews on Google Maps](${MEMORIAL_ARCH_MAPS_URI})`;

  const bodyContent = row.bodyContent.replace(oldSentence, newSentence);
  if (bodyContent === row.bodyContent) throw new Error("Replacement did not match");

  const [result] = await db.update(experiences)
    .set({ bodyContent })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title, bodyContent: experiences.bodyContent });

  console.log("Updated:", result.title);
  console.log("\n--- Paragraph 2 ---\n");
  console.log(result.bodyContent.split("\n\n")[1]);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
