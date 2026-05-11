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
  postgres(process.env.DATABASE_URL!, { prepare: false, ssl: "require" });

if (process.env.NODE_ENV !== "production") {
  global._pgClient = client;
}

export const db = drizzle(client, { schema });
