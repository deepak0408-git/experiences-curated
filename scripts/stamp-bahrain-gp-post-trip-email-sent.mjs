import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, inArray } from "drizzle-orm";
import { purchases, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_SLUG = "bahrain-grand-prix";

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!event) {
  console.error("Event not found");
  process.exit(1);
}

// The 39 recipients the real send went to (excludes deepak0408@gmail.com, [deleted], inactive rows)
const RECIPIENTS = [
  "6ady981zr@mozmail.com", "tcurq28@gmail.com", "zouknewsletters@gmail.com",
  "clarenceturkey@gmail.com", "sanketsingal844@gmail.com", "swarms_robin.0r@icloud.com",
  "veerkapadia21@gmail.com", "clanvn909@gmail.com", "someurl@yopmail.com",
  "savibavi1@gmail.com", "janek1223e@gmail.com", "samc_93@hotmail.com",
  "nzkerryn@hotmail.com", "da96103@hotmail.com", "kevin.gove007@gmail.com",
  "stevie.email@gmail.com", "jonkwok1996@gmail.com", "edwin9960@yahoo.com.tw",
  "pomp-pasty.9y@icloud.com", "raam.barath@gmail.com", "sarahvanboven@yahoo.com",
  "recofanly@gmail.com", "rahul.manchesterunited@gmail.com", "sanjaymanickam28@gmail.com",
  "elhh@duck.com", "wania.afrozicty99@gmail.com", "soultanobie19@gmail.com",
  "prajin2mummy@gmail.com", "kjd2338@gmail.com", "sumanthbestintheworld@gmail.com",
  "ozguroncel@gmail.com", "lolsteve528@gmail.com", "teja.nh24@gmail.com",
  "dakshabobby69@gmail.com", "prasadforfacebook@gmail.com", "gaoleon8@gmail.com",
  "siddhartha0610@gmail.com", "fluky_erosive_5k@icloud.com", "sanjeevanimhatre100600@gmail.com",
];

const now = new Date();

const result = await db
  .update(purchases)
  .set({ postTripEmailSentAt: now })
  .where(and(eq(purchases.sportingEventId, event.id), inArray(purchases.email, RECIPIENTS)))
  .returning({ email: purchases.email });

console.log(`Stamped postTripEmailSentAt = ${now.toISOString()} for ${result.length} row(s):`);
result.forEach((r) => console.log(" ", r.email));

await client.end();
