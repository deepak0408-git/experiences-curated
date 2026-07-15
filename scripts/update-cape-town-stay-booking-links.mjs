import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const bookingLinks = [
  {
    platform: "booking.com",
    label: "Cape Grace",
    url: "https://www.dpbolvw.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fza%2Fcape-grace.en-gb.html%3Flabel%3Dgen173nr-10CAso-wFCCmNhcGUtZ3JhY2VIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Apzk2NIGwAIB0gIkMzIyZmZlMWYtMWRlMi00YTYxLWJjZjktMjE4NzJiNDYxN2Y12AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26dist%3D0%26keep_landing%3D1%26sb_price_type%3Dtotal%26type%3Dtotal%26",
  },
  {
    platform: "booking.com",
    label: "Taj Cape Town",
    url: "https://www.dpbolvw.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fza%2Ftaj-cape-town.en-gb.html%3Flabel%3Dgen173nr-10CAso-wFCDXRhai1jYXBlLXRvd25IM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Ap7k2NIGwAIB0gIkMTkyMmFmNGMtMjgxYy00YjEyLWE3YzktNjE3NjIyZjlhYTI52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26dist%3D0%26group_adults%3D2%26group_children%3D0%26keep_landing%3D1%26no_rooms%3D1%26sb_price_type%3Dtotal%26type%3Dtotal%26",
  },
  {
    platform: "booking.com",
    label: "Vineyard Hotel",
    url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fza%2Fvineyard-hotel.en-gb.html%3Flabel%3Dgen173nr-10CAso-wFCDnZpbmV5YXJkLWhvdGVsSDNYBGhsiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBqAIBuAKg5NjSBsACAdICJDk3OTRhYmU4LTBlZGItNGM4Yy1hYmE3LWZkMGIxMWU3ODA2YdgCAeACAQ%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26dist%3D0%26group_adults%3D2%26group_children%3D0%26keep_landing%3D1%26no_rooms%3D1%26sb_price_type%3Dtotal%26type%3Dtotal%26",
  },
];

try {
  const [result] = await db
    .update(experiences)
    .set({ bookingLinks })
    .where(eq(experiences.title, "Where to Stay in Cape Town for the Test"))
    .returning({ id: experiences.id, title: experiences.title });

  console.log("✓ bookingLinks set on:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
