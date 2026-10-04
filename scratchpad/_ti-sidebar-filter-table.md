# Ticket Intelligence sidebar filter audit — every live/built F1 event

Legend: **On-track?** = my human judgment of whether this is genuinely a GA/grandstand/hospitality/ticket-guide experience (the kind that should link to Ticket Intelligence). **T1 (experienceType=fan_experience)** = does signal 1 alone catch it. **T2 (spoke=tickets/luxury)** = does signal 2 alone catch it (only events present in EXPERIENCE_TO_SPOKE_BY_EVENT). **Covered (1 OR 2)** = final verdict.

## Abu Dhabi Grand Prix 2026
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| Abu Dhabi Hill — the Real Value Seat | fan_experience | YES (GA) | ✅ | ✅ (tickets) | ✅ |
| F1 Paddock Club — Pit-Lane Hospitality | fan_experience | YES | ✅ | ✅ (luxury) | ✅ |
| Main Grandstand — Start, Finish & Podium | fan_experience | YES | ✅ | ✅ (tickets) | ✅ |
| West Grandstand — the Braking-Zone Seat | fan_experience | YES | ✅ | ✅ (tickets) | ✅ |
| Skybridge Terrace — Suspended Over the Track | fan_experience | **NO** (hotel rooftop viewing perch, not a purchasable circuit seat) | ✅ (false positive) | ✅ (luxury — also mis-tagged) | ❌ FALSE POSITIVE (both signals) |
| Yas Marina Yacht Charter — Season's Closing Scene | fan_experience | **NO** (boat charter, not a seat) | ✅ (false positive) | ✅ (luxury — also mis-tagged) | ❌ FALSE POSITIVE (both signals) |
| Yasalam After-Parties | event | NO | ✅ correct exclude | — (not in table) | ✅ correctly excluded |
| First-Timer Orientation, Getting Around, etc. | activity/transit | NO | ✅ correct exclude | — | ✅ correctly excluded |

**Abu Dhabi verdict: T1 alone produces 2 false positives (Skybridge Terrace, Yacht Charter) — both ALSO mis-tagged `luxury` in T2, so combining doesn't catch this. Real gap.**

## Australian Grand Prix 2027
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| AusGP Ticket Guide | fan_experience | YES | ✅ | ✅ (tickets) | ✅ |
| Brabham/Fangio/Piastri/Vettel Grandstand | fan_experience | YES (×4) | ✅ | ✅ (tickets) | ✅ |
| General Admission — Park Pass & Hills | fan_experience | YES | ✅ | ✅ (tickets) | ✅ |
| F1 Paddock Club & Trackside Hospitality | fan_experience | YES | ✅ | ✅ (luxury) | ✅ |
| Arrival & Queue Guide | fan_experience | NO | ✅ (false positive) | ✅ (arrival — correctly NOT tickets/luxury) | ✅ correctly excluded by T2 |
| Fan Zone — Melbourne Walk & Fan Forum | fan_experience | NO | ✅ (false positive) | ✅ (arrival) | ✅ correctly excluded by T2 |
| Lakeside Festival — Concert Series | fan_experience | NO | ✅ (false positive) | — (not in table) | ❌ FALSE POSITIVE (T1 only, T2 silent) |
| First Timer's Guide | activity | NO | ✅ correct exclude | ✅ (first-timer-guide) | ✅ |
| Melbourne weather/coffee/etc | activity/dining | NO | ✅ correct exclude | — | ✅ |

**Australian GP verdict: T1 alone has 3 false positives; T2 correctly excludes 2 of them (arrival-tagged) but Lakeside Festival isn't in the table at all — silent gap.**

## Bahrain Grand Prix 2026 (Sepang)
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| F1 Paddock Club | fan_experience | YES | ✅ | ✅ (luxury) | ✅ |
| Grandstand F, Hill Stand C2, K1 Grandstand, Main Grandstand | fan_experience | YES (×4) | ✅ | ✅ (tickets) | ✅ |
| (no other fan_experience rows) | — | — | — | — | — |

**Bahrain GP verdict: clean, no false positives — every fan_experience row here is genuinely on-track.**

## Belgian Grand Prix 2026
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| Eau Rouge/Raidillon — Gold 3, Pouhon — Silver 3, Kemmel Straight GA | fan_experience | YES (×3) | ✅ | — (event not in table) | ⚠️ T1-only |
| Your Belgian GP Ticket Guide | fan_experience | YES | ✅ | — | ⚠️ T1-only |
| The Fan Zone at Raidillon | fan_experience | NO (general atmosphere/fan-zone piece, not a seat) | ✅ (false positive) | — | ❌ FALSE POSITIVE (T1 only, no T2 entry exists for this event at all) |

