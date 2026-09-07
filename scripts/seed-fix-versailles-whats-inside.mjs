import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db
  .select({ bodyContent: experiences.bodyContent })
  .from(experiences)
  .where(eq(experiences.slug, "versailles-day-trip"));

const oldOpening =
  `Roland-Garros is inside Paris, so this pack's usual "day-trip city anchor" rule doesn't map cleanly onto the tournament itself. Versailles is the genuine substitute: not a nearby city, but a full day trip outside Paris proper, and the single most obvious one for anyone with a rest day between match sessions.

Getting there is straightforward. The RER C train runs directly from central Paris,`;

if (!row.bodyContent.includes(oldOpening)) {
  throw new Error("Expected opening not found in body_content — aborting to avoid a silent no-op.");
}

const newOpening = `Versailles is the single most obvious day trip outside Paris for anyone with a rest day between match sessions.

Inside, the palace is built around the Hall of Mirrors: a 73-metre gallery of 357 mirrors facing the garden windows, the room where the Treaty of Versailles was signed in 1919, and the single most crowded space in the building for good reason. It connects the King's and Queen's State Apartments — seven ceremonial rooms on each side, the King's named after Roman gods (Hercules, Venus, Diana, Mars, Mercury, Apollo, the War Room), the Queen's culminating in the Queen's Bedchamber, where royal births once took place in front of the full court. The Royal Chapel, Louis XIV's last major building project at Versailles, is worth the detour for its vaulted ceiling and baroque frescoes alone. Budget genuine time for the Hall of Mirrors specifically — it's the one room a Versailles trip is actually built around, and rushing through it defeats the point of coming.

Getting there is straightforward. The RER C train runs directly from central Paris,`;

const bodyContent = row.bodyContent.replace(oldOpening, newOpening);

const editorialNote =
  "Rewritten 7 Sep 2026 per founder direction: cut the internal-reasoning opening paragraph explaining why Versailles substitutes for the pack's day-trip rule (not customer-relevant) and added a dedicated paragraph on what's actually inside the palace (Hall of Mirrors, King's/Queen's State Apartments, Royal Chapel) — the entry previously covered transit and ticketing in real depth but never described the palace's actual highlights. Sourced from chateauversailles.fr official 'Marvels of the Palace' page and paristoversailles.com. Existing transit/ticketing/Trianon content unchanged.";

await db.update(experiences)
  .set({ bodyContent, editorialNote })
  .where(eq(experiences.slug, "versailles-day-trip"));

console.log("✓ versailles-day-trip — added what's-inside paragraph (Hall of Mirrors, State Apartments, Royal Chapel)");

await client.end();
