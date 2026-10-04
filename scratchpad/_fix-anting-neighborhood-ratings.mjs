import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-anting-neighborhood-mue5lzhx";
const MUSEUM_URL = "https://maps.google.com/?cid=484129483494367895&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

const OLD = "Open Tuesday to Sunday, 9:30am-4:30pm (closed Mondays), adult admission RMB30 — a genuine two-hour stop that fits naturally around a day otherwise built around the circuit.";
const NEW = `Open Tuesday to Sunday, 9:30am-4:30pm (closed Mondays), adult admission RMB30 — a genuine two-hour stop that fits naturally around a day otherwise built around the circuit. [See live rating and reviews on Google Maps](${MUSEUM_URL})`;

const [row] = await db.select({ bodyContent: experiences.bodyContent, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD)) {
  console.error("Target sentence not found — aborting");
  process.exit(1);
}

const newBody = row.bodyContent.replace(OLD, NEW);
const newEditorialNote = row.editorialNote + " Google Places API (New) lookup, 2 Oct 2026: Shanghai Auto Museum 4.5/90 reviews (clean match, museum type, exact name) — the only one of the two newly-introduced stops with a distinct Google Places entity. Anting German Town has no separate listing of its own; every search (English and Chinese names, including the more precise 安亭德国镇) resolves to the generic 'Anting' town point with no rating — stated honestly as unrated rather than forcing a mismatch.";

await db.update(experiences)
  .set({ bodyContent: newBody, editorialNote: newEditorialNote })
  .where(eq(experiences.slug, SLUG));

console.log("Added inline Google Maps link for Shanghai Auto Museum. German Town remains unrated (no Places entity found).");

await client.end();
