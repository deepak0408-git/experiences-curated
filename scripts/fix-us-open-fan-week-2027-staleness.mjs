import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Original body cited specific 2026 Fan Week dates and 2026-only named
// programming (Federer exhibition, Stars of the Open, specific sponsor
// activations) that can't be honestly carried forward to 2027 without
// verification. Fixed as part of the US Open 2026->2027 edition rollover,
// per migrate-from-classic-to-hub-spoke skill §1a — real 2027 Fan Week
// dates (22-28 Aug, verified against the ATP official 2027 calendar PDF
// and cross-checked via search) kept; unverified 2026-specific programming
// details replaced with an honest "confirm closer to the event" framing
// rather than left stated as current fact.
const bodyContent = `For most fans, the US Open starts on whatever day their ticket says. What that overlooks is the week before it, when the grounds at Flushing Meadows open for free and nobody has an assigned seat.

Fan Week runs Sunday, August 22 through Saturday, August 28, 2027, immediately before the ticketed main draw begins on August 29. Getting in needs nothing more than a free Fan Access Pass, issued through the US Open app to anyone 18 or older. There's no ticket to buy and no seat to book, just a registration.

The US Open Qualifying Tournament plays out across these days: real matches between players fighting for one of the last places in the main draw, not an exhibition. Grandstand, one of the three principal stadium courts, opens up for close viewing of players preparing for the tournament, the same players who'll be behind a paid ticket a week later. There's no fixed seating for most of it — you watch from wherever you can find room at the fence.

Recent editions have packed the week with extras beyond the tennis itself — a Kids' Day stadium show, celebrity exhibitions, themed fan nights, and a block party with DJs and a silent disco at Fountain Plaza, the open square at the center of the grounds. The exact 2027 lineup isn't published yet; check the official US Open app or usopen.org in the weeks before Fan Week for the confirmed schedule rather than assuming a prior year's programming repeats exactly. The food and drink stands are the same ones that serve the main draw, Honey Deuce included, if you want to start the ritual a week early.

Registering before Fan Week starts carries its own incentive in recent years: entry into a draw for Men's Final tickets, the single hardest match of the tournament to get into by any other route — confirm whether this incentive is running for 2027 via the official app. Getting to the grounds is the same as any other day at Flushing Meadows — the Long Island Rail Road from Penn Station runs about seven dollars and drops you at Mets-Willets Point, right at the gates, skipping the transfer most 7-train riders end up making.`;

const [updated] = await db
  .update(experiences)
  .set({ bodyContent, lastVerifiedDate: "2026-10-05" })
  .where(eq(experiences.slug, "us-open-fan-week-free-grounds-access-before-the-open-mrw9yvsj"))
  .returning({ slug: experiences.slug, title: experiences.title });

console.log("✓ Updated:", JSON.stringify(updated, null, 2));
await client.end();
