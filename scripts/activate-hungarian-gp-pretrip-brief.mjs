import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";

const lines = [
  "Expect temperatures in the high 20s by day, dropping into the teens at night. Most rain is a quick shower, not a washout, but this week is usually the wettest stretch of the month. Bring something for rain, skip the full waterproof.",
  "Take the M2 to Örs vezér tere, HÉV toward Kerepes, then the free shuttle to Gate 3. Nothing flagged on the transport authority's disruption list for race weekend as of now.",
  "New paddock, new pit building, and a rebuilt grandstand across the front straight, now sitting higher for a clearer view of the pit straight. If you're in a covered seat, expect a different ticket tier than last year, the cheap rows there are gone.",
];

try {
  const result = await client`
    UPDATE sporting_events
    SET
      pre_trip_brief_lines = ${lines},
      pre_trip_brief_live_at = NOW(),
      pre_trip_brief_updated_at = NOW()
    WHERE id = ${EVENT_ID}
    RETURNING id, name, pre_trip_brief_live_at
  `;
  console.log("✓ Activated:", result[0]);
} catch (e) {
  console.error("✗ FAILED:", e.message);
} finally {
  await client.end();
}
