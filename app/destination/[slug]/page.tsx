import type { Metadata } from "next";
import Link from "next/link";
import {
  getDestinationBySlug,
  getDestinationExperiences,
  type DestinationExperience,
} from "@/lib/queries/destinations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const dest = await getDestinationBySlug(slug);
    return {
      title: `${dest.name} — Experiences | Curated`,
      description: dest.editorialOverview?.slice(0, 160),
      openGraph: {
        title: dest.name,
        description: dest.editorialOverview ?? "",
        images: dest.heroImageUrl ? [{ url: dest.heroImageUrl }] : [],
      },
    };
  } catch {
    return { title: "Destination not found" };
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

const COUNTRY_NAMES: Record<string, string> = {
  AU: "Australia", GB: "United Kingdom", US: "United States", JP: "Japan",
  FR: "France", IT: "Italy", ES: "Spain", DE: "Germany", PT: "Portugal",
  NL: "Netherlands", CH: "Switzerland", AT: "Austria", GR: "Greece",
  NZ: "New Zealand", ZA: "South Africa", IN: "India", TH: "Thailand",
  SG: "Singapore", ID: "Indonesia", MX: "Mexico", BR: "Brazil",
  AR: "Argentina", PE: "Peru", CO: "Colombia", AE: "UAE",
  MA: "Morocco", KE: "Kenya", TZ: "Tanzania", EG: "Egypt",
  IS: "Iceland", NO: "Norway", SE: "Sweden", DK: "Denmark", FI: "Finland",
  IE: "Ireland", BE: "Belgium", CZ: "Czech Republic", PL: "Poland",
  HU: "Hungary", HR: "Croatia", TR: "Turkey", VN: "Vietnam",
  KH: "Cambodia", MM: "Myanmar", NP: "Nepal", LK: "Sri Lanka",
  MV: "Maldives", CU: "Cuba", CR: "Costa Rica", CL: "Chile",
};

function formatTimezone(ianaTimezone: string): string {
  const now = new Date();
  const abbr = new Intl.DateTimeFormat("en-US", {
    timeZone: ianaTimezone,
    timeZoneName: "short",
  }).formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? "";
  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: ianaTimezone,
    timeZoneName: "shortOffset",
  }).formatToParts(now).find((p) => p.type === "timeZoneName")?.value ?? "";
  return abbr === offset ? abbr : `${abbr} (${offset})`;
}

