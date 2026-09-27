import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Italian GP's sportingEvents row had venueAddress: null, which silently
// suppressed the hub-and-spoke Quick Reference "Address" row (HubPage.tsx
// requires event.venueName && event.venueAddress before pushing it) — one of
// two causes of the "only 1 line" Quick Reference bug found 27 Sep 2026
// (the other being the missing QUICK_REFERENCE_BY_EVENT entry, fixed
// separately in HubPage.tsx). Real address confirmed by the founder directly.
const ITALIAN_GP_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";
const VENUE_ADDRESS = "Viale di Vedano, 5, 20900 Monza MB, Italy";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const [before] = await client`select id, slug, venue_name, venue_address from sporting_events where id = ${ITALIAN_GP_ID}`;
console.log("Before:", before);

const [after] = await client`
  update sporting_events
  set venue_address = ${VENUE_ADDRESS}
  where id = ${ITALIAN_GP_ID}
  returning id, slug, venue_name, venue_address
`;
console.log("After:", after);

await client.end();
