import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "tifosi-monza-pilgrimage-no-fixed-seat";
const ITALIAN_GP_EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";

const bodyContent = `Most pilgrimages have a destination you stand still at. The tifosi's doesn't — the actual ritual only happens once the race is over and the gates open.

## A track built in 110 days, inside a royal park

The Autodromo Nazionale Monza was constructed in just 110 days in 1922, inside the Parco di Monza — a former royal estate north of Milan that had served as a summer residence for the House of Savoy. It was only the world's third purpose-built race track, after Brooklands and Indianapolis. On opening day, roughly 200,000 people traveled in from across Italy and Europe to see it. That first crowd is the same instinct that fills the grandstands every September since: the track earned its nickname, the Temple of Speed, before Ferrari ever raced there.

## The ritual that happens after the race, not during it

What actually defines the tifosi experience isn't the race itself — it's what happens the moment it ends. When the chequered flag drops, gates open and thousands of fans flood directly onto the circuit, sprinting down the main straight toward the podium, which sits directly above the start-finish line. The podium ceremony happens with fans standing beneath it, chanting and waving red flags while champagne rains down from above. It's not a controlled photo opportunity — it's a genuine mass migration onto the same tarmac the cars were lapping minutes earlier, and it's unlike anything else on the F1 calendar.

## Why it's a pilgrimage, not just a race weekend

What separates the tifosi from other passionate fanbases is generational depth — families who have been returning to Monza for decades, the relationship less about any one driver and more about a specific stretch of tarmac that's meant something to their family for two generations or more. A Ferrari win at Monza isn't treated as a good result; it's treated as a genuine national occasion.

## Why this is the pick

There's no single grandstand or corner that makes Monza the pilgrimage it is — the tifosi's pilgrimage doesn't have a fixed seat, because the whole point is ending up on the track itself, standing where the cars just were, when the race is already over. That's a ritual no other circuit on the calendar offers.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Tifosi at Monza — a Pilgrimage With No Fixed Seat",
    sport: ["formula_one"],
    sportingEventId: ITALIAN_GP_EVENT_ID,
    contentCategory: "bucket_list",
    seriesSlug: "pilgrimages",
    seriesPosition: 2,
    excerpt: "The real tifosi ritual doesn't happen during the race — it happens after, when the gates open and thousands flood the track to stand beneath the podium as champagne rains down.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Monza's 1922 construction (110 days, Parco di Monza royal estate, third purpose-built track after Brooklands/Indianapolis), 200,000 opening-day crowd, 'Temple of Speed' nickname — monzanet.it and worldinsport.com. Post-race podium track invasion, podium position above the start-finish straight, champagne-shower detail — fastway1.com and salracing.com. Generational tifosi fandom framing — grandprixgrandtours.com and scuderiafans.com. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-16T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
