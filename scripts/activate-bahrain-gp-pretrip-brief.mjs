import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "07e23597-720b-41e1-b8ff-419e004307ee";
const EXPECTED_SLUG = "bahrain-grand-prix";

const lines = [
  "Expect about 30°C highs and 25°C lows, very humid, with rain on most days in early October. Storms tend to build later in the day, so pack a light poncho and a small dry bag for your phone. Skip umbrellas in the grandstands.",
  "The Sepang Race Train Pass costs RM200 and gives 6 KLIA Ekspres trips between KL Sentral and KLIA Terminal 2 (about 33 minutes) on 2 to 4 October only. Buy it at kliaekspres.com or in the app, at station kiosks, or at the counter from 2 October. It is non-transferable, non-refundable and single-passenger, and unused trips expire. That is about RM130 cheaper than six single tickets at RM55 each.",
  "Rapid KL runs 95 free shuttle buses to the circuit, every 10 to 15 minutes, 7am to midnight, all three days. Pickups are the KLIA Terminal 2 Level 1 bus hub, the Mitsui KLIA bus hub, and De-Village on Persiaran Millenia 2 in Bandar Baru Enstek. The train pass covers only the train, so the shuttle is a separate free ride. There is no motorcycle parking at the circuit this year, so park at one of those hubs and take the shuttle.",
  "The Standard Chartered KL Marathon overlaps race weekend, with early-morning road closures in the city centre around Dataran Merdeka (10K and 5K on Saturday 3 October, full and half marathons on Sunday 4 October). They should clear well before the 3pm race, but allow extra time for airport transfers on those mornings. Check kl-marathon.com or Waze for the exact closures before you leave your hotel.",
  "F1 is back at Sepang for the first time since 2017. This is the relocated Bahrain Grand Prix, and it is a daytime race with a 3pm start on Sunday, not a night race. Qualifying is Saturday at 4pm.",
];

try {
  const [before] = await client`
    SELECT id, name, slug, pre_trip_brief_live_at FROM sporting_events WHERE id = ${EVENT_ID}
  `;
  if (!before) throw new Error(`No event with id ${EVENT_ID}`);
  if (before.slug !== EXPECTED_SLUG) throw new Error(`Slug mismatch: ${before.slug}`);
  console.log("Before:", before);

  const result = await client`
    UPDATE sporting_events
    SET
      pre_trip_brief_lines = ${lines},
      pre_trip_brief_live_at = NOW(),
      pre_trip_brief_updated_at = NOW()
    WHERE id = ${EVENT_ID}
    RETURNING id, name, pre_trip_brief_live_at, array_length(pre_trip_brief_lines, 1) AS line_count
  `;
  console.log("✓ Activated:", result[0]);
} catch (e) {
  console.error("✗ FAILED:", e.message);
} finally {
  await client.end();
}
