// Italian GP 2027 — recode ticket prices in the seeded experiences to the
// 2027 planner_ticket_tier_cost figures (founder-validated against the
// official site, 24 Sep 2026) and remove every "2027 prices not yet
// published / 2026 pricing" remark from those experiences.
//
// 2027 bands (planner_ticket_tier_cost, edition_year 2027, USD):
//   tier1 Prato GA, 3-day ............ US$280
//   tier2 Ascari/Parabolica/Laterale Destra/Lesmo grandstands, 3-day .. US$1,024-1,160
//   tier3 hospitality lounges (Fan's Garden Lounge, Fans Club, Ultimate Hospitality, F1 Experiences Lounge) .. US$4,313-6,199
//   tier4 Schumacher Lounge / Ferrari GP Club ...... US$7,729-11,252
// Grandstand 1 (Centrale) and Grandstand 5 (Piscina) are not in any tier, so
// they get no invented figure — they point at the official 2027 price list.
//
// Guarded: every replacement asserts the old text exists exactly once, and the
// script aborts BEFORE writing anything if any guard fails.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const NOTE = " Ticket pricing recoded to the 2027 planner figures (founder-validated), 24 Sep 2026.";
const B22_BAND = "about US$1,024–1,160";

// slugPrefix -> { body:[[old,new]], avoid:[[old,new]], tips:[[old,new]], practical:{costRange, bookingMethod:[old,new]} }
const EDITS = {
  "curva-grande-general-admission-": {
    costRange: {
      old: "General Admission is the lowest-priced ticket tier for the weekend — check monzanet.it closer to the date for exact 2026 pricing.",
      new: "General Admission (Prato) is the lowest-priced ticket tier: about US$280 for the full 3-day weekend in 2027.",
    },
  },
  "italian-gp-ga-lesmo-ascari-": {
    costRange: {
      old: "General admission (Prato): from roughly €50 Friday, €70 Saturday, €100 Sunday single-day; around €450 for the full weekend (2026 pricing, 2027 not yet confirmed)",
      new: "General admission (Prato): about US$280 for the full 3-day weekend (Friday–Sunday) in 2027.",
    },
  },
  "italian-gp-grandstand-1-centrale-": {
    costRange: {
      old: "Historically the most expensive 3-day grandstand ticket at Monza; 2027 pricing not yet released as of Sep 2026",
      new: "Historically the most expensive 3-day grandstand ticket at Monza, above the US$1,024–1,160 band the Ascari, Parabolica, Laterale Destra and Lesmo grandstands sit in for 2027. The exact Grandstand 1 figure is on the official 2027 price list at monzanet.it.",
    },
    bookingMethod: {
      old: "Book via the official monzanet.it ticket store once 2027 sales open — join the site's notification waitlist to be alerted.",
      new: "Book via the official monzanet.it ticket store — join the site's notification waitlist to be alerted if it shows as unavailable.",
    },
  },
  "grandstand-22-parabolica-corner-": {
    body: [[
      "Tickets for Grandstand 22 are 3-day packages only at €789. Single-day tickets are not available here.",
      `Tickets for Grandstand 22 are 3-day packages only, at ${B22_BAND} for 2027 (the band shared with the Ascari, Laterale Destra and Lesmo grandstands). Single-day tickets are not available here.`,
    ]],
    avoid: [[
      "Grandstand 22 is 3-day packages only at €789.",
      `Grandstand 22 is 3-day packages only, at ${B22_BAND}.`,
    ]],
    costRange: {
      old: "2027 pricing not yet published — check monzanet.it/en/tickets/ directly closer to the event. In 2026 a 3-day ticket (all sessions, reserved seat, no single-day option) ran €789.",
      new: `${B22_BAND[0].toUpperCase() + B22_BAND.slice(1)} for a 3-day ticket in 2027 (all sessions, reserved seat, no single-day option) — the band shared with the Ascari, Laterale Destra and Lesmo grandstands.`,
    },
  },
  "grandstand-26-pit-lane-grid-podium-": {
    tips: [[
      "it has the clearest sightline of any grandstand at Monza and is €414 cheaper than 26A for the same 3-day pass.",
      "it has the clearest sightline of any grandstand at Monza and is typically the cheaper of the sections for the same 3-day pass.",
    ]],
    costRange: {
      old: "2027 pricing not yet published — check monzanet.it/en/tickets/ directly closer to the event",
      new: "About US$1,024–1,160 for a 3-day pass in 2027, depending on section — the band shared with the Ascari, Parabolica and Lesmo grandstands.",
    },
  },
  "italian-gp-grandstand-5-piscina-": {
    avoid: [[
      " And don't treat any 2027 ticket price you come across for this stand as confirmed — Monza had not published 2027 pricing at the time of writing, so check monzanet.it's own ticket page directly rather than relying on a figure quoted elsewhere.",
      "",
    ]],
    costRange: {
      old: "2027 pricing not yet published — check monzanet.it/en/tickets/ directly closer to the event",
      new: "Sold as a 3-day reserved-seat package. The exact Grandstand 5 figure is on the official 2027 price list at monzanet.it.",
    },
    bookingMethod: {
      old: "Book directly via monzanet.it/en/tickets/ once 2027 tickets go on sale — historically sold as a 3-day reserved-seating package (practice, qualifying, race), not single-day.",
      new: "Book directly via monzanet.it/en/tickets/ — historically sold as a 3-day reserved-seating package (practice, qualifying, race), not single-day.",
    },
  },
  "trackside-corner-lounges-villas-": {
    costRange: {
      old: "Not yet published for 2027 — pricing is issued via Monzanet's own downloadable hospitality brochure rather than listed on the page itself; contact the circuit directly for current rates.",
      new: "2027 hospitality packages that include the Garden Lounge and Ultimate Hospitality run roughly US$4,313–6,199 depending on the days booked. Monzanet issues per-lounge pricing through its own downloadable hospitality brochure rather than on the page itself, so email the circuit for the exact rate for Dolce Vita and Green House.",
    },
  },
};

