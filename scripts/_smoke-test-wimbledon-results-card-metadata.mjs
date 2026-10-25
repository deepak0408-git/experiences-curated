import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import {
  sessionExplanation,
  wimbledonDaySessionExplanation,
  seatingPresentation,
  experiencePresentation,
  arenaDisplayName,
} from "../app/ticket-intelligence/tennis/[slug]/_lib/presentationMappings.ts";

// P1 regression, 25 Oct 2026: a reserved Wimbledon court (sessionCode ===
// null, same as Ground Pass) was wrongly shown with Ground Pass "Flexible
// timing" wording on the results card, because ResultCard.tsx/
// TeaserResult.tsx inferred Ground-Pass-ness from sessionCode === null
// instead of checking arenaCode === "GP" directly. Fixed by adding
// wimbledonDaySessionExplanation() and keying both components' isGroundPass
// checks off arenaCode. This test reproduces the fixed session-resolution
// logic exactly (mirrors ResultCard.tsx's `isGroundPass`/`session` lines)
// against every real option row, offline — no browser, no Next.js render.

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const AO_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6";
const RG_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

let failures = 0;
function check(label, pass) {
  if (pass) {
    console.log(`[PASS] ${label}`);
  } else {
    console.log(`[FAIL] ${label}`);
    failures++;
  }
}

function resolveSession(arenaCode, sessionCode) {
  const isGroundPass = arenaCode === "GP";
  return isGroundPass ? null : sessionExplanation(sessionCode) ?? wimbledonDaySessionExplanation();
}

// 1. The exact reported reproduction scenario: Wimbledon hero = Centre
// Court, reserved seating, flexible tournament mode. Confirms the card no
// longer shows Ground Pass wording for a reserved court.
const [centreCourtOption] = await sql`
  SELECT option_number, arena_code, session_code, seating_code
  FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID} AND arena_code = 'CC'
  ORDER BY option_number LIMIT 1
`;
const ccSession = resolveSession(centreCourtOption.arena_code, centreCourtOption.session_code);
check(
  "Centre Court (reserved court) no longer resolves to Ground Pass 'Flexible timing'",
  ccSession !== null && ccSession.value === "Day session"
);
check(
  "Centre Court session explanation does not mention Ground Pass",
  !ccSession.explanation.toLowerCase().includes("ground pass")
);

// 2. Every non-GP Wimbledon option (all 22) must resolve to the Wimbledon
// day-session label, never null, never Ground Pass wording.
const allWimbledonOptions = await sql`
  SELECT option_number, arena_code, session_code, seating_code
  FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID}
  ORDER BY option_number
`;
const nonGpOptions = allWimbledonOptions.filter((o) => o.arena_code !== "GP");
const gpOptions = allWimbledonOptions.filter((o) => o.arena_code === "GP");

check("Found 22 non-Ground-Pass Wimbledon options", nonGpOptions.length === 22);
check("Found 3 Ground Pass Wimbledon options", gpOptions.length === 3);

let reservedCourtMismatches = [];
for (const opt of nonGpOptions) {
  const s = resolveSession(opt.arena_code, opt.session_code);
  if (s === null || s.value !== "Day session" || s.explanation.toLowerCase().includes("ground pass")) {
    reservedCourtMismatches.push({ option_number: opt.option_number, arena_code: opt.arena_code, resolved: s });
  }
}
check(
  "All 22 reserved-court Wimbledon options resolve to 'Day session', never Ground Pass wording",
  reservedCourtMismatches.length === 0
);
if (reservedCourtMismatches.length) console.log(JSON.stringify(reservedCourtMismatches, null, 2));

// 3. Ground Pass options must still resolve to null (→ card's "Flexible
// timing" / Ground Pass branch) — never the new Wimbledon day-session text.
let gpMismatches = [];
for (const opt of gpOptions) {
  const s = resolveSession(opt.arena_code, opt.session_code);
  if (s !== null) gpMismatches.push({ option_number: opt.option_number, resolved: s });
}
check("All 3 Ground Pass Wimbledon options still resolve to null (Ground Pass branch, unaffected)", gpMismatches.length === 0);

// 4. Internal consistency: seating/experience presentation still key off
// arenaCode/seatingCode exactly as before — this fix must not have touched
// those paths. Every option must resolve without throwing.
let presentationErrors = [];
for (const opt of allWimbledonOptions) {
  try {
    const fullOption = { arenaCode: opt.arena_code, seatingCode: opt.seating_code ?? null };
    seatingPresentation(fullOption);
    experiencePresentation(opt.arena_code);
    arenaDisplayName(fullOption);
  } catch (err) {
    presentationErrors.push({ option_number: opt.option_number, error: err.message });
  }
}
check("All 25 Wimbledon options have internally consistent seating/experience metadata (no throws)", presentationErrors.length === 0);
if (presentationErrors.length) console.log(JSON.stringify(presentationErrors, null, 2));

// 5. Australian Open and French Open unaffected: their real sessionCode
// values (Day/Night) must still resolve through sessionExplanation() alone
// — arenaCode is never "GP" for their day/night rows, and the ?? fallback
// never triggers since sessionExplanation() never returns null for a real
// Day/Night code.
const [aoRow] = await sql`
  SELECT arena_code, session_code FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${AO_EVENT_ID}
  AND session_code IS NOT NULL LIMIT 1
`;
if (aoRow) {
  const aoSession = resolveSession(aoRow.arena_code, aoRow.session_code);
  check(
    "Australian Open's real Day/Night session rows still resolve via sessionExplanation(), unaffected",
    aoSession !== null && (aoSession.value === "Day session" || aoSession.value === "Night session")
  );
} else {
  console.log("[SKIP] No Australian Open row with non-null session_code found to verify — check slug");
}

const [rgRow] = await sql`
  SELECT arena_code, session_code FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${RG_EVENT_ID}
  AND session_code IS NOT NULL LIMIT 1
`;
if (rgRow) {
  const rgSession = resolveSession(rgRow.arena_code, rgRow.session_code);
  check(
    "French Open's real Day/Night session rows still resolve via sessionExplanation(), unaffected",
    rgSession !== null && (rgSession.value === "Day session" || rgSession.value === "Night session")
  );
} else {
  console.log("[SKIP] No French Open row with non-null session_code found to verify — check slug");
}

const [aoGpRow] = await sql`
  SELECT arena_code, session_code FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${AO_EVENT_ID}
  AND arena_code = 'GP' LIMIT 1
`;
if (aoGpRow) {
  const aoGpSession = resolveSession(aoGpRow.arena_code, aoGpRow.session_code);
  check("Australian Open Ground Pass still resolves to null (unaffected)", aoGpSession === null);
} else {
  console.log("[SKIP] No Australian Open Ground Pass row found to verify — check slug");
}

await sql.end();

if (failures > 0) {
  console.log(`\n${failures} FAILURE(S)`);
  process.exit(1);
} else {
  console.log("\nALL RESULTS-CARD METADATA SMOKE TESTS PASS");
}
