import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/schema/database";

// Homepage-only database connection, separate from the shared lib/db.ts
// client. Added 29 Oct 2026 after repeated "canceling statement due to
// statement timeout" errors on the homepage (Sentry issue 156921361,
// confirmed against Supabase's own Postgres logs — session IDs showed
// connections failing after sitting idle 33 min to ~3 hours).
//
// Root cause (confirmed via Supabase's official troubleshooting doc for
// this exact symptom): Vercel freezes serverless functions between
// requests. While frozen, postgres.js's own idle/lifetime timers (plain
// setTimeout calls, see node_modules/postgres/cjs/src/connection.js) are
// frozen too and never fire, so a connection can silently go stale during
// a freeze without ever being recycled. On the next request, the app
// reuses that stale connection and the query hangs until Postgres's own
// 2-minute statement_timeout kills it.
//
// Fix: before handing back a connection, run a fast "select 1" liveness
// check against a short timeout. If it fails, the connection is discarded
// and a fresh one opened. This is the fix Supabase's own docs recommend
// for postgres.js on serverless. Deliberately scoped to the homepage only
// (not lib/db.ts) — lib/db.ts is imported by 90+ files including payment
// webhooks and account deletion, and this check adds a small amount of
// latency + complexity that shouldn't be forced onto every query in the
// app to fix a problem currently only observed on the homepage.
//
// max: 1 — this is a second, additional connection pool on top of the
// shared one in lib/db.ts (which is capped at max: 3 per instance for
// Supabase pooler protection, see that file's own comment). Capping this
// one to 1 keeps the added connection budget minimal.
declare global {
  // eslint-disable-next-line no-var
  var _homepagePgClient: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  return postgres(process.env.DATABASE_URL!, { prepare: false, ssl: "require", max: 1 });
}

let client = global._homepagePgClient ?? createClient();
if (process.env.NODE_ENV !== "production") {
  global._homepagePgClient = client;
}

const LIVENESS_TIMEOUT_MS = 3000;

export async function getHomepageDb() {
  try {
    await Promise.race([
      client`select 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("homepage DB liveness check timed out")), LIVENESS_TIMEOUT_MS)
      ),
    ]);
  } catch {
    // Connection is stale or dead — discard it and open a fresh one rather
    // than letting a real query hang on it.
    client.end({ timeout: 0 }).catch(() => {});
    client = createClient();
    if (process.env.NODE_ENV !== "production") {
      global._homepagePgClient = client;
    }
  }

  return drizzle(client, { schema });
}
