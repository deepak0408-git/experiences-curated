import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "1c4d1502-bb04-4d01-81c8-f419b620af2d"; // Budget & Mid-Range Stays Near Interlagos

const practicalInfo = {
  hours: "Blue Tree Premium Verbo Divino: check-in from 2:00 PM, check-out by 12:00 PM. Ibis Budget São Paulo Morumbi: check-in available 3:00 PM-11:59 PM, check-out by 12:00 PM.",
  website: "https://book.omnibees.com/chain/986/hotel/1056, https://all.accor.com/booking/en/accor/hotel/5526",
  costRange: "Blue Tree Premium Verbo Divino: roughly US$70-110/night. Ibis Budget São Paulo Morumbi: roughly US$35-55/night. Both carry a race-weekend premium.",
  bookingMethod: "Book directly via each hotel's website, or through Booking.com/Expedia — both properties are listed on major platforms.",
};

const address = "Blue Tree Premium Verbo Divino: Rua Verbo Divino, 1323, Chácara Santo Antônio, São Paulo, SP, 04719-002, Brazil. Ibis Budget São Paulo Morumbi: Av. Roque Petroni Júnior, 800 - Torre II, Morumbi, São Paulo, SP, 04707-000, Brazil.";

const editorialNoteAppend = " Exact addresses and check-in/check-out times (Blue Tree: 2:00 PM/12:00 PM; Ibis Budget: 3:00 PM-11:59 PM window/12:00 PM) confirmed 12 Sep 2026 directly against the two official booking links provided (book.omnibees.com/chain/986/hotel/1056 for Blue Tree Premium Verbo Divino, all.accor.com/booking/en/accor/hotel/5526 for Ibis Budget São Paulo Morumbi), cross-checked against independent aggregator listings (Trivago, HotelPlanner) which agreed. Note: an initially-provided Omnibees link (hotel/1054) actually resolved to a different, separate property — 'Blue Tree Premium Morumbi' (Av. Roque Petroni Júnior, 1000) — not Verbo Divino; flagged and corrected before use, not silently substituted.";

const [row] = await db
  .update(experiences)
  .set({
    practicalInfo,
    address,
    editorialNote: sql`${experiences.editorialNote} || ${editorialNoteAppend}`,
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo, address: experiences.address });

console.log("✓", row.title);
console.log(JSON.stringify(row.practicalInfo, null, 2));
console.log(row.address);
await client.end();
