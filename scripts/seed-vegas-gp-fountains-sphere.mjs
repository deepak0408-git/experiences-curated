import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-fountains-sphere-" + Date.now().toString(36);

const bodyContent = `Two Las Vegas landmarks aren't just visible from the Las Vegas Strip Circuit — they're built into it. The cars run past both, and knowing their schedules turns a walk to your grandstand into its own piece of the weekend.

The Fountains of Bellagio choreograph water, light, and music across a lake the circuit's Turn 12-14 straight runs directly alongside. On weekdays the show runs every 30 minutes from 3pm to 7:30pm, then every 15 minutes from 8pm to midnight; weekends and holidays start at noon on the same 30-then-15-minute pattern. It's free, it runs 365 days a year weather permitting, and the music ranges from Sinatra to Lady Gaga depending on which show you catch. During race weekend, the fountains keep running on their normal schedule regardless of session times — meaning there's a real chance you'll walk past a live show on your way to or from qualifying or the race.

The Sphere, at the far end of the circuit near Turns 5 through 9, wraps its exterior in the Exosphere — over 1.2 million LEDs projecting visuals visible across the city, from an image of Earth to a giant eyeball to, on occasion, imagery tied directly to F1 itself, like a Formula One helmet. It's free to watch from outside, runs roughly from dusk through midnight, and needs no ticket at all — you're not paying to see the Exosphere, only to go inside for one of Sphere's own separate immersive shows, which is a different product entirely.

Both landmarks run on their own schedules independent of the race, which means seeing them well doesn't require planning around session times — it requires knowing roughly when to look up.`;

const whyItsSpecial = `A Grand Prix usually asks you to travel somewhere to watch a car go fast. Las Vegas is unusual because the two most photographed things in the city are also literally part of the route the cars take, and neither one costs anything to see properly. I'd tell a first-timer not to treat the fountains and the Sphere as separate sightseeing errands squeezed in around the racing — they're free, they're already on your walking route to nearly every grandstand, and catching either lit up at night, car engines somewhere in the background, is as much a part of what makes this specific Grand Prix worth the trip as any seat you book.`;

const insiderTips = [
  "The Fountains of Bellagio keep their normal public schedule during race weekend regardless of session times — check the current show schedule before you leave your hotel so you can time a walk to your grandstand around catching one live, rather than by luck.",
  "The Sphere occasionally runs F1-specific Exosphere content during Grand Prix week (helmet imagery and similar tie-ins have run in past years) — there's no fixed schedule for these special displays, so if you want to catch one, plan to walk past more than once across the weekend rather than assuming a single pass will show it.",
];

const whatToAvoid = `Don't confuse watching the Exosphere from outside (free, no ticket, visible any evening) with going inside Sphere for one of its ticketed immersive shows — they're entirely separate experiences with separate access, and assuming one covers the other is a common mix-up. Don't assume the fountains run on a race-specific schedule during Grand Prix weekend — they operate on their standard year-round timetable, so if you're hoping to catch a specific show, check the regular schedule rather than looking for race-weekend-specific times that don't exist.`;

const practicalInfo = {
  hours: "Fountains: Mon-Fri 3pm-7:30pm (every 30 min) then 8pm-midnight (every 15 min); Sat-Sun and holidays from noon on the same pattern. Sphere Exosphere: roughly dusk to midnight nightly",
  costRange: "Both free to view from outside",
  bookingMethod: "No booking needed to view either from outside. Sphere's separate ticketed interior shows are booked via sphere.com if you want to go inside.",
  howToBook: "",
  website: "https://www.visitlasvegas.com/listing/fountains-of-bellagio/34849/, https://www.visitlasvegas.com/listing/sphere/38440/",
  reservationsRequired: false,
};

const gettingThere = "Fountains: along Las Vegas Blvd outside Bellagio, near circuit Turns 12-14. Sphere: near Sands Avenue and circuit Turns 5-9. Both directly on foot routes between most Strip hotels and East Harmon/Koval/T-Mobile zone grandstand entrances.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Bellagio Fountains and the Sphere — Circuit Landmarks",
      subtitle: "Two free Vegas icons the race actually runs past — know the schedule, catch them live",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "The Strip",
      address: "Bellagio Fountains: 3600 S Las Vegas Blvd; Sphere: 255 Sands Ave, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from storyhunt.io/localadventurer.com fountain schedule guides, allaboutthesphere.com Exosphere technical detail, visitlasvegas.com official listings. Google ratings via Places API (New) direct lookup 29 Aug 2026: Fountains of Bellagio 4.8/60,906 reviews, Sphere 4.5/35,771 reviews — both exceptionally well-attested. Multi-venue experience, see MULTI_VENUE_RATINGS registry entry (venueCount: 2).",
      sport: ["formula_one"],
      moodTags: ["iconic", "free"],
      interestCategories: ["sightseeing"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
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
