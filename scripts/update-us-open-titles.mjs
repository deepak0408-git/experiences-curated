import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { like, eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const renames = [
  {
    match: "Preparing for Your US Open%",
    title: "The US Open Briefing",
    subtitle: "Tickets, heat, bags, and apps — what first-timers get wrong and how to sort it before you arrive in Flushing",
  },
  {
    match: "The Practice Courts at the US Open%",
    title: "Morning at the Practice Facility",
    subtitle: "Free with a grounds pass from 9am — arm's reach from world top-10 players before the sessions start",
  },
  {
    match: "Eating at the US Open%",
    title: "The Concourse at Flushing",
    subtitle: "More food diversity than any other Slam — because it's in New York, and the concourse reflects it",
  },
];

for (const { match, title, subtitle } of renames) {
  const [exp] = await db
    .select({ id: experiences.id, title: experiences.title })
    .from(experiences)
    .where(like(experiences.title, match))
    .limit(1);

  if (!exp) { console.log(`✗ Not found: ${match}`); continue; }

  await db
    .update(experiences)
    .set({ title, subtitle })
    .where(eq(experiences.id, exp.id));

  console.log(`✓ "${exp.title}" → "${title}"`);
}

await client.end();
