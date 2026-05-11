import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const client = postgres(process.env.DIRECT_URL, { ssl: "require" });

await client`
  CREATE TABLE IF NOT EXISTS pro_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    email VARCHAR(255) NOT NULL,
    paddle_subscription_id VARCHAR(100) NOT NULL UNIQUE,
    paddle_customer_id VARCHAR(100),
    paddle_price_id VARCHAR(100) NOT NULL,
    billing_cycle VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    current_period_end TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )
`;

await client`CREATE INDEX IF NOT EXISTS pro_subscriptions_user_idx ON pro_subscriptions(user_id)`;
await client`CREATE INDEX IF NOT EXISTS pro_subscriptions_email_idx ON pro_subscriptions(email)`;

console.log("✓ pro_subscriptions table created");
await client.end();
