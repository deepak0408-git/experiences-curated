// Second pass on the same fix: after adding the missing Yasalam paragraph,
// founder asked to expand toward the standing 500-1500 word body spec with
// real, sourced detail rather than padding. Added verified facts from
// yasmarinacircuit.com (venue name Etihad Park, Golden Circle upgrade) —
// cross-checked against abudhabigp.com's real yasalam-after-race-concerts
// listing before use. 4 Sep 2026.
import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const newBody = `The Yasalam concerts are the official spectacle of Abu Dhabi's season-finale week — a real headline act every night of the weekend, staged at Etihad Park, the Middle East's largest open-air entertainment venue on Yas Island, a short walk from the North Grandstand. They're bundled into every ticket tier from Abu Dhabi Hill General Admission through Paddock Club — your Abu Dhabi GP ticket guarantees entry to every night's concert, no separate purchase required. Zara Larsson and Lewis Capaldi open the series on Thursday, Imagine Dragons headlines the Saturday night before the race, and The Chainsmokers and The Script close out the weekend on Sunday straight after the chequered flag.

This isn't an add-on tucked into a hospitality package — it's genuinely part of the standard ticket, which is a real point of value most first-time visitors don't realize until they're already there. For anyone who wants to trade general admission for a closer view, a Golden Circle upgrade exists as a real, separate paid add-on — closest-to-stage positioning and fast-track entry, worth knowing about if the seat matters as much as the headline act itself.

Beyond those official stages, Abu Dhabi's season-finale week runs a genuinely separate, parallel nightlife scene too — and for many fans, especially those on hospitality or yacht packages, this is where the actual after-dark experience happens once the concerts themselves wrap.

White Abu Dhabi, on Yas Bay, is the city's largest club and the clearest single-venue answer to "where's the big party" — globally recognized DJs, immersive production (360-degree projection, lasers, high-end sound), and a scene that's become genuinely synonymous with F1 week in Abu Dhabi rather than just another club night. It carries a real Google rating of 3.7 from 423 reviews — solid, though notably lower than the hotel and restaurant venues in this pack, worth knowing honestly going in rather than assuming every nightlife venue here rates the same.

W Abu Dhabi's rooftop WET Deck runs its own dedicated program during race week — Bagatelle-branded parties with international DJs have been a recurring fixture, alongside the hotel's standard rooftop cocktail and marina-view offering, which becomes a genuine nightlife destination in its own right once the sun sets during Grand Prix week specifically.

Garden on Yas, an open-air space among palm trees adjacent to the W, has hosted its own headline nights during past race weeks — past programming has included major artist takeovers, though the specific 2026 lineup for this space wasn't confirmed as of this research; check closer to the event for the current year's program.

Together, these two layers — the official Yasalam stage at Etihad Park and the separate hotel/club scene around it — are what actually make Abu Dhabi's finale week feel different from a normal Grand Prix weekend. One is included in the ticket price and shared with every other fan in the venue; the other is a real, distinct booking decision with its own cost and access rules. Neither substitutes for the other, and a first-time visitor planning only around the race itself is genuinely missing half of what the week is built for.

Access and pricing vary significantly by venue and by night for the off-circuit scene — some of it is open to the general public with a cover charge, some is genuinely exclusive to hospitality/hotel guests or requires table bookings well in advance. Treat this as a real, distinct part of race week worth planning for specifically, not an afterthought to the official concerts.`;

await sql`UPDATE experiences SET body_content = ${newBody} WHERE id = '7ac7b4ac-ca0c-4bcd-8ee3-e77b8f2c43f8'`;
console.log("Updated. Word count:", newBody.split(/\s+/).length);
await sql.end();
