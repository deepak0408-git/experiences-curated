import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq, isNotNull, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Find homepage-featured events whose event has already ended.
  const expired = await db
    .select({ id: sportingEvents.id, name: sportingEvents.name })
    .from(sportingEvents)
    .where(and(
      isNotNull(sportingEvents.homepageSlot),
      lt(sportingEvents.endDate, today)
    ));

  if (expired.length === 0) {
    console.log("[expire-homepage-slots] nothing expired today");
    return NextResponse.json({ ok: true, expired: 0, repacked: 0 });
  }

  // Clear the expired events' slots.
  for (const event of expired) {
    await db
      .update(sportingEvents)
      .set({ homepageSlot: null })
      .where(eq(sportingEvents.id, event.id));
  }

  // Re-pack the remaining slotted events into contiguous slots 1..N,
  // preserving their existing relative order.
  const remaining = await db
    .select({ id: sportingEvents.id, homepageSlot: sportingEvents.homepageSlot })
    .from(sportingEvents)
    .where(isNotNull(sportingEvents.homepageSlot))
    .orderBy(asc(sportingEvents.homepageSlot));

  let repacked = 0;
  for (let i = 0; i < remaining.length; i++) {
    const newSlot = i + 1;
    if (remaining[i].homepageSlot !== newSlot) {
      await db
        .update(sportingEvents)
        .set({ homepageSlot: newSlot })
        .where(eq(sportingEvents.id, remaining[i].id));
      repacked++;
    }
  }

  console.log(
    `[expire-homepage-slots] expired: ${expired.map((e) => e.name).join(", ")} — repacked: ${repacked}`
  );

  return NextResponse.json({ ok: true, expired: expired.length, repacked });
}
