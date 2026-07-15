import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "e5e305cf-ab3b-480d-a715-9016ae674f0e";

const bodyContent = `A five-day Test is a big commitment if you're only in Durban for part of the tour, so it's worth understanding how a Kingsmead Test tends to unfold before picking which day, or days, to attend.

Kingsmead's reputation as a seamer's wicket means the early days of a Test here typically favour fast bowling, with the coastal humidity assisting swing, particularly in the morning session before the sun burns through the cloud cover. Day one and day two are usually when conditions are most helpful to bowlers, which can mean lower scoring but genuinely tense, fluctuating cricket — good days to watch if you want to see wickets fall in clusters.

This isn't theoretical. Kingsmead has produced some of the most one-sided bowling performances in the game's history. Marco Jansen took 7 for 13 as Sri Lanka were bowled out for 42 here in 2024, still Sri Lanka's lowest Test score ever. Keshav Maharaj took 7 for 32 to skittle Bangladesh for 53 in a fourth-innings collapse in 2022. Clarrie Grimmett of Australia took 13 wickets across both innings in the 1936 Test here, still the ground's best match figures — a reminder that visiting attacks have dominated at Kingsmead too, not just the home side.

By days three and four, the pitch tends to flatten out somewhat as the surface dries, and batting conditions typically improve, though Kingsmead rarely turns into a pure batting paradise the way some subcontinental venues do. The tide folklore, though debunked by the ground's own curators, still gets floated by Durban regulars watching for something unusual in the final session of each day.

Day five, if the match reaches it, is when a Test typically decides itself — declarations, run chases, and the psychological pressure of a result on the line. Kingsmead has also hosted the longest match in the sport's history: the March 1939 "Timeless Test" between England and South Africa ran 9 playing days over 12 calendar days before ending in a draw only because England's ship home was waiting. That's the extreme case, not the norm — most Tests here in the modern era finish inside four days given the ground's tendency to produce a result once the ball starts moving. If you can only pick one day of a five-day match and you want maximum drama, the final day of a competitive Test is usually the highest-stakes cricket you'll see all tour, but recent history says there's a real chance the match won't need all five.

For a first Test of a series against a side ranked world number one, expect both teams to come out cautious early, with the match likely to open up as both sides get a read on conditions.`;

const insiderTips = [
  "If you can only attend one day, check the weather forecast the week before — a Kingsmead Test with rain around can shift the whole day-by-day dynamic.",
  "Multi-day tickets are usually better value than buying single days individually if you know you'll attend more than 2 days.",
  "Recent Kingsmead Tests have leaned toward finishing in 3-4 days rather than going the full five — Sri Lanka's 42 all out (2024) and Bangladesh's 53 all out (2022) both came in matches that didn't need a fifth day. A day-four ticket is a genuinely reasonable bet for seeing a result, not just an insurance policy.",
];

const whatToAvoid = "Don't book day one assuming you'll see the tourists at their sharpest — touring sides historically start cautiously against Kingsmead's new-ball threat and take a session or two to settle, which sometimes makes the cricket tentative rather than explosive early on. And don't write off day four as a safe, boring pick either — of the ground's most one-sided results in the last few years, several were effectively decided by the third afternoon, meaning a day-four ticket bought as a fallback can just as easily land you a dead rubber as it can a grandstand finish. There's no day of a Kingsmead Test that's reliably guaranteed action, only better odds.";

const practicalInfo = {
  hours: "1st Test: 9-13 Oct 2026. Standard Test match hours, typically starting mid-morning local time.",
  website: "https://www.espncricinfo.com/cricket-grounds/kingsmead-durban-59089",
  costRange: "Single-day and multi-day Test ticket options typically both available — check Ticketpro for confirmed pricing structure closer to the tour",
  bookingMethod: "Tickets are sold through Ticketpro (tickets.cricket.co.za), Cricket South Africa's official ticketing partner — single-day tickets are usually available alongside full multi-day passes.",
  reservationsRequired: true,
};

try {
  const [result] = await db.update(experiences).set({
    bodyContent,
    insiderTips,
    whatToAvoid,
    practicalInfo,
    editorialNote: "Sources: espncricinfo.com (Kingsmead ground records, Test records, pitch behaviour patterns), cricket365.com (lowest Test totals at Kingsmead, exact scores/bowlers/years), sportsadda.com (best bowling figures), fantasykhiladi.com/thetopbookies.com (pitch report), ticketpros.co.za (Ticketpro confirmed as CSA's official ticketing partner). Verified 14 Jul 2026. Session-by-session pattern is a general characterisation based on the venue's known seamer-friendly reputation, not a guarantee for this specific Test.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
