import { getExperienceBySlug, type ExperienceDetail } from "@/lib/queries/experiences";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { db } from "@/lib/db";
import { experiences, savedItems, users, userProfiles, travelLogs } from "@/schema/database";
import { and, eq, ne, inArray, count, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { hasProSubscription } from "@/lib/pro";
import ExperienceViewGate from "./_components/ExperienceViewGate";
import SaveExperienceCTA from "./_components/SaveExperienceCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://experiencescurated.com";
  try {
    const exp = await getExperienceBySlug(slug);
    const description = exp.subtitle ?? exp.whyItsSpecial?.slice(0, 160) ?? "";
    const images = exp.heroImageUrl
      ? [{ url: exp.heroImageUrl, width: 1200, height: 630, alt: exp.heroImageAlt ?? exp.title }]
      : [];
    return {
      title: exp.title,
      description,
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
  const exp = await getExperienceBySlug(slug);

  const [ratingRow] = await db
    .select({
      avgRating: sql<number>`round(avg(${travelLogs.rating})::numeric, 1)`,
      ratingCount: count(travelLogs.id),
    })
    .from(travelLogs)
    .where(eq(travelLogs.experienceId, exp.id));
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
  const priceDisplay = isEarlyBird
    ? (process.env.NEXT_PUBLIC_EARLY_BIRD_PRICE_DISPLAY ?? "£15")
    : (process.env.NEXT_PUBLIC_STANDARD_PRICE_DISPLAY ?? "£25");

  // Related experiences — same sporting event, or same destination as fallback
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
        ne(experiences.slug, slug),
        exp.sportingEventId
          ? eq(experiences.sportingEventId, exp.sportingEventId)
          : eq(experiences.destinationId, exp.destinationId)
      )
    )
    .limit(3);

  // Auth + saved state
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const isLoggedIn = !!authUser;
  const isPro = authUser?.email ? await hasProSubscription(authUser.email) : false;
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
    <div className="min-h-screen bg-white">
      <ExperienceViewGate
        slug={slug}
        eventPackSlug="wimbledon-2026"
        eventPackName="Wimbledon 2026"
        priceDisplay={priceDisplay}
        isPro={isPro}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero ── */}
      {exp.heroImageUrl ? (
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-neutral-900">
          <img
            src={exp.heroImageUrl}
            alt={exp.heroImageAlt ?? exp.title}
            className="w-full h-full object-cover opacity-90"
          />
          {exp.heroImageCredit && (
            <p className="absolute bottom-3 right-4 text-xs text-white/60">
              {exp.heroImageCredit}
            </p>
          )}
        </div>
      ) : (
        <div className="h-2 bg-neutral-900" />
      )}

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
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
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-neutral-400">
            {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
          </span>
          {hasVisited && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
              ✓ You{`'`}ve been here{visitRating ? ` · ${visitRating}/5` : ""}
            </span>
          )}
          {!hasVisited && isArchetypeMatch && (
            <span className="inline-block text-[10px] font-medium text-neutral-400 border border-neutral-200 rounded-full px-2 py-0.5">
              Picked for your profile
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight tracking-tight">
          {exp.title}
        </h1>

        {exp.subtitle && (
          <p className="mt-3 text-lg text-neutral-500 leading-relaxed">
            {exp.subtitle}
          </p>
        )}

        {ratingCount >= 3 && (
          <div className="mt-3 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className={`text-sm ${s <= Math.round(Number(avgRating)) ? "text-amber-400" : "text-neutral-200"}`}>★</span>
              ))}
            </div>
            <span className="text-xs font-medium text-neutral-600">{Number(avgRating).toFixed(1)}</span>
            <span className="text-xs text-neutral-400">· {ratingCount} traveller{ratingCount !== 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-neutral-100">
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
          <div className="mt-10 prose prose-neutral prose-lg max-w-none">
            {exp.bodyContent.split("\n\n").map((para, i) => (
              <p key={i} className="text-neutral-800 leading-8 mb-5">
                {renderInline(para)}
              </p>
            ))}
          </div>
        )}

        {/* Why It's Special */}
        {exp.whyItsSpecial && (
          <div className="mt-12 border-l-4 border-neutral-900 pl-6 py-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
              Why it's special
            </p>
            {exp.whyItsSpecial.split("\n\n").map((para, i) => (
              <p key={i} className="text-neutral-700 leading-8 mb-4 italic">
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Insider Tips */}
        {exp.insiderTips && exp.insiderTips.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-5">
              Insider tips
            </h2>
            <ol className="space-y-4">
              {exp.insiderTips.filter(Boolean).map((tip, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-neutral-700 leading-7 text-[15px]">{tip}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Practical Info */}
        {practical && (
          <div className="mt-12 rounded-xl bg-neutral-50 border border-neutral-200 p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-5">
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
              {exp.gettingThere && (
                <PracticalRow label="Getting there" value={exp.gettingThere} />
              )}
              {exp.address && (
                <PracticalRow label="Address" value={exp.address} />
              )}
              {practical.website && (
                <div className="flex gap-4">
                  <dt className="w-28 flex-shrink-0 text-sm font-medium text-neutral-500">Website</dt>
                  <dd>
                    <a
                      href={practical.website.match(/^https?:\/\//) ? practical.website : `https://${practical.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-900 underline hover:text-neutral-500 transition-colors"
                    >
                      {practical.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* What to Avoid */}
        {exp.whatToAvoid && (
          <div className="mt-8 rounded-xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-amber-700 mb-3">
              What to avoid
            </h2>
            <p className="text-neutral-700 text-sm leading-7">{exp.whatToAvoid}</p>
          </div>
        )}

        {/* Curator attribution — only shown when a named curator is assigned */}
        {exp.curatorName && (
          <div className="mt-12 pt-8 border-t border-neutral-100 flex items-start gap-4">
            {exp.curatorImage ? (
              <img
                src={exp.curatorImage}
                alt={exp.curatorName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0 text-sm font-medium text-neutral-600">
                {exp.curatorName[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-neutral-900">{exp.curatorName}</p>
              <p className="text-xs text-neutral-400 mt-0.5">Curator</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {exp.moodTags && exp.moodTags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-neutral-100 flex flex-wrap gap-2">
            {exp.moodTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-neutral-100 text-xs text-neutral-500 capitalize"
              >
                {tag}
              </span>
            ))}
            {exp.interestCategories?.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full bg-neutral-100 text-xs text-neutral-500 capitalize"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Draft watermark */}
        {exp.status === "draft" && (
          <div className="mt-10 text-center text-xs text-neutral-300 font-medium tracking-widest uppercase">
            Draft — not published
          </div>
        )}

        {/* Save CTA */}
        <div className="mt-12 pt-8 border-t border-neutral-100">
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
        <div className="border-t border-neutral-100 bg-neutral-50">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-6">
              More from this guide
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/experience/${rel.slug}`}
                  className="group rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors bg-white"
                >
                  {rel.heroImageUrl ? (
                    <div className="h-32 overflow-hidden bg-neutral-100">
                      <img
                        src={rel.heroImageUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-neutral-100" />
                  )}
                  <div className="p-4">
                    <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1.5">
                      {TYPE_LABELS[rel.experienceType] ?? rel.experienceType}
                    </p>
                    <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    {rel.neighborhood && (
                      <p className="mt-1.5 text-xs text-neutral-400">{rel.neighborhood}</p>
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
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://experiencescurated.com";

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
    ...(exp.publishedAt ? { datePublished: exp.publishedAt.toISOString() } : {}),
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
        "px-3 py-1 rounded-full text-xs font-medium",
        highlight
          ? "bg-amber-100 text-amber-800"
          : "bg-neutral-100 text-neutral-600"
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
          className="underline underline-offset-2 text-neutral-900 hover:text-neutral-500 transition-colors"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

function PracticalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-28 flex-shrink-0 text-sm font-medium text-neutral-500">{label}</dt>
      <dd className="text-sm text-neutral-800 leading-6">{value}</dd>
    </div>
  );
}
