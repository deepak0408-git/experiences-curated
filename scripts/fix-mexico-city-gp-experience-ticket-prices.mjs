import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Corrects stale placeholder ticket/hospitality pricing across 4 already-
// seeded Mexico City GP experiences, now that real 2026 prices are confirmed
// (tickets.formula1.com screenshots, 6 Sep 2026, EUR→USD @ 1.1622; GA figure
// from GPDestinations.com, 3,900 MXN → USD @ today's real rate 0.05917 —
// see scripts/seed-mexico-city-gp-ticket-tiers.mjs for full sourcing).
// These 4 experiences previously used "recent-season"/estimated figures
// ($191 GA, $490-1,700 grandstand, $5,600/$9,600 hospitality) sourced from
// GPDestinations.com and Goal.com before the official 2026 prices were
// confirmed directly. Updated to match the real, seeded
// planner_ticket_tier_cost rows exactly.

// ─── 1. Mexico City GP Ticket Guide ────────────────────────────────────────

const TICKET_GUIDE_ID = "91619345-0b7e-4237-b201-416a5a689aee";

const ticketGuideBody = `Mexico City sells out faster than almost any race on the F1 calendar. When 2026 tickets went on general sale through the official promoter in November 2025, they were gone within the first day. If you're planning this trip, the ticket decision isn't really "which tier" — it's "buy the moment tickets open, then work out the tier."

There are four real tiers to understand. General admission (branded Grada 2A) is the cheapest way in — a 3-day pass runs around $231 USD, with no assigned seat, standing or lawn access only, and no guarantee of a clear sightline once the popular spots fill up on race morning. Numbered grandstand seats are the mid-tier, and pricing varies enormously by zone: the lower-tier stands (Grandstands 15, 14, and 5A) run from roughly $785 to $1,270 for a 3-day pass, while the premium stands — Grandstand 10, Grandstand 11, and Main Grandstand — run from roughly $1,640 to $2,166. Above that sit two hospitality products: the Champions Club, F1 Experiences' hospitality tier opposite the pits, and the official F1 Paddock Club and House 44 at F1 Paddock Club™, the top tier, from $8,502 for 3 days with paddock access, pit lane walks, and a suite view over the circuit — House 44 itself runs from $16,338 for the same 3 days.

All tickets here are sold as 3-day passes covering practice, qualifying, and the race — Mexico City doesn't typically offer single-day tickets the way some circuits do, so budget for the full weekend rather than trying to pick just race day.

Because this race consistently sells out on release day, the practical strategy is straightforward: know the release date in advance (announced via the official ticketing partner, currently Ticketmaster, several months ahead), have a payment method ready, and be online the moment sales open. If you miss the official window, resale platforms carry inventory afterward, but at a real markup — general admission resale has been seen as low as the official price but grandstand and box seats can run several times the original figure, and there's no guarantee the listing is genuine until it's in your hands.

One more factor unique to 2026: race weekend (30 October - 1 November) lands directly on top of Mexico City's Día de Muertos parade weekend, one of the biggest tourism draws in the city's calendar independent of F1. That means hotel and flight demand stacks on top of an already sold-out race — book accommodation as early as you buy tickets, not after.`;

const ticketGuideCostRange =
  "General admission ~US$231 (3-day) · Grandstand 15/14/5A US$785–1,270 (3-day) · Grandstand 10/11/Main US$1,640–2,166 (3-day) · Paddock Club from US$8,502, House 44 from US$16,338 (3-day)";

// ─── 2. F1 Paddock Club & Champions Club — Mexico City ────────────────────

const PADDOCK_CLUB_ID = "41cf34c3-c937-4e8b-8ab9-029224f3f6d1";

const paddockClubCostRange =
  "F1 Paddock Club from US$8,502 for 3 days · House 44 at F1 Paddock Club™ from US$16,338 for 3 days (both confirmed 2026 prices, tickets.formula1.com) — Champions Club is a separate F1 Experiences product sold via f1experiences.com; check current pricing there before booking";

