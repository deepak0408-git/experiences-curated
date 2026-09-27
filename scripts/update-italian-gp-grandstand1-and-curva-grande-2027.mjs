// Italian GP 2027 follow-up (24 Sep 2026, founder instruction):
//  1. Grandstand 1 (Centrale) 3-day ticket = US$2,103.
//  2. Curva Grande GA: replace the 2026 race dates with 3-5 Sep 2027 and state
//     that 2027 sales opened September 2026.
// Guarded: aborts before any write if the expected old text isn't found once.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

function once(text, oldS, newS, label) {
  if (typeof text !== "string") throw new Error(label + ": field empty");
  const i = text.indexOf(oldS);
  if (i < 0) throw new Error(label + ": old text not found\n  " + oldS.slice(0, 80));
  if (text.indexOf(oldS, i + oldS.length) >= 0) throw new Error(label + ": old text not unique");
  return text.replace(oldS, () => newS);
}

const [g1] = await db.select().from(experiences).where(like(experiences.slug, "italian-gp-grandstand-1-centrale-%"));
const [cg] = await db.select().from(experiences).where(like(experiences.slug, "curva-grande-general-admission-%"));
if (!g1 || !cg) throw new Error("experience missing");

const g1Pi = { ...g1.practicalInfo };
g1Pi.costRange = once(
  g1Pi.costRange,
  "Historically the most expensive 3-day grandstand ticket at Monza, above the US$1,024–1,160 band the Ascari, Parabolica, Laterale Destra and Lesmo grandstands sit in for 2027. The exact Grandstand 1 figure is on the official 2027 price list at monzanet.it.",
  "US$2,103 for a 3-day ticket in 2027 — the most expensive grandstand ticket at Monza, roughly double the US$1,024–1,160 band the Ascari, Parabolica, Laterale Destra and Lesmo grandstands sit in.",
  "g1 costRange"
);

const cgPi = { ...cg.practicalInfo };
cgPi.hours = once(cgPi.hours, "4–6 Sep 2026", "3–5 Sep 2027", "cg hours");
cgPi.bookingMethod = once(cgPi.bookingMethod, "(2026 sales opened September 2025)", "(2027 sales opened September 2026)", "cg bookingMethod");

const NOTE = " Updated 24 Sep 2026 per founder: 2027 dates and 2027 sales-open month.";
await db.update(experiences).set({ practicalInfo: g1Pi, editorialNote: (g1.editorialNote ?? "") + " Grandstand 1 3-day price (US$2,103) supplied by founder, 24 Sep 2026.", updatedAt: new Date() }).where(eq(experiences.id, g1.id));
console.log("updated", g1.slug);
await db.update(experiences).set({ practicalInfo: cgPi, editorialNote: (cg.editorialNote ?? "") + NOTE, updatedAt: new Date() }).where(eq(experiences.id, cg.id));
console.log("updated", cg.slug);
await client.end();
