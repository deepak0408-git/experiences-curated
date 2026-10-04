// Creates the sporting_events row for Chinese Grand Prix 2027 (Formula 1).
//
// Context / sourcing:
// - Venue: Shanghai International Circuit, No. 2000 Yining Road, Anting Town,
//   Jiading District, Shanghai — confirmed via WebSearch (Wikipedia, official
//   Shanghai Circuit station page, travelchinaguide.com), 23 Sep 2026.
// - Dates: 16-18 Apr 2027, per externalCalendarEvents row
//   (id d336cae8... superseded / 41e7a344-88a2-4855-9443-726642064d41,
//   sourceName "Official FIA 2027 F1 calendar (confirmed)", isProvisional:
//   false, lastVerifiedAt 2026-09-16). Confirmed again via WebSearch against
//   formula1.com/en/racing/2027 and formula1shanghai.com, 23 Sep 2026.
// - Weekend format: regular (non-sprint) — confirmed directly by the founder,
//   23 Sep 2026. Exact session clock times remain TBC on formula1.com /
//   formula1shanghai.com as of this seed date — do not invent them; any
//   downstream content (pre-trip brief, itinerary) must say "TBC" honestly
//   per hub-and-spoke skill §2a-3/§2a-5.
// - Destination: Shanghai (existing row, reused from Shanghai Masters 2026 —
//   no new destination needed). Evaluated and confirmed NOT the same area of
//   the city as Shanghai Masters' venue (Qizhong Arena, Minhang District,
//   southwest) — Shanghai Intl Circuit sits in Jiading/Anting, northwest,
//   ~40-60km apart. Day trips reusable; hotels/dining are not (see project
//   memory to be saved after this build).
//
// PACK_PRICING: placeholder only (see hub-and-spoke skill §0 BLOCKER) — no
// real Dodo product IDs exist yet, confirmed with curator 23 Sep 2026. Env
// vars below resolve to "" until real IDs are added to .env.local.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SHANGHAI_DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EXTERNAL_CALENDAR_EVENT_ID = "41e7a344-88a2-4855-9443-726642064d41"; // 2027 row, confirmed non-provisional

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "Chinese Grand Prix 2027",
    slug: "chinese-grand-prix",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2027,
    destinationId: SHANGHAI_DESTINATION_ID,
    venueName: "Shanghai International Circuit",
    venueAddress: "No. 2000 Yining Road, Anting Town, Jiading District, Shanghai, China",
    startDate: "2027-04-16",
    endDate: "2027-04-18",
    recurrence: "annual",
    ticketingUrl: "https://ticketing.formula1.com/china/",
    editorialOverview:
      "The only F1 race on the calendar with its own metro station — Shanghai International Circuit's distinctive bird's-eye 'Shang' character layout has hosted the Chinese Grand Prix since 2004, in the northwestern Jiading district, a world away from the tower-block Shanghai of postcards.",
    isHidden: true, // always true at creation — activated later via /curator/events
    isTestEvent: false,
    packStatus: "built_hidden", // must be explicit — makes /event-pack/chinese-grand-prix loadable during build
    packFormat: "hub_and_spoke", // mandatory default as of 1 Aug 2026 — set explicitly, not relying on column default
    // packCurrency, earlyBirdDisplay, standardDisplay, earlyBirdCutoff: left
    // NULL — curator-owned, set later via /curator/price once real Dodo
    // pricing exists (see hub-and-spoke skill §4c item 6).
  })
  .returning();

console.log("Created sporting_events row:", JSON.stringify(event, null, 2));

// BLOCKER (hub-and-spoke skill §0): link to externalCalendarEvents row at
// creation time, not deferred to the §4c pre-launch gate.
const updated = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: event.id, updatedAt: new Date() })
  .where(eq(externalCalendarEvents.id, EXTERNAL_CALENDAR_EVENT_ID))
  .returning();

console.log("\nLinked externalCalendarEvents row:", JSON.stringify(updated, null, 2));

await client.end();
