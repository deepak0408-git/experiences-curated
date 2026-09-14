// Qatar GP 2026 — fix qatar-gp-parisa-atmosphere-dining-mtyn04fd insiderTips.
// Both existing tips were timing/booking-related (alcove seating booking,
// weekend reservation lead time) — no food tip despite bodyContent now
// having real menu detail. Founder flagged 14 Sep 2026.
// Replacing tip 2 (redundant with whatToAvoid's own weekend-booking line)
// with a genuinely new, food-specific, actionable tip: portions run large
// and a Mix Platter for 4 exists for group sharing — a real planning fact
// not stated anywhere else in the experience (body names individual dishes
// but never addresses portion sizing or the shared-platter option).
// Source: tripadvisor.com reviews, novacircle.com, cross-checked.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-parisa-atmosphere-dining-mtyn04fd";

const insiderTips = [
  "Book ahead specifically for a table in one of the mural-framed alcoves rather than open floor seating — the room's signature visual details are concentrated there, and a standard table misses much of what makes the space worth visiting.",
  "Portions run large and the kitchen does a Mix Platter for 4, built for sharing across a table rather than ordering individual kebabs each — a better fit than one-per-person ordering if you're arriving as a group for a race-weekend dinner.",
];

const [existing] = await db
  .select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const result = await db
  .update(experiences)
  .set({
    insiderTips,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: replaced the second insiderTip (weekend-booking timing, redundant with whatToAvoid) with a food-specific tip — large portions, Mix Platter for 4 for group sharing — since both original tips were timing-related and the body now has real menu detail with no corresponding food tip. Sources: tripadvisor.com, novacircle.com.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
