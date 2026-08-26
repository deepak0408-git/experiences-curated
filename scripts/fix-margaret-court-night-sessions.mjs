import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const NOTE = " Corrected 26 Aug 2026: earlier copy wrongly stated night sessions run at Rod Laver Arena only — Margaret Court Arena also hosts night sessions (confirmed by founder via a live Ticketmaster listing for a Margaret Court Arena night session, 19 Jan 2027). Fixed everywhere this claim appeared.";

async function applyFix(slug, replacements) {
  const [existing] = await db.select().from(experiences).where(eq(experiences.slug, slug));
  if (!existing) {
    console.error(`NOT FOUND: ${slug}`);
    return;
  }

  const patch = {};
  let anyChanged = false;

  for (const { field, subfield, oldText, newText } of replacements) {
    if (subfield) {
      const container = existing[field] ?? {};
      const val = container[subfield];
      if (typeof val !== "string" || !val.includes(oldText)) {
        console.error(`MISMATCH: ${slug} :: ${field}.${subfield} — old text not found, skipping this replacement`);
        continue;
      }
      patch[field] = { ...(patch[field] ?? container), [subfield]: val.replace(oldText, newText) };
      anyChanged = true;
    } else if (Array.isArray(existing[field])) {
      const arr = patch[field] ?? [...existing[field]];
      let changedHere = false;
      const newArr = arr.map((item) => {
        if (typeof item === "string" && item.includes(oldText)) {
          changedHere = true;
          return item.replace(oldText, newText);
        }
        return item;
      });
      if (!changedHere) {
        console.error(`MISMATCH: ${slug} :: ${field}[] — old text not found, skipping this replacement`);
        continue;
      }
      patch[field] = newArr;
      anyChanged = true;
    } else {
      const val = patch[field] ?? existing[field];
      if (typeof val !== "string" || !val.includes(oldText)) {
        console.error(`MISMATCH: ${slug} :: ${field} — old text not found, skipping this replacement`);
        continue;
      }
      patch[field] = val.replace(oldText, newText);
      anyChanged = true;
    }
  }

  if (!anyChanged) {
    console.error(`NO CHANGES APPLIED for ${slug} — aborting write for this row`);
    return;
  }

  patch.editorialNote = (existing.editorialNote ?? "") + NOTE;
  patch.lastVerifiedDate = new Date().toISOString().slice(0, 10);

  const [updated] = await db.update(experiences).set(patch).where(eq(experiences.slug, slug)).returning({ id: experiences.id, slug: experiences.slug });
  console.log("Updated:", updated);
}

// 1) rod-laver-arena-inside-main-court
await applyFix("rod-laver-arena-inside-main-court-o0lvsc", [
  {
    field: "whatToAvoid",
    oldText: "Avoid booking a night session expecting cool relief from daytime heat; Melbourne Park's roofed arenas trap heat when closed, and a closed roof on a warm evening can feel stuffier than the open air outside, not cooler.",
    newText: "Avoid booking a night session at either Rod Laver or Margaret Court Arena expecting cool relief from daytime heat; Melbourne Park's roofed arenas trap heat when closed, and a closed roof on a warm evening can feel stuffier than the open air outside, not cooler.",
  },
]);

// 2) first-timers-guide-etiquette-crowd-culture
await applyFix("first-timers-guide-etiquette-crowd-culture-fdp4b7", [
  {
    field: "bodyContent",
    oldText: "Night sessions run only on Rod Laver Arena, carry the tournament's biggest scheduled matches, and deliver a cooler, louder, more theatrical atmosphere",
    newText: "Night sessions run on Rod Laver Arena and Margaret Court Arena, carry the tournament's biggest scheduled matches, and deliver a cooler, louder, more theatrical atmosphere",
  },
  {
    field: "practicalInfo",
    subfield: "hours",
    oldText: "night sessions run from around 7pm at Rod Laver Arena only",
    newText: "night sessions run from around 7pm at Rod Laver Arena or Margaret Court Arena",
  },
]);

