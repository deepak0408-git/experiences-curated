import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Deepened 10 Aug 2026 — named the real venues already in the seeded
// experiences (Nanxiang Mantou Dian, Jia Jia Tang Bao, Din Tai Fung; Fu
// 1015, Ultraviolet) directly in the free intro prose, matching ATP
// Finals' pattern of naming specific restaurants before the cards render,
// not just categorical description. Locked section rewritten from one
// booking-timing fact into a real sequenced day, same depth as ATP's.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const xiaolongbao = linkedExperiences.find((e) => e.slug.includes("xiaolongbao-shanghai-guide"));
  const frenchConcessionDining = linkedExperiences.find((e) => e.slug.includes("french-concession-dining-shanghai"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="teaser"
      h1="Five real picks, from a ¥20 basket to a single nightly table"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Xiaolongbao picks and the French Concession dining guide are free above. Unlocking adds our sequenced food day, the specific dishes to actually order at each stop, and the reservation timing that actually matters for the hardest-to-book venues."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Xiaolongbao is Shanghai&apos;s most famous dish, but real Shanghainese cooking is a much wider cuisine —
        braising, red-cooking, and a genuine sweetness in savoury dishes that surprises visitors expecting sharper
        Sichuan or Cantonese flavours. For soup dumplings, Nanxiang Mantou Dian trades on history inside the Yuyuan
        Bazaar, Jia Jia Tang Bao is the no-frills locals&apos; favourite near People&apos;s Square, and Din Tai Fung
        offers zero-risk consistency if you want the same result every time. In the French Concession, Fu 1015
        reworks Shanghainese classics inside a converted 1920s villa, while Ultraviolet — a single nightly table,
        20 courses, one seating — is the trip&apos;s genuine special-occasion splurge if that&apos;s part of your
        plan.
      </p>

      {xiaolongbao && (
        <div className="mb-8">
          <SpokeExperienceCard experience={xiaolongbao} isPro={isPro} />
        </div>
      )}

      {frenchConcessionDining && (
        <div className="mb-8">
          <SpokeExperienceCard experience={frenchConcessionDining} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A Shanghai food day, sequenced</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Start with xiaolongbao at Jia Jia Tang Bao mid-morning, before the lunch queue builds — it&apos;s the
            locals&apos; pick, genuinely good, and doesn&apos;t need a booking (if you want zero risk of an off day
            instead, Din Tai Fung is the safer bet). Save Nanxiang Mantou
            Dian for a weekday afternoon specifically, when the Yuyuan Bazaar queue thins out; weekend lunches there
            routinely run over an hour. Book Fu 1015 specifically for one relaxed evening in the French Concession —
            it&apos;s the pick for a genuinely good dinner without the single-seating pressure Ultraviolet carries.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing that matters</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Fu 1015 and Ultraviolet both require advance booking — Ultraviolet often weeks ahead given its single
            nightly seating. If a special-occasion dinner is part of your trip, book it before you finalize other
            logistics, not as an afterthought once you land.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What to actually order</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            At any xiaolongbao stop, order the classic pork basket first — it&apos;s the dish these places are
            actually known for, before branching into crab-roe or other variations. At Jian Guo 328, the two dishes
            locals keep coming back for are hong shao rou (red-braised pork, the defining flavour of Shanghainese
            home cooking — a genuine sweetness alongside the savoury braise) and the scallion noodles, a simpler,
            cheaper dish that&apos;s worth ordering specifically rather than skipping in favour of the fancier
            options on the menu.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: shanghaitourism.org, tripadvisor.com, wanderinchina.com, rachelgouk.com, corner.inc.
      </p>
    </SpokeShell>
  );
}
