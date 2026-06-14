import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const slug = "fan-zone-raidillon-" + Date.now().toString(36);

// ─── 1. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Every circuit has a section that isn't really about the racing. At Spa it's the Fan Zone, a wide flat area at the base of Raidillon where the circuit curves away toward the Kemmel Straight and most of the crowd's non-racing hours happen. It sits on the outside of the Eau Rouge sequence, meaning cars are visible through the fence as they exit La Source and begin their descent. You're not watching them at full speed — that's what the grandstands are for — but you're trackside, which matters when you're waiting for a simulator queue to move.

The zone is open across all three race weekend days, from circuit gates at 07:00 through to post-session. Its anchor is the main stage: a proper raised platform with screens on either side, used for driver and team principal interviews on Friday and Saturday, and for DJ sets and local acts across all three evenings. The driver interview slots are the ones worth planning around. Timings shift year to year and are published on the official Belgian GP app each morning — check the day before and again at gates, since the schedule updates if a session overruns. Getting a spot with a clear sightline to the stage means arriving 20–30 minutes early; the standing area fills quickly once word of a confirmed appearance gets around.

The simulators occupy a dedicated section toward the back of the zone. These aren't the fairground variety — the F1-branded rigs use proper racing game software and a bucket seat setup with a wheel and pedals. Queue times run 30–60 minutes on race Sunday, 10–20 minutes on Friday morning. The pit stop challenge, where you swap a tyre against the clock, runs nearby and draws a crowd when the timer is on. Both are included with any circuit ticket.

Merchandise: the main concentration of team and F1 merchandise stalls is here, not scattered around the circuit. If you want a Red Bull cap or a Ferrari jacket, this is where the selection is. Prices are official RRP — don't expect discounts. The food offer is the strongest at Spa: Belgian classics including proper frites with mayonnaise and stoofvlees, plus international options and multiple bar areas. Quality is better than most F1 circuits manage. The queues on race Sunday morning are real — eat before 11:00 or after 14:30.

The Fan Zone is accessible with any circuit ticket — Bronze, Silver, or Gold — and is the natural gathering point between sessions. After qualifying on Saturday, the crowd disperses from the grandstands and reconverges here. It's where you'll find the debrief conversations, the recaps on the big screens, and the post-session energy. On Sunday evening after the podium, the stage hosts the loudest session of the weekend.

It is 10 minutes on foot from the main circuit entrance, signposted from the moment you enter. From Gold 3 at Raidillon, it is 3 minutes downhill.`;

const whyItsSpecial = `The Fan Zone at Raidillon is the only place at Spa where the racing weekend and the festival around it genuinely overlap. Grandstands give you the sport. The Fan Zone gives you everything else — and at Spa, everything else is unusually good.

Part of this is location. Being at the foot of Raidillon means the context is always present. The cars are visible through the fence during sessions. Between sessions the corner itself sits there, the hill rising behind the zone, which gives the whole area a weight that a generic fan village in a car park doesn't have. You know where you are.

Part of it is the driver access. Most F1 fan zones involve watching drivers wave from a moving vehicle. At Spa the stage interviews are relatively informal — a driver and an interviewer, a standing crowd, no corporate buffer. You're close enough to read expressions. The team principal slots on Friday mornings have become a fixture for anyone who follows the political side of the paddock as closely as the racing; Toto Wolff and Christian Horner in front of 3,000 standing fans is a different thing to a press conference.

And part of it is just the crowd. 380,000 people attend the Belgian Grand Prix. A significant proportion of them spend time in this zone. By Sunday afternoon it has the density and noise of a festival main stage, with racing happening 200 metres away. That combination is specific to Spa.`;

const insiderTips = [
  "Check the stage schedule on the Belgian GP app the evening before each day — driver interview times shift based on session overruns and the confirmed slot appears there before it's posted anywhere else.",
  "Friday morning is the best time for simulators and the pit stop challenge — queues are 10–20 minutes versus 45–60 minutes on race Sunday.",
  "Eat before 11:00 or after 14:30 on race Sunday — the food queue at peak mid-morning runs 20+ minutes and frites sell out at two of the three stalls by early afternoon.",
];

const whatToAvoid = `Don't arrive at the Fan Zone stage area 5 minutes before a confirmed driver appearance expecting a front position — the standing area fills 20–30 minutes in advance and latecomers watch from behind. Don't write off the Fan Zone as a secondary attraction if it's your first Belgian GP: the driver access here is more direct than most circuits offer, and the post-qualifying Saturday evening atmosphere rivals anything in the grandstands. And don't spend race Sunday morning here if you have a grandstand ticket — the race start is the reason you came, and getting back to your seat through a 380,000-person crowd takes longer than it looks on the map.`;

const practicalInfo = {
  hours: "Open from 07:00 each race day; stage programme typically runs 09:00–22:00",
  costRange: "Free with any circuit ticket (Bronze, Silver, or Gold) — no additional charge",
  bookingMethod: "No booking required — walk in with any circuit ticket bought via belgium.gp.",
  howToBook: "The Fan Zone itself needs no booking — walk in with any ticket. To get the most from the driver stage appearances, download the official Belgian GP app before you arrive: the daily stage schedule is published there and updates in real time. Driver interview slots on Saturday are typically mid-morning, 90 minutes before qualifying starts — arrive at the stage 20–30 minutes early. The Silver 2 Fan Zone grandstand (sold via belgium.gp) puts you in an assigned seat right on the zone's edge with a direct sightline to the stage and the Eau Rouge fence simultaneously — worth considering if you want to anchor here rather than roam.",
  website: "https://www.formula1.com/en/racing/2026/belgium",
  reservationsRequired: false,
};

const gettingThere = `From the main circuit entrance, follow signs to the Fan Zone — 10 minutes on foot, flat terrain. From the Gold 3 grandstand at Raidillon, 3 minutes downhill. Accessible from all circuit entrances including Kemmel and Stavelot gates. No public transport runs directly to the circuit during race weekend — shuttle buses operate from Spa town (13km), Stavelot (5km), Malmedy (6km) and Liège (50km), approx. €60–105 return per day, bookable via belgium.gp.`;

// ─── 2. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Fan Zone at Raidillon",
      subtitle: "The circuit's social centre — stage shows, simulators, driver interviews, and the best food at the foot of Eau Rouge",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Francorchamps",
      address: "Route du Circuit 55, 4970 Stavelot, Belgium",
      heroImageUrl: null,
      heroImageAlt: null,
      heroImageCredit: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Fan zone location, stage programme, and ticket access from belgium.gp fan zones page and Silver 2 ticket info. Simulator/pit stop challenge detail from oversteer48.com Silver 2 guide. Attendance figure (380,000) from public record. Food detail and atmosphere from gpdestinations.com trackside guide and fanamp.com. Hero image pending — no suitable CC-licensed fan zone crowd image found; search ongoing. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["electric", "social", "adrenaline"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "120",
      budgetMaxCost: "150",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-14",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await client`
    INSERT INTO sporting_event_experiences (sporting_event_id, experience_id)
    VALUES (${BELGIAN_GP_EVENT_ID}, ${result.id})
    ON CONFLICT DO NOTHING
  `;

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("  → Join row inserted into sporting_event_experiences");
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
