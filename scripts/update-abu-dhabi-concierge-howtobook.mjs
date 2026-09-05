import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const today = new Date().toISOString().slice(0, 10);

const updates = [
  {
    slug: "skybridge-terrace-w-abu-dhabi-mtff9m960jzj",
    howToBook:
      "Skybridge Terrace is sold only through named resellers, not F1's own ticket portal — ZK Sports (+971 4 434 4434, info@zk-sports.com) is one of two authorized channels, alongside Premium Access. 2026 packages start from AED 45,577 per person for the 3-day pass. Call directly rather than filling out a web enquiry form if you want a real-time read on which view — the indoor bridge lounge or the outdoor terrace over Turns 11-14 — still has capacity, since this is the smallest-capacity hospitality product at the venue and allocations move fast once finale-weekend sales open.",
    editorialNote:
      "Concierge pick added — genuine named-reseller contact (ZK Sports, +971 4 434 4434, info@zk-sports.com, confirmed via zk-sports.com) plus real 2026 price floor (AED 45,577/3-day, confirmed via premiumaccess.team/zk-sports.com), meeting skill §2b criterion 1 (real VIP tier above standard) and criterion 3 (named operator). Verified 4 Sep 2026.",
  },
  {
    slug: "yas-marina-yacht-charter-mtff9m96euez",
    howToBook:
      "This market runs on enquiry, not listings, so the fastest way in is going straight to a broker's Abu Dhabi GP desk rather than browsing generic charter sites: Burgess runs a dedicated program via burgessyachts.com, and Ahoy Club lists its Abu Dhabi GP berths at ahoyclub.com/whats-on/abu-dhabi-grand-prix. Ask for a berth on the harbour's south-west side by name — that's the side with a direct sightline onto the racing, and the detail that determines whether you're actually watching the race or just anchored nearby.",
    editorialNote:
      "Concierge pick added — genuine named-broker contact (Burgess, Ahoy Club, both confirmed via their own Abu Dhabi GP program pages) plus a real, non-obvious tactical detail (south-west harbour side has the direct sightline), meeting skill §2b criterion 3 (named operator worth naming). Verified 4 Sep 2026.",
  },
  {
    slug: "yasalam-after-parties-mtffh4jny87g",
    howToBook:
      "The free Etihad Park concerts bundled into every ticket are one layer — Afterlife Abu Dhabi is the separate, ticketed one worth knowing about, run by Factory People: call +971 58 514 2022 for general table enquiries, or +971 55 445 6068 specifically for backstage VIP tables. Tables start from AED 1,250 per person — enquire by naming Afterlife directly rather than a generic 'race week party' request, since specific-event enquiries get answered faster.",
    editorialNote:
      "Concierge pick added, scoped narrowly — real named contact (Factory People, +971 58 514 2022 general / +971 55 445 6068 VIP backstage, confirmed via edmnomad.com) and real price floor (AED 1,250pp) for Afterlife Abu Dhabi specifically. Deliberately does NOT name CE LA VI, OPA, or Garden on Yas as separate bookable nightclub venues — research (4 Sep 2026) found OPA and Garden on Yas are actually Abu Dhabi GP ticket-tier product names (sold via abudhabigp.com), not independent venues with their own reservation lines, and CE LA VI's Abu Dhabi presence (vs. Dubai) could not be verified. Scoped to only the one fact that cleared verification, per user instruction to drop the unverified names rather than include them on a weaker basis.",
  },
];

for (const u of updates) {
  const [row] = await db
    .select({ practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.slug, u.slug));

  if (!row) {
    console.error("NOT FOUND:", u.slug);
    continue;
  }

  const [updated] = await db
    .update(experiences)
    .set({
      practicalInfo: {
        ...row.practicalInfo,
        howToBook: u.howToBook,
      },
      editorialNote: u.editorialNote,
      lastVerifiedDate: today,
    })
    .where(eq(experiences.slug, u.slug))
    .returning({ id: experiences.id, slug: experiences.slug });

  console.log("Updated:", updated);
}

// Burj Khalifa: move the sell-out tactic from public bookingMethod into
// Concierge howToBook, trimming bookingMethod back to the standard public
// booking instruction only.
const burjSlug = "burj-khalifa-dubai-day-trip-mtffjvgvvow3";
const [burjRow] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.slug, burjSlug));

if (burjRow) {
  const [updatedBurj] = await db
    .update(experiences)
    .set({
      practicalInfo: {
        ...burjRow.practicalInfo,
        bookingMethod:
          "Book At the Top tickets directly via burjkhalifa.ae, choosing between the standard Level 124/125 tier or the SKY Level 148 tier. The Dubai Fountain is free and needs no ticket — just time your visit around the schedule above.",
        howToBook:
          "Sunset SKY Level 148 slots for the exact week of Abu Dhabi GP weekend are the hardest single booking in this pack to get right — they routinely sell out 2-4 weeks ahead in the October-April season, and December sits inside that window. Book the moment your travel dates are fixed, not \"closer to the trip,\" and pick a slot roughly 20-30 minutes before that evening's Dubai Fountain show so you can walk straight from the deck down to the promenade without a dead gap.",
      },
      editorialNote:
        "Concierge pick added 4 Sep 2026 — moved the SKY Level 148 sell-out tactic (2-4 week window, confirmed via multiple ticket-aggregator sources plus burjkhalifa.ae's own booking guidance) out of public bookingMethod into Pro-gated howToBook, since a genuine lead-time trap belongs behind the gate per skill §2b criterion 2, not given away in the public field for free. Public bookingMethod trimmed to the standard booking instruction only.",
      lastVerifiedDate: today,
    })
    .where(eq(experiences.slug, burjSlug))
    .returning({ id: experiences.id, slug: experiences.slug });

  console.log("Updated:", updatedBurj);
} else {
  console.error("NOT FOUND:", burjSlug);
}

await client.end();
