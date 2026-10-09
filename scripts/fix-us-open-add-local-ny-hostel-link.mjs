import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-us-open-mq4wj388";

const [existing] = await db.select({ bookingLinks: experiences.bookingLinks }).from(experiences).where(eq(experiences.slug, SLUG));

const newLink = {
  url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Fthe-local-hostel-nyc.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-a7259925-0682-46fc-b703-c48596029066%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D54571603_398000202_0_0_0%26checkin%3D2027-08-30%26checkout%3D2027-09-03%26dest_id%3D545716%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D54571603_398000202_0_0_0%26hpos%3D1%26matching_block_id%3D54571603_398000202_0_0_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D54571603_398000202_0_0_0__99640%26srepoch%3D1791298299%26srpvid%3D7726fe43b097ce73bbc30c0bd9390570%26type%3Dtotal%26ucfs%3D1%26",
  label: "The Local NY Hostel",
  platform: "Booking.com",
};

const updatedLinks = [...(existing.bookingLinks ?? []), newLink];

const result = await db
  .update(experiences)
  .set({ bookingLinks: updatedLinks })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, bookingLinks: experiences.bookingLinks });

console.log(JSON.stringify(result, null, 2));
process.exit(0);
