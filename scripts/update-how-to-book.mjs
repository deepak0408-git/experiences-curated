import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const updates = [
  {
    title: "Wimbledon Museum & Private Tour",
    howToBook: "Email museum@aeltc.com with your preferred date, group size (up to 20), and whether you want a standard or private guide. Mention you're visiting around the Championships if relevant — they'll advise on the last available pre-tournament date. Standard tours can be booked online at bookings.wimbledon.com with no minimum group size.",
  },
  {
    title: "The Lawn at Wimbledon",
    howToBook: "Go to wimbledon.com/hospitality or keithprowse.co.uk and select The Lawn package. Choose your preferred day — finals weekend and semi-final days sell out first. You'll be asked for dress size/preference as part of the booking to ensure the right hospitality wristband. Payments are typically split: deposit on booking, balance 8 weeks before the event.",
  },
  {
    title: "Rooftop Dinner Then the Night Session",
    howToBook: "Book night session tickets first at usopen.org — they sell out months ahead, particularly for week two. Then book the dinner. Pier 17's Dinner and a Match package at rooftopatpier17.com lists specific dates during the Open fortnight; select your date and party size. For Le Bernardin, book via exploretock.com/lebernardin and request a 5pm seating explicitly — this gives comfortable time to finish and reach the 7 train.",
  },
  {
    title: "A Morning in Queens Before the Tennis",
    howToBook: "Email laura@eatyourworld.com for a private Flushing or Jackson Heights tour, specifying your preferred date, group size, and start time. Alternatively, book through Joe DiStefano at joedistefano.nyc/tours for a Flushing-focused private tour. Both guides ask about dietary restrictions in advance. If private tours are full, Eat Your World also publishes self-guided tour PDFs for both Flushing and Jackson Heights at eatyourworld.com.",
  },
];

for (const { title, howToBook } of updates) {
  const [exp] = await db
    .select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.title, title))
    .limit(1);

  if (!exp) {
    console.log(`✗ Not found: ${title}`);
    continue;
  }

  const updated = { ...(exp.practicalInfo ?? {}), howToBook };
  await db
    .update(experiences)
    .set({ practicalInfo: updated })
    .where(eq(experiences.id, exp.id));

  console.log(`✓ Updated: ${title}`);
}

await client.end();
