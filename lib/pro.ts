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

export async function getProDetails(email: string): Promise<{
  isPro: boolean;
  isAnnual: boolean;
  currentPeriodEnd: Date | null;
}> {
  const [sub] = await db
    .select({
      billingCycle: proSubscriptions.billingCycle,
      currentPeriodEnd: proSubscriptions.currentPeriodEnd,
    })
    .from(proSubscriptions)
    .where(
      and(
        eq(proSubscriptions.email, email),
        eq(proSubscriptions.status, "active")
      )
    )
    .limit(1);

  if (!sub) return { isPro: false, isAnnual: false, currentPeriodEnd: null };

  return {
    isPro: true,
    isAnnual: sub.billingCycle === "annual",
    currentPeriodEnd: sub.currentPeriodEnd ?? null,
  };
}
