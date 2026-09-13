import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "qatar-gp-2023-heat-crisis-driver-safety";
const QATAR_GP_2026_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";

const bodyContent = `Max Verstappen won the 2023 Qatar Grand Prix at Lusail International Circuit on 8 October by 4.8 seconds over Oscar Piastri, and clinched his third Drivers' Championship in the same weekend after teammate Sergio Pérez was eliminated from title contention in the sprint race. Almost none of that is what people remember about that afternoon.

## What was actually happening inside the cars

Cockpit temperatures that day reportedly exceeded 50°C (122°F), according to Mercedes driver George Russell. Aston Martin's Lance Stroll said he was dizzy and "passing out" behind the wheel. Alpine's Esteban Ocon vomited inside his own helmet mid-race and kept driving. Williams driver Alexander Albon was pulled aside for medical evaluation for acute heat exposure after crossing the line, and his teammate Logan Sargeant retired from the race entirely, suffering from what the team described as intense dehydration.

This wasn't one driver having a bad day in the heat. It was most of the grid, in the same conditions, at the same time.

## Why the FIA couldn't treat it as a one-off

F1 had raced in serious heat before — Malaysia, Bahrain, and Singapore all sit in the same climate band. What made Qatar different was the combination: extreme ambient heat and humidity on a circuit with almost no low-speed sections, so drivers got no real moment to let their core temperature recover between corners. The FIA opened a formal review into the race, and its findings pushed toward changes on three fronts: clearer guidance for teams and drivers, research into improving cockpit airflow, and a longer-term look at whether races in the hottest climates should sit differently on the calendar.

## The vest that took three years to become mandatory

The most visible outcome was a driver cooling system — a vest worn under the race suit, with tubing that circulates coolant to bring down core body temperature. It was developed and tested through 2024, then made available from the 2025 season alongside a new "Heat Hazard" declaration: whenever forecast ambient temperature crosses 31°C, teams may fit the full cooling system and run with an extra 5kg of allowed car weight to cover the added equipment.

Even with the system optional, several drivers, including Verstappen and Lewis Hamilton, pushed back on the idea of it being forced on everyone regardless of how an individual driver's body handles heat. The FIA held its ground on the timeline anyway: from the 2026 season, the cooling system becomes mandatory at any race that crosses the Heat Hazard threshold. Given Lusail's climate, and the fact that the rule exists because of what happened here, this is very much the race it was built for.

## Why it's worth knowing before you go

None of this changes much about what a spectator actually experiences trackside. Qatar has since shifted its race date later into the calendar, away from October's peak heat. But it's worth knowing, walking into Lusail, that a single afternoon here forced Formula 1 to rewrite its own rulebook. Not every circuit can say that.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The 2023 Qatar Grand Prix Heat Crisis — the Race That Made F1 Rethink Driver Safety",
    sport: ["formula_one"],
    sportingEventId: QATAR_GP_2026_EVENT_ID,
    contentCategory: "history",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Max Verstappen won his third title at Lusail in October 2023, but the race is remembered for something else entirely — drivers vomiting in their helmets and cockpit temperatures past 50°C, in a crisis that eventually rewrote F1's safety rules.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: race result (Verstappen win by 4.8s, Piastri 2nd, Norris 3rd), 8 Oct 2023 date, Verstappen's 3rd title clinched that weekend after Pérez's sprint crash — racingnews365.com, autosport.com, rappler.com, en.wikipedia.org/wiki/2023_Qatar_Grand_Prix. Driver heat reports (Stroll dizzy/'passing out', Ocon vomiting in helmet, Albon medical evaluation, Sargeant retirement/dehydration, Russell's 50°C/122°F cockpit reading) and FIA's formal review — KUOW/NPR wire copy, CNN (10 Oct 2023), the-race.com. Cooling vest development timeline, 2025 optional rollout, 31°C 'Heat Hazard' threshold with 5kg allowance, mandatory from 2026 — alpinef1.com ('New F1 rules for 2025'), motorsportmagazine.com, ESPN (hamilton-verstappen-urge-fia-not-enforce-silly-cooling-vests). Verified 13 Sep 2026.",
    publishedAt: new Date(),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
