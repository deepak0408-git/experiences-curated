import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "0cef8047-9497-487f-8c71-0243e8e84796"; // Liberdade's Ramen Shops — Aska & Lamen Kazu

// app/experience/[slug]/page.tsx renders the top-level `experiences.address`
// column for "Address" — not practicalInfo.address, which that page's type
// doesn't even declare. Putting the combined address there instead.
const address =
  "Restaurante Lamen ASKA: Rua Barão de Iguape, 260, Liberdade, São Paulo - SP, 01507-000, Brazil. Lamen Kazu: Rua Thomaz Gonzaga, 87, Liberdade, São Paulo - SP, 01506-020, Brazil.";

const practicalInfo = {
  hours:
    "Restaurante Lamen ASKA: Tue 11am-5pm, Wed-Sat 11am-2pm & 6-9pm, Sun 11am-5pm — closed Mondays and the last Sunday of each month. Lamen Kazu: Tue-Fri 11:30am-3:30pm & 5:30-10:30pm, Sat 11am-3:30pm & 5:30-10:30pm, Sun 11am-3:30pm & 5:30-9:30pm — closed Mondays.",
  // practical.website is rendered by app/experience/[slug]/page.tsx as a strict
  // comma-split list of bare URLs (no label support) — do not prefix entries
  // with "Name: " or join with " | ", both break the href.
  website:
    "https://www.yelp.com/biz/aska-s%C3%A3o-paulo?osq=Ramen, https://www.yelp.com/biz/lamen-kazu-s%C3%A3o-paulo-2",
  costRange: "Genuinely affordable — expect roughly US$8-15 per person for a full ramen meal at either restaurant",
  bookingMethod: "No reservations — both operate on a walk-in, line-up basis.",
  reservationsRequired: false,
};

const editorialNote =
  "Addresses and opening hours for both restaurants confirmed via real Google Places API lookup (regularOpeningHours + formattedAddress), 12 Sep 2026: Restaurante Lamen ASKA — Rua Barão de Iguape, 260, Liberdade, closed Mondays, Tue/Sun 11am-5pm continuous, Wed-Sat split lunch (11am-2pm)/dinner (6-9pm) service; also closes the last Sunday of each month per a secondary Threads/Instagram source, cross-checked. Lamen Kazu — Rua Thomaz Gonzaga, 87, Liberdade, closed Mondays, Tue-Fri 11:30am-3:30pm & 5:30-10:30pm, Sat 11am-3:30pm & 5:30-10:30pm, Sun 11am-3:30pm & 5:30-9:30pm. Websites set to the user-provided Yelp listing for each restaurant. Ratings sourced separately, 12 Sep 2026 (see prior editorial note on this row).";

const [row] = await db
  .update(experiences)
  .set({ address, practicalInfo, editorialNote })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, address: experiences.address, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title);
console.log("Address:", row.address);
console.log(JSON.stringify(row.practicalInfo, null, 2));
await client.end();
