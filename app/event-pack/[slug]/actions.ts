"use server";

import { db } from "@/lib/db";
import { purchases } from "@/schema/database";

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";

export async function grantFreeAccess(email: string): Promise<void> {
  await db
    .insert(purchases)
    .values({
      email,
      sportingEventId: WIMBLEDON_EVENT_ID,
      paddleOrderId: `FREE-${email}`,
      paddleCustomerId: "free_access",
      paddlePriceId: "free",
      priceTier: "standard",
      pricePaid: "0",
      currency: "GBP",
      status: "active",
    })
    .onConflictDoNothing();
}
