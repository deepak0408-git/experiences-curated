import { db } from "@/lib/db";
import { proSubscriptions } from "@/schema/database";
import { eq, and } from "drizzle-orm";

export async function hasProSubscription(email: string): Promise<boolean> {
  const [sub] = await db
    .select({ id: proSubscriptions.id })
    .from(proSubscriptions)
    .where(
      and(
        eq(proSubscriptions.email, email),
        eq(proSubscriptions.status, "active")
      )
    )
    .limit(1);
  return !!sub;
}
