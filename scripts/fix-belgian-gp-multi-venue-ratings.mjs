import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Google ratings for 9 named venues across Belgian GP's 2 multi-venue
// experiences, confirmed directly by the founder from live Google Maps
// screenshots, 12 Oct 2026. Written as live inline links in bodyContent
// right after each venue's first mention, per the Brazilian GP
// jardins-neighborhoods pattern (skill §2c multi-venue rule) — never as a
// static star/review-count number, since those go stale; the link always
// points at the real, live Google Maps page.

const LINK = (url) => `[See live rating and reviews on Google Maps](${url})`;

// ─── The Ardennes Beyond the Circuit ───────────────────────────────────
const ARDENNES_ID = "0156b0e4-5cd2-4679-8dac-5f751cb3a46a";

const ardennesReplacements = [
  [
    "The castle (Rue du Vieux Château 4) is open daily in July",
    `The castle (Rue du Vieux Château 4) ${LINK("https://maps.app.goo.gl/t9dXu3nH6ufARzGZA")} is open daily in July`,
  ],
  [
    "the Musée de la Bataille des Ardennes — the Battle of the Bulge museum at Rue Chamont 5",
    `the Musée de la Bataille des Ardennes ${LINK("https://maps.app.goo.gl/dWBUAyHPW5LETRku8")} — the Battle of the Bulge museum at Rue Chamont 5`,
  ],
  [
    "Chez Henri is the most consistent option for Ardennes cooking",
    `Chez Henri ${LINK("https://maps.app.goo.gl/mHXAVg89LUuT3Nb77")} is the most consistent option for Ardennes cooking`,
  ],
  [
    "The Parc des Topiaires on the edge of town has 250 sculpted boxwood",
    `The Parc des Topiaires ${LINK("https://maps.app.goo.gl/MGi3u8oQijArJfUMA")} on the edge of town has 250 sculpted boxwood`,
  ],
  [
    "Le Sanglier des Ardennes is the town's Michelin-listed restaurant",
    `Le Sanglier des Ardennes ${LINK("https://maps.app.goo.gl/Pf5bsSb5ad3XaXa59")} is the town's Michelin-listed restaurant`,
  ],
  [
    "The Grottes de Han are one of the most significant cave systems",
    `The Grottes de Han ${LINK("https://maps.app.goo.gl/wbaEEpd8encnrQEi7")} are one of the most significant cave systems`,
  ],
];

// ─── Belgian Race Weekend Street Food ──────────────────────────────────
const STREET_FOOD_ID = "596e7721-8008-46ed-bb24-8006f9748456";

const streetFoodReplacements = [
  [
    "Le Formule Un on Route du Circuit and Le Legends nearby both operate on race days.",
    `Le Formule Un ${LINK("https://maps.app.goo.gl/qJg27vD4HD6a8eNJ6")} on Route du Circuit and Le Legends ${LINK("https://maps.app.goo.gl/J1rhTBPnfVVphLZD7")} nearby both operate on race days.`,
  ],
  [
    "Acqua Rossa, slightly further along, draws the race crowd specifically",
    `Acqua Rossa ${LINK("https://maps.app.goo.gl/KXBVeL3n8C6injhJA")}, slightly further along, draws the race crowd specifically`,
  ],
];

async function applyReplacements(id, replacements) {
  const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.id, id));
  let body = row.bodyContent;
  for (const [find, replace] of replacements) {
    if (!body.includes(find)) {
      console.error(`✗ MISMATCH for ${id}: anchor text not found: "${find}"`);
      continue;
    }
    body = body.replace(find, replace);
  }
  await db.update(experiences).set({ bodyContent: body }).where(eq(experiences.id, id));
  console.log(`✓ ${id} bodyContent updated with ${replacements.length} inline rating links`);
}

await applyReplacements(ARDENNES_ID, ardennesReplacements);
await applyReplacements(STREET_FOOD_ID, streetFoodReplacements);

await client.end();
