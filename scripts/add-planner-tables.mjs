import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Creates the 6 new Season/Budget Planner (G3) tables — see
// docs/Season Budget Planner Tool G3 - Customer and Monetization Journey.txt
// for the full design brief. All new, additive — no existing table is
// altered by this script. Structure only; no rows are seeded here.

await sql`
  DO $$ BEGIN
    CREATE TYPE planner_tier AS ENUM ('budget', 'moderate', 'splurge', 'luxury', 'general');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
`;
await sql`
  DO $$ BEGIN
    CREATE TYPE planner_ticket_tier AS ENUM ('general_admission', 'grandstand', 'premium_grandstand', 'hospitality', 'general');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
`;
await sql`
  DO $$ BEGIN
    CREATE TYPE planner_time_window AS ENUM ('next_3mo', 'next_6mo', 'flexible');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
`;
await sql`
  DO $$ BEGIN
    CREATE TYPE planner_gate_action AS ENUM ('saved', 'compared', 'notified');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
`;
await sql`
  DO $$ BEGIN
    CREATE TYPE planner_drip_step AS ENUM ('immediate', 'day_3', 'day_10', 'notify_live');
  EXCEPTION WHEN duplicate_object THEN null; END $$;
`;
console.log("✓ 5 planner enums created (or already existed)");

await sql`
  CREATE TABLE IF NOT EXISTS planner_flight_cost (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id uuid NOT NULL REFERENCES destinations(id),
    origin_market varchar(100) NOT NULL,
    seasonal_band varchar(20) NOT NULL,
    cost_low numeric(10, 2) NOT NULL,
    cost_high numeric(10, 2) NOT NULL,
    last_updated timestamp NOT NULL DEFAULT now(),
    CONSTRAINT planner_flight_cost_route_season_unique UNIQUE (destination_id, origin_market, seasonal_band)
  )
`;
console.log("✓ planner_flight_cost created (or already existed)");

await sql`
  CREATE TABLE IF NOT EXISTS planner_hotel_tier_cost (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id uuid NOT NULL REFERENCES destinations(id),
    tier planner_tier NOT NULL,
    cost_low numeric(10, 2) NOT NULL,
    cost_high numeric(10, 2) NOT NULL,
    last_updated timestamp NOT NULL DEFAULT now(),
    CONSTRAINT planner_hotel_tier_cost_dest_tier_unique UNIQUE (destination_id, tier)
  )
`;
console.log("✓ planner_hotel_tier_cost created (or already existed)");

await sql`
  CREATE TABLE IF NOT EXISTS planner_ticket_tier_cost (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sporting_event_id uuid NOT NULL REFERENCES sporting_events(id),
    tier planner_ticket_tier NOT NULL,
    cost_low numeric(10, 2) NOT NULL,
    cost_high numeric(10, 2) NOT NULL,
    last_updated timestamp NOT NULL DEFAULT now(),
    CONSTRAINT planner_ticket_tier_cost_event_tier_unique UNIQUE (sporting_event_id, tier)
  )
`;
console.log("✓ planner_ticket_tier_cost created (or already existed)");

await sql`
  CREATE TABLE IF NOT EXISTS planner_destination_bands (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id uuid NOT NULL UNIQUE REFERENCES destinations(id),
    local_travel_low numeric(10, 2) NOT NULL,
    local_travel_high numeric(10, 2) NOT NULL,
    food_per_day_low numeric(10, 2) NOT NULL,
    food_per_day_high numeric(10, 2) NOT NULL,
    last_updated timestamp NOT NULL DEFAULT now()
  )
`;
console.log("✓ planner_destination_bands created (or already existed)");

await sql`
  CREATE TABLE IF NOT EXISTS planner_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email varchar(255) NOT NULL,
    sports sport[] NOT NULL,
    budget_min numeric(10, 2) NOT NULL,
    budget_max numeric(10, 2) NOT NULL,
    time_window planner_time_window NOT NULL,
    trip_length_days smallint NOT NULL,
    origin_market varchar(100) NOT NULL DEFAULT 'unspecified',
    shortlisted_event_ids uuid[] NOT NULL DEFAULT '{}',
    gate_action planner_gate_action NOT NULL,
    gate_action_event_ids uuid[] NOT NULL DEFAULT '{}',
    created_at timestamp NOT NULL DEFAULT now()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS planner_sessions_email_idx ON planner_sessions(email)`;
console.log("✓ planner_sessions created (or already existed)");

await sql`
  CREATE TABLE IF NOT EXISTS planner_drip_sent (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    planner_session_id uuid NOT NULL REFERENCES planner_sessions(id),
    sequence_step planner_drip_step NOT NULL,
    sent_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT planner_drip_sent_session_step_unique UNIQUE (planner_session_id, sequence_step)
  )
`;
console.log("✓ planner_drip_sent created (or already existed)");

const tables = await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name LIKE 'planner_%'
  ORDER BY table_name
`;
console.log("\nPlanner tables now in the database:");
console.table(tables);

await sql.end();
