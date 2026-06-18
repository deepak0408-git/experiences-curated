import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";

const lines = [
  "Weather: Late June into July 2026 is running hotter than usual — highs of 30–35°C are forecast for the opening weekend, with above-average temperatures likely throughout. Pack SPF and a water bottle as standard, and bring a light layer for evenings. Rain is possible but the outlook is drier than a typical Wimbledon fortnight; check the Met Office forecast the morning you travel rather than assuming.",
  "Transport: District line direct to Wimbledon station is the cleanest option. South Western Railway from Waterloo takes around 20 minutes but check SWR JourneyCheck the morning you travel — Wandsworth Town is skipping services Mon–Thu between 11:00–14:00 until 26 July, and Clapham Junction's footbridge is reduced to single-file while upgrade work runs until late 2027, so allow extra time if changing there.",
  "New this year — video review: Wimbledon is introducing video review technology for the first time in its 148-year history. Players can ask the chair umpire to review disputed incidents — double bounces, racket touches, hindrance — with no limit on requests. Centre Court and Court 1 have full access throughout; the other four show courts during singles matches. Line calls remain electronic and are not subject to review.",
];

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db
  .update(sportingEvents)
  .set({
    preTripBriefLines: lines,
    preTripBriefLiveAt: new Date(),
    preTripBriefUpdatedAt: new Date(),
  })
  .where(eq(sportingEvents.id, WIMBLEDON_EVENT_ID));

console.log("✓ Wimbledon pre-trip brief updated and activated");
console.log("  Live at:", new Date().toISOString());
lines.forEach((l, i) => console.log(`  Line ${i + 1}: ${l.slice(0, 80)}...`));

await client.end();
