import { db } from "../lib/db.ts";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const rows = await db
  .select({
    id: experiences.id,
    title: experiences.title,
    type: experiences.experienceType,
    practicalInfo: experiences.practicalInfo,
  })
  .from(experiences)
  .where(eq(experiences.sportingEventId, "2bab697d-9d2b-45ff-9b46-9fbfc3a0a40b"))
  .orderBy(experiences.title);

rows.forEach(r => {
  console.log(`\n--- ${r.title} ---`);
  console.log(`Type: ${r.type}`);
  console.log(`bookingMethod: ${r.practicalInfo?.bookingMethod || 'none'}`);
  console.log(`howToBook: ${r.practicalInfo?.howToBook || 'none'}`);
  console.log(`ID: ${r.id}`);
});

process.exit(0);
