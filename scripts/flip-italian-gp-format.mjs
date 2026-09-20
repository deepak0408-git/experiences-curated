import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// One-off flip of Italian GP 2027's packFormat from "classic" to
// "hub_and_spoke", now that all 12 spokes are built and wired (spokeConfig,
// registry, EXPERIENCE_TO_SPOKE), per the mandatory rule in CLAUDE.md:
// packFormat must be flipped in the same session hub-and-spoke content is
// built, or the pack silently 404s even with full content behind it.
// Deliberately does NOT touch isHidden — the founder wants to review before
// public activation, so the event stays hidden.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const target = process.argv[2];
if (target !== "hub_and_spoke" && target !== "classic") {
  console.error("Usage: node flip-italian-gp-format.mjs <hub_and_spoke|classic>");
  process.exit(1);
}

const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";

const [before] = await client`SELECT pack_format, is_hidden FROM sporting_events WHERE id = ${EVENT_ID}`;
console.log("Before:", before.pack_format, "isHidden:", before.is_hidden);

const [after] = await client`
  UPDATE sporting_events SET pack_format = ${target}
  WHERE id = ${EVENT_ID}
  RETURNING pack_format, is_hidden
`;
console.log("After:", after.pack_format, "isHidden:", after.is_hidden);

await client.end();
