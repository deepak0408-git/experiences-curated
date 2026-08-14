import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const client = postgres(process.env.DIRECT_URL, { ssl: "require", prepare: false });

await client`
  CREATE TABLE IF NOT EXISTS "business_partners" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "organization_name" varchar(255) NOT NULL,
    "contact_email" varchar(255) NOT NULL,
    "contact_name" varchar(255),
    "partner_type" varchar(30) NOT NULL,
    "status" varchar(20) DEFAULT 'contacted' NOT NULL,
    "notes" text,
    "first_contacted_at" timestamp,
    "last_contacted_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "business_partners_email_unique" UNIQUE("contact_email")
  );
`;

console.log("✓ business_partners table created");
await client.end();