// ─── 3. Foro Sol — The Loudest Corner in F1 ────────────────────────────────

const FORO_SOL_ID = "d5a0bdfc-7b0c-4734-9e0b-872e0afac1f7";

const foroSolCostRange =
  "Grandstands 14 and 15 (Foro Sol) run US$785–1,270 for the 3-day pass — confirmed 2026 pricing from tickets.formula1.com";

// ─── 4. Where to Sit — Grandstand Comparison ───────────────────────────────

const WHERE_TO_SIT_ID = "d0b3c33a-66d1-4e30-acda-d0d4981182a5";

const whereToSitCostRange =
  "Grandstand 15/14/5A US$785–1,270 (3-day) · Grandstand 10/11/Main Grandstand US$1,640–2,166 (3-day) — confirmed 2026 pricing from tickets.formula1.com, varies by zone and demand";

const updates = [
  {
    id: TICKET_GUIDE_ID,
    label: "Mexico City GP Ticket Guide",
    bodyContent: ticketGuideBody,
    costRange: ticketGuideCostRange,
    editorialNote:
      "Grandstand and hospitality pricing confirmed 6 Sep 2026 directly from tickets.formula1.com/en/f1-4861-mexico (screenshots, EUR→USD @ 1.1622, api.frankfurter.dev). GA figure (Grandstand 2A) has no listing on the official site — sourced from GPDestinations.com (published 20 Mar 2026), 3,900 MXN converted at today's real rate (0.05917, api.frankfurter.dev, 6 Sep 2026). Sell-out timing (single-day sellout via Ticketmaster, Nov 2025 on-sale) sourced from Goal.com's 2025/2026 ticket coverage, unchanged from original research.",
  },
  {
    id: PADDOCK_CLUB_ID,
    label: "F1 Paddock Club & Champions Club — Mexico City",
    bodyContent: null,
    costRange: paddockClubCostRange,
    editorialNote:
      "Paddock Club / House 44 pricing confirmed 6 Sep 2026 directly from tickets.formula1.com/en/f1-4861-mexico (screenshots, EUR→USD @ 1.1622). Champions Club price not independently verifiable — f1experiences.com blocks direct fetch — so left unquoted rather than carrying forward the prior estimate.",
  },
  {
    id: FORO_SOL_ID,
    label: "Foro Sol — The Loudest Corner in F1",
    bodyContent: null,
    costRange: foroSolCostRange,
    editorialNote:
      "Pricing confirmed 6 Sep 2026 directly from tickets.formula1.com/en/f1-4861-mexico (screenshots, EUR→USD @ 1.1622), replacing the earlier 'check tickets.formula1.com for current pricing' hedge now that real 2026 figures are confirmed.",
  },
  {
    id: WHERE_TO_SIT_ID,
    label: "Where to Sit — Grandstand Comparison",
    bodyContent: null,
    costRange: whereToSitCostRange,
    editorialNote:
      "Pricing confirmed 6 Sep 2026 directly from tickets.formula1.com/en/f1-4861-mexico (screenshots, EUR→USD @ 1.1622), replacing the earlier 'check tickets.formula1.com for current pricing' hedge now that real 2026 figures are confirmed.",
  },
];

for (const u of updates) {
  const [existing] = await db
    .select({ practicalInfo: experiences.practicalInfo, bodyContent: experiences.bodyContent })
    .from(experiences)
    .where(eq(experiences.id, u.id));

  const [result] = await db
    .update(experiences)
    .set({
      bodyContent: u.bodyContent ?? existing.bodyContent,
      practicalInfo: { ...existing.practicalInfo, costRange: u.costRange },
      editorialNote: u.editorialNote,
      lastVerifiedDate: "2026-09-06",
    })
    .where(eq(experiences.id, u.id))
    .returning({ id: experiences.id, title: experiences.title });

  console.log(`✓ Updated: ${result.title}`);
}

await client.end();
