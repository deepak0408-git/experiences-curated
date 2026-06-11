# Skill: Weekly Revenue Report

Automated Monday morning email summarising the previous week's revenue, costs,
and margin — sent to hello@experiences-curated.com via Resend.

---

## What it covers

- New pack purchases that week (by event, by tier)
- Pro subscription MRR (active subscriptions × price)
- Cumulative revenue to date
- Fixed cost estimate for the month
- Gross margin estimate
- "Expected payout" line to validate against Dodo/Paddle dashboard

---

## Implementation

### 1. Cron route
`app/api/cron/weekly-report/route.ts`
- Triggered every Monday at 07:00 UTC via `vercel.json`
- Verifies `Authorization: Bearer $CRON_SECRET`
- Queries `purchases` and `pro_subscriptions` tables
- Computes weekly + cumulative totals
- Sends HTML email via Resend

### 2. vercel.json entry
```json
{
  "crons": [
    { "path": "/api/cron/weekly-report", "schedule": "30 2 * * 6" }
  ]
}
```
Schedule: Saturday 08:00 IST = 02:30 UTC (`30 2 * * 6`)

### 3. Environment variables required
- `CRON_SECRET` — shared secret to authenticate cron calls (set in Vercel + .env.local)
- `RESEND_API_KEY` — already set
- `DATABASE_URL` — already set

### 4. Email details
- **To:** experiencescurated@gmail.com
- **From:** Experiences | Curated &lt;hello@experiences-curated.com&gt;
- **Subject:** `Experiences Curated Weekly Sales Report — 4 Jun – 11 Jun 2026` (dates dynamic)
- **Currency:** Each transaction shown in its original currency (GBP/USD/EUR) + INR equivalent. All totals in INR. Live FX rates via frankfurter.app; fallback rates if API down (£1=₹107, $1=₹84, €1=₹91).
- **Sections:** Pack sales by event · Pro subscriptions + MRR · YTD totals · Monthly fixed costs in USD + INR · Payout validation box

### 4. Fixed costs (hardcoded in report, update when plans change)
| Service | Monthly cost |
|---|---|
| Vercel Pro | $20 |
| Supabase | $0 (free) → $25 (Pro) |
| Algolia | $0 (free tier) |
| Resend | $0 (free tier) |
| Cloudflare R2 | ~$1 |
| Sentry | $0 (free tier) |
| Better Stack | $0 (free tier) |
| **Total fixed** | ~$21–$46 |

Payment provider fees: ~5% of gross revenue (Dodo/Paddle variable).

---

## Manual payout validation (2 min/week)

1. Open Dodo or Paddle dashboard → Payouts
2. Note payout amount for the period
3. Compare against "Expected payout" in the Monday email
4. Difference should be ~5% fees ± small timing difference
5. Flag anything >10% discrepancy for investigation

---

## Status
- [x] Route built: `app/api/cron/weekly-report/route.ts`
- [x] `vercel.json` crons entry added (`30 2 * * 6` — Saturday 08:00 IST)
- [x] `CRON_SECRET` added to `.env.local` — **add to Vercel env vars before next Saturday**
- [x] Tested manually 11 Jun 2026 — email received, INR totals correct, live FX rates confirmed
- [ ] First Saturday production email received and validated against Dodo payout
