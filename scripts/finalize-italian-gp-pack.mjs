import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";

// packRank order — On the grounds first (highest interest), then transit,
// accommodation, dining, neighbourhood — matches experienceOrder in PackView.
const RANK_ORDER = [
  "Curva Grande — General Admission at the High-Speed Sweep",
  "Grandstand 22 — The Parabolica Corner",
  "Grandstand 26 — Pit Lane, Grid & Podium Views",
  "The Fan Zone — Ascari to Parabolica",
  "Paddock Club & Champions Club — F1 Hospitality at Monza",
  "The Tifosi — Ferrari's Red Army at Monza",
  "Getting to the Circuit — Train, Walk & Parking",
  "Staying in Milan — The City Base Strategy",
  "Hotel de la Ville — Monza's F1 Pilots' Hotel",
  "Lake Como — Race Weekend from the Lake",
  "Eating in Monza — Risotto, Luganega & the Brianza Table",
  "Eating in Milan — Where Serious Italians Go",
  "Aperitivo Before the Race — The Milan Ritual",
  "The History of Monza — Walking the Old Banking",
  "Monza Town & the Royal Villa",
  "Alfa Romeo Museum, Arese",
];

for (let i = 0; i < RANK_ORDER.length; i++) {
  const title = RANK_ORDER[i];
  const rank = i + 1;
  const result = await client`
    UPDATE sporting_event_experiences see
    SET pack_rank = ${rank}
    FROM experiences e
    WHERE see.experience_id = e.id
      AND see.sporting_event_id = ${EVENT_ID}
      AND e.title = ${title}
    RETURNING e.title
  `;
  if (result.length === 0) {
    console.warn(`⚠ No match found for: "${title}"`);
  } else {
    console.log(`✓ packRank ${rank}: ${title}`);
  }
}

// Pre-trip brief — 3 lines (Weather, Transport, One innovation), left dormant (not activated yet)
const preTripBriefLines = [
  "Weather: Early September in Monza runs 22–27°C during the day, generally dry, though afternoon showers do happen — pack a light waterproof and sunscreen, since most of the General Admission parkland has only patchy shade.",
  "Transport: Trenord runs a direct train from Milano Centrale to Monza in 9 minutes, roughly hourly. If you're driving, the Green parking lot near Gate D gives the most direct walk to Curva Grande and the Lesmo bends without fighting main-straight traffic.",
  "New this year: This is a standard weekend format, no sprint — three practice sessions, one qualifying session, and the race at 15:00 local time on Sunday. Check formula1.com/en/racing/2026/italy for the confirmed session schedule closer to race weekend.",
];

await client`
  UPDATE sporting_events
  SET
    ticketing_url = 'https://www.monzanet.it/en/tickets/',
    pre_trip_brief_lines = ${preTripBriefLines}
  WHERE id = ${EVENT_ID}
`;
console.log("\n✓ ticketingUrl set, pre-trip brief lines saved (not yet activated — live_at left NULL)");

await client.end();
