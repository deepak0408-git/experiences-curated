# Operations Skills — Experiences | Curated

This folder contains operational skills for running the platform post-launch.
Each skill is a repeatable process that can be executed independently.

---

## Skills Index

| Skill file | What it does | Frequency |
|---|---|---|
| [weekly-revenue-report.md](weekly-revenue-report.md) | Build + maintain the automated weekly P&L email cron | One-time setup; runs every Monday |
| [stuck-buyer-rescue.md](stuck-buyer-rescue.md) | Cron that re-sends magic links to buyers who never signed in | One-time setup; runs daily |
| [pre-trip-brief-activation.md](pre-trip-brief-activation.md) | Scheduled activation of pre-trip briefs without a manual redeploy | Per event |
| [support-triage.md](support-triage.md) | Daily support workflow — auto-responder, Gmail filters, AI-assisted replies | Daily |

---

## Principles

- **Touchless by default.** Every repeatable task should run automatically. Manual steps are only for decisions that require human judgement.
- **Revenue first.** Anything that touches a purchase, a stuck buyer, or a failed webhook is highest priority.
- **One skill per concern.** Keep skills focused — a skill that does two things is two skills waiting to be written.
- **Always test on localhost before deploying.** Crons can be triggered manually via the Vercel dashboard for one-off testing.

---

## Environment notes

- Cron jobs: defined in `vercel.json` → `crons` array. Handler routes live in `app/api/cron/`.
- Cron auth: all cron routes must verify `Authorization: Bearer $CRON_SECRET` header.
- Email: all outbound email via Resend API (`RESEND_API_KEY`). From address: `hello@experiences-curated.com`.
- DB: always import from `@/lib/db` — never instantiate postgres directly.
