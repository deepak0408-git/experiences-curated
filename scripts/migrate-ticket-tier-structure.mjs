import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Redesigns planner_ticket_tier_cost from F1-specific enum values to
// sport-generic tier1-4 keys, per design doc "Ticket tier structure"
// (19 Jul 2026). Casts the column to text, remaps values, rebuilds the
// enum type cleanly rather than incrementally ADD VALUE-ing (avoids
// same-transaction restrictions on newly added enum values).

// 1. Cast the tier column to text so we can freely rewrite values and
//    swap the underlying type without enum constraints getting in the way.
await sql`ALTER TABLE planner_ticket_tier_cost ALTER COLUMN tier TYPE text`;
console.log("✓ Cast tier column to text");

// 2. Migrate existing rows: general_admission->tier1, grandstand->tier2,
//    premium_grandstand->tier3, hospitality->tier4. 'general' stays as-is.
await sql`UPDATE planner_ticket_tier_cost SET tier = 'tier1' WHERE tier = 'general_admission'`;
await sql`UPDATE planner_ticket_tier_cost SET tier = 'tier2' WHERE tier = 'grandstand'`;
await sql`UPDATE planner_ticket_tier_cost SET tier = 'tier3' WHERE tier = 'premium_grandstand'`;
await sql`UPDATE planner_ticket_tier_cost SET tier = 'tier4' WHERE tier = 'hospitality'`;
console.log("✓ Migrated existing rows to tier1-4");

// 3. Add the new eventTierLabel column.
await sql`ALTER TABLE planner_ticket_tier_cost ADD COLUMN IF NOT EXISTS event_tier_label VARCHAR(255)`;
console.log("✓ Added event_tier_label column");

// 4. Drop the old enum type and recreate it with the new value set.
await sql`DROP TYPE planner_ticket_tier`;
await sql`CREATE TYPE planner_ticket_tier AS ENUM ('tier1', 'tier2', 'tier3', 'tier4', 'general')`;
console.log("✓ Rebuilt planner_ticket_tier enum with tier1-4 + general");

// 5. Cast the tier column back to the (new) enum type.
await sql`ALTER TABLE planner_ticket_tier_cost ALTER COLUMN tier TYPE planner_ticket_tier USING tier::planner_ticket_tier`;
console.log("✓ Cast tier column back to enum type");

// 6. Create the new plannerTicketTierSportLabel table.
await sql`
  CREATE TABLE IF NOT EXISTS planner_ticket_tier_sport_label (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sport sport NOT NULL,
    tier_key planner_ticket_tier NOT NULL,
    default_label VARCHAR(100) NOT NULL,
    CONSTRAINT planner_ticket_tier_sport_label_sport_tier_unique UNIQUE (sport, tier_key)
  )
`;
console.log("✓ Created planner_ticket_tier_sport_label table");

await sql.end();
