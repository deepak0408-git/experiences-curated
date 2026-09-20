// Official F1 2027 calendar confirmed 16 Sep 2026 (FIA calendar graphic,
// founder-supplied via WhatsApp). Updates all 24 externalCalendarEvents rows
// seeded 8 Aug 2026 from a founder-supplied "tentative, unconfirmed" list:
// clears isProvisional, updates sourceName/sourceType, and fixes the two
// rows whose dates the official calendar moved (Brazilian GP, Las Vegas GP).
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { and, eq, sql } from "drizzle-orm";
import { externalCalendarEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SOURCE_NAME = "Official FIA 2027 F1 calendar (confirmed)";

// Date fixes for rows whose dates differ from the official calendar.
const DATE_FIXES = {
  "Brazilian Grand Prix": { startDate: "2027-11-05", endDate: "2027-11-07" },
  "Las Vegas Grand Prix": { startDate: "2027-11-18", endDate: "2027-11-20" },
};

const rows = await db
  .select()
  .from(externalCalendarEvents)
  .where(and(eq(externalCalendarEvents.sport, "formula_one"), sql`extract(year from ${externalCalendarEvents.startDate}) = 2027`));

let updated = 0;
for (const row of rows) {
  const fix = DATE_FIXES[row.name];
  await db
    .update(externalCalendarEvents)
    .set({
      isProvisional: false,
      sourceName: SOURCE_NAME,
      lastVerifiedAt: new Date(),
      updatedAt: new Date(),
      ...(fix ?? {}),
    })
    .where(eq(externalCalendarEvents.id, row.id));
  updated++;
  console.log(`Updated: ${row.name}${fix ? ` (date corrected to ${fix.startDate} – ${fix.endDate})` : ""}`);
}

console.log(`Done. ${updated} rows updated, isProvisional cleared, source set to "${SOURCE_NAME}".`);
await client.end();
