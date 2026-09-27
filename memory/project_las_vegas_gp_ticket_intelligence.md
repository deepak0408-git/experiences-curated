---
name: project_las_vegas_gp_ticket_intelligence
description: Las Vegas GP Ticket Intelligence — 17 seats seeded, FullResult.tsx wired
metadata:
  type: project
---

Las Vegas GP (event ID `cd5785a7-d37c-4d4b-a545-a8b8e28eac57`) Ticket
Intelligence built 27 Sep 2026, via [[feedback_f1_tickets_reseller_verification]]'s
parent skill (`ticket-intelligence-researcher`).

**17 seats seeded** to `circuit_seating_profile`
(`scripts/seed-las-vegas-gp-circuit-seating.mjs`): 5 grandstands (Heineken
Silver Main Grandstand, Turn 3, West Harmon, T-Mobile Grandstands, Hello
Kitty Grandstand), 3 GA zones (Flamingo, T-Mobile, Heineken GA+), 9
hospitality products (Turn 3 Club, SkyBox, Club Paris, HGV Clubhouse,
Trackside Tavern at Paddock Club Rooftop, Gordon Ramsay at F1 Garage,
Paddock Club, House 44, Legend).

**Excluded by founder decision** (not sourcing gaps — all 4 are real,
officially confirmed products): Bellagio Fountain Club ($8,400 3-day), Wynn
Grid Club ($25,997 3-day), TGR Haas F1 Team Club Suite, BWT Alpine Team
Suite.

**Full real inventory is ~22 products** — only 7 were previously reflected
in `planner_ticket_tier_cost`'s 4 tiers + 6 pre-existing published
experiences. This circuit has an unusually deep hospitality lineup (9
products after exclusions) vs. other seeded F1 events.

**§5 wiring done:** `FullResult.tsx`'s `CIRCUIT_MAP_BY_EVENT` and
`RESELLER_LINKS_BY_EVENT` both got a `las-vegas-grand-prix` entry (map
reused from existing `MapSpoke.tsx` R2 asset; reseller copy copied verbatim
from `TicketsSpoke.tsx`'s "Where to actually buy your ticket" block).

**§6 name-collision, flagged and resolved:** seeded seats named "Paddock
Club" and "House 44 at F1 Paddock Club" inherit the GLOBAL
`PRESTIGE_SEAT_NAMES`/`STAR_OVERRIDE_BY_SEAT_NAME` 5-star treatment from an
earlier event (same known gap as [[project_qatar_gp_hub_and_spoke_status]]'s
skill note — maps are keyed by seat name only, not per-event). Founder
decision 27 Sep 2026: accept as-is, directionally correct for Las Vegas too
(Paddock Club really is this circuit's top F1-Experiences-branded tier). No
map changes made. "Legend" ($21,268 ceiling, Las Vegas's real top price in
that shared tier4 band) was considered for its own prestige entry but
explicitly left out this build.

**Known honest gaps (NULL, not guessed):**
- `covered` on Heineken Silver Main Grandstand (own copy doesn't state it)
  and T-Mobile Grandstands (fanamp.com says covered, oversteer48.com says
  uncovered — directly conflicting, no tiebreak source found).
- `singleDayAvailable` on Heineken GA+, HGV Clubhouse, Trackside Tavern,
  Gordon Ramsay at F1 Garage, Hello Kitty Grandstand — 3-day pricing
  well-sourced, single-day status not confirmed either way.

**Still open (not part of this build):** §5's map/reseller entries are the
only code wiring needed beyond the seed script — `hasTicketIntelligence`
and the hub page's "Find your seat" section activate automatically once
seat rows exist.
