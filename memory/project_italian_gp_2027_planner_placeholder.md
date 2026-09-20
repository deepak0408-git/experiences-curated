---
name: project_italian_gp_2027_planner_placeholder
description: Italian GP 2027 planner Flights/Hotels/Tickets data is a copy of 2026 real data, not fresh 2027 research — real research pass pending
metadata:
  type: project
---

Italian GP 2027 (3-5 Sep 2027) planner cost data — `planner_flight_cost` (49
rows), `planner_hotel_tier_cost` (4 rows), `planner_ticket_tier_cost` (4
rows), all `edition_year: 2027` — is currently a **direct copy of the real
2026 research**, not genuine 2027 pricing. `planner_destination_bands` is
untouched (not edition-scoped).

**Why:** Italian GP's `sportingEvents.editionYear` had already rolled to
2027 by 19 Sep 2026, but the event needed a live planner entry now. The real
2027 flight search window (~29 Aug–10 Sep 2027) is ~11.5 months from the
research date — past Google Flights' confirmed ~10-month booking horizon
(live-probed 19 Sep 2026: Amsterdam→Milan returned "date too far in the
future" / 0 results on Google Flights; Kayak alone returned real data).
Rather than seed single-source or wait with no live data, the founder
explicitly chose to copy 2026's numbers forward as an interim placeholder.

**How to apply:** Re-run real 2027 research (Flights first, since that's
the blocker — Hotels/Tickets don't have the same horizon issue and could be
redone sooner) once Google Flights' booking horizon opens for the real
dates, roughly **mid-to-late Nov 2026 onward**. Before inserting fresh 2027
rows, DELETE the placeholder rows this copy created (script:
`scripts/seed-italian-gp-2027-copy-2026-placeholder.mjs` — has the exact
scope/logic) to avoid unique-constraint collisions on
(destination/event + tier/season + edition_year). Do not treat the current
2027 numbers as real when reporting live pricing state — they are 2026
prices relabeled, a known, deliberate, temporary gap.
