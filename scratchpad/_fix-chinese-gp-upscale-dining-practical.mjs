import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-upscale-dining-mud20jh1";

const newPracticalInfo = {
  hours: "Lunch: every day, 11:30 AM–2:30 PM. Dinner: every day, 5:30–10 PM. Per the restaurant's own official site.",
  website: "https://www.mmbund.com/",
  costRange: "À la carte mains roughly ¥280-420 (~US$39-58); signature dishes like the Jumbo Shrimp in Citrus Jar (¥180) or Meunière Truffle Bread (¥120) run lower. Brunch sets from ¥250 up to ¥780 per person. Splurge tier overall — budget US$80-150+ per person for a full dinner with drinks.",
  bookingMethod: "Reservations recommended well in advance, particularly around a major event weekend — book via reservations@mmbund.com or call +86 21 6323 9898.",
};

const newInsiderTips = [
  "Order the Long Short Rib Teriyaki and the Lemon-and-Lemon Tart — the short rib is the dish regulars talk about most, and the tart (a whole lemon confit-ed for 72 hours, hiding sorbet and curd inside) is Chef Paul Pairet's best-known dessert.",
  "If you want the full Pairet signature spread without overordering, the Jumbo Shrimp in Citrus Jar (steamed with lemongrass and vanilla) and the Meunière Truffle Bread are the two smaller, most distinctive plates worth adding alongside a main.",
];

const newWhatToAvoid = "Don't show up without a reservation, even on a weeknight — book via reservations@mmbund.com or by phone well ahead, since this is a serious independent dining destination with its own standing demand, not a restaurant that keeps walk-in tables open. Don't assume walk-in availability because you're visiting during a major event — this restaurant's demand comes from its own standing reputation in Shanghai's dining scene, not from Grand Prix tourism specifically, so book ahead regardless of race weekend timing.";

const [existing] = await db.select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const newEditorialNote = existing.editorialNote + " Hours/address/phone/reservation email confirmed directly via mmbund.com (official restaurant site), 2 Oct 2026. Signature dish names/prices via danielfooddiary.com — Meunière Truffle Bread ¥120, Chicken Picnic Aioli ¥125, Jumbo Shrimp in Citrus Jar ¥180, Black Cod In The Bag ¥280-360, Long Short Rib Teriyaki ¥420, Lemon-and-Lemon Tart ¥110 — cross-checked against WebSearch-aggregated Tripadvisor/Trip.com pricing (brunch ¥250-780/person) for the general splurge-tier cost range.";

await db.update(experiences)
  .set({
    practicalInfo: newPracticalInfo,
    insiderTips: newInsiderTips,
    whatToAvoid: newWhatToAvoid,
    editorialNote: newEditorialNote,
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated practicalInfo, insiderTips, whatToAvoid, editorialNote for", SLUG);

await client.end();
