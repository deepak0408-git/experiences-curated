import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "italian-gp-grandstand-5-piscina-mu7cogcs";

const bodyContent = `Grandstand 5 — locals call it the Piscina, after a swimming pool that used to sit nearby — is on the left side of the start/finish straight, a short walk past the start line and roughly midway to the Prima Variante, Monza's opening chicane. It's not the seat for a clean, wide view of the podium or the grid. It's the seat for sound.

Cars leave the grid at full throttle and hold it almost all the way to the Prima Variante braking zone, which means Grandstand 5 catches them at close to their loudest and fastest, right before they stand on the brakes for Turn 1. If Grandstand 1 sells you history and the podium sightline, Grandstand 5 sells you proximity to raw acceleration — genuinely one of the more visceral seats at the circuit, even if the sightline itself is narrower than the marquee stands further down the straight.

Seating is reserved and covered, with guaranteed group seating for parties booking together, TV screens for the parts of the lap you can't see from your seat, and access to the F1 Monza Fanzone.

What you're trading for that proximity to the start-line acceleration is width of view. Grandstand 5 doesn't give you the Prima Variante's actual braking and passing action the way a stand positioned directly at the chicane would, and it doesn't give you the grid or podium the way Grandstand 1 does. It's genuinely a specialist's seat — the one you pick if you've already done Monza once and want to feel the start differently the second time, not the one you pick as your only Monza grandstand if you've never been.`;

const insiderTips = [
  "This is a genuinely loud seat — cars are still at or near full acceleration when they pass, before the Prima Variante braking zone. If you've only ever watched Monza from a mid-lap grandstand, the difference in intensity here is real, not marketing copy.",
];

const whatToAvoid = `Don't pick Grandstand 5 as your only Monza grandstand if this is your first visit and you want the classic grid-and-podium experience — its sightline is narrower than Grandstand 1 or 26, and it trades that view for proximity to acceleration sound instead. And don't expect a clear view of the actual Prima Variante braking and passing action from here — you're positioned for the run-up to the chicane, not the chicane itself. And don't treat any 2027 ticket price you come across for this stand as confirmed — Monza had not published 2027 pricing at the time of writing, so check monzanet.it's own ticket page directly rather than relying on a figure quoted elsewhere.`;

const practicalInfo = {
  hours: "Gates open 07:00 on race weekend days; grid formation and race start on Sunday afternoon",
  costRange: "2027 pricing not yet published — check monzanet.it/en/tickets/ directly closer to the event",
  bookingMethod: "Book directly via monzanet.it/en/tickets/ once 2027 tickets go on sale — historically sold as a 3-day reserved-seating package (practice, qualifying, race), not single-day.",
  website: "https://www.monzanet.it/en/tickets/",
};

const editorialNote = "Location (left side of start/finish straight, midway to the Prima Variante) and the 'Piscina' name origin sourced from f1italy.com's official Grandstand 5 product page and oversteer48.com's independent seating guide, cross-checked 18 Sep 2026. An earlier draft of this experience stated specific 2027 pricing (€989/€959) as already confirmed live on monzanet.it — that was incorrect; 2027 pricing had not been published at the time of writing. Removed 19 Sep 2026; re-verify and re-add real pricing once Monza publishes it.";

try {
  const [result] = await db
    .update(experiences)
    .set({
      bodyContent,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      editorialNote,
      budgetMinCost: null,
      budgetMaxCost: null,
      lastVerifiedDate: "2026-09-19",
    })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("Updated:", result);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
