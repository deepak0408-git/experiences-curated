// Issue 1 (Business Problem Register) — a single, reliable, on-demand view
// of real commercial activity across all 3 revenue tables: purchases
// (Event Guide), pro_subscriptions (Pro), ticket_intelligence_season_passes
// (Season Pass).
//
// Hard rules, both from direct incidents already caught in this project:
// 1. Filter to pricePaid > 0 and exclude the founder's own email — raw row
//    counts are dominated by $0 free-tier/gift/test grants (confirmed via
//    direct query, 18 Nov 2026 inspection: 112 of 119 purchases rows,
//    all 3 season-pass rows, the one pro_subscriptions row).
// 2. Never sum price_paid across currencies unconverted — this produced a
//    nominal "$550.77" that was really ~$61 real USD revenue (Day 100
//    review, 25 Sep 2026, caused by an unconverted INR value). USD
//    normalization here is a live FX lookup at report time, clearly
//    labeled as an approximation, not a stored source of truth — no
//    amount_usd column exists on any of these tables.
//
// Run with: node --experimental-strip-types scripts/commercial-report.mjs
import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const FOUNDER_EMAIL = "deepak0408@gmail.com";
const sql = postgres(process.env.DATABASE_URL, { max: 1 });

// Confirmed real Dodo prices (CLAUDE.md, 1 Aug 2026) — pro_subscriptions has
// no price/currency column at all, so this is the only source for a dollar
// figure per subscription.
const PRO_PRICE_USD = { monthly: 6, annual: 59 };

