// Arrival & Gate Guide — Chinese GP 2027. Sources: ticketing.formula1.com/
// china (official — passport registration, circuit capacity 200,000),
// formula1shanghai.com/en/entering-the-circuit-31 (official circuit site —
// gates generally open ~8:00 AM), english.shanghai.gov.cn 2026 Chinese GP
// event page (official Shanghai municipal government site — confirmed
// entrance-to-grandstand mapping for the 2026 edition: Entrance 1 = A/B/K
// + Fanzone, Entrance 2 = B/C, Entrance 6 = E, Entrance 9 = F/H/J;
// Grandstand E free shuttle P5<->P13). Entrance numbers presented as a
// reasonable 2027 starting assumption since they describe permanent
// circuit infrastructure, not year-specific scheduling, but flagged as
// 2026-confirmed rather than 2027-confirmed. Metro Exit 6 / 5-minute walk
// via travelchinaguide.com, cross-checked against thef1spectator.com.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-arrival-guide-" + Date.now().toString(36);

const bodyContent = `Every attendee, regardless of ticket tier or nationality, including Chinese citizens, must register their full name and passport number against their ticket several weeks before the event — stated plainly on Formula 1's own ticketing site. Do this the moment your ticket is confirmed, and bring the physical passport itself on the day, not just a photo of it.

From Shanghai Circuit metro station (Line 11), take Exit 6 and walk north — it's about a five-minute walk to the site, no shuttle needed. Four entrances handle grandstand spectators, and which one you want depends on your seat: Entrance 1 serves Grandstands A, B, and K, plus the F1 Fanzone; Entrance 2 serves Grandstands B and C; Entrance 6 serves Grandstand E; and Entrance 9 serves Grandstands F, H, and J. This mapping is confirmed for the 2026 edition via Shanghai's own municipal government site — the physical entrances are permanent circuit infrastructure, so the same layout is a reasonable starting assumption for 2027, but check your ticket or this pack's pre-trip brief closer to the event for final confirmation.

Grandstand E spectators get a free round-trip shuttle between parking lots P5 (near Grandstand J) and P13 (near Grandstand E) — useful if walking the distance between the two isn't appealing. In 2026 it ran 8:30 AM–3 PM outbound and 9:30 AM–3 PM on the return, though exact 2027 hours will depend on that year's session schedule.

Gates generally open around 8:00 AM on session days, per Formula 1's own circuit page — well ahead of the first session, which matters at a venue built to move 200,000 people through security across a single weekend. Choose the entrance closest to your grandstand to minimize waiting time, and arrive earlier than you think you need to, especially on race day.

Every grandstand comes fitted with a large screen, so even if a security queue costs you a few minutes of missed track action, you won't lose the thread of the session once you're through.`;

const whyItsSpecial = `Most circuit arrival guides are about timing — how early, which queue. Shanghai adds a real wrinkle most first-timers don't expect: a passport registration requirement that has nothing to do with the circuit's layout, plus genuinely different entrances depending on your grandstand — Entrance 1 for A/B/K, Entrance 2 for B/C, Entrance 6 for E (with its own dedicated shuttle), Entrance 9 for F/H/J. Getting both pieces right before you land — passport registered weeks out, the correct entrance identified — is worth more than any amount of gate-time optimization on the day itself, especially at a venue moving 200,000 people through security across a single weekend.`;

const practicalInfo = {
  hours: "Gates generally open around 8:00 AM on session days, per Formula 1's own circuit page. Grandstand E's free shuttle (P5↔P13) ran 8:30 AM–3 PM outbound / 9:30 AM–3 PM return in 2026 — exact 2027 times depend on that year's session schedule.",
  website: "https://english.shanghai.gov.cn/en-SportsEvents/20260311/933bcc13c7c44363a04a036b4888a7de.html, https://www.formula1shanghai.com/en/entering-the-circuit-31",
  bookingMethod: "Register full passport details against your ticket as soon as it's purchased — required for every attendee, every tier, per ticketing.formula1.com's stated policy.",
};

const gettingThere = "Shanghai Circuit metro station (Line 11), Exit 6, then a 5-minute walk north to the site — no shuttle needed. Entrance 1 serves Grandstands A, B, K + the F1 Fanzone; Entrance 2 serves Grandstands B, C; Entrance 6 serves Grandstand E (with its own free round-trip shuttle from parking lots P5/P13); Entrance 9 serves Grandstands F, H, J. Confirmed for the 2026 edition via Shanghai's municipal government site — physical entrances are permanent circuit infrastructure, so this is a reasonable starting assumption for 2027, pending final confirmation. See the Getting to the Circuit experience in this pack for the full Metro Line 11 journey from central Shanghai.";

const insiderTips = [
  "Match your grandstand to its entrance before race day — Entrance 1 (A, B, K + Fanzone), Entrance 2 (B, C), Entrance 6 (E), Entrance 9 (F, H, J) — and pick the one closest to your seat rather than defaulting to the first entrance you reach, since the official guidance itself says this is what minimizes queue time.",
  "Register your passport details the day you buy your ticket — this is a genuine requirement stated directly on F1's own ticketing site, not a formality, and leaving it until race week adds real, avoidable friction.",
];

const whatToAvoid = "Don't assume every grandstand shares one entrance — four different gates (1, 2, 6, 9) each serve different grandstand combinations, and walking to the wrong one means a longer, avoidable walk around the circuit perimeter on a morning you don't have to spare. Don't wait until race week to handle passport registration — it's designed to be completed well in advance, and doing it early removes one entire category of last-minute stress from your trip.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Arrival & Entry Guide — What You Actually Need",
      subtitle: "Passport registration is the real requirement here — plus why to arrive early at a 200,000-capacity circuit.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai International Circuit, No. 2000 Yining Road, Anting Town, Jiading District, Shanghai, China",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from ticketing.formula1.com/china (official — passport registration requirement, 200,000 capacity), formula1shanghai.com/en/entering-the-circuit-31 (official circuit site — gates generally open ~8:00 AM), english.shanghai.gov.cn 2026 Chinese GP event page (official Shanghai municipal government site — confirmed entrance-to-grandstand mapping for the 2026 edition: Entrance 1 = A/B/K + Fanzone, Entrance 2 = B/C, Entrance 6 = E, Entrance 9 = F/H/J; Grandstand E free shuttle P5<->P13, 8:30am-3pm/9:30am-3pm in 2026). Supersedes an earlier version of this experience that relied on gpdestinations.com (a non-official travel guide) for partial gate detail — replaced with the official government source, found 2 Oct 2026. Entrance numbers presented as a reasonable 2027 starting assumption since they describe permanent circuit infrastructure, not year-specific scheduling, but flagged as 2026-confirmed rather than 2027-confirmed. Metro Exit 6 / 5-minute walk via travelchinaguide.com, cross-checked against thef1spectator.com.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
