// One-off, persisted fix (24 Sep 2026) for two open items on the Border-Gavaskar
// Trophy 2027 pack:
//  1. Tadoba experience contradicted itself on permit pricing. Corrected
//     against the Maharashtra Forest Department's own portal
//     (mytadoba.mahaforest.gov.in): booking opens 120 days ahead; advance
//     booking is the EXPENSIVE window; core zone closed Tuesdays.
//  2. sporting_events row gaps: packCurrency (NULL, every other event is USD),
//     venueName (messy 5-city string) and venueAddress (NULL).
// Guarded: aborts without writing if the text it expects to replace isn't there.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";

// ---- 1. Tadoba experience -------------------------------------------------
const [exp] = await db.select().from(experiences).where(like(experiences.slug, "tadoba-tiger-safari-%"));
if (!exp) throw new Error("Tadoba experience not found");

const paras = exp.bodyContent.split("\n\n");
const idx = paras.findIndex((p) => p.startsWith("One thing to plan around early: safari permits"));
if (idx === -1) throw new Error("Permit paragraph not found — body already changed?");
paras[idx] =
  "One thing to plan around early: safari permits for the core zones are booked online through the Maharashtra Forest Department's official portal, and booking opens at 12:00am IST exactly 120 days before your safari date. Booking far ahead is the expensive window: a core-zone safari (entry, guide and gypsy together, priced per vehicle) runs about ₹8,800 on a weekday and ₹12,800 at weekends if booked 60-120 days out, and drops to about ₹5,800 and ₹6,800 inside 59 days, when far fewer slots are left. The core zone is closed on Tuesdays. Given the Nagpur Test lands in late January, well inside tiger-viewing season but before peak activity picks up from February onward, decide your safari date as soon as your travel dates are fixed rather than treating it as something to sort out once you land.";
const newBody = paras.join("\n\n");

const oldPractical = exp.practicalInfo ?? {};
if (!/4,575|7,575/.test(oldPractical.costRange ?? "")) throw new Error("costRange not in expected old state");
const newPractical = {
  ...oldPractical,
  costRange:
    "Core-zone permit (entry, guide and gypsy together, per vehicle): about ₹8,800 weekday / ₹12,800 weekend if booked 60-120 days ahead, or ₹5,800 weekday / ₹6,800 weekend if booked 1-59 days ahead. Buffer zone about ₹6,000 weekday / ₹7,000 weekend.",
  bookingMethod:
    "Book online through the Maharashtra Forest Department's official safari portal (mytadoba.mahaforest.gov.in). Normal booking opens at 12:00am IST 120 days before the safari date; a last-minute Tatkal window opens at 8:00am IST three days before. The core zone is closed on Tuesdays.",
};

const tips = [...(exp.insiderTips ?? [])];
if (!tips[0]?.startsWith("Book your safari permit the moment")) throw new Error("insider tip 0 not in expected old state");
tips[0] =
  "Book on the day booking opens (120 days before your date) if you need a specific date — advance permits cost more but that's when the slots are. Inside 59 days permits are cheaper but far fewer remain, and a Tatkal window opens three days before at 8:00am IST.";

let avoid = exp.whatToAvoid ?? "";
if (!avoid.includes("Don't book this as a same-day round trip")) throw new Error("whatToAvoid not in expected old state");
if (!avoid.includes("core zone is closed on Tuesdays")) avoid += " Don't plan the safari for a Tuesday: the core zone is closed that day.";

await db
  .update(experiences)
  .set({ bodyContent: newBody, practicalInfo: newPractical, insiderTips: tips, whatToAvoid: avoid, updatedAt: new Date() })
  .where(eq(experiences.id, exp.id));
console.log("Tadoba experience updated:", exp.slug);

// ---- 2. Event row ---------------------------------------------------------
const [ev] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, EVENT_ID));
console.log("BEFORE:", { packCurrency: ev.packCurrency, venueName: ev.venueName, venueAddress: ev.venueAddress, ticketingUrl: ev.ticketingUrl });
await db
  .update(sportingEvents)
  .set({
    packCurrency: "USD",
    venueName: "VCA Stadium, Nagpur · MA Chidambaram Stadium, Chennai · Narendra Modi Stadium, Ahmedabad",
    venueAddress:
      "Wardha Road, Jamtha, Nagpur 441108 · Wallajah Road, Chepauk, Chennai 600005 · Motera, Ahmedabad 380005",
  })
  .where(eq(sportingEvents.id, EVENT_ID));
const [after] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, EVENT_ID));
console.log("AFTER:", { packCurrency: after.packCurrency, venueName: after.venueName, venueAddress: after.venueAddress, ticketingUrl: after.ticketingUrl });

await client.end();
