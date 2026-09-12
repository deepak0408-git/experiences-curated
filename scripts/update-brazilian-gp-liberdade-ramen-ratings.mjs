import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "0cef8047-9497-487f-8c71-0243e8e84796"; // Liberdade's Ramen Shops — Aska & Lamen Kazu

const bodyContent = `São Paulo has the largest population of Japanese descent of any city outside Japan, and Liberdade is the neighborhood that grew up around that community starting in the early 20th century. The food here isn't a themed district built for tourists — it's a genuine, generations-deep food culture, and two ramen shops in particular have become destinations in their own right, drawing lines that have nothing to do with novelty.

Restaurante Lamen ASKA keeps its menu genuinely narrow: two gyoza options, three lamen options, pork or chicken broth, nothing else. That narrowness is the point — everything on the menu gets full attention rather than a kitchen spreading itself across sushi, sashimi, and a dozen other dishes at once. Lines form before opening, and they're worth the wait; this is one of the most consistently well-reviewed restaurants in the entire neighborhood. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5067517373091332203&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Lamen Kazu, a short walk away on Rua Thomaz Gonzaga, is arguably the more famous of the two specifically for its tonkotsu — a rich, genuinely long-simmered pork broth ramen that regulars describe as the reason they keep coming back regardless of the wait. Like Aska, expect a line, especially on weekends, and expect it to move for a genuine reason once you're inside. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=4536772839955531305&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Both restaurants sit inside walking distance of the Feira da Liberdade, the neighborhood's weekend street market (Saturdays and Sundays, 9am-6pm) — pairing a ramen lunch with a walk through the market's stalls of Japanese-Brazilian food, crafts, and ornaments is the single best way to spend a few hours in this part of the city.`;

const editorialNote = "Aska and Lamen Kazu ratings confirmed via real Google Places API lookup, 12 Sep 2026 — Restaurante Lamen ASKA: 4.5/10,295 reviews; Lamen Kazu: 4.6/8,560 reviews. Both large, well-attested samples. Ratings written as live inline links per skill §2c multi-venue rule, never as static numbers. `MULTI_VENUE_RATINGS['brazilian-gp-liberdade-japanese-dining-']` registered with venueCount: 2, matching the 2 real inline rating links (Aska, Lamen Kazu).";

const [row] = await db
  .update(experiences)
  .set({
    bodyContent,
    editorialNote,
    googleMapsRating: null,
    googleMapsReviewCount: null,
    googleMapsUrl: null,
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, bodyContent: experiences.bodyContent });

console.log("✓", row.title, "— word count:", row.bodyContent.split(/\s+/).length);
await client.end();
