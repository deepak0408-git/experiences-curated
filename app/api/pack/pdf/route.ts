import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasProSubscription } from "@/lib/pro";
import { db } from "@/lib/db";
import { experiences, sportingEvents, sportingEventExperiences } from "@/schema/database";
import { eq, and, asc } from "drizzle-orm";
import { createElement } from "react";
import type { ReactElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { PackPdfDocument } from "./PackPdfDocument";

const SECTION_MAP: Record<string, string> = {
  transit: "Before you go",
  fan_experience: "On the grounds",
  sports_venue: "On the grounds",
  event: "On the grounds",
  accommodation: "Where to stay",
  dining: "Where to eat",
  neighborhood: "The neighbourhood",
  day_trip: "The neighbourhood",
  activity: "The neighbourhood",
  cultural_site: "The neighbourhood",
  multi_day: "The neighbourhood",
  natural_wonder: "The neighbourhood",
};

const SECTION_ORDER = [
  "Before you go",
  "On the grounds",
  "Where to stay",
  "Where to eat",
  "The neighbourhood",
];

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const isPro = await hasProSubscription(user.email);
  if (!isPro) {
    return NextResponse.json({ error: "Pro required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const mode = searchParams.get("mode") ?? "brief";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const [event] = await db
    .select({
      id: sportingEvents.id,
      name: sportingEvents.name,
      editorialOverview: sportingEvents.editorialOverview,
      preTripBriefLines: sportingEvents.preTripBriefLines,
      preTripBriefLiveAt: sportingEvents.preTripBriefLiveAt,
    })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug))
    .limit(1);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const exps = await db
    .select({
      id: experiences.id,
      title: experiences.title,
      subtitle: experiences.subtitle,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      neighborhood: experiences.neighborhood,
      whyItsSpecial: experiences.whyItsSpecial,
      bodyContent: experiences.bodyContent,
      insiderTips: experiences.insiderTips,
      practicalInfo: experiences.practicalInfo,
      packRank: sportingEventExperiences.packRank,
    })
    .from(experiences)
    .innerJoin(
      sportingEventExperiences,
      and(
        eq(sportingEventExperiences.experienceId, experiences.id),
        eq(sportingEventExperiences.sportingEventId, event.id)
      )
    )
    .where(eq(experiences.status, "published"))
    .orderBy(asc(sportingEventExperiences.packRank));

  const isBrief = mode === "brief";
  const displayExps = isBrief
    ? exps.filter((e) => e.packRank !== null).slice(0, 10)
    : exps;

  const sections = SECTION_ORDER.map((name) => ({
    name,
    items: displayExps.filter((e) => SECTION_MAP[e.experienceType] === name),
  })).filter((s) => s.items.length > 0);

  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const docElement = createElement(PackPdfDocument, {
    eventName: event.name,
    editorialOverview: event.editorialOverview ?? null,
    preTripBriefLines: event.preTripBriefLines ?? null,
    preTripBriefLiveAt: event.preTripBriefLiveAt ?? null,
    sections,
    isBrief,
    userEmail: user.email,
    dateStr,
  }) as ReactElement<DocumentProps>;

  const buffer = await renderToBuffer(docElement);

  const filename = isBrief ? `${slug}-travel-brief.pdf` : `${slug}-full-pack.pdf`;

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
