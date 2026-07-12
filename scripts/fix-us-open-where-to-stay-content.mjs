import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const id = "38c57e06-4763-4e19-9ac5-3a7ad571e938"; // Where to Stay for the US Open

const bodyContent = `The US Open runs for two weeks and hotels near Flushing Meadows fill months in advance. The question is not just which hotel but which neighbourhood to base yourself in — and the honest answer depends on what you want from the trip.

**Option 1: Flushing**

Flushing is the most convenient base. Four Points by Sheraton Flushing (33-68 Farrington Street) is within a 15-minute walk of the USTA gates, the 7 train is at Main Street for everything else, and you're in the middle of the food ecosystem that makes this tournament distinctive. The neighbourhood itself — the largest Chinatown outside of China, per many accounts, with Taiwanese, Shanghainese, and other regional cooking concentrated along Main Street and Roosevelt — is worth being embedded in rather than commuting to.

The tradeoff: Flushing hotels are not characterful. They're newer, efficient, and built for the business traveller who ends up in Queens for a trade show at the convention centre. Expect clean rooms, functional service, and limited lobby or common area quality. The neighbourhood is what earns its place.

**Option 2: Long Island City**

Long Island City (LIC) is two stops on the 7 train from Mets-Willets Point, putting you 15–20 minutes from the tournament gates with a direct line and no transfer. Boro Hotel and Hilton Garden Inn LIC are the strongest options here — newer, more design-forward, and often better value than equivalent Manhattan rooms. The neighbourhood has a different quality from Flushing — more residential and post-industrial, with waterfront parks that look directly at the Midtown Manhattan skyline.

For a US Open trip where you want convenience to the tournament plus a more interesting base than a Flushing business hotel, Long Island City is the strongest option.

**Option 3: Midtown Manhattan**

The obvious choice for visitors combining the US Open with a broader New York trip. Hyatt Grand Central New York (109 East 42nd Street) is the standout pick if you're going this route — it sits directly above Grand Central Terminal, putting you on the same 7 train that runs straight to Mets-Willets Point with no transfer, 38–42 minutes door to gate. That's still 80 minutes of transit for each full day at the tournament, but at least it's a single, direct ride rather than a connection.

For a two- or three-session visit where you're also spending time in the city, Manhattan makes sense. For a dedicated tournament trip, the commute accumulates.

**Booking timing**

US Open hotels — particularly in Flushing — book out 3–6 months ahead of the tournament. If you're planning to attend during the second week (quarterfinals onward), assume high demand and book as soon as your dates are confirmed.`;

const insiderTips = [
  "Long Island City hotels often have better room quality than equivalent Flushing options at similar prices — check Boro Hotel and Hilton Garden Inn LIC before defaulting to Flushing.",
  "If you're going the Manhattan route, Hyatt Grand Central New York sits directly above Grand Central Terminal — you're on the same 7 train line to Mets-Willets Point with no transfer, which isn't true of most Midtown hotels.",
];

const practicalInfo = {
  hours: "Hotels operate 24 hours; book as early as possible — Flushing fills 3–6 months ahead of the tournament",
  website: "https://www.booking.com",
  costRange: "Flushing hotels from ~$180/night; Long Island City from ~$200/night; Midtown Manhattan from ~$350/night during US Open fortnight",
  howToBook: "Flushing inventory is limited and moves first — prioritise booking the moment your session tickets are confirmed. Long Island City (Boro Hotel and Hilton Garden Inn LIC are the strongest options) books slightly later but still sells out for the second week. If Flushing is gone, LIC is the correct call: direct 7 train, better room quality, skyline views. If you want Manhattan, Hyatt Grand Central New York's direct line to Mets-Willets Point beats a typical Midtown hotel's transfer-heavy route — still an 80-minute daily round trip, but at least a single ride.",
  bookingMethod: "Book directly through the hotel or via Booking.com — no specialist operator needed.",
  reservationsRequired: true,
};

await db.update(experiences).set({ bodyContent, insiderTips, practicalInfo }).where(eq(experiences.id, id));
console.log("✓ Rewrote 'Where to Stay for the US Open' — added real Flushing (Four Points by Sheraton) and Midtown (Hyatt Grand Central New York) hotels, removed AC Hotel LIC everywhere");

await client.end();
