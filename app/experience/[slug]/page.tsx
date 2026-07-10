import { unstable_cache } from "next/cache";
import { getExperienceBySlug, type ExperienceDetail } from "@/lib/queries/experiences";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { experiences, savedItems, users, userProfiles, travelLogs, purchases, sportingEvents } from "@/schema/database";
import { and, eq, ne, inArray, count, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { hasProSubscription } from "@/lib/pro";
import ExperienceViewGate from "./_components/ExperienceViewGate";
import SaveExperienceCTA from "./_components/SaveExperienceCTA";
import ExperienceTracker from "./_components/ExperienceTracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://experiences-curated.com";
  try {
    const exp = await getExperienceBySlug(slug);
    const description = exp.subtitle ?? exp.whyItsSpecial?.slice(0, 160) ?? "";
    const images = exp.heroImageUrl
      ? [{ url: exp.heroImageUrl, width: 1200, height: 630, alt: exp.heroImageAlt ?? exp.title }]
      : [];
    return {
      title: exp.title,
      description,
      alternates: {
        canonical: `${base}/experience/${exp.slug}`,
      },
      openGraph: {
        title: exp.title,
        description,
        url: `${base}/experience/${exp.slug}`,
        type: "article",
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: exp.title,
        description,
        images: exp.heroImageUrl ? [exp.heroImageUrl] : [],
      },
    };
  } catch {
    return { title: "Experience not found" };
  }
}

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity",
  dining: "Dining",
  accommodation: "Stay",
  cultural_site: "Cultural Site",
  natural_wonder: "Natural Wonder",
  neighborhood: "Neighbourhood",
  day_trip: "Day Trip",
  multi_day: "Multi-day",
  sports_venue: "Sports Venue",
  fan_experience: "Fan Experience",
  transit: "Transit",
  event: "Event",
};

const BUDGET_LABELS: Record<string, string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Mid-range",
  splurge: "Splurge",
  luxury: "Luxury",
};

const PACE_LABELS: Record<string, string> = {
  slow: "Slow",
  moderate: "Moderate",
  active: "Active",
  intense: "Intense",
};

