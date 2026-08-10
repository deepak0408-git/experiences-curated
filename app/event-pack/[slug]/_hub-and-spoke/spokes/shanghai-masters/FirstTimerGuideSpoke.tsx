import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Rebuilt 10 Aug 2026 to add bag policy/prohibited items and a "city, not
// just tennis" orientation — the two structural elements ATP Finals'
// equivalent spoke has that were previously missing here. Bag policy is
// real, sourced directly from the official tournament FAQ (not invented or
// carried over from ATP Finals' own, structurally different Italian
// venue policy). City sights link to the Day Trips spoke rather than
// re-rendering duplicate cards, since all 4 already have their real card
// home there per EXPERIENCE_TO_SPOKE.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const visaGuide = linkedExperiences.find((e) => e.slug.includes("china-visa-apps-payments-guide"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="public"
      h1="Visas, apps, gate rules, and the city beyond Qizhong"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition="center 0%"
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Shanghai is the first destination in our coverage where the basic mechanics of a trip — visas, maps, paying
        for things — work differently enough from the UK, EU, US, or Australia that it's worth a dedicated guide
        rather than assuming it works like everywhere else.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The four things to sort before you fly</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">1. Check your visa-free eligibility</p>
          <p className="text-xs text-[#A3A3A3] leading-5">45 countries get 30-day visa-free entry; a separate 240-hour transit-free policy covers 54 countries through specific ports. Check your specific nationality before booking.</p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">2. Download Amap, not Google Maps</p>
          <p className="text-xs text-[#A3A3A3] leading-5">Google Maps is blocked in China and a VPN doesn't fix the underlying data. Amap (Gaode Maps) has the best English support of the local options.</p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">3. Link a foreign card to Alipay</p>
          <p className="text-xs text-[#A3A3A3] leading-5">Alipay and WeChat Pay both accept international Visa/Mastercard directly, no Chinese bank account needed — set this up before you land.</p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">4. Set up a metro-gate app: Metro Daduhui or Suishenxing</p>
          <p className="text-xs text-[#A3A3A3] leading-5">Metro Daduhui is Shanghai Metro's own QR-scan app for gate entry/exit and transfers, drawing on Alipay or WeChat Pay. For more than a couple of trips, Suishenxing (SH MaaS) bundles metro, bus, and ferry into one code with 1/3/7-day passes.</p>
        </div>
      </div>

      {visaGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={visaGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-sm font-bold text-white mb-2">What&apos;s not allowed through Qizhong&apos;s gates</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Bags larger than 55 × 40 × 20cm, glass bottles, alcohol, unauthorized professional camera/video equipment,
          and long-handled umbrellas are all prohibited — bring a compact one instead, since this is an outdoor
          hard-court venue and Shanghai in October does see occasional rain. One genuinely distinctive rule: food
          that&apos;s strong-smelling or disruptive to other spectators is banned by name — durian, stinky tofu,
          eggs, and potato chips are all specifically called out. Bring sun protection and your ID/passport used for
          the ticket purchase.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The city, not just the tennis</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Shanghai is a genuinely distinct city beyond the arena — the Bund&apos;s colonial-era waterfront facing off
          against Lujiazui&apos;s futuristic skyline across the river, Yu Garden&apos;s Ming-dynasty lanes tucked into
          the Old City, and the French Concession&apos;s tree-lined streets a world away from either. If this is your
          first trip here, budget real time for the city itself, not just Qizhong — see the{" "}
          <a href={`/event-pack/${eventSlug}/day-trips`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Day Trips guide
          </a>{" "}
          for where to start.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: china-briefing.com, newlandchase.com, chinadiscovery.com (visa policy), chinasurvivalkit.com
        (Amap/Baidu), realchinatrip.com and you.co (payments), english.shanghai.gov.cn (metro apps), ATP Tour
        official article "Shanghai 2025 Savour The Spectacle" (Court 17), en.rolexshanghaimasters.com/en/faqs
        (bag policy, prohibited items — official source). Verified 10 Aug 2026.
      </p>
    </SpokeShell>
  );
}
