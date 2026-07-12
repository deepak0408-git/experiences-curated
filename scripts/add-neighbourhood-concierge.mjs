import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const items = [
  {
    id: "6a46f802-68a0-4ff3-8229-cbb279822d87", // A Day in Budapest
    howToBook:
      "Independent Parliament visits aren't allowed, it's guided tour or audio-guide only, and same-day tickets routinely sell out in July, book the Budapest Parliament Tour with Audio Guide (linked below) at least a few days ahead rather than trying to walk up. If you'd rather have someone narrate the history of Castle Hill instead of self-guiding with an audio unit, the Buda Castle Walking Tour with a Historian covers the same ground with a live guide, worth it if you want the stories behind Fisherman's Bastion and Matthias Church rather than just the view. Either books directly through the links below, no separate contact needed for these.",
  },
  {
    id: "07205ca7-5528-470c-b9c3-05af68eab44b", // Szimpla Kert
    howToBook:
      "Szimpla itself needs no booking, it's walk-in, but if you want more than a drink, the Budapest Past & Present Jewish District Walk (linked below) puts the ruin bar in context, the same streets, the wartime ghetto history, and the neighbourhood's ongoing Jewish community, in a guided couple of hours. Book it for a Friday or Saturday afternoon so the tour ends right as the Jewish Quarter's evening crowd is picking up, and you can roll straight from the walk into Szimpla itself.",
  },
  {
    id: "1cec44b6-8c15-4ff5-ae93-b485dee66b06", // Széchenyi Thermal Bath
    howToBook:
      "The general skip-the-line ticket via szechenyibath.hu covers entry, but the Széchenyi Spa Full-Day Entrance Pass (linked below) is worth comparing on price and inclusions before you buy separately, it sometimes bundles in a locker or towel rental that the standard ticket charges for individually. Either way, buy ahead online rather than queuing at the gate on a summer race weekend, the entrance line runs long with race-week visitor numbers added to the usual crowd.",
  },
];

for (const item of items) {
  const [existing] = await db
    .select({ practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.id, item.id));

  const [result] = await db
    .update(experiences)
    .set({ practicalInfo: { ...existing.practicalInfo, howToBook: item.howToBook } })
    .where(eq(experiences.id, item.id))
    .returning({ id: experiences.id, title: experiences.title });

  console.log(`✓ Added Concierge howToBook: ${result.title}`);
}

await client.end();
