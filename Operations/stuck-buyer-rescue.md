# Skill: Stuck Buyer Rescue

Daily cron that finds buyers who completed a purchase but never signed in to
access their pack — and automatically re-sends their magic link.

---

## The problem

A buyer pays → webhook fires → Supabase Auth user created → confirmation email sent
with pack link. If the magic link expires (1 hour) before they click it, they're locked
out. They may not know to go back and sign in. Revenue is lost until they raise a
support query.

---

## Detection logic

A "stuck buyer" is:
- A row in `purchases` with `status = 'active'`
- Created more than 2 hours ago (link expired)
- Created less than 7 days ago (still within refund window / still relevant)
- The buyer's email has **never signed in** — i.e. `last_sign_in_at` is null in
  Supabase Auth admin API

---

## Implementation

### 1. Cron route
`app/api/cron/stuck-buyer-rescue/route.ts`
- Triggered daily at 09:00 UTC via `vercel.json`
- Verifies `Authorization: Bearer $CRON_SECRET`
- Queries `purchases` for eligible rows
- Calls Supabase admin `generateLink({ type: 'magiclink' })` for each
- Sends re-engagement email via Resend with pack link + plain sign-in link
- Logs each rescue to console (visible in Vercel logs)

### 2. vercel.json entry
```json
{ "path": "/api/cron/stuck-buyer-rescue", "schedule": "0 9 * * *" }
```

### 3. Email copy
Subject: `Access your [Event] pack — your link has expired`
Body: friendly nudge, new magic link button, reassurance the purchase is safe.

### 4. De-duplication
Track rescues to avoid emailing the same buyer every day:
- Add a `rescueSentAt` timestamp column to `purchases` (nullable)
- Only send if `rescueSentAt IS NULL` (one rescue email per purchase, ever)
- Update `rescueSentAt` after sending

---

## Schema change required
```sql
ALTER TABLE purchases ADD COLUMN rescue_sent_at TIMESTAMPTZ;
```
Run via `db:generate` + migration script (no TTY workaround — see feedback_db_migration.md).

---

## Status
- [ ] Schema column added: `purchases.rescueSentAt`
- [ ] Route built: `app/api/cron/stuck-buyer-rescue/route.ts`
- [ ] `vercel.json` crons entry added
- [ ] Tested manually with a real stuck purchase
- [ ] First rescue email received and validated