const MONTH_LABELS: Record<string, string> = {
  jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr",
  may: "May", jun: "Jun", jul: "Jul", aug: "Aug",
  sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
};

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Cache experience content, ratings, and related for 1 hour — only auth runs per-request
  const getExperienceData = unstable_cache(
    async (s: string) => {
      const exp = await getExperienceBySlug(s);

      const [ratingRow] = await db
        .select({
          avgRating: sql<number>`round(avg(${travelLogs.rating})::numeric, 1)`,
          ratingCount: count(travelLogs.id),
        })
        .from(travelLogs)
        .where(eq(travelLogs.experienceId, exp.id));

      let eventPackSlug = "wimbledon-2026";
      let eventPackName = "Wimbledon 2026";
      if (exp.sportingEventId) {
        const [ev] = await db
          .select({ slug: sportingEvents.slug, name: sportingEvents.name })
          .from(sportingEvents)
          .where(eq(sportingEvents.id, exp.sportingEventId))
          .limit(1);
        if (ev) { eventPackSlug = ev.slug; eventPackName = ev.name; }
      }

      const related = await db
        .select({
          id: experiences.id,
          title: experiences.title,
          slug: experiences.slug,
          heroImageUrl: experiences.heroImageUrl,
          experienceType: experiences.experienceType,
          subtitle: experiences.subtitle,
          neighborhood: experiences.neighborhood,
        })
        .from(experiences)
        .where(
          and(
            inArray(experiences.status, ["published", "in_review"]),
            ne(experiences.slug, s),
            exp.sportingEventId
              ? eq(experiences.sportingEventId, exp.sportingEventId)
              : eq(experiences.destinationId, exp.destinationId)
          )
        )
        .limit(3);

      return { exp, ratingRow, eventPackSlug, eventPackName, related };
    },
    ["experience-page"],
    { revalidate: 3600 }
  );

  const { exp, ratingRow, eventPackSlug, eventPackName, related } = await getExperienceData(slug);

  const avgRating = ratingRow?.avgRating ?? null;
  const ratingCount = ratingRow?.ratingCount ?? 0;

  const practical = exp.practicalInfo as {
    hours?: string;
    costRange?: string;
    bookingMethod?: string;
    reservationsRequired?: boolean;
    website?: string;
  } | null;

  const jsonLd = buildJsonLd(exp, ratingCount >= 3 ? { avgRating, ratingCount } : null);

  const isEarlyBird = new Date() < new Date(process.env.NEXT_PUBLIC_EARLY_BIRD_CUTOFF ?? "2026-06-01");
  const FREE_EVENT_SLUGS = (process.env.FREE_EVENT_SLUGS ?? "").split(",").filter(Boolean);
  const priceDisplay = FREE_EVENT_SLUGS.includes(eventPackSlug)
    ? "Free"
    : isEarlyBird
      ? (process.env.NEXT_PUBLIC_EARLY_BIRD_PRICE_DISPLAY ?? "£15")
      : (process.env.NEXT_PUBLIC_STANDARD_PRICE_DISPLAY ?? "£25");

  // Auth + saved state (always fresh — never cached)
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const isLoggedIn = !!authUser;
  const isPro = authUser?.email ? await hasProSubscription(authUser.email) : false;

  // Pack purchasers get unlimited reads for experiences in their purchased event
  let hasPurchasedPack = false;
  if (authUser?.email && exp.sportingEventId) {
    const [purchase] = await db
      .select({ id: purchases.id })
      .from(purchases)
      .where(
        and(
          eq(purchases.email, authUser.email),
          eq(purchases.sportingEventId, exp.sportingEventId),
          eq(purchases.status, "active")
        )
      )
      .limit(1);
    hasPurchasedPack = !!purchase;
  }
  let isSaved = false;
  let hasVisited = false;
  let visitRating: number | null = null;
  let archetype: string | null = null;
  if (authUser) {
    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.authId, authUser.id))
      .limit(1);
    if (dbUser) {
      const [saved] = await db
        .select({ id: savedItems.id })
        .from(savedItems)
        .where(and(eq(savedItems.userId, dbUser.id), eq(savedItems.experienceId, exp.id)))
        .limit(1);
      isSaved = !!saved;

      const [log] = await db
        .select({ rating: travelLogs.rating })
        .from(travelLogs)
        .where(and(eq(travelLogs.userId, dbUser.id), eq(travelLogs.experienceId, exp.id)))
        .limit(1);
      hasVisited = !!log;
      visitRating = log?.rating ?? null;
    }
    if (authUser.email) {
      const [profile] = await db
        .select({ archetype: userProfiles.archetype })
        .from(userProfiles)
        .where(eq(userProfiles.email, authUser.email))
        .limit(1);
      archetype = profile?.archetype ?? null;
    }
  }

  const ARCHETYPE_PREFERRED_TYPES: Record<string, string[]> = {
    pilgrim:       ["sports_venue", "fan_experience", "event"],
    first_pilgrim: ["sports_venue", "fan_experience", "transit"],
    connoisseur:   ["accommodation", "dining", "fan_experience"],
    immersionist:  ["neighborhood", "dining", "activity"],
  };
  const isArchetypeMatch = archetype != null &&
    (ARCHETYPE_PREFERRED_TYPES[archetype] ?? []).includes(exp.experienceType);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <ExperienceTracker
        experienceSlug={exp.slug}
        experienceTitle={exp.title}
        eventSlug={eventPackSlug}
        eventName={eventPackName}
      />
      <ExperienceViewGate
        slug={slug}
        eventPackSlug={eventPackSlug}
        eventPackName={eventPackName}
        priceDisplay={priceDisplay}
        isPro={isPro}
        hasPurchasedPack={hasPurchasedPack}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ── */}
      {exp.heroImageUrl ? (
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-[#0A0A0A]">
          <Image
            src={exp.heroImageUrl}
            alt={exp.heroImageAlt ?? exp.title}
            fill
            className={`object-cover opacity-90 ${
              slug === "wimbledon-centre-court-mq4whguq" ? "object-[center_65%]" :
              slug.startsWith("pouhon-corner-silver3-") ? "object-[center_70%]" :
              slug.startsWith("fan-zone-raidillon-") ? "object-[center_80%]" :
              slug.startsWith("spa-francorchamps-track-experiences-") ? "object-[center_92%]" :
              slug.startsWith("open-bold-hotel-") ? "object-[center_40%]" :
              slug.startsWith("open-pub-walk-birkdale-") ? "object-[center_60%]" :
              slug.startsWith("open-lord-street-southport-") ? "object-[center_70%]" :
              slug.startsWith("open-liverpool-day-trip-") ? "object-[center_35%]" :
              slug.startsWith("open-vincent-hotel-") ? "object-[center_70%]" :
              slug.startsWith("grandstand-22-parabolica-corner-") ? "object-[center_80%]" :
              slug.startsWith("staying-in-milan-city-base-strategy-") ? "object-[center_20%]" :
              slug.startsWith("alfa-romeo-museum-arese-") ? "object-[center_15%]" :
              slug.startsWith("paddock-club-champions-club-hospitality-") ? "object-[center_10%]" :
              ""
            }`}
            sizes="100vw"
            priority
          />
          {exp.heroImageCredit && (
            <p className="absolute bottom-3 right-4 text-xs text-white/50">
              {exp.heroImageCredit}
            </p>
          )}
        </div>
      ) : (
        <div className="h-2 bg-[#141414]" />
      )}

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6A6A6A] mb-6">
          <Link href="/" className="hover:text-[#AAFF00] transition-colors">Home</Link>
          <span>·</span>
          <span>{exp.destinationName}, {exp.destinationCountry.toUpperCase()}</span>
          {exp.neighborhood && (
            <>
              <span>·</span>
              <span>{exp.neighborhood}</span>
            </>
          )}
        </nav>

        {/* Type badge */}
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#6A6A6A]">
            {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
          </span>
          {hasVisited && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#AAFF00] bg-[#AAFF00]/10 border border-[#AAFF00]/30 rounded-sm px-2 py-0.5">
              ✓ You{`'`}ve been here{visitRating ? ` · ${visitRating}/5` : ""}
            </span>
          )}
          {!hasVisited && isArchetypeMatch && (
            <span className="inline-block text-[10px] font-medium text-[#6A6A6A] border border-[#2A2A2A] rounded-sm px-2 py-0.5">
              Picked for your profile
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-[#AAFF00] leading-tight tracking-tight">
          {exp.title}
        </h1>

        {exp.subtitle && (
          <p className="mt-3 text-lg text-[#A3A3A3] leading-relaxed">
            {exp.subtitle}
          </p>
        )}

        {ratingCount >= 3 && (
          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className={`text-sm ${s <= Math.round(Number(avgRating)) ? "text-amber-400" : "text-[#2A2A2A]"}`}>★</span>
              ))}
            </div>
            <span className="text-xs font-medium text-[#A3A3A3]">{Number(avgRating).toFixed(1)}</span>
            <span className="text-xs text-[#6A6A6A]">· {ratingCount} traveller{ratingCount !== 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-[#2A2A2A]">
          {exp.budgetTier && (
            <MetaBadge label={BUDGET_LABELS[exp.budgetTier]} />
          )}
          {exp.pace && (
            <MetaBadge label={PACE_LABELS[exp.pace]} />
          )}
          {exp.physicalIntensity && (
            <MetaBadge label={`Intensity ${exp.physicalIntensity}/5`} />
          )}
          {exp.bestSeasons && exp.bestSeasons.length > 0 && (
            <MetaBadge
              label={`Best: ${exp.bestSeasons.map((m) => MONTH_LABELS[m] ?? m).join(", ")}`}
            />
          )}
          {exp.advanceBookingRequired && (
            <MetaBadge label="Book in advance" highlight />
          )}
          {exp.availability === "event_only" && (
            <MetaBadge label="Event only" highlight />
          )}
        </div>

        {/* Body */}
        {exp.bodyContent && (
          <div className="mt-10 max-w-none">
            {exp.bodyContent.split("\n\n").map((para, i) => (
              <p key={i} className="text-[#A3A3A3] leading-8 mb-5">
                {renderInline(para)}
              </p>
            ))}
          </div>
        )}

        {/* Why It's Special */}
        {exp.whyItsSpecial && (
          <div className="mt-12 border-l-4 border-[#AAFF00] pl-6 py-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
              Why it&apos;s special
            </p>
            {exp.whyItsSpecial.split("\n\n").map((para, i) => (
              <p key={i} className="text-[#A3A3A3] leading-8 mb-4 italic">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Insider Tips */}
        {exp.insiderTips && exp.insiderTips.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-5">
              Insider tips
            </h2>
            <ol className="space-y-4">
              {exp.insiderTips.filter(Boolean).map((tip, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-sm bg-[#AAFF00] text-black text-xs font-black flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[#A3A3A3] leading-7 text-[15px]">{tip}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Practical Info */}
        {practical && (
          <div className="mt-12 rounded-sm bg-[#141414] border border-[#2A2A2A] p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-5">
              Practical info
            </h2>
            <dl className="space-y-3">
              {practical.hours && (
                <PracticalRow label="Hours" value={practical.hours} />
              )}
              {practical.costRange && (
                <PracticalRow label="Cost" value={practical.costRange} />
              )}
              {practical.bookingMethod && (
                <PracticalRow label="Access" value={practical.bookingMethod} />
              )}
              {exp.bookingLinks && (exp.bookingLinks as Array<{ platform: string; label?: string; url: string }>).length > 0 && (
                <div className="flex gap-4">
                  <dt className="w-[30%] flex-shrink-0 text-sm font-medium text-[#6A6A6A]">Book</dt>
                  <dd className="flex flex-wrap gap-2">
                    {(exp.bookingLinks as Array<{ platform: string; label?: string; url: string }>).map((link, i) => (
                      <a
                        key={link.url ?? i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
                      >
                        {link.label ?? link.platform}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
              {exp.gettingThere && (
                <PracticalRow label="Getting there" value={exp.gettingThere} />
              )}
              {exp.address && (
                <PracticalRow label="Address" value={exp.address} />
              )}
              {practical.website && (
                <div className="flex gap-4">
                  <dt className="w-[30%] flex-shrink-0 text-sm font-medium text-[#6A6A6A]">Website</dt>
                  <dd className="min-w-0 break-all flex flex-col gap-1">
                    {practical.website.split(",").map((url) => {
                      const trimmed = url.trim();
                      const href = trimmed.match(/^https?:\/\//) ? trimmed : `https://${trimmed}`;
                      return (
                        <a
                          key={trimmed}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#AAFF00] underline hover:text-white transition-colors"
                        >
                          {trimmed.replace(/^https?:\/\//, "")}
                        </a>
                      );
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* What to Avoid */}
        {exp.whatToAvoid && (
          <div className="mt-8 rounded-sm bg-[#141414] border border-[#2A2A2A] p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-3">
              What to avoid
            </h2>
            <p className="text-[#A3A3A3] text-sm leading-7">{exp.whatToAvoid}</p>
          </div>
        )}

        {/* Curator attribution — only shown when a named curator is assigned */}
        {exp.curatorName && (
          <div className="mt-12 pt-8 border-t border-[#2A2A2A] flex items-start gap-4">
            {exp.curatorImage ? (
              <Image
                src={exp.curatorImage}
                alt={exp.curatorName}
                width={40}
                height={40}
                className="rounded-sm object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0 text-sm font-black text-[#AAFF00]">
                {exp.curatorName[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-white">{exp.curatorName}</p>
              <p className="text-xs text-[#6A6A6A] mt-0.5">Curator</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {exp.moodTags && exp.moodTags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[#2A2A2A] flex flex-wrap gap-2">
            {exp.moodTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-sm bg-[#141414] border border-[#2A2A2A] text-xs text-[#6A6A6A] capitalize"
              >
                {tag}
              </span>
            ))}
            {exp.interestCategories?.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-sm bg-[#141414] border border-[#2A2A2A] text-xs text-[#6A6A6A] capitalize"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Draft watermark */}
        {exp.status === "draft" && (
          <div className="mt-10 text-center text-xs text-[#2A2A2A] font-medium tracking-widest uppercase">
            Draft — not published
          </div>
        )}

        {/* Save CTA */}
        <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
          <SaveExperienceCTA
            experienceId={exp.id}
            slug={slug}
            isLoggedIn={isLoggedIn}
            isSaved={isSaved}
          />
        </div>
      </div>

      {/* Related experiences */}
      {related.length > 0 && (
        <div className="border-t border-[#2A2A2A] bg-[#141414]">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-6">
              More from this guide
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/experience/${rel.slug}`}
                  className="group rounded-sm border border-[#2A2A2A] overflow-hidden hover:border-[#AAFF00] transition-colors bg-[#0A0A0A]"
                >
                  {rel.heroImageUrl ? (
                    <div className="relative h-32 overflow-hidden bg-[#1A1A1A]">
                      <Image
                        src={rel.heroImageUrl}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-[#1A1A1A]" />
                  )}
                  <div className="p-4">
                    <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-1.5">
                      {TYPE_LABELS[rel.experienceType] ?? rel.experienceType}
                    </p>
                    <h3 className="text-sm font-black text-white leading-snug group-hover:text-[#AAFF00] transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    {rel.neighborhood && (
                      <p className="mt-1.5 text-xs text-[#6A6A6A]">{rel.neighborhood}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildJsonLd(
  exp: ExperienceDetail,
  rating: { avgRating: number; ratingCount: number } | null,
) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://experiences-curated.com";

  const priceRange =
    exp.budgetMinCost && exp.budgetMaxCost
      ? `${exp.budgetCurrency ?? ""}${exp.budgetMinCost}–${exp.budgetCurrency ?? ""}${exp.budgetMaxCost}`
      : exp.budgetMinCost
      ? `${exp.budgetCurrency ?? ""}${exp.budgetMinCost}+`
      : null;

  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: exp.title,
    ...(exp.subtitle || exp.whyItsSpecial
      ? { description: exp.subtitle ?? exp.whyItsSpecial?.slice(0, 160) }
      : {}),
    url: `${base}/experience/${exp.slug}`,
    ...(exp.heroImageUrl ? { image: exp.heroImageUrl } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: exp.destinationName,
      addressCountry: exp.destinationCountry.toUpperCase(),
      ...(exp.address ? { streetAddress: exp.address } : {}),
    },
    ...(priceRange ? { priceRange } : {}),
    ...(exp.publishedAt ? { datePublished: new Date(exp.publishedAt).toISOString() } : {}),
    ...(exp.curatorName ? { author: { "@type": "Person", name: exp.curatorName } } : {}),
    ...(rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.avgRating,
            ratingCount: rating.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

function MetaBadge({
  label,
  highlight,
}: {
  label: string;
  highlight?: boolean;
}) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-sm text-xs font-medium",
        highlight
          ? "bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/30"
          : "bg-[#141414] text-[#6A6A6A] border border-[#2A2A2A]"
      )}
    >
      {label}
    </span>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:[^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:[^)]+)\)$/);
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-[#AAFF00] hover:text-white transition-colors"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

function linkifyText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    part.startsWith("http") ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#AAFF00] hover:text-white break-all transition-colors">
        {part}
      </a>
    ) : part
  );
}

function PracticalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-[30%] flex-shrink-0 text-sm font-medium text-[#6A6A6A]">{label}</dt>
      <dd className="text-sm text-[#A3A3A3] leading-6 min-w-0 break-words">{linkifyText(value)}</dd>
    </div>
  );
}
