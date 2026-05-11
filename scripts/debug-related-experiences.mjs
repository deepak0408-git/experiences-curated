import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEvents } from "../schema/database.ts";
import { eq, and, ne } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Check status breakdown of all experiences
const allExps = await db
  .select({ title: experiences.title, status: experiences.status, sportingEventId: experiences.sportingEventId, destinationId: experiences.destinationId, slug: experiences.slug })
  .from(experiences);

const statusCounts = allExps.reduce((acc, e) => { acc[e.status] = (acc[e.status] ?? 0) + 1; return acc; }, {});
console.log("Status breakdown:", statusCounts);

// Pick the first published experience (if any) and run the related query
const published = allExps.filter(e => e.status === "published");
console.log(`\nPublished experiences: ${published.length}`);

if (published.length > 0) {
  const sample = published[0];
  console.log(`\nSample: "${sample.title}" (slug: ${sample.slug})`);
  console.log(`  sportingEventId: ${sample.sportingEventId}`);
  console.log(`  destinationId: ${sample.destinationId}`);

  const related = await db
    .select({ title: experiences.title, status: experiences.status })
    .from(experiences)
    .where(
      and(
        eq(experiences.status, "published"),
        ne(experiences.slug, sample.slug),
        sample.sportingEventId
          ? eq(experiences.sportingEventId, sample.sportingEventId)
          : eq(experiences.destinationId, sample.destinationId)
      )
    )
    .limit(3);

  console.log(`\nRelated query result (${related.length} rows):`);
  related.forEach(r => console.log(`  • ${r.title} [${r.status}]`));
} else {
  console.log("\nNo published experiences found — this is why related section is empty.");
  console.log("\nFirst 5 in_review experiences:");
  allExps.filter(e => e.status === "in_review").slice(0, 5).forEach(e => console.log(`  • ${e.title}`));
}

await client.end();
