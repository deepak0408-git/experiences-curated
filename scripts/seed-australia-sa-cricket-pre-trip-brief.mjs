import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const EVENT_SLUG = "australia-in-south-africa-cricket-2026";

const lines = [
  "Weather in Cape Town: spring here doesn't commit to anything. Expect highs around 18-20°C, lows near 10°C, and rain on 9-11 days across the tour window, so pack layers, not just a jacket. A morning at Newlands can start grey and burn off by lunch, or not.",
  "Weather in Johannesburg: highs move from the low 20s in late September to the mid-20s by late October, but nights still drop to single digits, so bring something warm for evening sessions at the Wanderers. The UV index runs very high even now, well before it feels like summer, so sunscreen matters more than the temperature suggests.",
  "Weather in Durban: warm and getting stickier as October goes on, daytime highs around 24-25°C with humidity near 75%. Rain tends to hit in short, hard bursts rather than settle in for the day, so a quick-dry layer beats an umbrella.",
  "Transport in Cape Town: MyCiTi buses stop on Main Road and at Newlands itself, a short walk over the pedestrian footbridge to the ground. Skip driving on match days — parking around Campground Road fills early.",
  "Transport in Johannesburg: the Gautrain covers OR Tambo to Sandton in about 15 minutes, and Rosebank, one stop further, sits roughly 2km from the Wanderers, an easy walk or short Uber. Last train from Sandton leaves at 20:50, worth remembering if a day match drags into the evening.",
  "Transport in Durban: Uber and Bolt from King Shaka Airport into the city take 30-40 minutes and run roughly R300-500, cheaper and more predictable than the metered taxi rank. Kingsmead sits close enough to the Golden Mile hotels that plenty of fans just walk in.",
  "What's special: this is Australia's first Test tour of South Africa since the 2018 ball-tampering scandal, with genuine World Test Championship points on the line. Newlands has a real history of selling out before general sale opens on TicketPro (tickets.cricket.co.za) — prioritise the Cape Town Test if you're only committing to one leg. Check cricket.co.za or the CSA app for the latest schedule confirmations as the tour approaches.",
];

// Escape for postgres array literal
const arrayLiteral = "{" + lines.map(l => `"${l.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",") + "}";

const [row] = await sql`
  UPDATE sporting_events
  SET pre_trip_brief_lines = ${arrayLiteral}::text[],
      pre_trip_brief_live_at = NOW(),
      pre_trip_brief_updated_at = NOW()
  WHERE slug = ${EVENT_SLUG}
  RETURNING slug, pre_trip_brief_lines, pre_trip_brief_live_at
`;

if (!row) {
  console.error("✗ No row updated — check event slug:", EVENT_SLUG);
} else {
  console.log("✓ Pre-trip brief set for:", row.slug);
  console.log("  Lines saved:", row.pre_trip_brief_lines.length);
  console.log("  Live at:", row.pre_trip_brief_live_at);
  console.log("\n→ Check pack view at: http://localhost:3000/event-pack/australia-in-south-africa-cricket-2026");
}

await sql.end();
