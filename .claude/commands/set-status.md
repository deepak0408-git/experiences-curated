Set an experience's status in the ExperiencesCurated database.

## Instructions

The user will provide an experience title (or partial title) and a target status. Valid statuses: `draft`, `in_review`, `published`, `archived`, `flagged`.

Run the following steps:

1. Write a temporary script at `scripts/_set-status.mjs` with this template, filled in with the actual search term and target status:

```js
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { ilike, eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SEARCH = "<SEARCH_TERM>";
const TARGET = "<TARGET_STATUS>";

const matching = await db
  .select({ id: experiences.id, title: experiences.title, status: experiences.status })
  .from(experiences)
  .where(ilike(experiences.title, `%${SEARCH}%`));

if (matching.length === 0) {
  console.log(`No experience matching "${SEARCH}"`);
  await client.end();
  process.exit(1);
}

if (matching.length > 1) {
  console.log("Multiple matches — be more specific:");
  matching.forEach(e => console.log(`  [${e.status}] ${e.title}`));
  await client.end();
  process.exit(1);
}

const [exp] = matching;

const update = { status: TARGET };
if (TARGET !== "published") update.publishedAt = null;
if (TARGET === "published") update.publishedAt = new Date();
if (TARGET === "draft") update.reviewNotes = null;

await db.update(experiences).set(update).where(eq(experiences.id, exp.id));
console.log(`"${exp.title}"\n  ${exp.status} → ${TARGET}`);
await client.end();
```

2. Run it:
```
node --experimental-strip-types scripts/_set-status.mjs
```

3. Delete the script after it runs (success or failure).

4. Report the result to the user — what changed, or why it failed (no match / ambiguous).

## Status transition rules (inform the user if violated, but still proceed)

- `published` → `draft`: clears `publishedAt` and `reviewNotes`
- `in_review` → `published`: sets `publishedAt = now()`
- `draft` → `published`: valid but skips the review step — note this to the user
