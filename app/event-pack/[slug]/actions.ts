"use server";

import { db } from "@/lib/db";
import { purchases, users, sportingEvents } from "@/schema/database";
import { eq } from "drizzle-orm";

// currency is looked up from sportingEvents.packCurrency (the real
// Dodo/Paddle currency for this event's pack) rather than hardcoded --
// fixed 1 Aug 2026 after every free-access grant was silently writing
// "GBP" regardless of the event's actual currency (Hungarian GP/Italian GP
// are EUR, US Open/Bahrain GP are USD, etc.), corrupting purchases.currency
// for every non-GBP free event. Falls back to "GBP" only when an event
// genuinely has no packCurrency set yet (an honest gap, not a guess).
export async function grantFreeAccess(email: string, sportingEventId: string): Promise<void> {
  await db
    .insert(users)
    .values({ email })
    .onConflictDoNothing();

  const [event] = await db
    .select({ packCurrency: sportingEvents.packCurrency })
    .from(sportingEvents)
    .where(eq(sportingEvents.id, sportingEventId))
    .limit(1);

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
      currency: event?.packCurrency ?? "GBP",
      status: "active",
    })
    .onConflictDoNothing();
}
