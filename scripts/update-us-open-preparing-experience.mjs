import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { like, eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [exp] = await db
  .select({ id: experiences.id, bodyContent: experiences.bodyContent })
  .from(experiences)
  .where(like(experiences.title, "%Preparing for Your US Open%"))
  .limit(1);

if (!exp) {
  console.error("Experience not found");
  process.exit(1);
}

const addendum = `

**Food and drink you can bring in**

The USTA allows sealed, factory-sealed plastic water bottles (up to 591ml / 20oz) through security. Empty reusable bottles are permitted and free water refill stations are positioned throughout the grounds — this is the practical option for a full day in August heat. No glass containers, no cans, and no alcohol brought from outside.

Food is allowed in. The rule: modest quantities in clear, resealable plastic bags or transparent packaging. A sandwich, snacks, and a small meal for the day are all fine. Full picnic setups and large soft coolers exceed the bag policy (12 × 16 × 8 inches) — keep it to a compact bag and you'll be fine. No glass jars.

In practice: bring your own lunch in a ziplock or clear bag, an empty reusable bottle, and buy the Honey Deuce inside. You'll spend less and eat better than if you rely entirely on the concession stands.

**Useful apps and accounts**

*US Open app* (iOS / Android) — real-time scores, court-by-court schedules, weather-triggered delay notifications, and the draw updated live. The single most useful thing to have open on your phone during the day.

*X / Twitter @usopen* — the official account pushes schedule announcements, match results, and rain delay updates faster than any other channel. The tournament hashtag (#USOpen) is also where the tennis community watches along in real time — useful during a close fifth set.

*Instagram @usopen* — behind-the-scenes footage, player practice clips, and the best visual coverage of the grounds atmosphere. Less useful for live match information, worth checking the morning before your session for player-arrival content.

*The Score app* — live point-by-point scoring for every match on the grounds, with server stats and recent form context. The best alternative to the official app if you want to track multiple matches simultaneously — useful when you're at Louis Armstrong and want to know what's happening on Ashe.

*ESPN app* — if you have an ESPN subscription, live streaming of select matches is available. Useful in the stadium when you want to catch a match on a different court without physically moving.`;

const newBody = exp.bodyContent + addendum;

const [updated] = await db
  .update(experiences)
  .set({ bodyContent: newBody })
  .where(eq(experiences.id, exp.id))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${updated.title}`);
console.log(`  Body length: ${newBody.length} chars`);
await client.end();
