# E|C Trip Intelligence — Incremental Developer Handoff

**Scope:** Apply these changes to the **existing deployed/local Trip Intelligence implementation** and the **original developer handoff v1**. This is **not** a replacement application or a new database schema. The existing 24 Grand Prix remain eligible recommendation candidates, including Bahrain scored against historic **Sakhir** evidence. Do not change the questionnaire, event identifiers, existing results layout, or the 24-race universe.

## Files in this handoff (only three)

1. `README.md` — this change specification, rollout guidance and results footnote.
2. `grand-prix-characteristic-ratings.patch.json` — **only three** approved subdimension rating changes, with the correctly recalculated parent characteristic scores. This is a **data patch**, not a replacement for the 24-event master.
3. `matching-rubric.patch.json` — approved question-option mapping changes, street-circuit ranking/safeguard policy, and final-results explanation specification. This is a **configuration/logic patch**, not a complete engine or a database migration.

> These are JSON patches expressed as keyed updates and implementation instructions, **not** RFC 6902 JSON Patch operations or SQL scripts. Apply them to the existing database/configuration using the project's current storage architecture. Do not create new database tables or import them as complete replacements.

## A. Grand Prix characteristics: three approved updates

| `sporting_event_id` | Subdimension | Before | After | Derived characteristic before → after |
|---|---|---:|---:|---|
| `canada` | C07B Circuit Access & Logistics | 5 | **4** | C07 **5.0 → 4.4** |
| `singapore` | C07B Circuit Access & Logistics | 5 | **4** | C07 **5.0 → 4.4** |
| `azerbaijan` | C01A Racing Action | 5 | **4** | C01 **4.5 → 4.0** |

Recalculate C01/C07 from their existing subdimension weights; do not treat overall characteristics as independent source scores. **All other subdimension scores and C10 affordability values stay unchanged.** All 24 events stay in the database; Bahrain continues to use Sakhir data.

## B. Matching rubric: approved incremental changes

**Q2 = `racing_circuit`:** replace 75% aggregate C01 + 25% C05A with **60% C01A Racing Action / 20% C01B Circuit Character / 20% C05A Viewing Quality**.

**Q3:** `festival` = 95% C09B + 5% C09A; `glamour` = 95% C04B + 5% C04A; `fan_experience` = 95% C09A + 5% C09B. `crowds`, `relaxed`, and all other Q3 behaviour unchanged.

**Q6:** `very` = 20% C07A + 80% C07B; `quite` = 30% C07A + 70% C07B. Preserve existing Q6 `quite` strength multiplier **0.65**. Other Q6 answers unchanged.

**Q2 = `street_spectacle`:** preserve its existing 80% C04A + 20% C01 mapping, **plus a +0.15 experience-fit score bonus** to qualifying genuine street circuits only. The approved candidate set is `monaco`, `singapore`, `las-vegas`, `saudi-arabia`, `azerbaijan`, `spain-madrid` (Madrid is a hybrid; maintain this explicit approved classification unless separately reviewed). Do not count Melbourne or Miami toward this strict street-circuit rule.

**Street-circuit alternative safeguard:** After the normal experience-first shortlist and Q8 blending, if Q2 is `street_spectacle` and the initial top three contain no qualifying street circuit, insert the **highest final-blended-score qualifying street circuit already eligible under the 0.30 experience-fit shortlist**, replacing the third recommendation. Keep the first and second recommendations unchanged. If none qualifies within the shortlist, **do not force an insertion**. Never insert outside the existing 0.30 eligibility band. **No affordability veto:** even when Q8 is `major` or `quite`, a qualifying street circuit may appear as an alternative despite a higher cost. The cost compromise must be transparent in the result explanation.

**Everything else unchanged:** 8 questions/options; question budgets; 15% neutral baseline / 85% preference blend; active-question redistribution; experience-fit shortlist tolerance **0.30**, minimum-three fallback; Q8 cost influence (major 25%, quite 12.5%, flexible/not_deciding 0); C10 cost model; other question mappings; three-result presentation; existing static event insights. Street bonus applies to experience fit, **not** to C10 affordability or raw characteristic ratings.

## C. Final results: one concise explanatory footnote

**Keep existing explanations** beneath the matched winner and second/third alternatives, including why each matches the fan and why the first choice outranks the others. **Do not replace them with new explanation cards.** Add one understated footnote **at the end of the three recommendations** (not repeated under every event):

> **How these three were chosen:** We balance your answers to find the strongest overall match and two worthwhile alternatives. An alternative may particularly reflect an experience you prioritised, even when that involves trade-offs in cost, comfort or convenience. Review each recommendation's reasons and trade-offs before deciding.

This note should be visible without a separate click and should not expose internal numerical weights. If an alternative was selected through the street-circuit safeguard, its existing per-event explanation should truthfully flag the experience benefit and any material affordability compromise (e.g., Las Vegas for a price-sensitive street-circuit fan). **Do not imply that the safeguard-selected third event has a higher overall blended score than the option it displaced.** The footnote is generic; individual reasons must be computed from the actual questionnaire and results, not fabricated.

## D. Integration and acceptance checks

1. Back up current config/data. Match existing events by `sporting_event_id`, not name; preserve the `trip_intelligence_` naming convention wherever applicable.
2. Apply only the three ratings in `grand-prix-characteristic-ratings.patch.json`; verify source subdimensions and recalculated derived scores. All other ratings and all 24 event records must be byte/logically unchanged except pre-existing serialization side effects.
3. Apply only the rubric overrides and street rule in `matching-rubric.patch.json`. The JSON describes the intended algorithm; map it onto the existing engine rather than replacing unrelated engine code.
4. Recompute rankings from the updated source subdimensions; in particular, ensure C01A/C01B are available directly to the Q2 rubric and C07B is reflected in C07.
5. Test street preference with and without a qualifying event in the 0.30 shortlist. The safeguard must never change the hero or insert an event outside the shortlist; keep the original minimum-three fallback policy.
6. Regression-test Q8 `major` and `quite`: **do not add an affordability veto** to the street alternative. Budget-conscious street-circuit profiles may legitimately retain Las Vegas as third option; describe its cost trade-off.
7. Test Q2 racing 60/20/20, Q3 95/5, Q6 very 20/80 and quite 30/70, and unchanged options (including relaxed and weather comfort). Ensure no duplicate top-three events.
8. Confirm existing first/second/third explanatory text remains; add the single results footnote at the bottom. Do not add new result cards or alter the page layout beyond this small note.
9. Keep deployment gated on developer/AI-agent review and regression testing. **Nothing in this package has been deployed.**

**Validation context:** Previous synthetic 5,000-profile tests guided these decisions, but they are not real-user satisfaction or accuracy guarantees. Do not treat exact example rankings as immutable if production tie-breaking or data differ; verify logic and score consistency.
