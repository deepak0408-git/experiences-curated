import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-getting-to-interlagos-" + Date.now().toString(36);

const bodyContent = `The circuit itself is straightforward to reach on public transit, and the official race organizers are direct about which option they recommend: the Metrô Line 9 (Esmeralda), getting off at the Autódromo stop, which sits roughly 500 metres from the circuit gates. This is the same commuter rail line that runs through Pinheiros, one of the city's main interchange stations, so if you're staying anywhere in the Jardins, Itaim Bibi, or Pinheiros area, you're looking at one line with no transfers for most of the trip.

If you'd rather not deal with the metro at all, official F1 Express shuttle buses run Friday through Sunday of race weekend, departing between 6am and 1pm from three fixed pickup points: República Express in Praça da República downtown, Jabaquara Express at the Jabaquara subway station, and a dedicated pickup at Congonhas Airport for anyone flying in and heading straight to the circuit. These cost 27 BRL one-way or 38 BRL round trip — inexpensive, and specifically built for race weekend rather than a repurposed regular route. Buses leave once they fill up rather than on a fixed timetable, so there's some waiting built in, especially at busier departure points closer to race start.

You'll need a Bilhete Único card to use the metro — São Paulo's standard transit card, sold at metro station machines and loaded with credit before you tap in. Buy this before race day itself if you can; ticket machine queues at the closer stations get long once the weekend crowd builds, and you don't want your first stop at the Autódromo-bound platform to be a slow line for a card you could have bought the day before at a quieter station downtown.

Driving is possible but not recommended by anyone who's actually done it during a Brazilian GP — road closures around the circuit on session days back up traffic for kilometers, and parking near the venue is limited and expensive relative to a 27 BRL shuttle fare.`;

const whyItsSpecial = `Interlagos sits inside a real, working city, not a purpose-built exurb reachable only by car or a single shuttle route — which sounds like a small logistical detail until you compare it to circuits where the only practical option is an expensive, oversubscribed shuttle from one central point. Here you get a genuine choice: the metro if you want independence and flexibility, the F1 Express shuttle if you'd rather have door-to-door simplicity and don't mind a short wait, or a combination depending on the day. That's rarer at a modern F1 venue than it should be, and it's a direct result of São Paulo already having built a transit system before F1 ever needed one.`;

const insiderTips = [
  "Buy your Bilhete Único card at a quieter downtown or hotel-area metro station the day before race day, not at Autódromo or Pinheiros on the morning of — ticket-machine queues at the busier stations get genuinely long once race-weekend crowds build.",
  "The F1 Express shuttles depart once full rather than on a schedule — if you're at a busy pickup point like República close to a session's start time, budget extra waiting time rather than assuming a bus will be ready the moment you arrive.",
];

const whatToAvoid = `Don't drive to the circuit expecting normal traffic conditions — road closures around Interlagos on every race-weekend session day create real, multi-kilometer backups that regular commuters in the city already know to route around, and parking near the venue is both limited and priced well above the cost of public transit. And don't assume every metro line reaches the circuit directly — only Line 9 (Esmeralda) serves the Autódromo stop; if your hotel is on a different line, check the transfer to Line 9 before race day rather than discovering it while already en route.`;

const practicalInfo = {
  hours: "F1 Express shuttles run 6am-1pm Friday through Sunday of race weekend; Metrô Line 9 runs standard citywide operating hours",
  costRange: "Metrô: standard Bilhete Único fare (a few BRL per ride). F1 Express shuttle: 27 BRL one-way / 38 BRL round-trip (~US$5-8)",
  bookingMethod: "No advance booking needed for either option — buy a Bilhete Único card at any metro station, or pay for the F1 Express shuttle at the departure point.",
  website: "https://www.brasilf1.com/en/by-mass-transport",
};

const gettingThere = "Metrô Line 9 (Esmeralda) to the Autódromo stop, roughly 500 metres from the circuit gates. F1 Express shuttles depart from República Express (downtown), Jabaquara Express (Jabaquara metro station), and Congonhas Airport.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Interlagos",
      subtitle: "Metrô Line 9 to Autódromo, or a dedicated race-weekend shuttle from three city pickup points",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Interlagos",
      address: "Autódromo José Carlos Pace, Av. Senador Teotônio Vilela, 261, Interlagos, 04329-030 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "All transit detail (Metrô Line 9/Esmeralda to Autódromo stop ~500m from circuit, F1 Express shuttle routes/pickup points/pricing/hours, Bilhete Único card requirement) sourced directly from brasilf1.com's own official 'By Mass Transport' page, 11 Sep 2026 — this is the official race-ticketing site's own transit guidance, the highest-confidence source available for this fact set. Driving/parking discouragement is standard, widely-corroborated advice across every travel-guide source checked, not a single-sourced claim.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #6 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
