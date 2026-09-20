import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "getting-to-albert-park-tram-train-" + Date.now().toString(36);

const bodyContent = `Albert Park sits 5km south of Melbourne's CBD, and the Australian Grand Prix Corporation makes getting there deliberately easy: both tram and train travel direct to the circuit are free on the day, as long as you're carrying a valid Grand Prix ticket. Around 5,000 extra tram services run across race weekend specifically to handle the crowds, on top of the regular network.

The train option is Anzac Station, an eight-minute walk from Gate 5 — trains between State Library, Town Hall and Anzac stations are free with your Grand Prix ticket on the day of travel. If you're boarding anywhere other than Town Hall or State Library, though, you still need to tap on with a valid myki, since the free-travel zone doesn't cover the whole network end to end. Tram shuttles run direct from the city to gates around the circuit and are the more commonly used option, since they drop you closer to most gates than the single train station does.

The one thing worth planning around is the return trip. Getting to Albert Park in the morning is usually smooth — crowds are spread across several hours of arrivals. Getting away afterward is a different story: at peak departure times on Thursday, Friday and Saturday, wait times for tram shuttles at Gates 1 and 2 have run up to 40 minutes, and on Sunday after the race itself, waits of up to an hour aren't unusual. That's tens of thousands of people trying to leave inside the same 30-minute window.

Two things make the difference between a smooth exit and a long, crowded wait. First, don't rush straight to the nearest gate the second the chequered flag falls — a coffee, a lap of the Fan Zone, or a slow walk to a gate that isn't the closest one to your seat can put you ahead of the main surge rather than in the middle of it. Second, know your gate number before race day; Albert Park's gates each serve different grandstands, and picking the wrong shuttle queue on a crowded Sunday costs real time.`;

const whyItsSpecial = `Melbourne's approach to Grand Prix transport is genuinely unusual for a global sporting event — free tram and train travel on race day, thousands of extra services laid on, and a circuit close enough to the CBD that most visitors never need a car or a taxi at all. That's a real, considered piece of event infrastructure, not an afterthought bolted onto the ticket price.

The trade-off is the departure crush, which is real and worth planning around rather than being surprised by. A first-time visitor who treats the exit like the arrival — just walk to the nearest gate — is the person standing in a 40-minute or hour-long queue. Someone who knows to hang back ten minutes after the flag, or walk to a slightly less obvious gate, gets home while everyone else is still queuing. It's a small piece of local knowledge that changes the last hour of your day more than almost any other single tip.`;

const insiderTips = [
  "Delay your exit by 10-15 minutes after the session ends — grab a drink, walk the Fan Zone, or check the merchandise stalls — rather than joining the immediate rush to the nearest gate; queue times drop sharply once the first wave has cleared.",
  "If you're boarding the train from anywhere other than Town Hall or State Library stations, tap on with a valid myki even though the Grand Prix ticket covers the fare — the free-travel zone doesn't extend to every boarding point on the line.",
];

const whatToAvoid = "Don't assume every tram or train trip on race weekend is automatically free — the free-travel benefit applies specifically to direct services to/from the circuit on the day of your ticket, and boarding a train outside the Town Hall/State Library/Anzac free zone still requires a tapped myki. And don't leave Albert Park via Gates 1 or 2 at peak Sunday departure time without expecting a real wait — up to an hour has been recorded at the busiest points, and a different gate or a short delay can avoid it entirely.";

const practicalInfo = {
  hours: "Tram and shuttle services run from before gates open until well after each day's sessions end, 2–4 Apr 2027 — extra services are added specifically for Grand Prix weekend.",
  costRange: "Free — direct tram and train travel to/from Albert Park is included with a valid Grand Prix ticket on the day of travel.",
  bookingMethod: "No booking needed — show your Grand Prix ticket for free tram/train travel on the direct services; tap on with myki if boarding a train outside the Town Hall/State Library/Anzac free zone.",
  website: "https://transport.vic.gov.au/news-and-resources/projects-hub/greater-melbourne/metro-tunnel/more-ways-to-move",
  reservationsRequired: false,
};

const gettingThere = "Anzac Station is an eight-minute walk from Gate 5. Tram routes 1, 3, 5, 6, 16, 64, 67 and 72 all serve stops adjacent to the circuit gates, with free direct shuttle services and roughly 5,000 extra tram services added across race weekend. Check your ticket for which gate serves your grandstand before you travel.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Albert Park — Tram, Train & the Exit",
      subtitle: "Free tram and train travel on race day — and the one timing trick that avoids the hour-long queue home.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Albert Park Grand Prix Circuit",
      address: "Albert Park Grand Prix Circuit, 12 Aughtie Dr, Albert Park VIC 3206, Australia",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: transport.vic.gov.au/news-and-resources/events-and-public-transport/grand-prix (official free-travel policy, myki requirement outside free zone), grandprix.com.au/fan-zone/news/free-tram-travel-to-the-grand-prix (5,000 extra tram services, Anzac Station 8-min walk from Gate 5, peak departure wait times of 40 min weekdays / up to 1 hour Sunday). Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["budget-friendly", "authentic"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-20",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
