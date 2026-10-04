import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import crypto from "crypto";

const sql = postgres(process.env.DIRECT_URL);

const EVENT_SLUG = "singapore-grand-prix";
const token = crypto.randomBytes(32).toString("hex");

const [row] = await sql`
  UPDATE sporting_events
  SET pre_trip_brief_live_at = NULL,
      pre_trip_brief_approval_token = ${token}
  WHERE slug = ${EVENT_SLUG}
  RETURNING slug
`;

if (!row) {
  console.error("✗ No row updated — check event slug:", EVENT_SLUG);
} else {
  console.log("✓ Token set for:", row.slug);
  console.log("TOKEN:", token);
}

await sql.end();
