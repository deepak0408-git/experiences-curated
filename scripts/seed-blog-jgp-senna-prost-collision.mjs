import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "suzuka-collision-decided-the-title-two-years-running";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4"; // Japanese GP 2027 (Suzuka)

const bodyContent = `## The pass that got thrown out

Going into the 1989 Japanese Grand Prix, Alain Prost led his McLaren teammate Ayrton Senna by 16 points with two races left, and the two men were no longer speaking off the track. On lap 47, Senna dived down the inside of Prost at Suzuka's chicane, the tight left-right just before the final corner. Prost turned in to hold his line. The cars locked together and stopped dead in the middle of the track.

Prost climbed out and walked away, his race over. Senna didn't. Marshals push-started his McLaren, and he rejoined by cutting straight across the chicane rather than looping back onto the circuit properly. He caught and passed Alessandro Nannini for the lead and crossed the line first. Hours later, race stewards disqualified him for missing the chicane, and the win, and the title, went to Prost.

Senna didn't accept it quietly. He accused FISA president Jean-Marie Balestre, a Frenchman, of manufacturing the ruling to hand the championship to a fellow Frenchman, calling it "a manipulation of the championship." The fallout ran into the winter: Senna had to sign a written apology to keep his competition licence for 1990, a condition he later said he only agreed to under pressure.

## The same track, the opposite outcome

A year later, the two were teammates no more — Prost had left for Ferrari — but the championship arithmetic put them right back in the same position at the same corner of the same circuit. This time Senna led the standings going into Suzuka, and this time the corner in question was Turn 1, not the chicane.

Senna had pole position but a grievance: he'd asked for pole to be moved to the cleaner side of the track, on the racing line, and been refused. On the first lap, with Prost's Ferrari alongside him into Turn 1, Senna held his line rather than back out of it. The two cars came together at well over 100mph and both were out of the race before the first lap was over.

With Prost eliminated and Senna needing only to finish ahead of him in the standings, the title was his the moment both cars stopped. It was a mirror image of 1989 in outcome and a mirror image in method — contact, not a clean pass, decided both championships — except this time Senna was the one left standing.

## One rivalry, one track, two collisions

Two Suzuka races, two collisions between the same two drivers, two world titles settled by contact rather than a chequered flag. Prost and Senna never fully repaired the relationship; Prost later said the 1990 crash was no accident, a view Senna never fully disputed in public. Whatever actually happened at Turn 1 that October afternoon, the sport had already watched this exact story end the opposite way twelve months earlier, at the same track, between the same two men.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Grand Prix Decided by a Collision, Two Years Running",
    sport: ["formula_one"],
    sportingEventId: EVENT_ID,
    contentCategory: "rivalry",
    excerpt: "Senna and Prost's championship came down to a collision at Suzuka in 1989 — and again in 1990. Same two drivers, same track, opposite outcomes both times.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote: "Sources: Motorsport.com, 'Flashback: The Prost/Senna collision that shook the world' — 1989 chicane incident, push-start/chicane-cut disqualification. CNN, 'When Suzuka staged Senna and Prost rivalry' — Balestre conspiracy accusation, licence apology. Formula1.com, 'Prost vs Senna: how the infamous Suzuka '89 clash unfolded' — pre-race points gap, race context. Wikipedia, '1990 Japanese Grand Prix' — Turn 1 lap-1 collision, pole-position dispute, championship-clinching context. RaceFans, '20 years since Senna took out Prost at Suzuka' — Prost's later view that the 1990 crash was deliberate. Researched 23 Sep 2026. Article 1 of 5 in the Japanese GP 2027 blog batch (angles locked with founder 23 Sep 2026). Hero image pending — sourced separately, all 5 articles' images to be applied as a batch at the end per founder instruction.",
    publishedAt: new Date("2026-09-23T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
