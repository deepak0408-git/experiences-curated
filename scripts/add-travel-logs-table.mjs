import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

try {
  await sql`
    CREATE TABLE IF NOT EXISTS travel_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id),
      experience_id UUID NOT NULL REFERENCES experiences(id),
      visited_at DATE NOT NULL,
      rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      mood_tags TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  console.log("✓ travel_logs table created");

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS travel_logs_user_experience_idx
    ON travel_logs(user_id, experience_id)
  `;
  console.log("✓ unique index on (user_id, experience_id)");

  await sql`CREATE INDEX IF NOT EXISTS travel_logs_user_idx ON travel_logs(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS travel_logs_experience_idx ON travel_logs(experience_id)`;
  console.log("✓ indexes created");

} catch (err) {
  console.error("Error:", err.message);
} finally {
  await sql.end();
}
