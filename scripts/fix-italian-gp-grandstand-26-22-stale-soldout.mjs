import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Fixes stale 2026-race-specific "sold out" language on Grandstand 26 and
// Grandstand 22 that carried forward unmodified into Italian GP's 2027
// edition (event editionYear rolled to 2027; these two rows were last
// verified 29 Jun 2026 and never revisited). Both asserted an actual sale
// event ("26A confirmed sold out via f1italy.com Jun 2026") as if it were
// still current fact -- misleading for a 2027 buyer, since 2027 tickets
// aren't even on sale yet. Rewritten to keep the true, evergreen pattern
// (26A/26B are historically the most sought-after seats and tend to sell
// out early) without asserting a specific 2026 sale event as current.
// Founder-reviewed fix approach, 19 Sep 2026.

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const GRANDSTAND_26_SLUG = "grandstand-26-pit-lane-grid-podium-mqz5lk5k";
const GRANDSTAND_22_SLUG = "grandstand-22-parabolica-corner-mqzgq262";

const grandstand26Body = `Monza's start/finish straight is where the Italian GP is won and lost. Grandstand 26 — the Laterale Destra — sits directly opposite the pit lane on that straight, which means you see everything that matters: the grid build-up before lights out, pit stops played out in real time across the track, the race finish, and the podium ceremony. Not from a screen. From your seat.

The stand is divided into three sections. Section 26A puts you closest to the start line, opposite grid positions 7 to 14 — the mid-pack teams jostling for position. 26B moves you further back along the grid. 26C is the podium section: lower seat numbers here give you the best unobstructed view of the celebration on the circuit. If the podium is what you're there for — the trophy lift, the champagne, the Tifosi roar — 26C is your seat.

The stand faces east, which means it's shaded from midday onwards. That matters in early September when Monza can sit at 28–30°C through qualifying and race day. Rows D and E have roof support pillars that can clip sightlines — stick to rows A–C or the upper tiers to avoid them.

One thing to understand about Grandstand 26: it is historically the most sought-after reserved seat at Monza after Grandstand 1. Sections 26A and 26B have a track record of selling out well ahead of race weekend in past editions. Once tickets for the current edition go on sale, don't wait if 26A or 26B is the seat you want — book as soon as monzanet.it opens sales, and check the official waitlist there if a section shows as unavailable.

The Fan Zone is a short walk from the stand. Food and drink vendors operate behind the seating. Gates A and B are the fastest entry route — 5 minutes from the main entrance.`;

const grandstand26PracticalInfo = {
  hours: "Gates open 08:00 on race days; qualifying from 15:00 Saturday; race start ~15:00 Sunday",
  website: "https://www.monzanet.it/en/tickets/",
  costRange: "2027 pricing not yet published — check monzanet.it/en/tickets/ directly closer to the event",
  howToBook:
    "Book 3-day passes via monzanet.it/en/tickets/ as soon as 2027 sales open. Grandstand 26, especially sections 26A and 26B, has historically sold out early — don't wait once sales go live. If a section shows unavailable, check the official waitlist at monzanet.it/en/tickets/, which releases tickets when corporate allocations are returned, usually 4–6 weeks before race day. On Location Experiences, the official F1 hospitality partner, sells inclusive packages with grandstand seating and pit lane access (onlocationexp.com) as an alternative route in.",
  bookingMethod: "Book 3-day passes via monzanet.it/en/tickets/ — check availability for 26B/C or join the waitlist for 26A.",
  reservationsRequired: true,
};

const grandstand26EditorialNote =
  "Sources: oversteer48.com/monza-grandstand-26-laterale-destra, f1italy.com/en/ticket-info/26-laterale-destra-a. Seating layout and section facts verified Jun 2026, still current. Removed a stale, 2026-race-specific sold-out claim (19 Sep 2026) that had carried forward unmodified into the 2027 edition — replaced with evergreen guidance that doesn't assert a specific past sale event as current fact. 2027 pricing not yet published. Hero image: Pexels Licence, Jenda Kubeš.";

const grandstand22HowToBook =
  "Buy directly at monzanet.it/en/tickets/ as soon as 2027 sales open — tickets delivered as print-at-home PDF within 48 hours. Grandstand 22 has historically sold more slowly than Grandstand 26, but it does sell out in past editions, so don't wait once sales go live. Booking as a group? Monzanet.it guarantees adjacent seating automatically. If official tickets are unavailable, tickets.gp aggregates legitimate resellers, usually at or near face value — avoid Viagogo as a first choice, since pricing inflates fast when stock is low. Want hospitality above the grandstand tier? Champions Club (open bar, driver Q&A, grid walk) or Paddock Club (pit lane access, unlimited F&B) sell 6–8 months out — contact F1 Experiences directly at f1experiences.com.";

const grandstand22CostRange = "2027 pricing not yet published — check monzanet.it/en/tickets/ directly closer to the event. In 2026 a 3-day ticket (all sessions, reserved seat, no single-day option) ran €789.";

const grandstand22EditorialNote =
  "Sources: f1italy.com/en/ticket-info/grandstand-22 (seating rows A–M, seats 1–164, covered), oversteer48.com/monza-grandstand-22-parabolica/ (seat recommendations, TV screen position), motorsporttickets.com grandstand guide (view description, atmosphere). Speed figures from f1chronicle.com Parabolica corner guide. 2026 price (€789) verified Jun 2026, kept as reference only. Removed a stale 'sells out by June' / 'if tickets are live, buy immediately' claim (19 Sep 2026) that assumed 2027 sales were already open — they aren't. GTG: check f1experiences.com for Champions Club/Paddock Club. Booking.com: N/A. Hero image: Alexandros Milidakis, Pexels Licence.";

try {
  const [r26] = await db
    .update(experiences)
    .set({
      bodyContent: grandstand26Body,
      practicalInfo: grandstand26PracticalInfo,
      editorialNote: grandstand26EditorialNote,
    })
    .where(eq(experiences.slug, GRANDSTAND_26_SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });
  console.log("Updated:", r26?.title, "|", r26?.id, "|", r26?.slug);

  const [r22] = await db
    .update(experiences)
    .set({
      practicalInfo: {
        hours: "Gates open 08:00 daily. Practice Friday, Qualifying Saturday, Race Sunday.",
        website: "https://www.monzanet.it/en/tickets/",
        costRange: grandstand22CostRange,
        howToBook: grandstand22HowToBook,
        bookingMethod: "Buy directly at monzanet.it/en/tickets/ — tickets delivered as print-at-home PDF within 48 hours.",
        reservationsRequired: true,
      },
      editorialNote: grandstand22EditorialNote,
    })
    .where(eq(experiences.slug, GRANDSTAND_22_SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });
  console.log("Updated:", r22?.title, "|", r22?.id, "|", r22?.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
