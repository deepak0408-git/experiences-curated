import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-grandstand-e-muqmz384";

const OLD_PARA = `On price, E undercut the circuit's premium stands in its first year: a three-day ticket ran 1,580 CNY, roughly US$224, priced alongside H and K rather than the pricier Grandstand A. Formula 1's own announcement calls it "newly configured" and leans on the usual "unparalleled vantage point" line, but never says whether the stand is covered. Shanghai's government guide doesn't say either. Pack for Shanghai's April weather regardless, because nothing on record confirms a roof.`;

const NEW_PARA = `On price, E undercut the circuit's premium stands in its first year: a three-day ticket ran 1,580 CNY, roughly US$224, priced alongside H and K rather than the pricier Grandstand A. Formula 1's own announcement calls it "newly configured" and leans on the usual "unparalleled vantage point" line. Unlike A, H, and K, Grandstand E is uncovered — pack for Shanghai's April weather accordingly, since there's no roof between you and whatever the sky does that day.`;

const newWhatToAvoid = "Don't book Grandstand E expecting shelter — it's the one named grandstand at this circuit confirmed uncovered, unlike A, H, and K, so a rainy or sun-heavy session day means sitting through it exposed. Don't buy a single-day ticket hoping to add Grandstand E — it sold three-day-only in its first year, so if your plan is one session only, this stand isn't the one to build it around.";

const [row] = await db.select({ bodyContent: experiences.bodyContent, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD_PARA)) {
  console.error("Target paragraph not found — aborting");
  process.exit(1);
}

const newBody = row.bodyContent.replace(OLD_PARA, NEW_PARA);
const newEditorialNote = row.editorialNote + " Updated 2 Oct 2026: covered status upgraded from 'unconfirmed' to confirmed uncovered, and 3-day-only ticket status confirmed HIGH confidence, per circuit_seating_profile row for Grandstand E (sourced to formula1.com's own 'tickets-on-sale-for-2026-chinese-grand-prix' article + english.shanghai.gov.cn's 2026 event guide, founder-confirmed 27 Sep 2026) — supersedes this experience's earlier hedged 'nothing on record confirms a roof' language. whatToAvoid rewritten to use these confirmed facts instead of the prior unconfirmed-roof hedge.";

await db.update(experiences)
  .set({
    bodyContent: newBody,
    whatToAvoid: newWhatToAvoid,
    editorialNote: newEditorialNote,
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated body (fixed stale roof-status hedging) and whatToAvoid (grounded in circuit_seating_profile data).");

await client.end();
