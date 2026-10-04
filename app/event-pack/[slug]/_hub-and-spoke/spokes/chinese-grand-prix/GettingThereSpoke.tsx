import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real content sourced from the seeded Getting to Shanghai International
// Circuit experience (chinese-gp-getting-there-), 23 Sep 2026: Metro Line
// 11 to Shanghai Circuit station (~60 min from central Shanghai, per
// formula1.com), airport-to-circuit routes (Pudong vs Hongqiao), Didi/Alipay
// setup.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingThereGuide = linkedExperiences.find((e) => e.slug.includes("chinese-gp-getting-there-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Chinese Grand Prix"
      status="public"
      h1="Metro Line 11 is the backbone — the airport leg is where real planning matters"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Formula 1&apos;s own event page gives the simplest version of the journey: hop on Shanghai Metro Line 11 and
        get off at the Shanghai Circuit stop, roughly 60 minutes from central Shanghai. For most visitors staying
        anywhere near a Line 11 station, that&apos;s genuinely the easiest option — no traffic to worry about, and a
        station built specifically to serve the circuit.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Metro Line 11 — the official route</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Direct to Shanghai Circuit station, no transfers needed if you&apos;re already on the Line 11 route.
          Roughly 60 minutes from central Shanghai — a real commitment on a three-day weekend, so build it into your
          schedule rather than treating it as an afterthought.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Arriving from the airport</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Pudong International Airport (PVG)</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Metro Line 2 into the city, then a transfer to Line 11 — roughly 2 hours door to door once you account
              for the transfer. A taxi or Didi covers the same ground in roughly 90 minutes depending on traffic, at
              a real cost — private transfers typically start somewhere in the ¥300+ range.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Hongqiao Airport (SHA)</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Sits directly on Metro Line 2, connecting to Line 11 for the circuit — a genuinely shorter journey
              than Pudong. If you have a choice of arrival airport for this trip, this proximity is worth factoring
              into your flight search, not just an afterthought.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Don&apos;t cut race-day timing close</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Station crowding on a Line 11 headed to a 200,000-capacity event is real. Budget more time than a normal
          journey would suggest, especially on race day — arriving with a buffer beats arriving stressed.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Didi</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              China&apos;s equivalent of Uber, bookable through the Alipay app. Download and configure it before you
              land, using your home App Store and reliable home wifi — far easier than setting it up for the first
              time at an airport taxi rank.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Alipay</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Since 2025, Alipay accepts international Visa, Mastercard, and Amex cards directly, with no Chinese
              bank account needed — just a passport-and-selfie verification step. Set this up before you fly; it&apos;s
              also how you&apos;ll pay for most things in Shanghai once you land.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Shanghai Metro app or a transit map</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Signage and announcements are bilingual, but having a transit map or app on hand makes navigating
              Line 11 and any transfers considerably smoother, especially with race-weekend crowds at the stations
              nearest the circuit.
            </p>
          </div>
        </div>
      </div>

      {gettingThereGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={gettingThereGuide} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Fly into Hongqiao if your route allows it — the shorter transit connection to Line 11 genuinely matters
          across a multi-day trip. Set up Alipay and Didi before you leave home, not after landing, and treat race
          day specifically as a day to leave extra time, not cut it close — a 200,000-capacity event puts real
          pressure on the same Line 11 route everyone else is using too.
        </p>
      </div>
    </SpokeShell>
  );
}
