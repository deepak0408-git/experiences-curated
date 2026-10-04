import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Real content sourced from the seeded Anting neighborhood experience
// (chinese-gp-anting-neighborhood-), 23 Sep 2026.
//
// "China Visas, Maps, and Payments" (china-visa-apps-payments-guide-)
// reused from Shanghai Masters (tennis), 2 Oct 2026 — genuinely
// venue-agnostic content (visa rules, Amap, Alipay/WeChat Pay, metro QR
// apps). sport array appended with "formula_one" (never replaced) and
// EXPERIENCE_TO_SPOKE_BY_EVENT["chinese-grand-prix"] given a matching entry
// in the same session — see experience-researcher skill §2b's reuse
// workflow and project_shared_experience_backlink_gap memory.
//
// "First-Timer's Guide — Visa, Payment & Entry Basics"
// (chinese-gp-first-timer-guide-) removed from this spoke, 2 Oct 2026 —
// founder judged it a strict subset of the reused China Visas/Maps/
// Payments guide above, and asked for it to be archived via /curator/review
// (curator-owned status change, not a script). Its card and lookup were
// removed here in the same pass so the spoke doesn't reference a
// soon-to-be-archived row.
//
// "5 mistakes" framing added 4 Oct 2026, matching Brazilian GP's
// FirstTimerGuideSpoke pattern. The old standalone Visa/Payment/Maps intro
// sections (each with its own heading ahead of the shared experience card)
// were folded into mistakes 2-4 below rather than kept as a separate,
// redundant pass over the same facts — same content, no double-statement.
// Mistake 1 (passport registration, founder-requested) is real and sourced,
// not assumed: every Chinese GP ticket is tied to one named passport
// holder, with passport details requested by the ticket supplier roughly 4
// weeks before the race for entry personalization and facial-recognition
// gate access — miss that follow-up and the ticket risks not being usable.
// Sources: gpdestinations.com ("How to Buy Shanghai F1 Tickets"),
// onthegridtravel.com (facial recognition, only F1 race to use it), both
// WebSearch-confirmed 4 Oct 2026.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const antingNeighborhood = linkedExperiences.find((e) => e.slug.includes("chinese-gp-anting-neighborhood-"));
  const visaMapsPayments = linkedExperiences.find((e) => e.slug.includes("china-visa-apps-payments-guide-"));
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
      h1="5 mistakes first-time visitors make at the Chinese Grand Prix"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        A first trip to China for a Grand Prix comes with real logistics that a first trip to a European or North
        American round doesn&apos;t — worth sorting out before you land, not once you&apos;re jet-lagged and trying
        to buy a metro ticket. Here&apos;s what genuinely trips up a first-time visitor, drawn from the real detail
        in this pack rather than generic advice.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — treating ticket purchase as the end of the process</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Every Chinese Grand Prix ticket is tied to one named passport holder, and that&apos;s not a formality you
          handle at the gate — your supplier will contact you separately, typically around 4 weeks before the race,
          to collect passport details for entry personalization. China is the only round on the calendar that uses
          facial recognition for circuit and grandstand entry, so miss that follow-up and your ticket risks not
          working at all. Register your passport details the moment your supplier asks, not when you remember to.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — assuming Google Maps will work</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Google Maps has been blocked in mainland China since 2010, and a VPN doesn&apos;t fix it — the underlying
          map data itself is wrong for China, not just inaccessible. Download Amap (Gaode Maps) before you land, not
          after you&apos;re already lost looking for the circuit gate; it has the best English support of the local
          options and actually has accurate data for restaurants, metro routes, and addresses that Google simply
          doesn&apos;t carry here. Baidu Maps is a reasonable backup with stronger data in smaller areas, though its
          interface stays more Chinese-heavy even in &quot;English mode.&quot;
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — relying on cash or a foreign card at checkout</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Alipay and WeChat Pay dominate everywhere from restaurants to taxis to circuit vendors, and cash, while
          technically still legal tender, or a bare card tap, is often the slower, less-accepted option in
          practice. Both apps let you link an international Visa, Mastercard, or Amex directly without a Chinese
          bank account or phone number, but the passport-and-selfie verification takes real setup time — do it on
          reliable wifi before you leave home, not queued at a circuit food stall. Expect a roughly 3% fee on
          transactions over ¥200 using a linked foreign card; smaller transactions are typically fee-free.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — assuming the same visa rules apply to everyone</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          As of early 2026, citizens of roughly 50 countries — most of Europe including the UK, plus Japan, South
          Korea, Australia, New Zealand, Singapore, and several others — can enter China visa-free for stays up to
          30 days, requiring only a passport valid for 3+ months and a confirmed onward or return ticket. US
          citizens, notably, are not on that unilateral list as of this writing — if you&apos;re American, check
          current requirements directly rather than assuming the same rules apply. Checking a friend&apos;s
          experience instead of your own passport&apos;s current requirements is a real, avoidable way to find out
          too late that you needed to apply for a visa weeks in advance. Separately, a 240-hour (10-day) visa-free
          transit policy covers travelers from 57 countries passing through China on the way to a third
          destination, with real conditions attached (an onward ticket to a genuinely different country, not back
          where you started).
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — booking a hotel without understanding the commute</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The circuit sits roughly 60 minutes each way from central Shanghai on Metro Line 11 — a real number, not
          a minor detail, across a three-day weekend. Booking downtown without weighing that commute against
          staying in Jiading near the circuit is one of the most common first-timer regrets this pack&apos;s Hotels
          guide exists specifically to prevent.
        </p>
      </div>

      {visaMapsPayments && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={visaMapsPayments} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Understanding where you actually are</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The circuit sits inside Anting, a real working automotive-manufacturing district, not a resort town built
        around the race — worth knowing before you arrive so the area&apos;s character doesn&apos;t come as a
        surprise.
      </p>
      {antingNeighborhood && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={antingNeighborhood} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Check your specific passport&apos;s visa requirements the moment you start planning, not after booking
          flights — the rules genuinely differ by nationality, and the gap can be a real surprise if you assume a
          friend&apos;s experience applies to you. Download Amap and set up Alipay or WeChat Pay with an
          international card before you leave home, using reliable wifi, not on arrival. All of this takes a few
          minutes done right, and saves a genuinely stressful first day if left until you land.
        </p>
      </div>
    </SpokeShell>
  );
}
