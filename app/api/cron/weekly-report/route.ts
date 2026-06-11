import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { purchases, proSubscriptions, sportingEvents } from "@/schema/database";
import { gte, and, eq, sql } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

const REPORT_TO = "experiencescurated@gmail.com";
const PROVIDER_FEE_RATE = 0.05;

// Fixed monthly costs in USD
const FIXED_COSTS = [
  { name: "Vercel Pro", usd: 20 },
  { name: "Supabase", usd: 0 },
  { name: "Cloudflare R2", usd: 1 },
  { name: "Better Stack", usd: 0 },
  { name: "Sentry", usd: 0 },
  { name: "Algolia", usd: 0 },
  { name: "Resend", usd: 0 },
];
const FIXED_MONTHLY_USD = FIXED_COSTS.reduce((sum, c) => sum + c.usd, 0);

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£", USD: "$", EUR: "€", INR: "₹",
};

function sym(currency: string) {
  return CURRENCY_SYMBOLS[currency] ?? currency + " ";
}

// Fetch live FX rates relative to INR from frankfurter.app
async function fetchRatesToINR(): Promise<Record<string, number>> {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=INR&to=GBP,USD,EUR");
    if (!res.ok) throw new Error("FX fetch failed");
    const data = await res.json() as { rates: Record<string, number> };
    // rates are INR→X, we need X→INR
    const toInr: Record<string, number> = { INR: 1 };
    for (const [currency, rate] of Object.entries(data.rates)) {
      toInr[currency] = 1 / rate;
    }
    return toInr;
  } catch {
    // Fallback rates if API is down
    return { GBP: 107, USD: 84, EUR: 91, INR: 1 };
  }
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Fetch live FX rates
  const fxToINR = await fetchRatesToINR();
  const gbpToInr = fxToINR["GBP"] ?? 107;
  const usdToInr = fxToINR["USD"] ?? 84;
  const eurToInr = fxToINR["EUR"] ?? 91;

  function toINR(amount: number, currency: string): number {
    return amount * (fxToINR[currency] ?? 84);
  }

  // ── Weekly purchases ──────────────────────────────────────────────────────
  const weeklyPurchases = await db
    .select({
      id: purchases.id,
      email: purchases.email,
      pricePaid: purchases.pricePaid,
      currency: purchases.currency,
      priceTier: purchases.priceTier,
      purchasedAt: purchases.purchasedAt,
      eventName: sportingEvents.name,
    })
    .from(purchases)
    .leftJoin(sportingEvents, eq(purchases.sportingEventId, sportingEvents.id))
    .where(and(
      gte(purchases.purchasedAt, weekStart),
      eq(purchases.status, "active"),
    ));

  // ── YTD ──────────────────────────────────────────────────────────────────
  const ytdRows = await db
    .select({
      pricePaid: purchases.pricePaid,
      currency: purchases.currency,
    })
    .from(purchases)
    .where(and(gte(purchases.purchasedAt, yearStart), eq(purchases.status, "active")));

  const ytdCount = ytdRows.length;
  const ytdInr = ytdRows.reduce((sum, r) => sum + toINR(parseFloat(r.pricePaid ?? "0"), r.currency ?? "GBP"), 0);

  // ── Pro subscriptions ─────────────────────────────────────────────────────
  const proMonthlyResult = await db
    .select({ count: sql<string>`count(*)` })
    .from(proSubscriptions)
    .where(and(eq(proSubscriptions.status, "active"), eq(proSubscriptions.billingCycle, "monthly")));
  const proAnnualResult = await db
    .select({ count: sql<string>`count(*)` })
    .from(proSubscriptions)
    .where(and(eq(proSubscriptions.status, "active"), eq(proSubscriptions.billingCycle, "annual")));

  const proMonthlyCount = parseInt(proMonthlyResult[0]?.count ?? "0");
  const proAnnualCount = parseInt(proAnnualResult[0]?.count ?? "0");
  const activeProCount = proMonthlyCount + proAnnualCount;
  const PRO_MONTHLY_GBP = 9;
  const PRO_ANNUAL_GBP = 69;
  const mrrGbp = (proMonthlyCount * PRO_MONTHLY_GBP) + (proAnnualCount * (PRO_ANNUAL_GBP / 12));
  const mrrInr = toINR(mrrGbp, "GBP");

  // ── Weekly revenue by currency then by event ──────────────────────────────
  // Group by event, tracking per-currency amounts
  const byEvent: Record<string, { count: number; byCurrency: Record<string, number> }> = {};
  for (const p of weeklyPurchases) {
    const key = p.eventName ?? "Unknown";
    const currency = p.currency ?? "GBP";
    const amount = parseFloat(p.pricePaid ?? "0");
    if (!byEvent[key]) byEvent[key] = { count: 0, byCurrency: {} };
    byEvent[key].count++;
    byEvent[key].byCurrency[currency] = (byEvent[key].byCurrency[currency] ?? 0) + amount;
  }

  // Weekly totals in INR
  const weeklyInr = weeklyPurchases.reduce((sum, p) =>
    sum + toINR(parseFloat(p.pricePaid ?? "0"), p.currency ?? "GBP"), 0);
  const weeklyFeesInr = weeklyInr * PROVIDER_FEE_RATE;
  const weeklyNetInr = weeklyInr - weeklyFeesInr;

  // Also show gross in GBP equiv for payout reference
  const weeklyGbpEquiv = weeklyInr / gbpToInr;

  // ── Date label ────────────────────────────────────────────────────────────
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const weekLabel = `${weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${fmt(now)}`;

  // ── Build event rows ──────────────────────────────────────────────────────
  const eventRows = Object.entries(byEvent).map(([name, d]) => {
    const currencyLines = Object.entries(d.byCurrency)
      .map(([cur, amt]) => `${sym(cur)}${amt.toFixed(2)} ${cur}`)
      .join("<br>");
    const inrEquiv = Object.entries(d.byCurrency)
      .reduce((sum, [cur, amt]) => sum + toINR(amt, cur), 0);
    return `<tr>
      <td style="padding:6px 0;color:#525252">${name}</td>
      <td style="padding:6px 0;text-align:center;color:#525252">${d.count}</td>
      <td style="padding:6px 0;text-align:right;color:#525252;font-size:12px">${currencyLines}</td>
      <td style="padding:6px 0;text-align:right;color:#171717;font-weight:600">₹${Math.round(inrEquiv).toLocaleString("en-IN")}</td>
    </tr>`;
  }).join("") || `<tr><td colspan="4" style="padding:6px 0;color:#a3a3a3;font-style:italic">No purchases this week</td></tr>`;

  const costRows = FIXED_COSTS.map(c =>
    `<tr>
      <td style="padding:4px 0;color:#525252">${c.name}</td>
      <td style="padding:4px 0;text-align:right;color:#525252">$${c.usd}</td>
      <td style="padding:4px 0;text-align:right;color:#525252">${c.usd > 0 ? "₹" + Math.round(toINR(c.usd, "USD")).toLocaleString("en-IN") : "—"}</td>
    </tr>`
  ).join("");

  const fixedMonthlyInr = toINR(FIXED_MONTHLY_USD, "USD");

  // ── FX rates note ─────────────────────────────────────────────────────────
  const fxNote = `Live rates (frankfurter.app): £1 = ₹${Math.round(gbpToInr)} · $1 = ₹${Math.round(usdToInr)} · €1 = ₹${Math.round(eurToInr)}`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#171717">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:8px">Experiences | Curated</p>
      <h1 style="font-size:20px;font-weight:700;margin-bottom:4px">Weekly Sales Report</h1>
      <p style="font-size:13px;color:#a3a3a3;margin-bottom:4px">${weekLabel}</p>
      <p style="font-size:11px;color:#a3a3a3;margin-bottom:32px">${fxNote}</p>

      <!-- Pack sales -->
      <h2 style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;margin-bottom:12px">Pack Sales This Week</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px">
        <tr style="border-bottom:1px solid #e5e5e5">
          <th style="padding:6px 0;text-align:left;color:#a3a3a3;font-weight:500">Event</th>
          <th style="padding:6px 0;text-align:center;color:#a3a3a3;font-weight:500">Sales</th>
          <th style="padding:6px 0;text-align:right;color:#a3a3a3;font-weight:500">Amount</th>
          <th style="padding:6px 0;text-align:right;color:#a3a3a3;font-weight:500">INR equiv</th>
        </tr>
        ${eventRows}
        <tr style="border-top:2px solid #171717">
          <td style="padding:8px 0;font-weight:700">Total</td>
          <td style="padding:8px 0;text-align:center;font-weight:700">${weeklyPurchases.length}</td>
          <td style="padding:8px 0;text-align:right;color:#525252;font-size:12px">≈ £${weeklyGbpEquiv.toFixed(2)}</td>
          <td style="padding:8px 0;text-align:right;font-weight:700;font-size:16px">₹${Math.round(weeklyInr).toLocaleString("en-IN")}</td>
        </tr>
      </table>

      <!-- Pro subscriptions -->
      <h2 style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;margin-bottom:12px">Pro Subscriptions</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px">
        <tr>
          <td style="padding:5px 0;color:#525252">Monthly (£9/mo)</td>
          <td style="padding:5px 0;text-align:right;color:#525252">${proMonthlyCount}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#525252">Annual (£69/yr)</td>
          <td style="padding:5px 0;text-align:right;color:#525252">${proAnnualCount}</td>
        </tr>
        <tr style="border-top:1px solid #e5e5e5">
          <td style="padding:8px 0;font-weight:600">Active total</td>
          <td style="padding:8px 0;text-align:right;font-weight:600">${activeProCount}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#525252">Estimated MRR</td>
          <td style="padding:5px 0;text-align:right;color:#171717;font-weight:600">£${mrrGbp.toFixed(2)} · ₹${Math.round(mrrInr).toLocaleString("en-IN")}</td>
        </tr>
      </table>

      <!-- YTD -->
      <h2 style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;margin-bottom:12px">Year to Date</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px">
        <tr>
          <td style="padding:5px 0;color:#525252">Pack sales</td>
          <td style="padding:5px 0;text-align:right;font-weight:600">${ytdCount} packs</td>
        </tr>
        <tr>
          <td style="padding:5px 0;color:#525252">Gross revenue (INR equiv)</td>
          <td style="padding:5px 0;text-align:right;font-weight:700;font-size:15px">₹${Math.round(ytdInr).toLocaleString("en-IN")}</td>
        </tr>
      </table>

      <!-- Costs -->
      <h2 style="font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;margin-bottom:12px">Estimated Costs (Monthly)</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;font-size:13px">
        <tr style="border-bottom:1px solid #e5e5e5">
          <th style="padding:5px 0;text-align:left;color:#a3a3a3;font-weight:500">Service</th>
          <th style="padding:5px 0;text-align:right;color:#a3a3a3;font-weight:500">USD</th>
          <th style="padding:5px 0;text-align:right;color:#a3a3a3;font-weight:500">INR</th>
        </tr>
        ${costRows}
        <tr style="border-top:1px solid #e5e5e5">
          <td style="padding:6px 0;font-weight:600">Fixed total</td>
          <td style="padding:6px 0;text-align:right;font-weight:600">$${FIXED_MONTHLY_USD}</td>
          <td style="padding:6px 0;text-align:right;font-weight:600">₹${Math.round(fixedMonthlyInr).toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#525252">Provider fees (~5% of gross this week)</td>
          <td style="padding:4px 0;text-align:right;color:#525252" colspan="2">₹${Math.round(weeklyFeesInr).toLocaleString("en-IN")}</td>
        </tr>
      </table>

      <!-- Payout validation -->
      <div style="background:#f5f5f5;border-radius:8px;padding:16px;margin-top:24px;font-size:13px">
        <p style="font-weight:600;margin:0 0 8px">Payout Validation</p>
        <p style="color:#525252;margin:0 0 4px">Gross this week: <strong>₹${Math.round(weeklyInr).toLocaleString("en-IN")} (≈ £${weeklyGbpEquiv.toFixed(2)})</strong></p>
        <p style="color:#525252;margin:0 0 4px">Expected net after ~5% fees: <strong>₹${Math.round(weeklyNetInr).toLocaleString("en-IN")}</strong></p>
        <p style="color:#a3a3a3;margin:8px 0 0;font-size:12px">Compare against your Dodo/Paddle payout dashboard. Flag if difference &gt;10%.</p>
      </div>

      <p style="font-size:11px;color:#a3a3a3;margin-top:32px">
        Auto-generated every Saturday at 08:00 IST. ${fxNote}.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: REPORT_TO,
      subject: `Experiences Curated Weekly Sales Report — ${weekLabel}`,
      html,
    });
    console.log("[weekly-report] report sent to", REPORT_TO);
  } catch (err) {
    console.error("[weekly-report] failed to send:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    weeklyPurchases: weeklyPurchases.length,
    weeklyInr: Math.round(weeklyInr),
    activeProCount,
    mrrGbp: mrrGbp.toFixed(2),
    mrrInr: Math.round(mrrInr),
  });
}
