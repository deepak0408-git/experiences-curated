import { db } from "../lib/db.ts";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const rows = await db
  .select({ title: experiences.title, status: experiences.status, type: experiences.experienceType, wordCount: experiences.bodyWordCount })
  .from(experiences)
  .where(eq(experiences.sportingEventId, "2bab697d-9d2b-45ff-9b46-9fbfc3a0a40b"))
  .orderBy(experiences.title);

console.log(`Total: ${rows.length}`);
rows.forEach(r => console.log(`[${r.status}] ${r.title} (${r.type})`));
process.exit(0);
