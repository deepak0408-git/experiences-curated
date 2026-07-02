"use server";

import { db } from "@/lib/db";
import { purchases, users } from "@/schema/database";

export async function grantFreeAccess(email: string, sportingEventId: string): Promise<void> {
  await db
    .insert(users)
    .values({ email })
    .onConflictDoNothing();

  await db
    .insert(purchases)
    .values({
      email,
      sportingEventId,
      paddleOrderId: `free-${email}-${sportingEventId}`,
      paddleCustomerId: "free_access",
      paddlePriceId: "free",
      priceTier: "early_bird",
      pricePaid: "0",
      currency: "GBP",
      status: "active",
    })
    .onConflictDoNothing();
}
