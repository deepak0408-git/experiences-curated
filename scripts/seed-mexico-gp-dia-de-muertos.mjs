import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-dia-de-muertos-" + Date.now().toString(36);

const bodyContent = `2026 race weekend lands directly on top of Día de Muertos, and this isn't a minor scheduling coincidence — it means you're arriving for one of the biggest, most emotionally significant weekends on Mexico City's entire annual calendar, independent of the Grand Prix. Understanding what's actually happening around you changes the whole trip.

The city's Grand Parade traditionally runs on the Saturday nearest November 2nd, which for 2026 points to Saturday, October 31st — directly inside race weekend itself. The exact route and time get published closer to the date by the city government, but the parade has followed a consistent path in recent years: starting at Puerta de los Leones in Chapultepec, moving along Paseo de la Reforma, then Avenida Juárez, then 5 de Mayo, finishing at the Zócalo — roughly 6km of processional route, running from around midday to mid-afternoon. It's free, open to anyone, and the best viewing spots (Glorieta de la Palma, the Angel of Independence roundabout, and the stretch between the Angel and Alameda Central) fill up early — arriving by mid-morning is the realistic way to claim a good spot rather than watching over a crowd of heads.

Monumental altars, or ofrendas, appear across the city during this period — a huge installation typically goes up in the Zócalo itself, alongside smaller neighborhood altars throughout Roma, Condesa, and other areas. These aren't decorations in the way a Halloween display is; each altar is built to welcome the spirits of specific departed loved ones home for the night, with marigolds, candles, photographs, and the deceased's favorite foods laid out as an actual offering, not a symbolic gesture.

The etiquette here matters more than it does at most festivals, because this is a genuine act of mourning and remembrance layered underneath the public celebration. Don't touch anything on a private altar without permission, and never treat a cemetery vigil as a photo opportunity — families spend the night at gravesides sharing stories and honoring their dead, and that's a deeply personal moment to observe respectfully from a distance, not to approach for close-up photos. If you do want a photo of someone in elaborate Catrina-style face paint in a public setting, ask first — a simple "¿Puedo tomar una foto?" is almost always welcomed. Wearing Catrina makeup yourself as a visitor is generally seen as a respectful way to participate, provided it's done with real understanding of what the festival means rather than as a costume. What isn't welcome: treating this as "Mexican Halloween," which misses the entire point, or showing up in a costume built for a different holiday's aesthetic rather than this one's actual meaning.`;

const whyItsSpecial = `Most sporting events happening during a country's biggest cultural weekend feel like an inconvenient scheduling clash — hotels get more expensive, streets get busier, and travelers often wish the two things weren't overlapping. Mexico City 2026 flips that logic entirely. The race and Día de Muertos aren't competing for your attention; they're compounding into a single, once-in-a-cycle version of this trip that fans attending in a normal year simply don't get. You're not choosing between the Grand Prix and the parade — you get both, in the same handful of days, in a city that treats both with real seriousness. That combination doesn't repeat on a predictable schedule, which is exactly why it's worth building real time into your itinerary for the parade and the altars, not just the circuit.`;

const insiderTips = [
  "Claim your parade viewing spot by mid-morning, well ahead of the roughly midday start — the stretch between the Angel of Independence and Alameda Central is repeatedly named as where the atmosphere peaks, but it's also where the crowd builds fastest.",
  "If you want to photograph someone in Catrina-style makeup in a public setting, ask first with a simple '¿Puedo tomar una foto?' — it's a small gesture that's almost always met warmly, and skipping it is one of the more common things visitors get wrong here.",
];

const whatToAvoid = `Don't call this "Mexican Halloween" anywhere, including in your own social media captions — it trivializes a genuine act of remembrance and mourning that happens to also be publicly celebratory, and locals notice the framing. And don't get so absorbed in the parade crowd along Reforma that you stop tracking your bag or your group — hundreds of thousands of people line this route, and pickpocketing in exactly this kind of dense, distracted crowd is the most commonly reported real safety issue, not a hypothetical one. Use a bag that closes securely, keep valuables off your back, and agree on a meeting point with anyone you're with in case the crowd separates you.`;

const practicalInfo = {
  hours: "Grand Parade: traditionally the Saturday nearest Nov 2, likely Oct 31 in 2026 — exact time and route confirmed by CDMX government closer to the date, historically running roughly 12pm-4pm",
  costRange: "Free — the parade and public altar viewing require no ticket or entry fee",
  bookingMethod: "No booking needed — this is a free, public city-wide celebration. Check the official CDMX government tourism site in October for the confirmed 2026 route and schedule.",
  website: "https://www.casagoliana.com/blog/day-of-the-dead-parade-mexico-city-2026",
};

const gettingThere = "The parade route runs from Chapultepec (Puerta de los Leones) along Paseo de la Reforma to the Zócalo — any Metro station along that corridor (Chapultepec, Reforma-area stops, or Zócalo itself) gives reasonable access to a viewing point.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Día de Muertos — The Grand Parade & Altars Weekend",
      subtitle: "Race weekend collides with the city's biggest cultural weekend of the year — here's how to see both",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Citywide — parade runs Chapultepec to Zócalo",
      address: "Parade route: Puerta de los Leones (Chapultepec) to Plaza de la Constitución (Zócalo) via Paseo de la Reforma",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Parade route, timing, and viewing-spot recommendations sourced from CasaGoliana.com's 2026 Day of the Dead parade guide and RioTimesOnline.com's 2026 expat guide, Sep 2026 — exact 2026 date not yet officially confirmed by CDMX government at time of writing, stated honestly in body copy as 'traditionally/likely' rather than asserted as confirmed fact. Etiquette guidance sourced from InsideTheUpgrade.com's 'what tourists get wrong' feature and MyWanderlustyLife.com's foreigner's guide. Second What to Avoid replaced 6 Sep 2026 — the original ('don't treat a cemetery vigil as a photo backdrop') restated bodyContent almost verbatim. Replaced with real parade-crowd pickpocket safety guidance (hundreds of thousands of attendees along Reforma, dense-crowd pickpocketing as the most commonly reported real safety issue), sourced from Covermore.com.au's Day of the Dead travel-safety guide and multiple corroborating visitor-safety sources, 6 Sep 2026 — distinct from the Metro-crowding pickpocket avoid already used in the Getting There experience, since this is about the parade crowd specifically, not transit.",
      sport: ["formula_one"],
      moodTags: ["cultural", "unique", "free"],
      interestCategories: ["culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "MXN",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #20 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
