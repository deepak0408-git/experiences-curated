import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Removes an unverified "Ticketmaster" claim from Mexico City GP Ticket
// Guide, flagged by the founder 6 Sep 2026 as inconsistent with their own
// knowledge of how F1 Mexico tickets are sold. The claim traced to a single
// third-party source (GPDestinations.com) with no independent confirmation
// from the official promoter/F1 site — not strong enough evidence to assert
// against direct founder pushback. Sell-out speed itself stays (multiple
// sources agree on a fast sell-out), just not the specific platform name.
// See scripts/seed-mexico-gp-ticket-guide.mjs for the corrected source script.

const EXPERIENCE_ID = "91619345-0b7e-4237-b201-416a5a689aee";

const bodyContent = `Mexico City sells out faster than almost any race on the F1 calendar. When 2026 tickets went on general sale through the official promoter, they were gone within days. If you're planning this trip, the ticket decision isn't really "which tier" — it's "buy the moment tickets open, then work out the tier."

There are four real tiers to understand. General admission (branded Grada 2A) is the cheapest way in — a 3-day pass runs around $231 USD, with no assigned seat, standing or lawn access only, and no guarantee of a clear sightline once the popular spots fill up on race morning. Numbered grandstand seats are the mid-tier, and pricing varies enormously by zone: the lower-tier stands (Grandstands 15, 14, and 5A) run from roughly $785 to $1,270 for a 3-day pass, while the premium stands — Grandstand 10, Grandstand 11, and Main Grandstand — run from roughly $1,640 to $2,166. Above that sit two hospitality products: the Champions Club, F1 Experiences' hospitality tier opposite the pits, and the official F1 Paddock Club and House 44 at F1 Paddock Club™, the top tier, from $8,502 for 3 days with paddock access, pit lane walks, and a suite view over the circuit — House 44 itself runs from $16,338 for the same 3 days.

All tickets here are sold as 3-day passes covering practice, qualifying, and the race — Mexico City doesn't typically offer single-day tickets the way some circuits do, so budget for the full weekend rather than trying to pick just race day.

Because this race consistently sells out fast after release, the practical strategy is straightforward: know the release date in advance (announced via the official promoter and Formula 1's own channels, several months ahead), have a payment method ready, and be online the moment sales open. If you miss the official window, resale platforms carry inventory afterward, but at a real markup — general admission resale has been seen as low as the official price but grandstand and box seats can run several times the original figure, and there's no guarantee the listing is genuine until it's in your hands.

One more factor unique to 2026: race weekend (30 October - 1 November) lands directly on top of Mexico City's Día de Muertos parade weekend, one of the biggest tourism draws in the city's calendar independent of F1. That means hotel and flight demand stacks on top of an already sold-out race — book accommodation as early as you buy tickets, not after.`;

const insiderTips = [
  "The official release date is typically announced via Formula 1's own channels and the promoter months ahead of the race — set a calendar reminder rather than relying on stumbling across the announcement, since the gap between announcement and sell-out has been as short as a few days.",
  "If you miss the release entirely, check resale platforms specifically for general admission first — it's the tier most likely to still be near face value, while grandstand and hospitality resale prices climb fast once official stock is gone.",
];

const hours = "Ticket sales open via the official promoter — announced several months ahead of race week; check mexico.gp or tickets.formula1.com for the confirmed 2026 release date";
const bookingMethod = "Buy directly at tickets.formula1.com or mexico.gp the moment sales open — this race has sold out within days in recent seasons. Resale platforms (StubHub, Viagogo) carry inventory afterward at a markup, general admission typically closest to face value.";
const subtitle = "This race sells out fast — know your tier before release, not after";

const editorialNote = "Pricing sourced from GPDestinations.com's 2026 budget planner and ticket-buying guide, and Goal.com's 2025/2026 ticket pricing coverage, Sep 2026 — all figures attributed as approximate/recent-season, not officially confirmed 2026 numbers where the source itself flagged them as such. The specific ticketing-platform claim (Ticketmaster Mexico as intermediary) was removed 6 Sep 2026 — sourced from only one third-party site with no independent confirmation, and the founder flagged it as inconsistent with their own knowledge of how F1 Mexico tickets are actually sold. Fast sell-out timing itself is retained (multiple sources agree tickets sold out within days of the 2026 on-sale), but the specific platform name is not asserted.";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

const [result] = await db
  .update(experiences)
  .set({
    subtitle,
    bodyContent,
    insiderTips,
    practicalInfo: { ...existing.practicalInfo, hours, bookingMethod },
    editorialNote,
    lastVerifiedDate: "2026-09-06",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title} — Ticketmaster claim removed`);

await client.end();
