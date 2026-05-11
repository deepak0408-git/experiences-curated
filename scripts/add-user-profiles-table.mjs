import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const client = postgres(process.env.DIRECT_URL, { ssl: "require" });

await client`
  CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    archetype VARCHAR(50),
    quiz_answers JSONB,
    quiz_completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )
`;

await client`CREATE INDEX IF NOT EXISTS user_profiles_user_idx ON user_profiles(user_id)`;
await client`CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email)`;

console.log("✓ user_profiles table created");
await client.end();
