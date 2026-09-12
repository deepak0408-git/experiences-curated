import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "99073aeb-cad5-4e39-9a39-7ad0ea3667e2"; // São Roque Wine Route

const address =
  "Terra do Vinho: Rua Dr. Durval Villaça, 300, Jardim Villaca, São Roque - SP, 18135-180. Vinhos Canguera: Estr. do Vinho (SPV-077), km 8, Canguera, São Roque - SP, 18145-001. Vinhos Frank: Estr. do Vinho (SPV-077), Km 1, Taboão, São Roque - SP, 18130-000. Vinícola Góes: Estr. do Vinho, 9111, São Roque - SP, 18145-002.";

const bodyContent = `São Roque sits roughly 43 miles west of São Paulo, and it's been Brazil's own wine country since the 17th century — Portuguese immigrants first planted vines here for the climate, and Italian immigrants later took over and expanded the region into what's now known simply as "the Land of Wine." It's a genuinely different pace from a São Paulo race weekend: rolling countryside, working vineyards, and small family-run operations rather than the city's density and noise.

A typical day tour runs about 7 hours, with hotel pickup and drop-off included for anyone staying within a few miles of central São Paulo (pickup from a fixed point on Avenida Paulista otherwise). Tours generally stop at four wineries along or near the Estrada do Vinho, the wine road that gives the region its name.

Terra do Vinho is the first stop for most tours and sits closest to town. Founded in 1966 by the Oliveira Santos family and now run by its third generation, the boutique winery has picked up national awards for its Tannat Reserva and its traditional liqueur, Dona Hilarina — both worth tasting in the property's barrel room before the route moves on. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3107324626336212646&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Vinhos Canguera sits further out on the Estrada do Vinho itself, founded in 1952 and one of the first wineries in the region to offer organized tastings — a genuine pioneer of São Roque's wine tourism rather than a later arrival. Its everyday table wines use the region's traditional Niágara and Bordô grapes, but the Aldegheri label is the serious pour here, a fine-wine line built on Cabernet Sauvignon, Merlot, and Tannat alongside Brut and Moscatel sparkling wines. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=17844406035602054943&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Vinhos Frank sits just up the same road, tracing back to a family vineyard first planted in the 1940s and its first bottled release under the Frank label in 1965. The winery now carries more than 39 labels, but the tasting room's real showcase is the Linha Eternus, a four-wine range that's picked up national and international medals and is the clear reason to save some palate for this stop. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=6052396406804491650&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Vinícola Góes closes out most itineraries, and it's the largest and most established operation in the region by a clear margin — founded in 1938 and still family-run, with production in both São Paulo and Rio Grande do Sul. Its Tempos de Góes Sauvignon Blanc Reserva 2023 won Double Gold and was named Brazil's best Sauvignon Blanc at the Wines of Brazil Awards 2024, the single strongest individual bottle among all four wineries on the route. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=882616080372119580&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Most itineraries include a lunch stop at a Portuguese-style property along the route, and wrap up with time at a chocolate factory's retail store — an odd-sounding pairing that works better than it sounds after a few wine tastings. This isn't a serious wine-connoisseur trip in the Napa or Mendoza sense — it's a relaxed countryside day built around tasting, small-production wineries, and a genuine change of pace from the city, priced and paced for a broad range of visitors rather than dedicated wine tourism.`;

const editorialNote =
  "Tour structure (7-hour duration, hotel pickup zone, Portuguese-style lunch, chocolate factory stop, ~US$124 starting price) sourced directly from Civitatis' own official tour listing via WebFetch, 11 Sep 2026. Regional history (17th-century Portuguese origin, Italian immigrant expansion, 'Land of Wine' name) sourced from earlier destination-level research (multiple aggregator sources), cross-checked. All 4 named wineries — Terra do Vinho, Vinhos Canguera, Vinhos Frank, Vinícola Góes — individually confirmed via real Google Places API lookup (address, rating, review count, website), 12 Sep 2026: Terra do Vinho 4.6/2,082; Vinhos Canguera 4.7/1,621; Vinhos Frank 4.6/3,169; Vinícola Góes 4.6/5,992 (the region's largest, most established operation). Per-winery history and flagship-wine facts sourced via WebSearch, cross-checked against each winery's own site/blog where available, 12 Sep 2026: Terra do Vinho (founded 1966, Oliveira Santos family, Tannat Reserva + Dona Hilarina liqueur awards — vinhosdesaoroque.com.br/premiados, temqueir.com.br); Vinhos Canguera (founded 1952, pioneering regional tasting winery, Aldegheri fine-wine line — vinhoscanguera.com.br/historico.html, intelivino.com.br); Vinhos Frank (family vineyard from 1940s, first Frank-label bottle 1965, Linha Eternus flagship — vinhosfrank.com.br, wine-locals.com); Vinícola Góes (founded 1938, Tempos de Góes Sauvignon Blanc Reserva 2023 — Double Gold + Best Sauvignon Blanc, Wines of Brazil Awards 2024 — vinicolagoes.com.br/historia, vinicolagoes.com.br/premiados). Ratings written as live inline links per skill §2c multi-venue rule, never as static numbers. `MULTI_VENUE_RATINGS['brazilian-gp-sao-roque-wine-route-']` registered with venueCount: 4, matching the 4 real inline rating links. `whatToAvoid` third avoid (no self-driving between wineries) added per curator request, 12 Sep 2026.";

const whatToAvoid =
  "Don't expect a premium, connoisseur-level wine experience on the scale of a major international wine region — São Roque's wineries are smaller-scale, family-run operations, genuinely charming but not aiming for that tier, so set expectations around a relaxed countryside day rather than a serious tasting menu. Don't skip the lunch stop assuming it's a throwaway inclusion — the Portuguese-style property lunch is typically one of the better-reviewed parts of the full-day itinerary, not a filler stop between wineries. And don't drive yourself between wineries — the four stops sit spread out along rural roads with tastings at each one, so a self-drive itinerary means either skipping the wine or driving after drinking; a guided tour with a driver is the only way to actually taste at all four safely.";

const practicalInfo = {
  hours: "Full-day tours run roughly 7 hours, typically departing São Paulo mid-morning",
  website:
    "https://www.civitatis.com/en/sao-paulo/sao-roque-day-trip/, https://www.adegaterradovinho.com.br/, http://www.vinhoscanguera.com.br/, http://www.vinhosfrank.com.br/, http://www.vinicolagoes.com.br/",
  costRange: "Around US$120-130 per person, including hotel pickup/drop-off, 4 winery admissions with tastings, transport, and a guide",
  bookingMethod: "Book through a tour operator such as Civitatis or GetYourGuide — advance booking recommended given the fixed pickup schedule.",
  reservationsRequired: false,
};

const [row] = await db
  .update(experiences)
  .set({
    address,
    bodyContent,
    whatToAvoid,
    practicalInfo,
    editorialNote,
    googleMapsRating: null,
    googleMapsReviewCount: null,
    googleMapsUrl: null,
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, address: experiences.address, bodyContent: experiences.bodyContent, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title, "— word count:", row.bodyContent.split(/\s+/).length);
console.log("Address:", row.address);
console.log(JSON.stringify(row.practicalInfo, null, 2));
await client.end();
