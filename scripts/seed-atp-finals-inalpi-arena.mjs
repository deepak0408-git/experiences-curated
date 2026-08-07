import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-inalpi-arena-" + Date.now().toString(36);

const bodyContent = `Inalpi Arena wasn't built for tennis. It went up in 2005 as the ice hockey venue for the 2006 Turin Winter Olympics, designed by Arata Isozaki and Pier Paolo Maggiora — a 183-metre-long, four-level structure clad in stainless steel with a glazed base, sitting inside the Torino Olympic Park in the Santa Rita district. Ice hockey was never going to be its long life, though: since the Games it's hosted basketball, volleyball, MMA, Eurovision 2022, and arena tours from Madonna, Harry Styles, and Rihanna, before becoming the permanent home of the ATP Finals in 2021.

The Olympic pedigree shows in the scale. At maximum capacity it seats 15,000 for basketball configuration — the largest indoor arena in Italy — though for tennis, flexible stands are set up to hold closer to 12,000, still a genuinely big room for a sport that's usually watched in venues a third that size. That size is exactly why the ATP Finals works here: eight players, playing round-robin, with an atmosphere that scales up rather than a boutique tennis-club feel.

The venue was renamed Inalpi Arena in 2023 under a new naming-rights sponsorship (Inalpi is a Piedmontese dairy company), after a run as Pala Alpitour and, before that, PalaOlimpico — worth knowing if you're cross-referencing older reviews or articles that still use the earlier names, since they're all the same building.

Two entrances matter for planning: general admission uses the north gates on Piazzale Grande Torino, while corporate hospitality guests enter through separate south gates on the venue's other side. Getting the entrance right on arrival matters more here than at a smaller venue, given the walking distance around a building this size.`;

const whyItsSpecial = `What makes Inalpi Arena work for the season finale isn't tennis pedigree — it has none, really, next to Wimbledon's Centre Court or the O2's tennis history in London — it's that Turin built something genuinely oversized for a hockey tournament that lasted two weeks in 2006, and has spent the two decades since finding new uses for that scale. You're watching the top eight players in the world inside a room built to Olympic and touring-superstar capacity, not a repurposed exhibition hall. The sustainability certification (UNI EN ISO 20121, for event management) is a small detail, but it's evidence this is a venue that's been actively maintained and run at a professional international standard continuously since the Olympics, not left to coast on its Games-era reputation. For a first-time visitor, the practical upshot is real: sightlines built for hockey and basketball translate well to tennis, and a venue built to move 15,000 people efficiently handles a 12,000-seat tennis crowd without the bottlenecks smaller, older arenas often have.`;

const insiderTips = [
  "The venue has gone by three names since 2005 — PalaOlimpico, Pala Alpitour, and now Inalpi Arena (since 2023). If you're researching using older sources, all three refer to the same building.",
  "General admission and corporate hospitality use entirely separate gates on opposite sides of the arena (north vs. south) — confirm which one your ticket type uses before you're standing at the wrong entrance.",
];

const whatToAvoid = `Don't assume this is a dedicated tennis venue with tennis-specific sightlines throughout — it's a multi-purpose arena reconfigured for the tournament, so if seat view matters to you, check the specific section against the tournament's own seating guide rather than assuming every angle is optimised for the sport.`;

const practicalInfo = {
  hours: "Session times vary by day — 15 sessions across the tournament week, day and evening splits. Check the official schedule closer to November for exact times.",
  costRange: "Venue entry is via ticket purchase only — see the Ticket Guide experience for tier pricing.",
  bookingMethod: "General admission and season tickets via the official Nitto ATP Finals ticket site.",
  howToBook: "",
  website: "https://tickets.nittoatpfinals.com/en",
  reservationsRequired: true,
};

const gettingThere = "Corso Sebastopoli 123, 10137 Torino — Santa Rita district. Nearest transit: Sebastopoli tram stop (lines 4 and 10), roughly a 5-minute walk. See the Getting There experience for full transit detail.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Inalpi Arena — inside the ATP Finals venue",
      subtitle: "An Olympic ice hockey arena turned season-finale tennis venue, Turin's largest indoor space",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Santa Rita",
      address: "Corso Sebastopoli 123, 10137 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Venue history, capacity, and architecture confirmed via en.wikipedia.org/wiki/Inalpi_Arena and nittoatpfinals.com/en/venue/about-the-venue. Entrance/gate detail from the official venue page. Verified 4 Aug 2026.",
      sport: ["tennis"],
      moodTags: ["iconic-venue", "atmosphere"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-04",
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
