import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

async function declassify(id, title, newBookingMethod) {
  const [existing] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.id, id));
  const { howToBook, ...rest } = existing.practicalInfo;
  const practicalInfo = { ...rest, bookingMethod: newBookingMethod };
  await db.update(experiences).set({ practicalInfo }).where(eq(experiences.id, id));
  console.log(`✓ Declassified: ${title}`);
}

// ─── 1. Eating at the US Open — already thin, keep bookingMethod as-is (was already good) ───
await declassify(
  "3f082b9e-6a72-47af-9381-424bd553bd75",
  "Eating at the US Open",
  "No advance booking for any food or drink — all concessions are walk-up. Free water filling stations are positioned throughout the grounds; bring a refillable bottle to avoid buying bottled water at stadium prices."
);

// ─── 2. Louis Armstrong Stadium ───
await declassify(
  "29854770-cdc8-4913-a43f-823845bd6e22",
  "Louis Armstrong Stadium",
  "Book reserved seats via usopen.org as soon as the daily schedule releases (usually the evening before). Third-round matches (days 5-6) tend to be the best value — seeds clash and upsets happen most. Grounds pass holders can enter the concourse and unreserved areas on applicable sessions; check usopen.org for which sessions allow this."
);

// ─── 3. Queens: A Day Beyond the Courts ───
await declassify(
  "6072122e-51f0-403c-a302-6ff81af50064",
  "Queens: A Day Beyond the Courts",
  "No booking required for any part of this itinerary — all walk-in. MoMA PS1's Warm Up series (Saturdays in summer, outdoor music) is free with museum admission; check momaps1.org for the August schedule before you go, as dates and artists are announced a few weeks out."
);

// ─── 4. Flushing Meadows-Corona Park ───
await declassify(
  "b1046f53-6f29-4716-b942-66b0ded24005",
  "Flushing Meadows-Corona Park",
  "No advance booking needed for the park or the Unisphere. Queens Museum is walk-in welcome, pay-what-you-wish; on weekends during the US Open fortnight, booking ahead online at queensmuseum.org is worth it since the Panorama room can fill up mid-afternoon."
);

// ─── 5. Morning at the Practice Facility ───
await declassify(
  "167a87cc-b7b0-467c-b2ab-553e3c6c3c3c",
  "Morning at the Practice Facility",
  "Covered by a grounds pass via usopen.org — no separate ticket needed. Early-week days (Monday-Wednesday) are best value, with the full draw still in play. Arrive close to opening (8-9am); by 11am most players have cleared out. The US Open app lists which courts are assigned to which players the evening before."
);

// ─── 6. When Play Stops ───
await declassify(
  "9d541cab-db6f-4ef4-b4d3-55a02e87973b",
  "When Play Stops",
  "Covered by your session ticket — no separate booking. Download the US Open app before you arrive; it shows real-time match status and revised schedules during delays, including when spare capacity opens up on roof-court sessions."
);

// ─── 7. Flushing's Golden Mall ───
await declassify(
  "c408893a-d00c-4b62-9223-1ad2fcc472c8",
  "Flushing's Golden Mall",
  "No reservations, no queuing system — walk in and order at individual stalls. The lamb skewer stall is the one exception; arrive before noon or after 3pm to skip the queue. On US Open session days the basement fills fast between 11:30am and 1:30pm, so aim for before 11am or after 2pm."
);

// ─── 8. A Morning in Queens Before the Tennis ───
await declassify(
  "64ec24f3-4e80-4326-bf3e-5a3afda00603",
  "A Morning in Queens Before the Tennis",
  "Email laura@eatyourworld.com or book at joedistefano.nyc/tours for a private Flushing or Jackson Heights food tour — both accept dietary requests and ask for roughly 2 weeks' notice. Self-guided tour PDFs are also available at eatyourworld.com if private tours are full."
);

// ─── 9. Preparing for Your US Open Visit — redundant with Arthur Ashe's real Concierge entry ───
await declassify(
  "ad53475e-d932-44af-803f-608cc6d51263",
  "Preparing for Your US Open Visit",
  "Tickets via usopen.org or the official US Open app — do not use secondary market platforms without checking the official site first. Buy first-week grounds passes as soon as they go on sale in spring for the best prices; night session tickets for the second week sell out fastest."
);

await client.end();
console.log("\nAll 9 Concierge entries declassified — pack now carries 4 genuine Concierge picks (Arthur Ashe Stadium, Rooftop Dinner Then the Night Session, Jackson Heights: The Food Mile, Where to Stay for the US Open).");
