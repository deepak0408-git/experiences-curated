import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "38c57e06-4763-4e19-9ac5-3a7ad571e938"; // Where to Stay for the US Open

const bookingLinks = [
  {
    platform: "Booking.com",
    label: "Boro Hotel, Long Island City",
    url: "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Fthe-boro-hotel-lic.en-gb.html%3Flabel%3Dgen173nr-10CAso7AFCEnRoZS1ib3JvLWhvdGVsLWxpY0gzWARobIgBAZgBM7gBF8gBDNgBA-gBAfgBAYgCAagCAbgC8fnO0gbAAgHSAiQwZjMwNDVhYi1hOGM5LTRlNWYtOWVmZi04MzQ1ZTdkOGUwZWTYAgHgAgE%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26dist%3D0%26group_adults%3D2%26group_children%3D0%26keep_landing%3D1%26no_rooms%3D1%26sb_price_type%3Dtotal%26type%3Dtotal%26",
  },
  {
    platform: "Booking.com",
    label: "Hilton Garden Inn Long Island City",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Fhilton-garden-inn-long-island-city-manhattan-view.en-gb.html%3Flabel%3Dgen173nr-10CAso7AFCMWhpbHRvbi1nYXJkZW4taW5uLWxvbmctaXNsYW5kLWNpdHktbWFuaGF0dGFuLXZpZXdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Apv6ztIGwAIB0gIkY2RjMDJiNTktOTc4ZC00MDZlLWFiZTktNDkzMDRhNjI5MDcz2AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26dist%3D0%26group_adults%3D2%26group_children%3D0%26keep_landing%3D1%26no_rooms%3D1%26sb_price_type%3Dtotal%26type%3Dtotal%26",
  },
];

try {
  const [result] = await db
    .update(experiences)
    .set({ bookingLinks })
    .where(eq(experiences.id, EXPERIENCE_ID))
    .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug, status: experiences.status });

  console.log("✓ Booking.com affiliate links added");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
