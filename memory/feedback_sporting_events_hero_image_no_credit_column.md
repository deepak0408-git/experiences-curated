---
name: sporting-events-hero-image-no-credit-column
description: sporting_events.hero_image_url has no matching credit column, unlike experiences — CC BY/BY-SA event hero images go live with no attribution stored or displayed
metadata:
  type: project
---

`sportingEvents` (schema/database.ts) has `heroImageUrl` but no `heroImageCredit`/`heroImageAlt` — unlike `experiences`, which has both (`heroImageCredit`, `heroImageAlt`) and `circuitSeatingProfile`/similar tables that also carry a credit field. When a CC BY or CC BY-SA licensed image (requires attribution) is seeded as an event-level hero image via a `scripts/seed-<event>-event-hero.mjs` script, there is currently no DB field to store the required credit, and nothing in the app renders one for event-level heroes.

**Surfaced 10 Oct 2026**, seeding hero images for 5 GP events in one session from founder-supplied Wikimedia Commons URLs:
- Turkish GP 2027 — public domain (no attribution needed)
- Azerbaijan GP 2027 — CC BY 4.0, credit "Press Service of the President of the Republic of Azerbaijan" — **not stored**
- Austrian GP 2027 — CC BY 2.0, credit "Pedro Mendes (pedrik)" — **not stored**
- Bahrain GP 2026 — CC BY 2.0, credit "Emily Faulk" — **not stored** (this one replaced an existing LIVE hero image, confirmed with founder first)
- Portuguese GP 2027 — CC BY-SA 2.0, credit "Vitor Oliveira" — **not stored**

Each seed script leaves an inline comment + console.log noting the uncredited photographer, but that's not a real fix — it's just not losing the information.

**Why:** Legal/compliance risk is low-but-real (CC BY/BY-SA requires attribution; CC BY-SA additionally requires share-alike), and it's silently accumulating across events rather than being a one-off.

**How to apply:** Next time event hero images are touched in bulk, or if this becomes a recurring ask, consider either (a) adding `heroImageCredit`/`heroImageAlt` columns to `sportingEvents` mirroring `experiences`' pattern, and back-filling the 4 credits already known from this session, or (b) deciding attribution isn't needed for event-level (as opposed to experience-level) hero images and documenting that decision explicitly. Don't let this list grow past a handful of events before deciding one way or the other.
