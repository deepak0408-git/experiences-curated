import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";

const rows = await sql`
  SELECT seat_name, ticket_tier_cost_id AS tier_id, action_tags, covered, reserved_seating, min_age, seat_type
  FROM circuit_seating_profile WHERE sporting_event_id = ${EVENT_ID}
`;
const tierRows = await sql`SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}`;
const tierById = Object.fromEntries(tierRows.map(r => [r.id, r.tier]));

const seats = rows.map(r => ({
  seatName: r.seat_name,
  seatType: r.seat_type,
  actionTags: r.action_tags,
  covered: r.covered,
  reservedSeating: r.reserved_seating,
  minAge: r.min_age,
  tier: tierById[r.tier_id] ?? null,
}));

// Replicate scoreSeat logic inline (simplified, matching scoreSeats.ts)
const TIER_RANK = { tier1: 0, tier2: 1, tier3: 2, tier4: 3 };
const answers = { q1: "overtaking", q2: "flexible", q3: "preferred", q4: "solo_friends", q5: "fan_zones", q7: "balanced" };

function score(seat) {
  let s = 0;
  const actionMatch = { overtaking: ["overtaking"], start_grid: ["start_grid","podium_atmosphere"], high_speed_or_technical: ["high_speed","technical_corner"], atmosphere: [] };
  const wanted = actionMatch[answers.q1] ?? [];
  const matched = seat.actionTags.filter(t => wanted.includes(t));
  if (matched.length) s += 3 * matched.length;
  if (answers.q2 === "flexible") {
    if (seat.seatType === "festival_lawn") s += 2;
    else if (seat.seatType === "grandstand" && seat.reservedSeating === false) s += 0.5;
  }
  if (answers.q3 === "preferred" && seat.covered === true) s += 1;
  if (answers.q5 === "fan_zones" && seat.seatType === "festival_lawn") s += 2;
  const tr = seat.tier ? TIER_RANK[seat.tier] : null;
  if (tr !== null && answers.q7 === "balanced") s += (tr === 1 || tr === 2) ? 1.5 : 0;
  return s;
}

const scored = seats.map(s => ({ name: s.seatName, score: score(s), tags: s.actionTags.join(",") })).sort((a,b) => b.score - a.score);
console.table(scored);
await sql.end();
