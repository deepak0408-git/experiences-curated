# Skill: Pre-Trip Brief Activation

Scheduled activation of pre-trip briefs for each event pack — without a manual
code change or redeploy.

---

## The problem

Currently `PRE_TRIP_BRIEF` in `PackView.tsx` has a `live` boolean that must be
manually set to `true` and redeployed before each event. This is a redeploy
dependency on a specific date — easy to forget, and unnecessary.

---

## Target behaviour

Brief activates automatically on a configured date per event. No code change.
No redeploy.

---

## Implementation options

### Option A — DB-driven (recommended)
Store `preTripBriefLiveAt: Date` on the `sporting_events` table.
`PackView.tsx` reads it at render time: if `preTripBriefLiveAt <= now`, show the brief.
Content (the `lines`) stays in code — only the activation date is DB-driven.

**Pros:** One DB update activates the brief. No redeploy ever.
**Cons:** Requires a schema column + migration.

### Option B — Vercel cron
Cron at `app/api/cron/activate-pre-trip-briefs/route.ts` runs daily.
Checks each event's `startDate` — if within 10 days, sets a flag in DB.
PackView reads the flag.

**Pros:** Fully automatic, no manual DB update needed.
**Cons:** Slightly more moving parts.

### Option C — Environment variable (current workaround)
Keep `live` in code but add a `PRE_TRIP_BRIEF_LIVE_WIMBLEDON=true` env var
checked at runtime. Flip in Vercel dashboard without a redeploy.

**Pros:** Quickest to implement.
**Cons:** Env var per event — doesn't scale past 3–4 events.

**Recommended:** Option A for now, Option B when you have 5+ events.

---

## Activation dates

| Event | Slug | Activate brief by |
|---|---|---|
| Wimbledon 2026 | `wimbledon-2026` | 19 Jun 2026 |
| India in England Cricket 2026 | `india-in-england-cricket-2026` | 19 Jun 2026 (do both together) |
| US Open 2026 | `us-open-2026` | 20 Aug 2026 |

---

## Content checklist (before activation)

- [ ] Review brief lines for accuracy — confirm venues, transport, weather notes
- [ ] Check `startDate` / `endDate` are correct in DB
- [ ] Confirm hero image is live on pack landing page
- [ ] Test pack view as a purchaser after activation

---

## Status
- [ ] Approach agreed (Option A / B / C)
- [ ] Schema change (if Option A): `sporting_events.preTripBriefLiveAt`
- [ ] PackView.tsx updated to read activation date
- [ ] Wimbledon brief content written and ready
- [ ] Cricket brief content written and ready
- [ ] US Open brief content written and ready
