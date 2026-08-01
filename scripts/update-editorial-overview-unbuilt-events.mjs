import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Editorial overviews for the 6 unbuilt V1 planner-scope events — required
// field per event-builder skill §8, only England-in-SA had one when these
// rows were first created (inconsistency caught by user 20 Jul 2026).
// Humanizer-passed before writing, per standing instruction (always run
// humanizer on generated text without being asked). Sources:
// - Alfred Dunhill Links format (pro-am, free Thu-Sat, paid Sunday final):
//   alfreddunhilllinks.com/tickets
// - Singapore GP as F1's first night race: formula1.com (2008 inaugural)
// - Las Vegas GP route (Strip, Bellagio, Sphere): f1lasvegasgp.com
// - Abu Dhabi GP recurring championship-decider (2010, 2021): formula1.com
// - NZ-Australia 4-Test format, Boxing Day MCG Test: cricket.com.au

const OVERVIEWS = {
  "alfred-dunhill-links-2026":
    "Pros and celebrity amateurs play as partners across three Scottish courses: St Andrews, Carnoustie, and Kingsbarns. Watching is free Thursday to Saturday at all three; the Sunday final at the Old Course needs a ticket bought in advance.",
  "singapore-gp-2026":
    "F1's first night race, run under floodlights through the streets of Marina Bay. Heat and humidity make it a genuinely punishing circuit for drivers, even by F1 standards.",
  "atp-finals-2026":
    "The top 8 singles players and doubles teams close out the season at Turin's Inalpi Arena. Every match is between the best players in the world — there's no easy first round here.",
  "las-vegas-gp-2026":
    "A night race down the Strip, past the Bellagio fountains and the Sphere. Newer to the calendar than most F1 races, and built with the show in mind as much as the racing.",
  "abu-dhabi-gp-2026":
    "The season finale at Yas Marina Circuit, starting in daylight and finishing under floodlights. The championship has gone down to the wire here more than once.",
  "new-zealand-in-australia-cricket-2026-27":
    "Four Tests across four grounds, including the Boxing Day Test at the MCG — the biggest date on the Southern Hemisphere's cricket calendar.",
};

for (const [slug, overview] of Object.entries(OVERVIEWS)) {
  const result = await sql`
    UPDATE sporting_events SET editorial_overview = ${overview} WHERE slug = ${slug}
    RETURNING slug
  `;
  console.log(result.length > 0 ? `✓ updated: ${slug}` : `✗ NOT FOUND: ${slug}`);
}

const slugs = Object.keys(OVERVIEWS);
const rows = await sql`
  SELECT slug, editorial_overview FROM sporting_events WHERE slug = ANY(${slugs}) ORDER BY slug
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
