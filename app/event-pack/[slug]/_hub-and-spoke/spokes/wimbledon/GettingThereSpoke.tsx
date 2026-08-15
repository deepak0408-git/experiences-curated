import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Rebuilt 15 Aug 2026 per direct founder review. Real changes: (1) added
// real taxi/driving/parking/bus coverage — previously only covered rail;
// (2) "Traveling to the All England Club" experience is plain wayfinding
// (train directions, car park info), not genuine Concierge content — its
// practicalInfo.howToBook was cleared same day so it no longer wrongly
// carries the "Concierge pick" badge (SpokeExperienceCard.tsx badges purely
// off howToBook being non-empty); the real practical detail that used to
// live there is now written directly into this spoke's own free prose
// below instead; (3) internal source line removed, replaced with a real
// reader-facing footer.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const transit = linkedExperiences.find((e) => e.slug.includes("traveling-to-the-all-england-club"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="public"
      h1="The District line is mostly the wrong answer — here's the real route"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        There&apos;s received wisdom about the District line that&apos;s mostly wrong, and a simpler route most
        guides don&apos;t mention. Below is the real train route, plus what to do if you&apos;re driving, taking a
        taxi, or arriving by bus.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The fastest real route — by train</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          South Western Railway from London Waterloo to Wimbledon takes just 21 minutes, no change required — tap in
          with contactless or Oyster, no advance booking needed. The District line (Underground) terminates at the
          same station but is slower from most of central London, despite being the more commonly suggested route.
          If you&apos;re coming from the south side of the grounds, Southfields station (District line) is the
          better call — exit and follow Church Road south for a 15-minute walk to the southern gates.
        </p>
        <FactRow label="Fastest route" value="SWR train, London Waterloo → Wimbledon (21 min)" />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Bus</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The 493 and 57 both stop close to Wimbledon Park and the AELTC grounds, and are a genuinely useful option
          if you&apos;re already staying in SW19 or nearby South London rather than coming in from central London —
          the same Oyster/contactless tap-in applies, and London&apos;s Zone 1–2 daily price cap (£8.90, frozen for
          2026) covers bus journeys too. From further out, the train is faster and more reliable for match-day
          crowds than a bus route through local traffic.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Taxi / rideshare</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A black cab or Uber from central London runs roughly 30–50 minutes each way depending on traffic and
          time of day — genuinely slower and pricier than the train for most of the Fortnight, since match-day
          traffic around SW19 backs up badly in the hour either side of gates opening and closing. Worth it late at
          night after the last Tube/rail departures, or if you&apos;re traveling with young children or heavy bags —
          otherwise the train is the better call every day of the Championships.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Driving &amp; parking</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Driving is genuinely the least recommended option — central London traffic, the Ultra Low Emission Zone,
          and very limited parking near the grounds make it slower and more expensive than the train for almost
          everyone. If you do drive, the All England Club&apos;s own car park requires tickets purchased well in
          advance via wimbledon.com — they sell out. Wimbledon Park cricket ground runs as day-of overflow parking
          but fills by mid-morning on high-attendance days, so it&apos;s not a reliable fallback.
        </p>
      </div>

      {transit && (
        <div className="mb-8">
          <SpokeExperienceCard experience={transit} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Plan your exact journey</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Transport for London&apos;s own journey planner covers the last-mile walk from Wimbledon station to the
          All England Club gates, and any live disruption on the day.
        </p>
        <a
          href="https://tfl.gov.uk/plan-a-journey/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Plan your journey on TfL →
        </a>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Transport for London (tfl.gov.uk), wimbledon.com (parking and car park booking).
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
