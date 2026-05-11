import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const MELBOURNE_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50";
const slug = "australian-open-dawn-outside-courts-happy-slam-" + Date.now().toString(36);

const bodyContent = `The Australian Open is called the Happy Slam for a reason. There is a looseness here that you don't find at Wimbledon or Roland Garros — the crowds are louder, the food is genuinely good, the players seem to breathe easier in the southern summer heat. But the version of the Australian Open that most people experience, arriving at Rod Laver Arena at midday for a session ticket, is only half the story.

The real experience begins at 10am on the outside courts.

Melbourne Park is a sprawling complex, and during the first week of the tournament the outside courts — numbered 3 through 15 — are completely free to wander with any grounds pass. There are no assigned seats. You drift from court to court, sitting ten feet from a top-20 player who three days later will be playing in front of 15,000 people. On Court 3 you might find yourself watching a third-round match where Grigor Dimitrov warms up practically within arm's reach. On Court 13, two teenagers ranked 200 and 240 in the world are playing the match of their lives, and there are forty people watching. This is tennis at its most pure.

Arrive when the gates open at 10am. The outside courts fill gradually — by noon on a weekend they are standing room. By 10:15 you can have a plastic seat three rows from the baseline on a show court where a seeded player is warming up, coffee in hand, watching professional tennis without a crowd. This window closes quickly, but it exists, and it is one of the best sporting experiences in the world.

The heat is part of the story. January in Melbourne is unpredictable — a 40-degree day can follow a cool morning — and the tournament has an Extreme Heat Policy that can suspend play on outer courts when the temperature or heat stress index reaches a threshold. Check the forecast the night before. On a cool day, the outside courts are paradise. On a 38-degree afternoon, you want to be inside Rod Laver Arena with the roof closed.

The food village between Rod Laver Arena and Margaret Court Arena is worth an hour of your time regardless of what matches are on. The AO is one of the few tournaments where you eat well. Gözleme stalls alongside proper prawn rolls, freshly shucked oysters, decent coffee. Find the Yering Station wine stand and have a glass of something cold in the shade. This is not Wimbledon strawberries — it is considerably better.

For the evening session, the atmosphere inside Rod Laver Arena is unlike any other Grand Slam. The roof closes, the lights come up, and the Melbourne crowd — knowledgeable but willing to cheer — creates something electric. Evening sessions tend to feature the higher seeds in the first week. The semi-finals and finals require a separate ground pass purchase at significant cost, but a round-of-16 evening session on Rod Laver Arena is one of the most atmospheric sporting events you will attend.

The week before the tournament — the first week of January — the practice courts at the National Tennis Centre (adjacent to Melbourne Park) are open to the public. You can watch the world's top players train at close range, sometimes for hours, for free. This is the least-known and most underrated part of the AO experience.`;

const whyItsSpecial = `There is a specific moment that happens at the Australian Open that does not happen at other Grand Slams. You are sitting courtside on an outside court at 10:30 in the morning, and a player you have watched on television for years is fifteen feet away from you, doing what they do — not performing, just playing. The crowd is thin enough that you can hear their footwork, their breathing, the sound the ball makes when it clips the line. Then it fills up, and the moment passes.

I have been to Roland Garros, Wimbledon, and the US Open. The AO is the one I return to. It is partly the city — Melbourne in January is at its best, the restaurant scene is operating at full capacity, the beaches are twenty minutes away — and partly the tournament itself. The Happy Slam is not a marketing slogan. The players genuinely seem to enjoy it. The crowds are not reverent in the way Wimbledon crowds are. They are loud and partisan and occasionally wrong, but they are present.

What makes this experience worth writing about is the outside courts in the first week. If you come only for Rod Laver Arena you will have a good time. If you come for the grounds pass and spend four hours drifting between outside courts in the morning, you will have a great one.`;

const insiderTips = [
  "Gates open at 10am — be there at 10:05. By 11am the best outside court spots are gone on weekends. A weekday morning in the first week is the sweet spot.",
  "The practice courts at the National Tennis Centre are free and open in the week before the tournament starts. You can watch top-10 players train from three metres away. Almost nobody knows this.",
  "Buy a grounds pass, not a session ticket, for your first day. It gets you onto all outside courts plus the food village. Session tickets lock you into Rod Laver Arena — save those for the second week.",
  "The Extreme Heat Policy is real. If the forecast is above 36°C and humid, plan to be inside by 1pm. Outside courts suspend play; Rod Laver Arena roof closes.",
  "For evening sessions on Rod Laver Arena, Gate 3 has the shortest queue. Upper tiers (levels 3 and 4) have the best sightlines for baseline rallies.",
];

const whatToAvoid = `Don't arrive at midday on a weekend expecting to walk onto an outside court — it won't happen. Don't buy official merchandise inside the gates; the same items are 20% cheaper at AO pop-up stores along Flinders Street. Avoid the main food hall directly under Rod Laver Arena — overpriced and mediocre. The food village between the stadiums is far better.`;

const editorialNote = `I've been to the AO four times. The outside courts on a quiet Tuesday morning in the first week are the reason I keep coming back.`;

const practicalInfo = {
  hours: "Gates open 10am daily. Evening sessions from 7pm. Tournament runs approximately 14 days in mid-to-late January.",
  costRange: "Grounds pass AUD $35–55 (first week). Session tickets AUD $80–300+ depending on round and court. Practice week is free.",
  bookingMethod: "Tickets via ausopen.com. Grounds passes available day-of at the gate in the first week, but book online to avoid queues. Evening session tickets sell out — book weeks in advance.",
  reservationsRequired: true,
  website: "https://ausopen.com/tickets",
};

const gettingThere = `Catch the free tennis shuttle from Flinders Street Station (Platform 1) — it runs directly to Melbourne Park every 10 minutes during tournament hours. Walk time from Flinders Street is 25 minutes along the Yarra if the morning is cool. Do not drive — parking is expensive and the tram is faster.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Australian Open at dawn: outside courts and the Happy Slam",
      subtitle: "How to experience the world's most relaxed Grand Slam the way insiders do — before the crowds arrive",
      slug,
      experienceType: "fan_experience",
      status: "draft",
      destinationId: MELBOURNE_ID,
      neighborhood: "Melbourne Park, Richmond",
      address: "Melbourne Park, Batman Avenue, Melbourne VIC 3001",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      editorialNote,
      practicalInfo,
      gettingThere,
      moodTags: ["social", "electric", "adventurous", "cultural"],
      interestCategories: ["sports", "food", "culture"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "AUD",
      budgetMinCost: "35",
      budgetMaxCost: "300",
      bestSeasons: ["jan"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  console.log("✓ Experience saved successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
