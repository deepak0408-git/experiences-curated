import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";

const lines = [
  "Weather: Late July in Budapest regularly pushes past 30°C, with afternoon storms that can arrive with little warning. Pack sun protection and water for the Hungaroring's natural bowl, which has limited shade, plus a light waterproof just in case. Check accuweather.com/en/hu/budapest/187423/weather-forecast/187423 in the days before you travel.",
  "Transport: From Budapest, take the M2 metro to Örs vezér tere, then the HÉV suburban rail toward Kerepes, then the free shuttle bus to Gate 3 — a standard BKK ticket (bkk.hu) covers the metro and HÉV legs. Budget 60-90 minutes each way, and build in extra time after the race, the crowd surge back into Budapest is heaviest in the hour after the chequered flag.",
  "New this year: This is the Hungaroring's calendar spot in its usual mid-to-late July window, still one of the most affordable weekends on the F1 calendar with General Admission tickets from around €72 for the full weekend. Check formula1.com/en/racing/2026/hungary or the Formula 1 app for the latest confirmed session times.",
];

await client`
  UPDATE sporting_events
  SET
    pre_trip_brief_lines = ${lines},
    pre_trip_brief_updated_at = NOW()
  WHERE id = ${EVENT_ID}
`;

console.log("✓ Pre-trip brief lines seeded (dormant — not activated, event is 6+ weeks out)");

await client.end();