// ---- Phase 1: compute every change in memory, abort on any guard failure ----
const plan = [];
for (const [prefix, e] of Object.entries(EDITS)) {
  const [row] = await db.select().from(experiences).where(like(experiences.slug, prefix + "%"));
  if (!row) throw new Error("experience not found: " + prefix);
  const set = {};

  const replaceOnce = (text, [oldS, newS], label) => {
    if (typeof text !== "string") throw new Error(`${prefix} ${label}: field empty`);
    const i = text.indexOf(oldS);
    if (i < 0) throw new Error(`${prefix} ${label}: old text not found — already changed?\n  ${oldS.slice(0, 90)}`);
    if (text.indexOf(oldS, i + oldS.length) >= 0) throw new Error(`${prefix} ${label}: old text not unique`);
    return text.replace(oldS, () => newS);
  };

  if (e.body) { let t = row.bodyContent; for (const p of e.body) t = replaceOnce(t, p, "body"); set.bodyContent = t; }
  if (e.avoid) { let t = row.whatToAvoid; for (const p of e.avoid) t = replaceOnce(t, p, "whatToAvoid"); set.whatToAvoid = t; }
  if (e.tips) {
    const tips = [...(row.insiderTips ?? [])];
    for (const p of e.tips) {
      const idx = tips.findIndex((x) => x.includes(p[0]));
      if (idx < 0) throw new Error(`${prefix} tips: old text not found`);
      tips[idx] = replaceOnce(tips[idx], p, "tip");
    }
    set.insiderTips = tips;
  }
  if (e.costRange || e.bookingMethod) {
    const pi = { ...(row.practicalInfo ?? {}) };
    if (e.costRange) pi.costRange = replaceOnce(pi.costRange, [e.costRange.old, e.costRange.new], "costRange");
    if (e.bookingMethod) pi.bookingMethod = replaceOnce(pi.bookingMethod, [e.bookingMethod.old, e.bookingMethod.new], "bookingMethod");
    set.practicalInfo = pi;
  }
  set.editorialNote = (row.editorialNote ?? "") + NOTE;
  plan.push({ id: row.id, slug: row.slug, set });
}

// ---- Phase 2: write ----
for (const p of plan) {
  await db.update(experiences).set({ ...p.set, updatedAt: new Date() }).where(eq(experiences.id, p.id));
  console.log("updated", p.slug, "->", Object.keys(p.set).join(", "));
}
console.log(`done: ${plan.length} experiences`);
await client.end();
