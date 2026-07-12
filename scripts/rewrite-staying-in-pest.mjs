import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "ac9439b1-54bd-4ef2-ba9c-85cf34335e6f"; // Staying in Pest

const bodyContent = `Budapest splits into two halves across the Danube, hilly Buda and flat Pest, and for a Hungaroring race weekend the choice isn't close. Pest has the majority of the city's hotels, restaurants, and nightlife, it's flat and walkable, and it's where the M2 red metro line runs, the first leg of the journey out to the circuit. But "stay in Pest" isn't specific enough on its own, the districts inside Pest have genuinely different personalities, and picking the wrong one for your trip matters more than picking the wrong hotel within it.

District V, the Belváros or Inner City, is Budapest's most formal address. It's where the Four Seasons Gresham Palace and the Art Deco Párizs Budapest sit, grand hotels, upmarket bars, a Monday-to-Friday rhythm that feels more office district than tourist strip. It suits couples and anyone wanting a quiet, polished base, and it's genuinely walkable to Parliament and the river. If race weekend evenings are meant to be calm, this is the district.

District VI, Terézváros, is the one most locals actually recommend to first-time visitors. It's anchored by Andrássy Avenue, Budapest's grand boulevard of designer stores, the State Opera, and old embassy mansions, and it runs its own metro line (M1) straight to the thermal baths in under ten minutes. It's elegant without being stiff, central without District V's formality or District VII's noise, a mix of upscale hotels and old cafés next to unpretentious kebab shops. For most people planning a multi-day trip around one race weekend, this is the strongest all-round base.

District VII, Erzsébetváros, is the Jewish Quarter and the ruin bar district, Szimpla Kert's home turf. It's the liveliest of the three, full of bars and restaurants, and the cheapest place to find a bed. It also carries real history, the site of the wartime Budapest ghetto and a Jewish community still rebuilding its presence today. Book here if evenings out matter more to you than a quiet night's sleep before race day.

Whichever district you land in, the practical rule holds: book near an M2 stop. Deák Ferenc tér sits at the centre of all three districts and doubles as the main interchange station. Astoria connects directly to Keleti railway station, useful if you're arriving by train. Blaha Lujza tér is quieter, set back from the main tourist flow, and still only 15-20 minutes' walk from the centre. Any of the three gets you onto the M2 toward Örs vezér tere, where the HÉV suburban line picks up for the Hungaroring, without adding a transfer to an already long race-day morning.`;

const whyItsSpecial = `Most guides tell you "stay in Pest" and stop there, as if the flat side of the river were one undifferentiated hotel district. It isn't. District V, VI, and VII sit within a fifteen-minute walk of each other and feel like three different cities: formal and quiet, elegant and balanced, loud and cheap. Picking between them isn't really an accommodation decision, it's a decision about what kind of race weekend you want, one where evenings are as calm as the mornings, or one where the Jewish Quarter's bars are part of the trip. The M2 rule matters for every district equally. The character of the district you choose is what actually shapes the week.`;

const insiderTips = [
  "If you can't decide, default to District VI (Terézváros), it's the balance point between District V's formality and District VII's noise, and its own M1 line adds a second fast route across the city beyond the M2.",
  "Search specifically for hotels within walking distance of an M2 metro stop (Deák Ferenc tér, Astoria, Blaha Lujza tér, Keleti pályaudvar), this single filter does more for your race-day morning than almost any other accommodation decision.",
];

const whatToAvoid = `Don't book a hotel in Buda for the views or the quiet, the hillier terrain and lack of direct M2 access make the daily commute to the Hungaroring noticeably more complicated, even though it's the same city. And don't assume all of Pest is the same district, character, price, and noise level all vary block by block near the centre.`;

const practicalInfo = {
  hours: "N/A — destination guidance, not a single bookable venue",
  costRange: "District V: highest, grand five-star and boutique properties. District VI: mid-to-upper, elegant boutique hotels. District VII: widest range, from hostels to well-reviewed budget hotels near Blaha Lujza tér.",
  website: "https://www.f1hungary.com/en/hotels-24",
  bookingMethod: "Search accommodation platforms filtering for District V, VI, or VII, prioritising proximity to an M2 metro stop over proximity to the river or old town views. Named options worth checking directly: Carat Boutique Hotel or Florin Apart Hotel near Deák Ferenc tér, Danubius Hotel Astoria near Astoria, Marone Suites or Centrooms House near Blaha Lujza tér.",
  reservationsRequired: true,
};

const [result] = await db
  .update(experiences)
  .set({ bodyContent, whyItsSpecial, insiderTips, whatToAvoid, practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Rewritten: ${result.title}`);

await client.end();