// 3) rod-laver-arena-seating-comparison — this one is genuinely Rod-Laver-specific
// (it's a seating guide for that one arena), but its "only arena that runs an
// evening session at all" line is the false universal claim and needs fixing.
await applyFix("rod-laver-arena-seating-comparison-v3yhof", [
  {
    field: "bodyContent",
    oldText: "Night session tickets at Rod Laver run at a premium over day tickets regardless of section, since it's the only arena that runs an evening session at all — but at least you're not choosing a section based on where the sun will be in three hours.",
    newText: "Night session tickets at Rod Laver run at a premium over day tickets regardless of section — Margaret Court Arena also runs night sessions, but Rod Laver's is priced and scheduled around the tournament's single biggest match of the night — so at least you're not choosing a section based on where the sun will be in three hours.",
  },
]);

// 4) melbourne-january-heat-what-to-pack
await applyFix("melbourne-january-heat-what-to-pack-df5qwz", [
  {
    field: "whyItsSpecial",
    oldText: "the clothes that work for a 2pm match on Rod Laver Arena's exposed upper deck can be wrong within six hours for the same day's night session",
    newText: "the clothes that work for a 2pm match on Rod Laver or Margaret Court Arena's exposed upper deck can be wrong within six hours for the same day's night session",
  },
]);

// 5) late-night-melbourne-park-midnight-finishes — this one is legitimately
// Rod-Laver-specific for the historical record (Hewitt-Baghdatis, Murray-
// Kokkinakis both happened there), so only the forward-looking generalization
// needs broadening, not the historical facts.
await applyFix("late-night-melbourne-park-midnight-finishes-svfimc", [
  {
    field: "bodyContent",
    oldText: "What you can still get, and what the rules don't touch, is Rod Laver Arena's night session atmosphere itself — a full house under lights, well past sundown, with genuinely high-stakes tennis running later than almost any other major sporting event schedules for.",
    newText: "What you can still get, and what the rules don't touch, is the night session atmosphere itself at Rod Laver or Margaret Court Arena — a full house under lights, well past sundown, with genuinely high-stakes tennis running later than almost any other major sporting event schedules for.",
  },
  {
    field: "bodyContent",
    oldText: "In the early rounds, a Rod Laver Arena night session is typically priced *below* the equivalent day session — the tournament isn't yet guaranteed to put a marquee match under lights, so the ticket reflects that uncertainty.",
    newText: "In the early rounds, a night session at Rod Laver or Margaret Court Arena is typically priced *below* the equivalent day session — the tournament isn't yet guaranteed to put a marquee match under lights, so the ticket reflects that uncertainty.",
  },
  {
    field: "practicalInfo",
    subfield: "costRange",
    oldText: "in the early rounds a Rod Laver Arena night ticket often runs cheaper than the day session",
    newText: "in the early rounds a Rod Laver or Margaret Court Arena night ticket often runs cheaper than the day session",
  },
]);

// 6) ao-ticket-guide-grounds-session-finals — the core offender, direct false claim
await applyFix("ao-ticket-guide-grounds-session-finals-p0773j", [
  {
    field: "bodyContent",
    oldText: "Night sessions run on Rod Laver Arena only, and that's deliberate — the tournament schedules its biggest, most anticipated matches for the evening slot, so night tickets there consistently price higher than the same arena's day session. Margaret Court and John Cain run day sessions only, no night session of their own, and both can actually be cheaper in the evening than their own daytime tickets once the main-arena crowd has moved on.",
    newText: "Night sessions run on both Rod Laver Arena and Margaret Court Arena — the tournament schedules its biggest, most anticipated matches for the evening slot, so night tickets at either arena typically price higher than that same arena's day session. John Cain Arena runs day sessions only, no night session of its own, and can actually be cheaper in the evening slot's adjacent hours than its own daytime tickets once the main-arena crowd has moved on.",
  },
  {
    field: "insiderTips",
    oldText: "Night sessions only run at Rod Laver Arena — if you want an evening session specifically, that's the only arena selling one, regardless of which other courts interest you.",
    newText: "Night sessions run at both Rod Laver Arena and Margaret Court Arena — Rod Laver's night session is priced and scheduled around the tournament's single biggest match, while Margaret Court's is usually the cheaper way into an evening session.",
  },
]);

console.log("Done.");
await client.end();