const MONTH_LABELS: Record<string, string> = {
  jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr",
  may: "May", jun: "Jun", jul: "Jul", aug: "Aug",
  sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
};

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  const exps = await getDestinationExperiences(dest.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      {dest.heroImageUrl ? (
        <div className="relative h-[45vh] min-h-[300px] overflow-hidden bg-neutral-900">
          <img
            src={dest.heroImageUrl}
            alt={dest.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 max-w-5xl mx-auto">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white/70 mb-2">
              {dest.destinationType.replace("_", " ")} · {COUNTRY_NAMES[dest.countryCode.toUpperCase()] ?? dest.countryCode.toUpperCase()}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              {dest.name}
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 px-8 pt-12 pb-10 max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>·</span>
            <span className="text-neutral-400">Destinations</span>
          </nav>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2">
            {dest.destinationType.replace("_", " ")} · {COUNTRY_NAMES[dest.countryCode.toUpperCase()] ?? dest.countryCode.toUpperCase()}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
            {dest.name}
          </h1>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
        {/* Breadcrumb (only shown when hero image exists) */}
        {dest.heroImageUrl && (
          <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span>·</span>
            <span>Destinations</span>
            <span>·</span>
            <span className="text-neutral-700">{dest.name}</span>
          </nav>
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main column */}
          <div className="lg:col-span-2">
            {dest.editorialOverview && (
              <p className="text-lg text-neutral-700 leading-8 mb-10">
                {dest.editorialOverview}
              </p>
            )}

            {/* Vibe tags */}
            {dest.vibeTags && dest.vibeTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {dest.vibeTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-neutral-100 text-xs text-neutral-600 capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Experience grid */}
            <div className="mt-4">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-400">
                  Curated Experiences
                </h2>
                <span className="text-xs text-neutral-400">{exps.length}</span>
              </div>

              {exps.length === 0 ? (
                <p className="text-sm text-neutral-400 py-8 text-center border border-dashed border-neutral-200 rounded-xl">
                  No published experiences yet for this destination.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  {exps.map((exp) => (
                    <ExperienceCard key={exp.id} exp={exp} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="mt-12 lg:mt-0 space-y-8">
            {/* At a glance */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
                At a glance
              </h3>
              <dl className="space-y-3">
                {(dest.minDays || dest.idealDays) && (
                  <SidebarRow
                    label="Stay"
                    value={
                      dest.idealDays
                        ? `${dest.minDays ?? dest.idealDays}–${dest.idealDays} days`
                        : `${dest.minDays} days min`
                    }
                  />
                )}
                {dest.timezone && (
                  <SidebarRow label="Timezone" value={formatTimezone(dest.timezone)} />
                )}
                {dest.currency && <SidebarRow label="Currency" value={dest.currency} />}
                {dest.language && <SidebarRow label="Language" value={dest.language} />}
                {dest.bestSeasons && dest.bestSeasons.length > 0 && (
                  <SidebarRow
                    label="Best time"
                    value={dest.bestSeasons.map((m) => MONTH_LABELS[m] ?? m).join(", ")}
                  />
                )}
                {dest.region && <SidebarRow label="Region" value={dest.region} />}
                <SidebarRow label="Country" value={COUNTRY_NAMES[dest.countryCode.toUpperCase()] ?? dest.countryCode.toUpperCase()} />
              </dl>
            </div>

            {/* Best for */}
            {dest.bestFor && dest.bestFor.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
                  Best for
                </h3>
                <ul className="space-y-1.5">
                  {dest.bestFor.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical */}
            {(dest.gettingThere || dest.gettingAround || dest.visaInfo || dest.safetyNotes || dest.budgetContext) && (
              <div className="space-y-5">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                  Practical info
                </h3>
                {dest.gettingThere && (
                  <PracticalBlock label="Getting there" text={dest.gettingThere} />
                )}
                {dest.gettingAround && (
                  <PracticalBlock label="Getting around" text={dest.gettingAround} />
                )}
                {dest.visaInfo && (
                  <PracticalBlock label="Visa" text={dest.visaInfo} />
                )}
                {dest.budgetContext && (
                  <PracticalBlock label="Budget" text={dest.budgetContext} />
                )}
                {dest.safetyNotes && (
                  <PracticalBlock label="Safety" text={dest.safetyNotes} />
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({ exp }: { exp: DestinationExperience }) {
  return (
    <Link
      href={`/experience/${exp.slug}`}
      className="group rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors"
    >
      {exp.heroImageUrl ? (
        <div className="h-40 overflow-hidden bg-neutral-100">
          <img
            src={exp.heroImageUrl}
            alt={exp.heroImageAlt ?? exp.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-40 bg-neutral-100 flex items-center justify-center">
          <span className="text-xs text-neutral-400 tracking-widest uppercase">
            {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
          </span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
            {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
          </span>
          {exp.budgetTier && (
            <span className="text-xs text-neutral-400">
              {BUDGET_LABELS[exp.budgetTier]}
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors">
          {exp.title}
        </h3>
        {exp.subtitle && (
          <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-5">
            {exp.subtitle}
          </p>
        )}
        {exp.neighborhood && (
          <p className="mt-2 text-xs text-neutral-400">{exp.neighborhood}</p>
        )}
      </div>
    </Link>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 flex-shrink-0 text-xs font-medium text-neutral-500">{label}</dt>
      <dd className="text-xs text-neutral-800">{value}</dd>
    </div>
  );
}

function PracticalBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-neutral-500 mb-1">{label}</p>
      <p className="text-xs text-neutral-700 leading-5">{text}</p>
    </div>
  );
}