async function getUsdRate(currency) {
  if (currency === "USD") return 1;
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${currency}&to=USD`);
    const data = await res.json();
    return data?.rates?.USD ?? null;
  } catch {
    return null;
  }
}

function fmtUsd(n) {
  return `US$${n.toFixed(2)}`;
}

async function main() {
  console.log("=".repeat(70));
  console.log("COMMERCIAL REPORT — real paid activity only");
  console.log(`Generated ${new Date().toISOString()}`);
  console.log(`Excludes: $0 free/gift grants, founder's own email (${FOUNDER_EMAIL})`);
  console.log("USD figures are a live FX-rate approximation at report time, not a stored/audited value.");
  console.log("=".repeat(70));

  // ── Event Guide purchases ────────────────────────────────────────────
  const purchaseRows = await sql`
    SELECT p.price_paid, p.currency, p.email, p.product_type, p.utm_source,
           p.purchased_at, se.name AS event_name, se.sport
    FROM purchases p
    JOIN sporting_events se ON se.id = p.sporting_event_id
    WHERE p.price_paid::numeric > 0 AND p.email != ${FOUNDER_EMAIL}
    ORDER BY p.purchased_at DESC
  `;

  const uniqueCurrencies = [...new Set(purchaseRows.map((r) => r.currency))];
  const rates = Object.fromEntries(
    await Promise.all(uniqueCurrencies.map(async (c) => [c, await getUsdRate(c)]))
  );

  let purchaseUsdTotal = 0;
  let purchaseConversionFailed = 0;
  for (const r of purchaseRows) {
    const rate = rates[r.currency];
    if (rate == null) {
      purchaseConversionFailed++;
      continue;
    }
    purchaseUsdTotal += Number(r.price_paid) * rate;
  }

  console.log("\n--- EVENT GUIDE (purchases) ---");
  console.log(`Genuine paid purchases: ${purchaseRows.length}`);
  console.log(`Approx. USD total: ${fmtUsd(purchaseUsdTotal)}${purchaseConversionFailed ? ` (${purchaseConversionFailed} rows excluded — FX lookup failed)` : ""}`);

  console.log("\nBy raw currency (not converted):");
  const byCurrency = {};
  for (const r of purchaseRows) {
    byCurrency[r.currency] = byCurrency[r.currency] || { count: 0, total: 0 };
    byCurrency[r.currency].count++;
    byCurrency[r.currency].total += Number(r.price_paid);
  }
  for (const [cur, v] of Object.entries(byCurrency)) {
    console.log(`  ${cur}: ${v.count} purchase(s), ${v.total.toFixed(2)} ${cur} raw`);
  }

  console.log("\nBy event:");
  const byEvent = {};
  for (const r of purchaseRows) {
    const key = `${r.event_name} (${r.sport})`;
    byEvent[key] = byEvent[key] || { count: 0 };
    byEvent[key].count++;
  }
  for (const [event, v] of Object.entries(byEvent)) {
    console.log(`  ${event}: ${v.count} purchase(s)`);
  }

  console.log("\nBy UTM source (Issue 12 attribution, only exists on purchases made since 20 Nov 2026):");
  const byUtm = {};
  for (const r of purchaseRows) {
    const key = r.utm_source ?? "(not set / pre-dates attribution)";
    byUtm[key] = (byUtm[key] ?? 0) + 1;
  }
  for (const [source, count] of Object.entries(byUtm)) {
    console.log(`  ${source}: ${count} purchase(s)`);
  }

  // ── Pro subscriptions ────────────────────────────────────────────────
  const proRows = await sql`
    SELECT billing_cycle, status, email, utm_source
    FROM pro_subscriptions
    WHERE email != ${FOUNDER_EMAIL} AND status = 'active'
  `;
  const proUsdTotal = proRows.reduce((sum, r) => sum + (PRO_PRICE_USD[r.billing_cycle] ?? 0), 0);

  console.log("\n--- PRO SUBSCRIPTIONS ---");
  console.log(`Genuine active external subscribers: ${proRows.length}`);
  console.log(`Approx. USD total (current period, not lifetime): ${fmtUsd(proUsdTotal)}`);
  if (proRows.length > 0) {
    console.log("By UTM source:");
    const proByUtm = {};
    for (const r of proRows) {
      const key = r.utm_source ?? "(not set / pre-dates attribution)";
      proByUtm[key] = (proByUtm[key] ?? 0) + 1;
    }
    for (const [source, count] of Object.entries(proByUtm)) {
      console.log(`  ${source}: ${count} subscriber(s)`);
    }
  }

  // ── Ticket Intelligence Season Passes ────────────────────────────────
  const passRows = await sql`
    SELECT price_paid, currency, email, sport, utm_source
    FROM ticket_intelligence_season_passes
    WHERE price_paid::numeric > 0 AND email != ${FOUNDER_EMAIL}
  `;
  const passCurrencies = [...new Set(passRows.map((r) => r.currency))];
  const passRates = Object.fromEntries(
    await Promise.all(passCurrencies.map(async (c) => [c, rates[c] ?? (await getUsdRate(c))]))
  );
  let passUsdTotal = 0;
  for (const r of passRows) {
    const rate = passRates[r.currency];
    if (rate != null) passUsdTotal += Number(r.price_paid) * rate;
  }

  console.log("\n--- TICKET INTELLIGENCE SEASON PASS ---");
  console.log(`Genuine paid passes: ${passRows.length}`);
  console.log(`Approx. USD total: ${fmtUsd(passUsdTotal)}`);
  if (passRows.length > 0) {
    const passBySport = {};
    for (const r of passRows) passBySport[r.sport] = (passBySport[r.sport] ?? 0) + 1;
    console.log("By sport:", passBySport);
  }

  // ── Grand total ──────────────────────────────────────────────────────
  const grandTotal = purchaseUsdTotal + proUsdTotal + passUsdTotal;
  console.log("\n" + "=".repeat(70));
  console.log(`TOTAL GENUINE PAID REVENUE (approx. USD): ${fmtUsd(grandTotal)}`);
  console.log(`Across ${purchaseRows.length + proRows.length + passRows.length} genuine paying customers/transactions.`);
  console.log("=".repeat(70));

  await sql.end();
}

main().catch((err) => {
  console.error("Report failed:", err);
  process.exitCode = 1;
});
