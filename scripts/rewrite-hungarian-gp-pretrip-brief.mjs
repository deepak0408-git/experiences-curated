import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";

const lines = [
  "Weather: Check accuweather.com/en/hu/budapest/187423/weather-forecast/187423 in the 2-3 days before you travel rather than relying on a general seasonal average, late July storms here can be highly localised and the forecast a week out is a poor guide to race day itself.",
  "Transport: Confirm this year's shuttle bus operating hours at f1hungary.com before you travel, they vary slightly year to year and by session day, and don't assume last year's published times still apply.",
  "This year: Hungary is the final race before F1's summer break, which means genuine storylines are in play going into the weekend, driver market speculation tends to peak around this race specifically since contract news often breaks right before teams and drivers scatter for the break. Check formula1.com/en/racing/2026/hungary or the F1 app in the days before you travel for grid and session-time confirmations, and don't be surprised if team news dominates the build-up more than usual for a mid-season round.",
];

await client`
  UPDATE sporting_events
  SET
    pre_trip_brief_lines = ${lines},
    pre_trip_brief_updated_at = NOW()
  WHERE id = ${EVENT_ID}
`;

console.log("✓ Pre-trip brief rewritten — now forward-looking rather than restating experience content");

await client.end();
