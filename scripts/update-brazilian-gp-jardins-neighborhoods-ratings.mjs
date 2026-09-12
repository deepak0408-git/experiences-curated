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

Jardins is the one built around Rua Oscar Freire — high-end retail, some of the city's best restaurants, and a genuinely walkable grid of tree-lined streets. It's the most polished of the three and the closest to a "tourist can find their way around easily" area, without actually being touristy in the way that phrase usually implies. Short-term rental options here skew toward boutique apartment buildings rather than large towers.

The food identity here centers on Tordesilhas, known for showcasing regional Brazilian cooking beyond the usual São Paulo staples. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9709405097852839100&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

The other anchor is Vento Haragano, a gaúcha-style churrascaria built for a proper sit-down steak dinner — this is the neighborhood to pick if a real reservation, not a quick bite, is part of how you want to spend a race-weekend evening. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8078347172144092170&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Itaim Bibi sits just south, built more around business than leisure during the week — it's a financial-district-adjacent neighborhood with sleek modern towers, but it fills with genuinely good, less see-and-be-seen restaurants at night once the office crowd clears out. Faria Lima, the avenue running through it, has direct metro access via the Yellow Line, and self-catering apartments here (Housi Faria Lima, Charlie Faria Lima, and similar buildings) are common and usually well set up with a kitchen and basic amenities, aimed at longer-stay business travelers as much as tourists.

Rua Joaquim Floriano is the street to know for food here, anchored by Eataly's Italian food hall — it's less about one signature restaurant than a genuinely wide, constantly shifting food scene that rewards just walking the street and picking something. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=6133516157298007537&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Vila Nova Conceição is smaller and quieter than either — mostly residential towers, genuinely leafy, sitting right against Ibirapuera Park's edge. It has less going on after dark than Jardins or Itaim, but if you want proximity to the park and a calmer base to return to after a loud race day, it's the pick of the three.

Its dining skews quieter and more residential in character than Itaim's. Kinoshita, a Michelin-starred kappo restaurant open since the 1970s, is the area's best-known name and one of the city's most respected Japanese kitchens. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=7614976629803033540&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

For something more casual, Jaber has been serving esfihas and other Arab-Brazilian specialties in the neighborhood since 1952. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3353865980808131403&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

For getting to Interlagos specifically: Vila Olímpia, on the border of Itaim Bibi, sits directly on Line 9 (Esmeralda) — the same line that runs straight to the Autódromo stop, so an apartment near Vila Olímpia's station can mean a single-line trip to the circuit with no transfer. Jardins and Vila Nova Conceição both require a short connection onto Line 9 from a different line.`;

const editorialNote = "Neighborhood character sourced from Expedia's area guides and Hotels.com's neighborhood pages for Itaim Bibi and Vila Nova Conceição, 11 Sep 2026 — rewritten entirely to strip AI-vocabulary phrasing found in source material ('vibrant urban oasis', 'enchanting', 'seamlessly blends'). Vila Olímpia's direct Line 9 (Esmeralda) connection sourced from a self-catering apartment listing's own stated transit info (1.5km/direct line to Esmeralda), cross-checked against the official Metrô Line 9 route map, 11 Sep 2026. Named restaurants (Tordesilhas, Vento Haragano — Tripadvisor/Culture Trip round-ups; Eataly São Paulo — Casai's Itaim Bibi guide; Kinoshita — Michelin Guide + Espaces blog, confirmed 1-star Michelin 2025, founded 1970s; Jaber Especialidades Árabes — Tripadvisor/BaresSP, operating since 1952) each confirmed via a real Google Places API lookup, 12 Sep 2026 — ratings/review counts written as live inline links per skill §2c multi-venue rule, never as static numbers. A generic mention of a Peruvian-ceviche trend in Itaim Bibi was deliberately left unnamed — the specific venue name surfaced only in an AI-generated web summary with no verifiable address, so it was not named or rated. `MULTI_VENUE_RATINGS['brazilian-gp-jardins-itaim-neighborhoods-']` registered with venueCount: 5, matching the 5 real inline rating links (Tordesilhas, Vento Haragano, Eataly, Kinoshita, Jaber).";

const [row] = await db
  .update(experiences)
  .set({ bodyContent, editorialNote })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, bodyContent: experiences.bodyContent });

console.log("✓", row.title, "— word count:", row.bodyContent.split(/\s+/).length);
await client.end();
