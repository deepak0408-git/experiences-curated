import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-first-timer-orientation-" + Date.now().toString(36);

const bodyContent = `Every session at the Las Vegas Grand Prix runs at night, and that single fact changes more about how to prepare than most first-time attendees expect. Late November in Las Vegas means mild days, mid-60s to low 70s Fahrenheit, but temperatures drop into the mid-40s once the sun goes down — and every practice, qualifying, and the race itself happens after dark. Exposed grandstand and general admission seating, plus genuine desert wind once evening sets in, make it feel colder than the number on your phone suggests.

Dress in layers you can add and remove: a light top works fine before sunset, but you'll want long pants, closed-toe shoes, and a real jacket once qualifying or the race gets underway. It rains on roughly 5 days in a typical November, so packing something lightweight and waterproof, even if you never need it, is worth the space in your bag. Bring lip balm and moisturizer too — desert air is dry enough during the day that it catches people off guard even before evening cold sets in.

The event runs entirely cashless. Every food, drink, and merchandise purchase on-site is card or mobile payment only, so don't plan on carrying cash as a backup. You'll also be walking a genuine amount — between your entry gate, the grandstands, food stalls, and general activations, comfortable footwear matters as much here as it does anywhere else on the Strip.

One detail worth knowing if your seat or standing spot is close to the track: F1 cars are loud enough at close range that hearing protection is a real, non-dramatic thing to pack, not overcaution. And despite the sport's reputation for partisan crowds elsewhere, F1 fans at this race have a track record of applauding good driving regardless of team colors — teamwear from every team mixes freely in every zone, without the tension some other major sporting events carry.`;

const whyItsSpecial = `A night race sounds like a scheduling detail until you're standing in 45-degree wind at 9pm in a t-shirt because you planned around the daytime forecast instead of the actual session times. This is the piece I'd want a genuine first-timer to read before anything else on the pack, because almost every other experience here assumes you've already got the basics — dress, cash, footwear, noise — sorted. Getting oriented on what a Vegas night race actually demands is what turns the rest of the weekend from a series of small discomforts into the spectacle it's built to be.`;

const insiderTips = [
  "Pack for the coldest session on your schedule, not the mildest — if you're only attending Saturday's race, dress for mid-40s desert night wind even if Thursday and Friday's forecasts looked milder during the day.",
  "The event is entirely cashless, including food and merchandise stalls — load your payment app or confirm your card works internationally (if traveling from abroad) before race weekend, not once you're already in line hungry.",
];

const whatToAvoid = `Don't judge how warm to dress based on the daytime forecast — Vegas's desert climate swings dramatically after sunset, and every session at this race happens after dark, so a daytime-only weather check will genuinely underdress you. Don't assume you can duck out for cash if your card fails — the entire event runs cashless, and there's no on-site fallback if your only payment method stops working mid-session.`;

const practicalInfo = {
  hours: "Practice Thu 19 Nov, Qualifying Fri 20 Nov, Race Sat 21 Nov 2026 — all sessions run evening into night, Pacific time",
  costRange: "No cost — this is orientation guidance, not a ticketed experience",
  bookingMethod: "No booking required. Download the official Las Vegas Grand Prix app before arrival for real-time scheduling, maps, and entertainment info.",
  howToBook: "",
  website: "https://www.formula1.com/en/latest/article/helpful-information-when-visiting-the-las-vegas-strip-circuit-for-the-las.26AHYJ72F3A2urDHRXdine, https://oversteer48.com/las-vegas-f1-dress-code/",
  reservationsRequired: false,
};

const gettingThere = "Applies circuit-wide — general orientation for any zone or grandstand at the Las Vegas Strip Circuit.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "First-Timer Orientation — a Night Race, and What Changes",
      subtitle: "Dress for mid-40s desert cold after dark, bring a card not cash, and pack ear protection",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Las Vegas Strip",
      address: "Las Vegas Strip Circuit, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from formula1.com official visitor info article, oversteer48.com dress code guide, redbull.com cold-temperature analysis, and themanual.com/yahoo.com first-timer tips (cashless event, hearing protection, fan atmosphere). Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
