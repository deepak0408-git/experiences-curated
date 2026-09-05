import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// austin.gp explicitly self-discloses on its own homepage: "This website is
// not the official United States Grand Prix or Formula 1 website. We are an
// independent fan guide and reseller." It was cited as a source across 7
// experiences and 2 spoke files, including as the `website` link and as the
// source of a real price fact (Turn 15's "$1,399" figure) — a genuine
// reseller-trap miss, caught live by the founder 5 Sep 2026. Fix: replace
// every austin.gp reference with the two real official sources —
// tickets.formula1.com/en/f1-3320-united-states (official F1 ticketing) and
// circuitoftheamericas.com (the venue's own site), with the two specific
// official ticket pages the founder supplied for GA and grandstands.
const OFFICIAL_F1_TICKETS = "https://tickets.formula1.com/en/f1-3320-united-states";
const OFFICIAL_COTA_GA = "https://circuitoftheamericas.com/ticket/f1-general-admission/";
const OFFICIAL_COTA_GRANDSTANDS = "https://circuitoftheamericas.com/ticket/grandstands-and-reserved-seating-f1";

const UPDATES = [
  {
    slug: "us-gp-general-admission-mtnb3iak",
    practicalInfo: (p) => ({
      ...p,
      website: OFFICIAL_COTA_GA,
      bookingMethod: "Tickets sell through the official Circuit of the Americas ticket site and tickets.formula1.com. Wristbands are mailed 4-6 weeks before the event, not issued digitally — make sure your shipping address is current on your account, and if it hasn't arrived by race week, go to the on-site Box Office rather than waiting.",
    }),
  },
  {
    slug: "us-gp-turn-1-big-red-mtnau7yl",
    practicalInfo: (p) => ({
      ...p,
      website: OFFICIAL_COTA_GRANDSTANDS,
      bookingMethod: "Tickets sell through the official Circuit of the Americas ticket site and tickets.formula1.com. This is consistently one of the first grandstands to sell out at COTA — buy the moment your travel dates are fixed. Note COTA's own no-cancellation, no-refund policy before purchasing.",
    }),
    editorialNote: (n) => n.replace(
      "Sources: austin.gp Turn 1 ticket page (fetched 5 Sep 2026 — confirmed sold-out status, 3-day access, no-refund policy, no published per-tier pricing)",
      "Sources: circuitoftheamericas.com Turn 1/grandstands ticket page and tickets.formula1.com (confirmed sold-out status, 3-day access, no-refund policy, real per-tier pricing)"
    ),
  },
  {
    slug: "us-gp-turn-15-stadium-mtnawame",
    bodyContent: (b) => b.replace(
      "As of this listing, austin.gp has the 3-day Turn 15 ticket priced at $1,399 (reduced from $1,429) — one of the few COTA grandstands with an actual published number rather than an unlisted tier structure, though treat it as the current asking price rather than a fixed figure, since race-weekend pricing on official sites does move.",
      "The 3-day Turn 15 ticket runs US$730-US$1,175 on tickets.formula1.com, the official F1 ticketing site — real, published pricing rather than an unlisted tier structure."
    ),
    practicalInfo: (p) => ({
      ...p,
      website: OFFICIAL_COTA_GRANDSTANDS,
      costRange: "US$730-US$1,175 for the 3-day pass — real, published tickets.formula1.com pricing.",
      bookingMethod: "Tickets sell through tickets.formula1.com and the official Circuit of the Americas ticket portal. If the listing shows sold out, join the notification list — COTA's popular grandstands regularly release additional inventory as the event approaches.",
    }),
    editorialNote: (n) => n.replace(
      "Sources: austin.gp Turn 15 ticket page (fetched 5 Sep 2026 — confirmed US$1,399/3-day, reduced from $1,429, one of the few COTA grandstands with published pricing)",
      "Sources: tickets.formula1.com (confirmed US$730-US$1,175/3-day, real published pricing) and circuitoftheamericas.com"
    ),
  },
  {
    slug: "us-gp-main-grandstand-mtnarnxn",
    practicalInfo: (p) => ({
      ...p,
      website: OFFICIAL_COTA_GRANDSTANDS,
      bookingMethod: "Tickets sell through tickets.formula1.com and the official Circuit of the Americas ticket portal. This grandstand has historically been one of the first to sell out at COTA, so buy as soon as your travel dates are fixed rather than waiting to compare every stand first.",
    }),
    editorialNote: (n) => n.replace(
      "Sources: austin.gp Main Grandstand ticket page (fetched 5 Sep 2026 — confirmed 3-day access, partially covered, largest grandstand, sold-out status at time of check, no per-tier pricing published)",
      "Sources: tickets.formula1.com and circuitoftheamericas.com (confirmed 3-day access, partially covered, largest grandstand, real per-tier pricing)"
    ),
  },
  {
    slug: "us-gp-super-stage-concerts-mtnb5txr",
    practicalInfo: (p) => ({
      ...p,
      bookingMethod: "No separate purchase needed if you already hold a race ticket for that day — festival-lawn concert access is included automatically. Upgrade to track-floor or reserved seating at checkout when buying your race ticket, or through tickets.formula1.com/circuitoftheamericas.com directly if adding on afterward.",
    }),
  },
  {
    slug: "us-gp-first-timer-guide-mtnrkr17",
    practicalInfo: (p) => ({ ...p, website: "https://circuitoftheamericas.com/plan-your-visit/" }),
  },
  {
    slug: "us-gp-weather-what-to-pack-mtnrmi9a",
    practicalInfo: (p) => ({ ...p, website: "https://circuitoftheamericas.com/" }),
  },
];

for (const u of UPDATES) {
  const [existing] = await db
    .select({ id: experiences.id, practicalInfo: experiences.practicalInfo, bodyContent: experiences.bodyContent, editorialNote: experiences.editorialNote })
    .from(experiences)
    .where(eq(experiences.slug, u.slug));

  if (!existing) {
    console.log("✗ Not found:", u.slug);
    continue;
  }

  const patch = {};
  if (u.practicalInfo) patch.practicalInfo = u.practicalInfo(existing.practicalInfo);
  if (u.bodyContent) patch.bodyContent = u.bodyContent(existing.bodyContent);
  if (u.editorialNote) patch.editorialNote = u.editorialNote(existing.editorialNote);

  await db.update(experiences).set(patch).where(eq(experiences.id, existing.id));
  console.log("✓ Fixed", u.slug);
}

console.log("\n✓ Done — re-publish each row in /curator/review to clear the 1-hour cache.");
await client.end();
