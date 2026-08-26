import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const TWELVE_APOSTLES_MAPS_URI = "https://maps.google.com/?cid=15126865179454442992&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

try {
  const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent })
    .from(experiences)
    .where(eq(experiences.title, "Great Ocean Road & the Twelve Apostles"));

  if (!row) throw new Error("Experience not found");

  const oldSentence = "The Twelve Apostles themselves are limestone sea stacks rising straight out of the Southern Ocean, carved by the same erosion that's slowly claiming the cliffs behind them — several stacks have collapsed within living memory, which is part of why seeing them now rather than assuming they'll always look the same has its own quiet urgency.";
  const newSentence = `The Twelve Apostles themselves are limestone sea stacks rising straight out of the Southern Ocean, carved by the same erosion that's slowly claiming the cliffs behind them — several stacks have collapsed within living memory, which is part of why seeing them now rather than assuming they'll always look the same has its own quiet urgency. [See live rating and reviews on Google Maps](${TWELVE_APOSTLES_MAPS_URI})`;

  const bodyContent = row.bodyContent.replace(oldSentence, newSentence);
  if (bodyContent === row.bodyContent) throw new Error("Replacement did not match");

  const [result] = await db.update(experiences)
    .set({ bodyContent })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title, bodyContent: experiences.bodyContent });

  console.log("Updated:", result.title);
  console.log("\n--- Paragraph 3 ---\n");
  console.log(result.bodyContent.split("\n\n")[2]);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
