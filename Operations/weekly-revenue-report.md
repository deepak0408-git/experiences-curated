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
    { "path": "/api/cron/weekly-report", "schedule": "0 7 * * 1" }
  ]
}
```

### 3. Environment variables required
- `CRON_SECRET` — shared secret to authenticate cron calls
- `RESEND_API_KEY` — already set
- `DATABASE_URL` — already set

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
- [ ] Route built: `app/api/cron/weekly-report/route.ts`
- [ ] `vercel.json` crons entry added
- [ ] `CRON_SECRET` added to Vercel env vars
- [ ] Tested manually (GET with Bearer token)
- [ ] First Monday email received and validated