**Belgian GP verdict: classic-format event, not in EXPERIENCE_TO_SPOKE_BY_EVENT at all (that table is hub-and-spoke only) — T2 provides ZERO coverage here. 1 false positive from T1 alone (Fan Zone).**

## Hungarian Grand Prix 2026
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| F1 Fan Lounge, General Admission & Fan Zone, Paddock Club, Where to Sit, Ticket Guide | fan_experience | YES (×5) | ✅ | — (not in table) | ⚠️ T1-only |
| The Chicane — Where Laps Quietly Fall Apart | fan_experience | **AMBIGUOUS** (reads like an on-track storytelling piece about a corner, not a purchasable seat — needs title/body check) | ✅ (possible false positive) | — | ⚠️ UNCERTAIN |

**Hungarian GP verdict: also classic format, zero T2 coverage. "The Chicane" is a judgment call I can't resolve from title alone.**

## Italian Grand Prix 2027 (Monza)
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| Curva Grande GA, GA Lesmo/Ascari, Grandstand 1/5/22/26, Paddock Club & Champions Club | fan_experience | YES (×7) | ✅ | ✅ (tickets/luxury) | ✅ |
| The Fan Zone — Ascari to Parabolica | fan_experience | NO | ✅ (false positive) | ✅ (arrival — correctly excluded) | ✅ correctly excluded by T2 |
| The Tifosi — Ferrari's Red Army | fan_experience | NO (culture/atmosphere piece) | ✅ (false positive) | ✅ (first-timer-guide — correctly excluded) | ✅ correctly excluded by T2 |
| Trackside Corner Lounges & Villas | fan_experience | **YES, likely** (sounds like a real premium seating/hospitality product) | ✅ | — (not in table — newer experience, added after table built) | ⚠️ T1-only, T2 stale/missing |

**Italian GP verdict: T2 correctly resolves 2 of T1's false positives here, but 1 newer experience (Trackside Corner Lounges & Villas) isn't in the table yet — T2 coverage decays as new experiences get added without a table update.**

## Las Vegas Grand Prix 2026
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| F1 Paddock Club, Flamingo Zone GA, Practice & Qualifying tickets | fan_experience | YES (×3) | ✅ | ✅ (tickets/luxury) | ✅ |
| Heineken Silver Main Grandstand, Turn 3 Grandstand, West Harmon Grandstand | **sports_venue** | YES (×3) — genuine grandstands | ❌ MISSED (wrong type) | ✅ (tickets) | ✅ (saved by T2 only) |
| Race Week on the Strip — Free Parties | fan_experience | NO | ✅ (false positive) | — (not in table) | ❌ FALSE POSITIVE |
| T-Mobile Zone at Sphere — festival | fan_experience | NO | ✅ (false positive) | — (not in table) | ❌ FALSE POSITIVE |
| Watching From a Sportsbook | fan_experience | NO | ✅ (false positive) | — (not in table) | ❌ FALSE POSITIVE |
| First-Timer Orientation | transit | NO | ✅ correct exclude | ✅ (first-timer-guide) | ✅ |

**Las Vegas GP verdict: BIGGEST FINDING — 3 real grandstands are typed `sports_venue`, not `fan_experience`, so T1 MISSES them entirely; only T2 (spoke table) catches them. Also 3 T1 false positives with no T2 entry to correct them.**

## Mexico City Grand Prix 2026
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| F1 Paddock Club & Champions Club, Foro Sol, Ticket Guide, Where to Sit | fan_experience | YES (×4) | ✅ | ✅ (tickets/luxury) | ✅ |
| The Fan Zone & Race Week Culture | fan_experience | NO | ✅ (false positive) | — (not in table — table only has 16 of 21 entries) | ❌ FALSE POSITIVE |

**Mexico City GP verdict: 1 false positive, T2 table incomplete for this event too.**

## Qatar Grand Prix 2026
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| GA — Lusail Hill, Main/North Grandstand, Paddock/Champions Club, Ticket Guide, Lusail Hill Lounge | fan_experience | YES (×6) | ✅ | ✅ (tickets/luxury) | ✅ |
| Fan Zone — Simulators, Pit Stops, Free Concerts | fan_experience | NO | ✅ (false positive) | ✅ (arrival — correctly excluded) | ✅ correctly excluded by T2 |

**Qatar GP verdict: T2 correctly resolves the 1 T1 false positive.**

## São Paulo (Brazilian) Grand Prix 2026
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| Grandstand A/M, Heineken Village, Paddock/Champions Club, Ticket Guide | fan_experience | YES (×5) | ✅ | ✅ (tickets/luxury) | ✅ |
| (no false positives found) | — | — | — | — | — |

**Brazilian GP verdict: clean.**

