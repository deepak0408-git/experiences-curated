import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "ultimate-sports-travel-packing-checklist-f1-tennis-golf-cricket";

// Note: app/blog/[slug]/page.tsx's renderBody() only splits bodyContent on
// blank lines ("\n\n") into paragraph blocks — there's no real markdown list
// parser, so every checklist item needs its own blank-line-separated block
// to land on its own line, not just a single "\n".
const bodyContent = `Pack for a football match and you're mostly deciding on a coat. Pack for a Grand Prix, a Grand Slam, a major, and a Test match, and you're solving several problems that have almost nothing in common, on top of the ordinary work of getting yourself and your documents across a border. Here's one list that covers all of it, with the sport-specific items called out where they apply.

## The full checklist

1. Passport, and visa documents if required, check well ahead of departure, not the week of.

2. Photo ID matching your ticket name, several venues now run name-matched entry checks.

3. Printed or downloaded ticket, not just an email link, stadium wifi buckles under crowd load exactly when you need to pull it up.

4. Universal travel adapter.

5. eSIM or international roaming sorted before you land, don't wait to sort connectivity at the airport.

6. Small cash notes, alongside a card, some kiosks and vendors outside the venue don't take cards, even where the ground itself has gone cashless.

7. Empty refillable water bottle, most major venues across all four sports allow an empty bottle through security and have fill points inside, a full one gets confiscated at the gate.

8. Cap or wide-brim hat.

9. Sunscreen, reapplied through the day, cloud cover doesn't block UVA, so don't skip it on an overcast forecast.

10. Portable phone charger.

11. A packable layer, every sport on this list runs sessions that start warm and end cold, or the reverse.

12. Basic first-aid, pain relievers, blister plasters.

13. Comfortable, broken-in shoes.

14. Check that specific venue's bag policy the morning you travel, not the week before, some venues require a clear bag specifically, and rules change season to season.

## Sport-specific additions

For F1: earplugs, for every day of the weekend. This is the one genuinely non-negotiable item on the whole list. At full throttle, an F1 car has been measured at close to 140 decibels trackside, according to acoustical engineer Craig Dolder's research, reported by Scientific American. That's just under the level known to cause permanent hearing loss, and past what OSHA considers safe for sustained exposure over a normal workday. Bring kid-sized earplugs or proper ear defenders for children, adult plugs don't seal right for smaller ears.

For tennis: check your specific major's bag size rules before you pack the bag itself. They vary more than you'd think, the US Open caps bags at 12" x 12" x 16" with no on-site storage for oversized ones, the Australian Open works on a rougher "must fit under your seat" standard, and the French Open uses a 15-litre capacity limit with mandatory bag check for anything bigger.

For tennis: light-coloured, breathable clothing, natural fabrics hold up better than synthetics over a long day in direct sun.

For golf: binoculars, genuinely useful, since you're often watching from well back off the tee or green.

For golf: polarized sunglasses, for glare off open grass and fairways, which offer none of the shade a stadium roof or grandstand gives you.

For cricket: an umbrella for the walk in, but check the ground's rules, since most venues don't allow umbrellas up once play has started.

None of this is glamorous advice. It's mostly about not losing an hour of your day to a gate argument over bag size, or your hearing to a race you didn't protect your ears for.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Ultimate Sports Travel Packing Checklist: F1, Tennis, Golf, and Cricket",
    sport: ["formula_one", "tennis", "golf", "cricket"],
    sportingEventId: null,
    contentCategory: "travel_craft",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "One checklist for four very different match days, plus the passport-and-adapter basics every international sports trip needs and still forgets.",
    bodyContent,
    readMinutes,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "F1 noise levels (~140dB trackside) and OSHA safe-exposure comparison: acoustical engineer Craig Dolder's research, reported by Scientific American (scientificamerican.com/article/formula-1-racing-loud-enough). Tennis major bag policies (US Open 12x12x16in, Australian Open under-seat standard, French Open 15L cap): aggregated from Radical Storage, Stasher, and Sportskeeda spectator-guide coverage, secondary sources not each tournament's own official page. Cricket umbrella-during-play restriction corroborated by Lord's official site (lords.org/lords/match-day/plan-your-day/what-to-bring) as a common but not universal ground practice. Golf sun-exposure/binoculars advice: aggregated general spectator-guide sources, not one tournament's official rulebook. Passport/visa, adapter, eSIM, first-aid and cash items are general international-travel practice, not sourced factual claims. Verified 22 Sep 2026. Hero image pending — founder supplying directly.",
    publishedAt: null,
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");
console.log("  NOTE:  Hero image not set — update via curator/blog or a follow-up script once founder supplies the image.");

await client.end();
