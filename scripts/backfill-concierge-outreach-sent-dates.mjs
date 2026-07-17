import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { purchases } from "../schema/database.ts";
import { inArray } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const now = new Date();

// Sent the pre-trip version today (Belgian GP, race weekend)
const preTripRecipients = ["rasmey@web.de", "paaskesen@outlook.dk"];

// Sent the post-trip version today (Wimbledon / Open Championship purchasers)
const postTripRecipients = [
  "markeysa@tcd.ie",
  "sarah.markey2@gmail.com",
  "anup.fernandes@yahoo.co.in",
  "kshitijshetty9900@gmail.com",
  "sach25tp@gmail.com",
  "molgrainger@yahoo.ie",
  "riosaz@ymail.com",
  "ale.bardazzi91@gmail.com",
  "leander.bond@gmail.com",
  "lisalowe38@live.com",
  "sheritabernardez@gmail.com",
  "jody_graeme@yahoo.com",
  "kaaarsoo@gmail.com",
  "oabrefa@yahoo.co.uk",
  "juliet_uata@yahoo.com",
  "a.h.pollard@hotmail.co.uk",
  "shilps@mac.com",
];

const preTripResult = await db
  .update(purchases)
  .set({ conciergeOutreachPreTripSentAt: now })
  .where(inArray(purchases.email, preTripRecipients))
  .returning({ email: purchases.email });
console.log(`✓ Backfilled conciergeOutreachPreTripSentAt for ${preTripResult.length} rows:`, preTripResult.map(r => r.email));

const postTripResult = await db
  .update(purchases)
  .set({ conciergeOutreachPostTripSentAt: now })
  .where(inArray(purchases.email, postTripRecipients))
  .returning({ email: purchases.email });
console.log(`✓ Backfilled conciergeOutreachPostTripSentAt for ${postTripResult.length} rows:`, postTripResult.map(r => r.email));

await client.end();