## Singapore Grand Prix 2026
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| F1 Paddock Club, Grandstand/Walkabout ticket guide, Zone 4 Walkabout | fan_experience | YES (×3) | ✅ | ✅ (tickets/luxury) | ✅ |
| F1 Village — Zone 1 & 4 | fan_experience | **AMBIGUOUS** (fan-zone atmosphere, not a seat — likely false positive) | ✅ (likely false positive) | ✅ (arrival — correctly excluded) | ✅ correctly excluded by T2 |
| Padang Stage — Concerts | fan_experience | NO | ✅ (false positive) | ✅ (first-timer-guide — correctly excluded) | ✅ correctly excluded by T2 |
| Padang Grandstand, Stamford Grandstand, Turn 1 Grandstand | **sports_venue** | YES (×3) — genuine grandstands | ❌ MISSED (wrong type) | ✅ (tickets) | ✅ (saved by T2 only) |

**Singapore GP verdict: same `sports_venue` gap as Las Vegas — 3 real grandstands missed by T1, only caught by T2.**

## United States Grand Prix 2026
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| Champions Club, GA, Main Grandstand, Paddock Club, Turn 1 "Big Red", Turn 15 | fan_experience | YES (×6) | ✅ | ✅ (tickets/luxury) | ✅ |
| (no false positives found) | — | — | — | — | — |

**US GP verdict: clean.**

---

# Chinese GP 2027 / Japanese GP 2027 (built_hidden, in_review/published — real content exists, not yet activated)

## Chinese Grand Prix 2027
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| Ticket Guide, GA, Grandstand A/B/H/K, Paddock Club | fan_experience | YES (×6) | ✅ | — (not in EXPERIENCE_TO_SPOKE_BY_EVENT at all) | ⚠️ T1-only |
| Arrival & Entry Guide, Fan Zone & Off-Track Activities, First-Timer's Guide, Weather | fan_experience | NO (×4) | ✅ (4 false positives) | — | ❌ 4 FALSE POSITIVES |

**Chinese GP verdict: worst false-positive rate of any event — 4 of 10 fan_experience rows are non-track, and this event has zero T2 coverage (table entry doesn't exist yet).**

## Japanese Grand Prix 2027
| Experience | Type | On-track? | T1 | T2 | Covered |
|---|---|---|---|---|---|
| GA, Grandstand G/V1-V2/Q2, Ticket Guide, Hospitality Tiers | fan_experience | YES (×6) | ✅ | ✅ (tickets/luxury) | ✅ |
| First-Timer's Guide, GP Square & Fan Zones, Weather & What to Pack | fan_experience | NO (×3) | ✅ (3 false positives) | ✅ (first-timer-guide/arrival/weather — correctly excluded) | ✅ correctly excluded by T2 |

**Japanese GP verdict: T2 fully resolves all 3 T1 false positives here — best-case outcome, since this event's table entry is complete and recent (29 Sep 2026).**

---

# Summary — the 4 real failure modes found

1. **`sports_venue` false negatives** (Las Vegas ×3, Singapore ×3): real grandstands typed `sports_venue` instead of `fan_experience` — **T1 misses these entirely**; only T2 catches them, and only for events with a complete, current table entry.
2. **`fan_experience` false positives with NO T2 entry to correct them**: Abu Dhabi (Skybridge Terrace, Yacht Charter — worse, these are ALSO mis-tagged `luxury` in T2), Australian GP (Lakeside Festival), Belgian/Hungarian GP (classic format — T2 doesn't cover classic events at all), Mexico City (Fan Zone), Chinese GP (4 non-track rows, no T2 entry exists yet).
3. **T2 table incompleteness**: several events (Italian GP's "Trackside Corner Lounges & Villas", Mexico City missing 5 of 21 entries, Chinese GP missing entirely) show the curator table lags behind real seeded experiences — a structural staleness risk for ANY filter that leans on it.
4. **Classic-format events have zero T2 coverage by design** (Belgian GP, Hungarian GP) — `EXPERIENCE_TO_SPOKE_BY_EVENT` is hub-and-spoke only, so T1-only false positives are unresolvable for these two live events unless a third signal is added.

**Bottom line: neither signal alone is reliable, and even combined (T1 OR T2), real false positives survive on at least 4 events (Abu Dhabi, Australian GP, Belgian GP, Mexico City, Chinese GP) and a real false-negative class (`sports_venue`) only gets saved by T2, which itself isn't complete or current.** A title/slug keyword check (matching "Grandstand", "Paddock Club", "General Admission", "Ticket Guide", "Hospitality", "GA" as a second-tier signal) would likely close most of the remaining gaps, but that's the fragile approach I flagged earlier — worth deciding deliberately rather than defaulting to it.
