import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "1cec44b6-8c15-4ff5-ae93-b485dee66b06"; // Széchenyi Thermal Bath

const bodyContent = `Széchenyi Thermal Bath opened in 1913 in City Park, built over natural hot springs drilled by engineer Vilmos Zsigmondy in the late 19th century. It's the largest medicinal bath complex in Europe: 15 indoor pools and 3 grand outdoor pools, the outdoor water sitting around 30-34°C and the thermal pools closer to 38°C, hot enough to sit comfortably in even on a cool evening.

The building itself is part of the draw, a grand yellow neo-Baroque complex designed by Győző Czigler, expanded to its current size in 1927. But the actual experience is more social than architectural: Széchenyi has a livelier, more communal atmosphere than Budapest's other historic baths, and the sight of people playing chess on floating boards in the outdoor pools, year-round, rain or shine, is one of the city's genuinely iconic images rather than a tourist cliché invented for postcards.

It's open every day from 6am to 10pm, though indoor pools close at 8pm and saunas at 9pm. Weekday tickets run about HUF 11,900, weekend tickets HUF 13,500, and buying a skip-the-line ticket online ahead of time is worth the small effort given how busy the entrance gets, especially on a summer weekend during race week.`;

const practicalInfo = {
  hours: "Daily 6am-10pm; indoor pools close 8pm, saunas/steam rooms close 9pm",
  website: "https://www.szechenyibath.hu/",
  costRange: "HUF 11,900 weekday / HUF 13,500 weekend",
  bookingMethod: "Buy a skip-the-line ticket online via szechenyibath.hu ahead of your visit, or use a Budapest Card for a discounted entrance fee.",
  reservationsRequired: false,
};

const [result] = await db
  .update(experiences)
  .set({ bodyContent, practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ ${result.title} — currency unified to HUF`);

await client.end();
