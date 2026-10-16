import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import { plannerTicketTierCost } from "../schema/database.ts";

// Real 2026 weekend (3-day) grandstand/GA/hospitality prices, sourced
// directly from the official Hungarian GP reseller gpticketshop.hu
// (screenshots supplied by founder, 16 Oct 2026) and F1 Experiences/
// third-party aggregators for hospitality (Paddock Club, Champions Club —
// no official per-package price published, ranges sourced from multiple
// 2026 resellers). EUR->USD converted at ~1.08 (16 Oct 2026 rate), rounded
// to whole dollars. Used for Ticket Intelligence ORDINAL scoring only —
// never displayed as a $ figure to the fan (migrate-from-classic-to-hub-
// spoke skill N/A here; see ticket-intelligence-researcher skill §3).
//
// TIER STRUCTURE — CATEGORY-BASED, not price-ordinal. Founder explicit
// instruction, 16 Oct 2026, overriding the price-ordinal pattern used by
// every prior event (e.g. Brazilian GP's tier3 = Heineken Village, priced
// ABOVE tier2 grandstands — seat-type-agnostic there). For Hungarian GP:
//   tier1 = General Admission ONLY
//   tier2 = standard grandstands (Chicane 1/2/4, Fan, Apex 1, Grand Prix 1,
//     Apex 2, Grand Prix 2, Pit Exit 1, Grid 1, Grid 2)
//   tier3 = premium main-straight grandstands ONLY (T1, Hungaroring,
//     Hungaroring Platinum)
//   tier4 = hospitality ONLY (F1 Fan Lounge, Champions Club, F1 Paddock
//     Club)
//
// Real per-stand prices (official, EUR, Weekend/3-day, gpticketshop.hu):
//   General Admission 170, Chicane 1/2/4 240, Fan 270, Apex 1 300, Grand
//   Prix 1 300, Apex 2 340, Grand Prix 2 350, Pit Exit 1 430, Grid 1 430,
//   Grid 2 430, T1 500, Hungaroring 650, Hungaroring Platinum 740.
//
// Hospitality pricing: F1 Fan Lounge €1,950 (gpticketshop.hu, official).
// Champions Club $4,899 (f1experiences.com's own 2027 package page, USD
// directly, screenshot supplied by founder). F1 Paddock Club $7,000 (real
// figure supplied directly by founder, 16 Oct 2026, correcting this
// script's earlier $6,670-11,935 reseller-range placeholder) — also the
// real prestige tiebreaker winner for this event (see §6 of the
// ticket-intelligence-researcher skill; wired separately in scoreSeats.ts
// and FullResult.tsx).
//
// Founder explicit instruction, 16 Oct 2026: only Champions Club is seeded
// from F1 Experiences — its "Starter"/"Hero" packages (Grid 3, Turn 1,
// Apex 1/2, Hungaroring Platinum, Pit Exit 1) bundle hotel + daily
// transfers on top of the SAME underlying grandstand seats already priced
// via gpticketshop.hu, not distinct seats — excluded from this inventory
// as a different product for an existing seat, not a new one.
//
// ticketTierCostId drives ORDINAL rank only — never displayed as a $
// figure to the fan (ticket-intelligence-researcher skill §3) — so each
// tier's costLow/costHigh here is a real, honest span across exactly the
// seats that tier actually contains, not an invented round number.
const HUNGARIAN_GP_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const EDITION_YEAR = 2027;
const EUR_TO_USD = 1.08;
const usd = (eur) => Math.round(eur * EUR_TO_USD);

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission (3-day)",
    costLow: String(usd(170)),
    costHigh: String(usd(170)),
  },
  {
    tier: "tier2",
    eventTierLabel: "Chicane 1, Chicane 2, Chicane 4, Fan, Apex 1, Grand Prix 1, Apex 2, Grand Prix 2, Pit Exit 1, Grid 1, Grid 2 (3-day)",
    costLow: String(usd(240)),
    costHigh: String(usd(430)),
  },
  {
    tier: "tier3",
    eventTierLabel: "T1, Hungaroring, Hungaroring Platinum (3-day)",
    costLow: String(usd(500)),
    costHigh: String(usd(740)),
  },
  {
    tier: "tier4",
    eventTierLabel: "F1 Fan Lounge, Champions Club, F1 Paddock Club (3-day)",
    costLow: String(usd(1950)),
    costHigh: "7000", // F1 Paddock Club, real figure supplied directly by founder, 16 Oct 2026, already USD
  },
];

for (const row of rows) {
  const [existing] = await db
    .select()
    .from(plannerTicketTierCost)
    .where(and(eq(plannerTicketTierCost.sportingEventId, HUNGARIAN_GP_ID), eq(plannerTicketTierCost.tier, row.tier), eq(plannerTicketTierCost.editionYear, EDITION_YEAR)));

  if (existing) {
    await db
      .update(plannerTicketTierCost)
      .set({ eventTierLabel: row.eventTierLabel, costLow: row.costLow, costHigh: row.costHigh, currency: "USD", lastUpdated: new Date() })
      .where(eq(plannerTicketTierCost.id, existing.id));
    console.log(`✓ Updated ${row.tier}`);
  } else {
    await db.insert(plannerTicketTierCost).values({
      sportingEventId: HUNGARIAN_GP_ID,
      tier: row.tier,
      eventTierLabel: row.eventTierLabel,
      editionYear: EDITION_YEAR,
      costLow: row.costLow,
      costHigh: row.costHigh,
      currency: "USD",
      lastUpdated: new Date(),
    });
    console.log(`✓ Inserted ${row.tier}`);
  }
}

const final = await db.select().from(plannerTicketTierCost).where(and(eq(plannerTicketTierCost.sportingEventId, HUNGARIAN_GP_ID), eq(plannerTicketTierCost.editionYear, EDITION_YEAR)));
console.table(final.map((r) => ({ tier: r.tier, label: r.eventTierLabel, low: r.costLow, high: r.costHigh })));

await client.end();
