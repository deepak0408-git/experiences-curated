import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import { eq } from "drizzle-orm";
import { SPOKE_COMPONENTS, SPOKE_METADATA } from "../_hub-and-spoke/spokes/registry";

// Dynamic spoke route for any hub_and_spoke-format event — e.g.
// /event-pack/bahrain-grand-prix/tickets. Only reachable for events with
// packFormat="hub_and_spoke"; every classic event 404s here since it has
// no spoke content registered, which is the correct behaviour (classic
// packs don't have spoke sub-pages at all).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; spoke: string }>;
}): Promise<Metadata> {
  const { slug, spoke } = await params;
  const title = SPOKE_METADATA[slug]?.[spoke];
  return { title: title ?? "Event Guide" };
}

export default async function SpokePage({
  params,
}: {
  params: Promise<{ slug: string; spoke: string }>;
}) {
  const { slug, spoke } = await params;

  const [event] = await db.select({ packFormat: sportingEvents.packFormat }).from(sportingEvents).where(eq(sportingEvents.slug, slug)).limit(1);
  if (!event || event.packFormat !== "hub_and_spoke") notFound();

  const Component = SPOKE_COMPONENTS[slug]?.[spoke];
  if (!Component) notFound();

  return <Component eventSlug={slug} />;
}
