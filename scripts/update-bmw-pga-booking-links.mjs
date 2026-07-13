import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

async function setLinks(id, title, bookingLinks) {
  await db.update(experiences).set({ bookingLinks }).where(eq(experiences.id, id));
  console.log(`✓ Affiliate link added: ${title}`);
}

await setLinks(
  "fbbae4b9-409b-471d-a0a3-781894d54a3b", // Coworth Park, Ascot
  "Coworth Park, Ascot",
  [
    {
      platform: "Booking.com",
      label: "Coworth Park, Ascot",
      url: "https://www.anrdoezrs.net/click-101774030-12937117?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fgb%2Fcoworth-park.en-gb.html%3Fchal_t%3D1783964803741%26force_referer%3D",
    },
  ]
);

await setLinks(
  "1584e41a-0ab1-4044-a5be-ebc66c930de4", // Wheatsheaf Hotel, Virginia Water
  "Wheatsheaf Hotel, Virginia Water",
  [
    {
      platform: "Booking.com",
      label: "Wheatsheaf Hotel, Virginia Water",
      url: "https://www.dpbolvw.net/click-101774030-12937117?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fgb%2Fthe-wheatsheaf-surrey.en-gb.html%3Flabel%3Dgen173nr-10CAsoUEIVdGhlLXdoZWF0c2hlYWYtc3VycmV5SDNYBGhsiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBqAIBuALUydTSBsACAdICJDBiNTg5NzkzLWRjOTMtNGY5MC1hMjc2LWJkNDRmYmQ4N2RmNNgCAeACAQ%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26dist%3D0%26keep_landing%3D1%26sb_price_type%3Dtotal%26type%3Dtotal%26",
    },
  ]
);

await setLinks(
  "1183bc66-1c8b-402d-ac04-3c03f4d9d33b", // Windsor Castle & The Long Walk
  "Windsor Castle & The Long Walk",
  [
    {
      platform: "GetYourGuide",
      label: "Windsor Castle Entrance Ticket",
      url: "https://www.getyourguide.com/london-l57/windsor-castle-entrance-ticket-t53858/?partner_id=HCNITTS&utm_medium=online_publisher",
    },
  ]
);

await client.end();
console.log("\nAll 3 BMW PGA affiliate links added.");
