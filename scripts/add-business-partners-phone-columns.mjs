import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const client = postgres(process.env.DIRECT_URL, { ssl: "require", prepare: false });

await client`
  ALTER TABLE "business_partners"
    ADD COLUMN IF NOT EXISTS "phone_1" varchar(30),
    ADD COLUMN IF NOT EXISTS "phone_2" varchar(30);
`;

console.log("✓ phone_1 and phone_2 columns added to business_partners");
await client.end();
