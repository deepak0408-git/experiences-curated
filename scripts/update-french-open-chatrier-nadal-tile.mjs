import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "court-philippe-chatrier-suzanne-lenglen";

const bodyContent = `Roland-Garros has two show courts, and they don't feel like siblings. Court Philippe-Chatrier is the one everyone means when they say "Center Court" here: 15,225 seats, red clay that's been raked in this same corner of the 16th arrondissement since 1928, and a bowl that was almost entirely rebuilt between 2018 and 2020. It carried a plainer name for most of its life, Court Central, until 2001, when the FFT renamed it for Philippe Chatrier, the federation president who spent the 1970s and 80s fighting to get tennis back into the Olympics. He won that fight in 1988. The court named for him now closes with a roof.

That roof is the real story of the last renovation. Eleven steel trusses, 330 tonnes apiece, slide shut in about 15 minutes when the Paris sky does what it usually does in late May. Before 2020, rain meant a dead afternoon and a rescheduled match. Now Chatrier keeps playing, and something about watching clay-court tennis under an enclosed roof, muffled crowd noise bouncing off steel instead of open sky, changes the atmosphere in a way that's hard to predict until you're sitting in it.

Chatrier carries one more permanent mark now. In May 2025, Roland-Garros set a tile bearing Rafael Nadal's footprint into the ground beside the net, alongside a plaque engraved with the Musketeers' Cup and his record 14 titles. It's the only tribute of its kind on the court, and for the sport's biggest clay-court fanbase, finding it courtside is close to a pilgrimage stop in its own right.

Suzanne-Lenglen sits a short walk away and plays a different role entirely. Built in 1994 as "Court A" before earning Lenglen's name, it holds 10,068 people across an upper and lower circle and got its own retractable roof in the same 2020 project, the second court at Roland-Garros to have one. Lenglen won six Wimbledon titles and six French Championships in the 1920s, dominant enough that the French called her La Divine, and the surface named for her tends to produce the tournament's best second-tier matches: seeded players not yet at Chatrier level, former champions on the way down, the ones fighting hardest to be somewhere else next year.

Ticket categories map directly onto how close you sit to the baseline. On Chatrier and Lenglen, Category Gold and Category 1 run along the lower rows nearest the court, Category 2 climbs into the mid-tier, and outside courts like Simonne-Mathieu sit in their own cheaper bracket entirely. A single day on Chatrier or Lenglen runs somewhere in the €75-198 range depending on category and which day of the tournament, climbing sharply for the final weekend. Hospitality packages through the FFT's own Sodexo Live!-run tiers, Le Pavillon, La Mezzanine, L'Orangerie, sit well above that, with lunch and lounge access built into the price.

Buy through the official Roland-Garros ticketing site first. The FFT runs its own resale marketplace for tickets people can no longer use, sold back at face value, and that's the only resale channel worth trusting. Everything outside it, however official-sounding the name, is a gamble you don't need to take for a ticket this easy to get legitimately.`;

const insiderTips = [
  "Category Gold and Category 1 seats sit in the lower rows on both Chatrier and Lenglen — closest to the clay, but the cheaper Category 2 tier in the upper bowl often gives a better full-court sightline for following rallies rather than just the baseline action in front of you.",
  "The roof closes in around 15 minutes once rain starts — if play is suspended, stay in your seat rather than heading for cover elsewhere in the grounds; the restart is usually faster than people expect once the trusses are shut.",
  "Lenglen's ticket prices run noticeably below Chatrier's for the same day of the tournament, and the standard of tennis in the second week is frequently just as high — a genuinely good-value alternative if Chatrier is sold out or over budget.",
  "Nadal's footprint tile sits beside the net on Chatrier, not at the entrance or in a concourse — you'll need to be courtside (or watching closely on the broadcast camera pass) to spot it, since it isn't sign-posted for passing foot traffic.",
];

const editorialNote = "Court history/capacity from Wikipedia (Stade Roland Garros), worldstadia.com, stade.rolandgarros.com. Ticket categories/pricing from official rolandgarros.com ticketing pages and cross-referenced goaltickets.com pricing guide, 2026 season as proxy for 2027 (not yet on sale). Roof spec (11 trusses, 330t, ~15min close) from rolandgarros.com roof explainer and CNN coverage. Nadal footprint tile (installed 25 May 2025, beside the net) from rolandgarros.com official tribute article and ATP Tour coverage. Google rating verified via Places API lookup, 4 Sep 2026.";

try {
  const [result] = await db
    .update(experiences)
    .set({
      bodyContent,
      insiderTips,
      editorialNote,
      lastVerifiedDate: "2026-09-07",
    })
    .where(eq(experiences.slug, slug))
    .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

  console.log("✓ Updated:", result.slug, `(${result.status})`);
  console.log("Reminder: this experience is published — re-click Publish on it in /curator/review to bust the 1hr page cache.");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
