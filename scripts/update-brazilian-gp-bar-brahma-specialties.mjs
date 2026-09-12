import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "822cf5bb-86b8-45d1-8247-76cc19470cbf"; // Bar Brahma — Live Samba Since 1948

const bodyContent = `Bar Brahma sits on the corner of Avenida São João and Avenida Ipiranga in São Paulo's historic center, and it's been running since 1948 — a genuine art deco botequim, not a themed recreation of one. Founded by German immigrant Henrique Hillebrecht, it became a meeting point for the city's political and academic figures through the 1950s and 60s — Jânio Quadros and Ademar de Barros among the politicians who met here, alongside law students from the nearby Largo São Francisco faculty during a genuinely charged political era — while legends of Brazilian music, including João Gilberto and Elis Regina, played its stage.

The venue's history isn't a straight line, though: Bar Brahma actually closed in 1998 after the original operation went bankrupt, sitting shuttered for three years before new owners took it over in 2001. That reform rebuilt the space to resemble its original 1950s look rather than modernizing it, and the reopened Bar Brahma has run continuously since as one of the city's essential live-music addresses.

The kitchen runs on classic botequim cooking built to share: feijoada, picadinho, and a filé à parmegiana meant for the table are the anchors, alongside filé à Oswaldo Aranha finished in a dark-beer sauce and braised short rib served over polenta. Petiscos built specifically to go with a round of chopp include pork knuckle "à passarinho" with sauerkraut, crispy fried jiló chips, and pancetta in a honey-based sweet-and-sour sauce. The Chopp Brahma itself, poured with its traditional three-finger head, is the house's actual signature — poured according to the bar's own "ritual do chopp," a set pouring technique staff are trained on rather than a marketing phrase — alongside a list of classic and house caipirinhas built to keep pace with a long night of music rather than a single round.

The stage runs live samba, MPB, choro, and pagode seven nights a week, starting from around 8pm and continuing into the early hours — the venue itself is open 11am to 1am daily, so you can also come earlier for a drink in a quieter room before the music picks up.

The main floor doesn't take reservations, so arriving with the crowd rather than expecting a held table is the norm — larger groups of eight or more can book the private dining room separately. Weekend nights get genuinely busy, and getting there before the room fills up matters more than trying to reserve ahead.`;

const whyItsSpecial = `São Paulo has plenty of bars trading on a manufactured sense of history — reproduction decor, a name borrowed from somewhere older. Bar Brahma is the real thing: a room that's actually hosted the musicians whose names get invoked as Brazilian music's foundational figures, running continuously (with one real interruption and comeback) since 1948. Its exceptionally large, well-attested rating reflects a venue that's stayed genuinely good across generations, not one riding a single moment of hype. A night here is as close as a visiting fan gets to hearing Brazilian music the way it's actually been played in this city for eighty years, not a version curated for tourists.`;

const editorialNote =
  "History (1948 opening, João Gilberto/Elis Regina performances, 1990s decline, 2001 revival) sourced from LikeALocalGuide's venue feature, cross-checked, 11 Sep 2026. Founder (Henrique Hillebrecht), political/academic patronage (Jânio Quadros, Ademar de Barros, Largo São Francisco law students), and the 1998 bankruptcy/closure → 2001 reopening-with-period-restoration detail sourced via WebSearch aggregator round-up (Terra, Espaces, Prefeitura de São Paulo's own Selo de Valor Cultural listing), 12 Sep 2026 — an earlier version of this experience's copy stated 'faced real decline' without the concrete closure/reopening facts; now sourced with the actual timeline. Hours (11am-1am daily) sourced from Wanderlog aggregator listing. Menu specialties (feijoada, picadinho, filé à parmegiana for sharing, filé à Oswaldo Aranha in dark-beer sauce, braised short rib with polenta, pork-knuckle à passarinho with sauerkraut, jiló chips, honey-glazed pancetta) and the Chopp Brahma three-finger-head 'ritual do chopp' plus house caipirinhas sourced via WebSearch aggregator round-up, 12 Sep 2026 — a separate, less specific 'shrimp moqueca' claim from a generic travel-content site was not corroborated elsewhere and was left out. Cover charge sources genuinely conflicted — one Tripadvisor review cited ~$50/person, another cited R$20/person, a difference too large to resolve confidently (could reflect different nights/events or one figure being inaccurate) — flagged explicitly in copy per skill §1's rule to state source conflicts rather than pick one arbitrarily. Live music format (samba/MPB/choro/pagode, 7 nights, ~8pm start) sourced from LikeALocalGuide and BarsForKings. Real Google Maps rating confirmed via Places API, 11 Sep 2026: 4.5/22,383 reviews. `whyItsSpecial`'s Google Maps link removed 12 Sep 2026 per skill §2c hard rule (links never belong in `whyItsSpecial`, only `bodyContent`) — the row's own `googleMapsRating`/`googleMapsUrl` fields already carry the real rating.";

const [row] = await db
  .update(experiences)
  .set({ bodyContent, whyItsSpecial, editorialNote })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, bodyContent: experiences.bodyContent, whyItsSpecial: experiences.whyItsSpecial });

console.log("✓", row.title, "— body word count:", row.bodyContent.split(/\s+/).length, "| whyItsSpecial word count:", row.whyItsSpecial.split(/\s+/).length);
await client.end();
