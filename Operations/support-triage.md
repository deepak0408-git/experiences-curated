# Skill: Daily Support Triage

Workflow for handling user support queries in a ~2 hour daily window.
Built around async-first, self-service-first principles.

---

## Tier 0 — Prevent the query (always-on)

These reduce inbound volume permanently:

- `/help` FAQ page — covers the top 5 query types
- Post-purchase confirmation email with direct pack link (done ✅)
- Auto-responder on `hello@experiences-curated.com`: "We respond within 24 hours"
- Clear error states on sign-in and checkout pages

Top 5 query types to keep the FAQ current:
1. "I paid but can't access my pack" → sign-in with purchase email + magic link
2. "My link expired" → go to /sign-in, enter purchase email
3. "I want a refund" → link to /terms refund policy
4. "What's included in the pack?" → link to pack landing page
5. "I entered the wrong email at checkout" → manual fix (curator action)

---

## Tier 1 — Gmail filters (set up once)

Create filters on `hello@experiences-curated.com`:

| Keyword | Label | Action |
|---|---|---|
| refund / cancel | 🔴 Urgent | Star + label |
| can't access / not working / broken | 🟡 Access | Label |
| invoice / receipt | 🟢 Finance | Label |
| wrong email | 🟡 Access | Label |
| everything else | 📥 General | Label |

Process order in your daily window: Urgent → Access → Finance → General.

---

## Tier 2 — Daily triage workflow (target: <2 hours)

1. **Scan labels** (5 min) — flag anything that needs a DB fix (wrong email, duplicate charge)
2. **Handle Urgent** — refunds processed same day; respond with policy + action taken
3. **Handle Access** — check `purchases` table for the email; if purchase exists, generate a fresh magic link via admin script; reply with link
4. **Handle Finance** — forward Dodo/Paddle transaction ID from DB; Dodo/Paddle are MoR so they own the invoice
5. **Handle General** — reply or defer

### Magic link generation for support (copy-paste script)
```js
// Run with: node --experimental-strip-types scripts/gen-magic-link.mjs user@example.com
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const email = process.argv[2];
const { data } = await supabase.auth.admin.generateLink({
  type: 'magiclink', email,
  options: { redirectTo: 'https://experiences-curated.com/auth/confirm?next=/' }
});
console.log(data.properties.action_link);
```

---

## Tier 3 — AI-assisted replies (when volume >20/week)

Build a simple tool:
- Paste the user's email into a UI
- Pulls their purchase record from DB automatically
- Claude drafts a reply using FAQ context + their purchase details
- You review, edit, send

Not worth building until query volume justifies it. Estimate: ~Month 3 post-launch.

---

## Wrong-email fix procedure

User paid with wrong email address:

1. Confirm purchase in `purchases` table — verify `paddleOrderId` matches
2. Update `email` in `purchases` to correct address
3. Update `email` in `public.users` if row exists
4. Update Supabase Auth user email via admin dashboard
5. Generate fresh magic link for correct email
6. Reply to user with link

---

## Status
- [ ] Auto-responder configured on hello@experiences-curated.com
- [ ] Gmail filters created (5 labels)
- [ ] FAQ page reviewed and covers top 5 query types
- [ ] `gen-magic-link.mjs` script created and tested
- [ ] Wrong-email fix procedure tested end-to-end
