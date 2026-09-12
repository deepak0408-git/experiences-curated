import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "3f467556-9b97-4f79-9dcc-e86977a5e22d"; // Jardins, Itaim Bibi & Vila Nova Conceição

const bodyContent = `Three neighborhoods sit next to each other south of Paulista Avenue, and together they cover most of the self-catering and mid-to-high-end stay options fans use for race weekend: Jardins, Itaim Bibi, and Vila Nova Conceição.

Jardins is the one built around Rua Oscar Freire — high-end retail, some of the city's best restaurants, and a genuinely walkable grid of tree-lined streets. It's the most polished of the three and the closest to a "tourist can find their way around easily" area, without actually being touristy in the way that phrase usually implies. Short-term rental options here skew toward boutique apartment buildings rather than large towers. The food identity centers on names like Tordesilhas, known for showcasing regional Brazilian cooking beyond the usual São Paulo staples, and Vento Haragano, a gaúcha-style churrascaria built for a proper sit-down steak dinner — this is the neighborhood to pick if a real reservation, not a quick bite, is part of how you want to spend a race-weekend evening.

Itaim Bibi sits just south, built more around business than leisure during the week — it's a financial-district-adjacent neighborhood with sleek modern towers, but it fills with genuinely good, less see-and-be-seen restaurants at night once the office crowd clears out. Faria Lima, the avenue running through it, has direct metro access via the Yellow Line, and self-catering apartments here (Housi Faria Lima, Charlie Faria Lima, and similar buildings) are common and usually well set up with a kitchen and basic amenities, aimed at longer-stay business travelers as much as tourists. Rua Joaquim Floriano is the street to know for food — Eataly's Italian food hall anchors one end, and newer openings have pushed Peruvian-style ceviche into the neighborhood's rotation alongside its established Japanese and French dining. It's less about one signature restaurant than a genuinely wide, constantly shifting food scene that rewards just walking the street and picking something.

Vila Nova Conceição is smaller and quieter than either — mostly residential towers, genuinely leafy, sitting right against Ibirapuera Park's edge. It has less going on after dark than Jardins or Itaim, but if you want proximity to the park and a calmer base to return to after a loud race day, it's the pick of the three. What dining exists here skews quieter and more residential in character than Itaim's — award-winning Japanese restaurants and a handful of authentic Arab-Brazilian spots sit on leafy streets rather than a loud restaurant row, several with garden or veranda seating. It's a neighborhood for a calm, unhurried dinner close to home, not a night out that spills onto the street.

For getting to Interlagos specifically: Vila Olímpia, on the border of Itaim Bibi, sits directly on Line 9 (Esmeralda) — the same line that runs straight to the Autódromo stop, so an apartment near Vila Olímpia's station can mean a single-line trip to the circuit with no transfer. Jardins and Vila Nova Conceição both require a short connection onto Line 9 from a different line.`;

const editorialNote = "Neighborhood character sourced from Expedia's area guides and Hotels.com's neighborhood pages for Itaim Bibi and Vila Nova Conceição, 11 Sep 2026 — rewritten entirely to strip AI-vocabulary phrasing found in source material ('vibrant urban oasis', 'enchanting', 'seamlessly blends'). Vila Olímpia's direct Line 9 (Esmeralda) connection sourced from a self-catering apartment listing's own stated transit info (1.5km/direct line to Esmeralda), cross-checked against the official Metrô Line 9 route map, 11 Sep 2026. This is a genuinely multi-venue/multi-area piece (3 named neighborhoods, no single addressable venue) — no single Google Maps rating applies; per skill §2c this stays without a MULTI_VENUE_RATINGS entry since no individually-named, rateable venues (specific hotels/restaurants) are called out by name in this piece, only areas. Food/atmosphere additions (12 Sep 2026) sourced from Tripadvisor/Culture Trip restaurant round-ups for Jardins (Tordesilhas, Vento Haragano), Casai's Itaim Bibi guide + Tripadvisor for Rua Joaquim Floriano/Eataly/Cevicheria Moderna, and Guia da Semana/Visite São Paulo neighborhood round-ups for Vila Nova Conceição's Japanese/Arab dining character — named venues are genre examples (churrascaria, food hall, ceviche spot), not individually addressable enough to warrant per-venue Google Maps ratings.";

const [row] = await db
  .update(experiences)
  .set({ bodyContent, editorialNote })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, bodyContent: experiences.bodyContent });

console.log("✓", row.title, "— word count:", row.bodyContent.split(/\s+/).length);
await client.end();
