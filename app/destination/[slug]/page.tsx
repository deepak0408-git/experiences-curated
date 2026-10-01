import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getDestinationBySlug,
  getDestinationExperiences,
  getDestinationSportingEvents,
  getNearbyDestinationEvents,
  type DestinationExperience,
  type DestinationSportingEvent,
  type NearbyDestinationEvent,
} from "@/lib/queries/destinations";
import { getArticlesForDestination } from "@/lib/queries/blog";
import { getAuthUser } from "@/lib/supabase/server";
import { hasTicketIntelligence } from "../../ticket-intelligence/[slug]/_lib/getSeatingData";
import { isGetYourGuideLink, isBookingComLink } from "../../event-pack/[slug]/_hub-and-spoke/_lib/getSpokeData";
import EventNotifyRow from "./_components/EventNotifyRow";
import DestinationActionSidebar from "./_components/DestinationActionSidebar";

// SEO titles/descriptions for the 4 pilot destinations only — written to match
// real search intent ("[city] sports travel guide", "[event] + hotels/tickets")
// rather than the generic `{name} — Experiences | Curated` pattern the other
// 35 (non-pilot) destinations still use. Founder-requested 1 Oct 2026; extend
// this map as more destinations get the events treatment.
const DESTINATION_SEO: Record<string, { title: string; description: string }> = {
  "london-gb": {
    title: "London Sports Travel Guide",
    description:
      "Plan your London sports trip: upcoming events, plus hotels, dining and day trips near every venue.",
  },
  "melbourne-au": {
    title: "Melbourne Sports Travel Guide",
    description:
      "Plan your Melbourne sports trip: upcoming events, plus hotels, dining and day trips near every venue.",
  },
  shanghai: {
    title: "Shanghai Sports Travel Guide",
    description:
      "Plan your Shanghai sports trip: upcoming events, plus hotels, dining and day trips near every venue.",
  },
  "abu-dhabi": {
    title: "Abu Dhabi Sports Travel Guide",
    description:
      "Plan your Abu Dhabi sports trip: upcoming events, plus hotels, dining and day trips near every venue.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const dest = await getDestinationBySlug(slug);
    const seo = DESTINATION_SEO[slug];
    const title = seo ? `${seo.title} | Experiences | Curated` : `${dest.name} — Experiences | Curated`;
    const description = seo ? seo.description : dest.editorialOverview?.slice(0, 160);
    return {
      title,
      description,
      openGraph: {
        title: seo?.title ?? dest.name,
        description: description ?? "",
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

const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  football: "Football",
  rugby: "Rugby",
  golf: "Golf",
  formula_one: "Formula 1",
  cycling: "Cycling",
  athletics: "Athletics",
  other: "Sport",
};

// Per-destination hero crop fix — lg: breakpoint only, never bare/mobile
// (see feedback_image_refocus_lg_only memory: mobile's default object-cover
// centering already works fine; desktop crops need the manual override).
// Shanghai's hero (Bund at night, Oriental Pearl Tower) was cropping the
// tower's top off with default center positioning — founder-caught 1 Oct
// 2026. Lowering the focus point shifts the visible crop window upward.
const HERO_IMAGE_FOCUS: Record<string, string> = {
  shanghai: "lg:object-[center_85%]",
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

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${e.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
}

type EventStatus = {
  badge: "live" | "upcoming" | "coming_soon";
  linkable: boolean;
};

// Status badge logic per the brainstorm's content model: live/built_hidden
// events are "Guide ready" and link through; planned+hidden events show as
// "Coming soon" with no link-through, not greyed-out/unclickable-looking —
// same visual treatment as "Guide coming — get notified" on the experience
// page (ExperienceActionSidebar.tsx). This deliberately surfaces hidden
// events on this page — see the no-isHidden-filter note on
// getDestinationSportingEvents in lib/queries/destinations.ts. Countdown
// removed entirely per founder feedback 1 Oct 2026.
function eventStatus(ev: { startDate: string; endDate: string; packStatus: string; isHidden: boolean }): EventStatus {
  if (ev.isHidden || ev.packStatus === "planned") {
    return { badge: "coming_soon", linkable: false };
  }
  const toStart = daysUntil(ev.startDate);
  const toEnd = daysUntil(ev.endDate);
  if (toStart <= 0 && toEnd >= 0) {
    return { badge: "live", linkable: true };
  }
  return { badge: "upcoming", linkable: true };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  const nearbyEvents = await getNearbyDestinationEvents({ id: dest.id, lat: dest.lat, lng: dest.lng });
  const [exps, directEvents, relatedArticles, { user }] = await Promise.all([
    getDestinationExperiences(dest.id),
    getDestinationSportingEvents(dest.id),
    getArticlesForDestination(
      dest.id,
      3,
      nearbyEvents.map((e) => ({ id: e.id, sport: e.sport }))
    ),
    getAuthUser(),
  ]);

  // Merge direct + nearby into one flat chronological list, per the
  // brainstorm's content model — nearby events carry a distance label.
  const mergedEvents = [
    ...directEvents.map((ev) => ({ ...ev, nearDestinationName: null as string | null, distanceKm: null as number | null })),
    ...nearbyEvents,
  ].sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Attractions / Where to Stay / Where to Eat, per founder feedback 1 Oct
  // 2026 — day_trip, accommodation, dining get their own labeled rows
  // instead of one undifferentiated "featured" grid. The rest of the
  // destination's published experiences are reachable via a single
  // "Explore more" link into search (item #8), not rendered inline.
  // Attractions includes day_trip, cultural_site, and activity — widened
  // 1 Oct 2026 after Abu Dhabi surfaced with zero day_trip-typed
  // experiences despite having clearly relevant content (Sheikh Zayed
  // Mosque, Louvre Abu Dhabi) tagged cultural_site instead. Founder-
  // confirmed: applies to all destinations, not just Abu Dhabi.
  const ATTRACTION_TYPES = new Set(["day_trip", "cultural_site", "activity"]);
  const attractions = exps.filter((e) => ATTRACTION_TYPES.has(e.experienceType));
  const stays = exps.filter((e) => e.experienceType === "accommodation");
  const dining = exps.filter((e) => e.experienceType === "dining");
  // Sports Venues — new section, founder-requested 1 Oct 2026, positioned
  // above Attractions. No affiliate sidebar (no stated GYG/Booking.com
  // relationship for venues), same ExperienceRow pattern as Where to Eat.
  const sportsVenues = exps.filter((e) => e.experienceType === "sports_venue");

  // "Find your perfect seat" gate — F1-only, real seeded Ticket Intelligence
  // data, same gate as ExperienceActionSidebar's showTicketIntelligenceLink.
  // Computed per event since each event card gets its own sidebar (item #3).
  const ticketIntelFlags = await Promise.all(
    mergedEvents.map(async (ev) =>
      ev.sport === "formula_one" ? await hasTicketIntelligence(ev.id) : false
    )
  );

  // GetYourGuide links across all Attractions experiences, Booking.com links
  // across all Where to Stay experiences — founder-confirmed 1 Oct 2026
  // (items #4/#5). Flattened across experiences in that section rather than
  // per-card, matching "a sidebar with the affiliate links" as a section-
  // level block.
  const attractionGygLinks = attractions
    .flatMap((e) => ((e.bookingLinks as Array<{ platform: string; label?: string; url: string }> | null) ?? []).map((l) => ({ ...l, experienceTitle: e.title })))
    .filter((l) => isGetYourGuideLink(l.url));
  const stayBookingLinks = stays
    .flatMap((e) => ((e.bookingLinks as Array<{ platform: string; label?: string; url: string }> | null) ?? []).map((l) => ({ ...l, experienceTitle: e.title })))
    .filter((l) => isBookingComLink(l.url));

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      {dest.heroImageUrl ? (
        <div className="relative h-[45vh] min-h-[300px] overflow-hidden bg-[#141414]">
          <Image
            src={dest.heroImageUrl}
            alt={dest.name}
            fill
            className={`object-cover opacity-85 ${HERO_IMAGE_FOCUS[dest.slug] ?? ""}`}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 max-w-5xl mx-auto">
            <span className="inline-block text-xs font-black tracking-widest uppercase text-white/70 mb-2">
              {dest.destinationType.replace("_", " ")} · {COUNTRY_NAMES[dest.countryCode.toUpperCase()] ?? dest.countryCode.toUpperCase()}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              {dest.name}
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-[#141414] px-8 pt-12 pb-10 max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#6A6A6A] mb-6">
            <Link href="/" className="hover:text-[#AAFF00] transition-colors">Home</Link>
            <span>·</span>
            <span className="text-[#A3A3A3]">Destinations</span>
          </nav>
          <span className="inline-block text-xs font-black tracking-widest uppercase text-[#A3A3A3] mb-2">
            {dest.destinationType.replace("_", " ")} · {COUNTRY_NAMES[dest.countryCode.toUpperCase()] ?? dest.countryCode.toUpperCase()}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            {dest.name}
          </h1>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
        {/* Breadcrumb (only shown when hero image exists) */}
        {dest.heroImageUrl && (
          <nav className="flex items-center gap-2 text-xs text-[#6A6A6A] mb-8">
            <Link href="/" className="hover:text-[#AAFF00] transition-colors">Home</Link>
            <span>·</span>
            <span>Destinations</span>
            <span>·</span>
            <span className="text-[#A3A3A3]">{dest.name}</span>
          </nav>
        )}

        {/* Editorial hook — same body size as the hub-and-spoke event pack's
            intro copy (HubPage.tsx config.introText block). Full page
            width, same as before. */}
        {dest.editorialOverview && (
          <p className="text-sm text-[#A3A3A3] leading-7 mb-10">
            {dest.editorialOverview}
          </p>
        )}

        {/* Sporting events — full page width (not confined to the 2/3-width
            main column below), so the event card keeps its original full
            size and the DestinationActionSidebar sits in genuinely
            additional space to its right, rather than squeezing the card
            narrower to share the main column's width. */}
        <div className="mb-12">
          <h2 className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-6">
            Sporting events in {dest.name}
          </h2>

          {mergedEvents.length === 0 ? (
            <p className="text-sm text-[#6A6A6A] py-8 text-center border border-dashed border-[#2A2A2A] rounded-sm">
              No upcoming sporting events tracked here yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {mergedEvents.map((ev, i) => (
                <div key={ev.id} className="lg:flex lg:gap-5 lg:items-stretch">
                  <DestinationEventCard ev={ev} userEmail={user?.email ?? null} />
                  <div className="mt-4 lg:mt-0 lg:w-72 lg:flex-shrink-0">
                    <DestinationActionSidebar
                      eventSlug={ev.slug}
                      eventFormat={ev.packFormat}
                      showTicketIntelligenceLink={ticketIntelFlags[i]}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sports Venues — founder-requested 1 Oct 2026, full page width,
            positioned above Attractions. No affiliate sidebar, same
            fromDestination backlink config as every other section
            (ExperienceCard already threads destinationSlug through). */}
        {sportsVenues.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-6">
              Sports Venues
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sportsVenues.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} destinationSlug={dest.slug} />
              ))}
            </div>
          </div>
        )}

        {/* Attractions / Where to Stay — full page width, same pattern as
            Sporting Events above: cards keep their original full size, the
            affiliate sidebar sits in genuinely additional space to the
            right (not squeezed from the card grid's existing width).
            Founder-corrected 1 Oct 2026 — items #4/#5 originally lived
            inside the 2/3-width main column below, which cramped the
            card grid narrower than the event cards above it. */}
        {attractions.length > 0 && (
          <ExperienceRowFullWidth title="Attractions" exps={attractions} affiliateLinks={attractionGygLinks} affiliateLabel="Book" destinationSlug={dest.slug} />
        )}
        {stays.length > 0 && (
          <ExperienceRowFullWidth title="Where to Stay" exps={stays} affiliateLinks={stayBookingLinks} affiliateLabel="Book" destinationSlug={dest.slug} />
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main column */}
          <div className="lg:col-span-2">
            {/* Where to Eat — no affiliate sidebar (dining has no affiliate
                relationship), so it stays in the standard 2/3-width main
                column. */}
            {dining.length > 0 && (
              <ExperienceRow title="Where to Eat" exps={dining} destinationSlug={dest.slug} />
            )}

            {/* Single link into search rather than the full experience
                grid — founder-confirmed 1 Oct 2026 (item #8). */}
            <Link
              href={`/search?destination=${encodeURIComponent(dest.name)}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-black text-[#AAFF00] hover:text-[#BBFF33] transition-colors"
            >
              Explore more {dest.name} experiences →
            </Link>

            {/* Worth reading — same block/query pattern as the hub-and-spoke
                event pack's "Worth reading" (HubPage.tsx), scoped to this
                destination's events rather than a single event. Renders
                nothing if there's genuinely no related coverage yet. */}
            {relatedArticles.length > 0 && (
              <div className="mt-10">
                <h2 className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-6">Worth reading</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/blog/${article.slug}`}
                      className="group flex flex-col rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden hover:border-[#AAFF00] transition-colors"
                    >
                      <div className="relative h-36 w-full overflow-hidden bg-[#1A1A1A]">
                        {article.heroImageUrl ? (
                          <Image
                            src={article.heroImageUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#1A1A1A]" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 px-4 py-3.5">
                        <p className="text-sm font-semibold text-white group-hover:text-[#AAFF00] transition-colors leading-snug">
                          {article.title}
                        </p>
                        <p className="mt-1.5 text-xs text-[#A3A3A3] leading-5 line-clamp-2 flex-1">{article.excerpt}</p>
                        {article.readMinutes && (
                          <span className="mt-2 text-xs text-[#6A6A6A]">{article.readMinutes} min read</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="mt-12 lg:mt-0 space-y-8">
            {/* Best for */}
            {dest.bestFor && dest.bestFor.length > 0 && (
              <div>
                <h3 className="text-xs font-black tracking-widest uppercase text-[#A3A3A3] mb-3">
                  Best for
                </h3>
                <ul className="space-y-1.5">
                  {dest.bestFor.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#A3A3A3]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#AAFF00] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical */}
            {(dest.gettingThere || dest.gettingAround || dest.visaInfo || dest.safetyNotes || dest.budgetContext) && (
              <div className="space-y-5">
                <h3 className="text-xs font-black tracking-widest uppercase text-[#A3A3A3]">
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

type MergedEvent = (DestinationSportingEvent | NearbyDestinationEvent) & {
  nearDestinationName: string | null;
  distanceKm: number | null;
};

// Image + layout modeled on the homepage's CalendarSection card
// (app/_components/CalendarSection.tsx) — taller dominant image, LIVE NOW
// badge over the image, accent-green CTA linking to the event guide.
// Fixed min-height so a short-copy card (e.g. an event with no
// editorialOverview, like a "Coming soon" row) matches the tallest card
// (e.g. Wimbledon's full text) instead of visibly shrinking. Founder-
// confirmed 1 Oct 2026 (item #2).
const EVENT_CARD_MIN_HEIGHT = "sm:min-h-[320px]";

function DestinationEventCard({ ev, userEmail }: { ev: MergedEvent; userEmail: string | null }) {
  const status = eventStatus(ev);
  const isNearby = ev.nearDestinationName != null;

  const details = (
    <div className="flex flex-col justify-between px-6 py-5 flex-1 min-w-0">
      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-black tracking-widest uppercase text-[#AAFF00]">
            {SPORT_LABELS[ev.sport] ?? ev.sport}
          </span>
          {isNearby && (
            <span className="text-xs text-[#6A6A6A]">
              · in {ev.nearDestinationName}{ev.distanceKm != null ? `, ${Math.round(ev.distanceKm)}km away` : ""}
            </span>
          )}
        </div>

        <h3 className={`text-xl font-black leading-snug transition-colors ${status.linkable ? "text-white group-hover:text-[#AAFF00]" : "text-white"}`}>
          {ev.name}
        </h3>

        <p className="mt-1.5 text-sm text-[#A3A3A3]">
          {formatDateRange(ev.startDate, ev.endDate)}
        </p>

        {ev.editorialOverview && (
          <p className="mt-2 text-sm text-[#A3A3A3] leading-6 line-clamp-2">
            {ev.editorialOverview}
          </p>
        )}
      </div>

      {/* Price removed from the card per founder feedback 1 Oct 2026 (item
          #1) — price lives on the event pack page itself, same reasoning
          the homepage's CalendarSection card already follows. */}
      {status.linkable ? (
        <div className="mt-5">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black tracking-wide group-hover:bg-[#BBFF33] transition-colors whitespace-nowrap">
            {status.badge === "live" ? "Live now — get the guide" : "Get the guide"}
          </span>
        </div>
      ) : (
        <EventNotifyRow eventName={ev.name} userEmail={userEmail} />
      )}
    </div>
  );

  const image = (
    <div className={`relative h-52 sm:h-auto sm:w-80 sm:flex-shrink-0 overflow-hidden bg-[#1A1A1A] ${EVENT_CARD_MIN_HEIGHT}`}>
      {ev.heroImageUrl ? (
        <Image
          src={ev.heroImageUrl}
          alt={ev.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 320px"
        />
      ) : (
        <div className="w-full h-full bg-[#1A1A1A]" />
      )}
      {status.badge === "live" && (
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#AAFF00] text-black text-xs font-black tracking-wide">
          LIVE NOW
        </span>
      )}
    </div>
  );

  // Not linkable (planned/hidden event) — render as a non-clickable row with
  // an inline notify-me form, not a greyed-out dead link. "Coming soon"
  // badge removed per founder feedback 1 Oct 2026 — confusing alongside the
  // notify row, which already communicates the same state. Founder-
  // confirmed 1 Oct 2026 (item #4).
  if (!status.linkable) {
    return (
      <div className={`flex flex-col sm:flex-row rounded-sm overflow-hidden border border-[#2A2A2A] bg-[#141414] lg:h-full ${EVENT_CARD_MIN_HEIGHT}`}>
        {image}
        {details}
      </div>
    );
  }

  return (
    <Link
      href={`/event-pack/${ev.slug}`}
      className={`group relative flex flex-col sm:flex-row rounded-sm overflow-hidden border border-[#2A2A2A] bg-[#141414] hover:border-[#AAFF00] transition-all duration-200 lg:h-full ${EVENT_CARD_MIN_HEIGHT}`}
    >
      {image}
      {details}
    </Link>
  );
}

// Attractions / Where to Stay / Where to Eat row — no item count in the
// header, per founder feedback 1 Oct 2026 (item #2).
type AffiliateLink = { label?: string; platform?: string; url: string; experienceTitle: string };

// Generic platform strings that exist purely as the provider name, not a
// real tour/hotel name — never display these as the link text. Some
// bookingLinks rows (e.g. Borough Market Food Tour) put the real name in
// `platform` with no `label` set at all, so label-only fallback showed the
// generic experience title instead. Founder-caught 1 Oct 2026.
const GENERIC_PLATFORM_NAMES = new Set(["booking.com", "getyourguide"]);

function affiliateLinkDisplayName(link: AffiliateLink): string {
  if (link.label) return link.label;
  if (link.platform && !GENERIC_PLATFORM_NAMES.has(link.platform.toLowerCase())) return link.platform;
  return link.experienceTitle;
}

// No-affiliate-sidebar variant (Where to Eat) — stays in the standard
// 2/3-width main column, no width concerns since there's no sidebar to make
// room for.
function ExperienceRow({ title, exps, destinationSlug }: { title: string; exps: DestinationExperience[]; destinationSlug: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-6">
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {exps.map((exp) => (
          <ExperienceCard key={exp.id} exp={exp} destinationSlug={destinationSlug} />
        ))}
      </div>
    </div>
  );
}

// Full-page-width variant (Attractions, Where to Stay) — same pattern as the
// Sporting Events row: card grid keeps its full natural width, the
// affiliate sidebar sits in genuinely additional space to the right rather
// than squeezing the grid narrower. Founder-corrected 1 Oct 2026.
function ExperienceRowFullWidth({
  title,
  exps,
  affiliateLinks,
  affiliateLabel,
  destinationSlug,
}: {
  title: string;
  exps: DestinationExperience[];
  affiliateLinks: AffiliateLink[];
  affiliateLabel: string;
  destinationSlug: string;
}) {
  return (
    <div className="mb-12">
      <h2 className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-6">
        {title}
      </h2>
      <div className="lg:flex lg:gap-5 lg:items-stretch">
        <div className="grid sm:grid-cols-2 gap-5 lg:flex-1">
          {exps.map((exp) => (
            <ExperienceCard key={exp.id} exp={exp} destinationSlug={destinationSlug} />
          ))}
        </div>
        {affiliateLinks.length > 0 && (
          <div className="mt-5 lg:mt-0 lg:w-72 lg:flex-shrink-0">
            <AffiliateLinksSidebar label={affiliateLabel} links={affiliateLinks} />
          </div>
        )}
      </div>
    </div>
  );
}

// Section-level affiliate sidebar — GetYourGuide links on Attractions,
// Booking.com links on Where to Stay. Founder-confirmed 1 Oct 2026 (items
// #4/#5). Same affiliate-disclaimer line as the experience page's bookingLinks
// block (page.tsx ~line 1388) — always real GYG/Booking.com links only, per
// isGetYourGuideLink/isBookingComLink detection.
function AffiliateLinksSidebar({ label, links }: { label: string; links: AffiliateLink[] }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
        {label}
      </p>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={`${link.url}-${i}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
            >
              {affiliateLinkDisplayName(link)}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
    </div>
  );
}

function ExperienceCard({ exp, destinationSlug }: { exp: DestinationExperience; destinationSlug: string }) {
  return (
    <Link
      href={`/experience/${exp.slug}?fromDestination=${destinationSlug}`}
      className="group rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden hover:border-[#AAFF00] transition-colors"
    >
      {exp.heroImageUrl ? (
        <div className="relative h-40 overflow-hidden bg-[#1A1A1A]">
          <Image
            src={exp.heroImageUrl}
            alt={exp.heroImageAlt ?? exp.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-40 bg-[#1A1A1A] flex items-center justify-center">
          <span className="text-xs text-[#6A6A6A] tracking-widest uppercase">
            {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
          </span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black tracking-widest uppercase text-[#AAFF00]">
            {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
          </span>
          {exp.budgetTier && (
            <span className="text-xs text-[#6A6A6A]">
              {BUDGET_LABELS[exp.budgetTier]}
            </span>
          )}
        </div>
        <h3 className="text-sm font-black text-white leading-snug group-hover:text-[#AAFF00] transition-colors">
          {exp.title}
        </h3>
        {exp.subtitle && (
          <p className="mt-1 text-xs text-[#A3A3A3] line-clamp-2 leading-5">
            {exp.subtitle}
          </p>
        )}
        {exp.neighborhood && (
          <p className="mt-2 text-xs text-[#6A6A6A]">{exp.neighborhood}</p>
        )}
      </div>
    </Link>
  );
}

function PracticalBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#6A6A6A] mb-1">{label}</p>
      <p className="text-xs text-[#A3A3A3] leading-5">{text}</p>
    </div>
  );
}
