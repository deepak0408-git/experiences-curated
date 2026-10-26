import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/schema/database";

// Singleton prevents Next.js hot-reload from creating new connections on every
// module re-evaluation and exhausting the Supabase pooler's connection limit.
declare global {
  // eslint-disable-next-line no-var
  var _pgClient: ReturnType<typeof postgres> | undefined;
}

const client =
  global._pgClient ??
  // max: 3 caps connections per serverless instance — without it each instance
  // defaults to 10, and enough concurrent instances exhaust Supabase's pooler
  // (fixed at 200 client connections on the Micro compute tier).
  postgres(process.env.DATABASE_URL!, { prepare: false, ssl: "require", max: 3 });

if (process.env.NODE_ENV !== "production") {
  global._pgClient = client;
}

export const db = drizzle(client, { schema });
