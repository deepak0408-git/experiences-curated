import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Sharpens the vague "no confirmed lineup, treat concert loosely" paragraph
// in The Fan Zone & Race Week Culture with real, specific, sourced detail,
// per founder request 6 Sep 2026 to re-research this fact properly.
// Sources checked 6 Sep 2026: GPDestinations.com's trackside-mexico-grand-prix
// page ("normally they have DJs performing on the podium in the Foro Sol
// area after the race on Sunday... need a ticket for that zone"; driver
// appearances "on the stage in the Green Zone behind the main grandstands
// (Grada 1 and 2) on Friday and Saturday"; "I've not seen any announcements
// yet about who will be performing this year" — confirms no 2026 lineup is
// out yet), and mexico.gp's own Fan Zones page (no entertainment
// programming listed at all — confirms the official site itself doesn't
// carry this detail, consistent with "not yet announced" rather than
// "doesn't exist"). No trackside concert series exists here unlike Miami/
// Las Vegas — confirmed by the same source.

const EXPERIENCE_ID = "26f329b5-7724-44b2-9ecd-7e2ec9fc27c2";

const bodyContent = `Every grandstand ticket and general admission pass at Mexico City includes access to the Fan Zone, and it's worth building real time into your schedule for it rather than treating it as something to pass through on the way to your seat. Each zone around the circuit runs its own version, so what you find depends partly on which gate you're entering through — but the constants across the site are driver and team principal appearances at scheduled times (posted on-site signage tells you where and when), F1 simulators, a Pit Stop Challenge where fans can attempt a mock tire change against the clock, and team merchandise booths for every constructor on the grid.

Mexico City's fan zone leans harder into local culture than most other stops on the calendar, and this is one of the real differentiators of the whole weekend. Expect mariachi bands and folk dancers performing through the day, and because race weekend 2026 falls directly on top of Día de Muertos (see the dedicated experience elsewhere in this pack), displays and imagery tied to the holiday show up throughout the fan areas — skull face paint, marigold styling, altar-inspired art installations. It reads less like a corporate activation and more like the city's own biggest celebration bleeding into the race weekend, because that's genuinely what's happening.

Food inside the fan zone spans the full range Mexico City is known for — quick street-food-style stalls alongside more considered options, plus bars serving throughout the day. There's no confirmed 2026 concert lineup as of this pack's research, and this race genuinely doesn't run a trackside concert series the way Miami or Las Vegas do. What does happen reliably: driver appearances on a stage in the Green Zone behind the main grandstands (Grada 1 and 2) on Friday and Saturday, and a DJ set on the podium in the Foro Sol area after Sunday's race — that specific DJ set requires a Foro Sol-zone ticket to access, not just any fan zone entry. Exact performer names for both aren't typically announced until a few days before race weekend, so check the official schedule as it approaches rather than expecting a lineup this far out.`;

const editorialNote = "Fan zone activity re-verified 6 Sep 2026 per founder request for sharper sourcing. GPDestinations.com's trackside-mexico-grand-prix page confirms: post-race Sunday DJ set on the Foro Sol podium (Foro Sol-zone ticket required — general fan zone entry alone doesn't grant access), and driver/team principal appearances in the Green Zone behind Grada 1/2 on Friday and Saturday. Same source explicitly states no 2026 performer lineup has been announced yet for either. mexico.gp's own official Fan Zones page carries no entertainment programming detail at all — consistent with 'not yet announced,' not 'doesn't exist.' No trackside concert series exists here the way Miami/Las Vegas run one, per the same source.";

const [existing] = await db
  .select({ bodyContent: experiences.bodyContent })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

const [result] = await db
  .update(experiences)
  .set({ bodyContent, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);

await client.end();
