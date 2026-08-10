import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import Link from "next/link";

const SPOKE_ID = "luxury";

// Rebuilt 10 Aug 2026 to match the hub-and-spoke skill's §2i requirement —
// the Luxury spoke must cover the whole trip (hospitality, premium
// transit, off-venue luxury, one new hotel fact), not jump straight to the
// top hospitality product. Previous version was a stub: one paragraph, one
// card, no locked content, and a CTA promising a "Bulgari Suite
// booking-timing detail" that never appeared anywhere in the file.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const luxuryGuide = linkedExperiences.find((e) => e.slug.includes("luxury-shanghai-peninsula-bulgari"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="teaser"
      h1="A hospitality tier, a chauffeur, and China's tallest rooftop bar"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition="center 65%"
      isUnlocked={isUnlocked}
      ctaCopy="The real off-venue venues, transit pricing, and hotel picks are all free above. The Event Pack adds ATP House's real per-person price and features, our verdict on whether it's actually worth it over a Center Court ticket, and how to sequence a luxury day around your session."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Luxury at the Shanghai Masters is a stack of decisions, not one purchase — the hospitality ticket is only one
        part of it. Here&apos;s what actually goes into a genuinely upscale week in Shanghai, before we get to the
        seating tier itself.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Transfeero publishes real fixed fares from Pudong (PVG) to central Shanghai: a Standard Sedan (Mercedes
          E-Class, BMW 5 Series or similar) starts from US$48, a First Class transfer (Mercedes S-Class, BMW 7
          Series or similar) starts from US$96 — both include tolls, a 60-minute free wait for flight delays, and
          meet-and-greet at the baggage-hall exit. Journey time runs 45-70 minutes normally, 80-90 minutes during
          peak hours (weekday 7-10am or 4-8pm). Worth booking specifically for your arrival day or a hospitality-day
          transfer to Qizhong, since it removes any Metro-plus-shuttle planning entirely — see the{" "}
          <Link href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Getting There guide
          </Link>{" "}
          for the standard route.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Off-venue luxury</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-6">
        <p className="text-sm font-bold text-white mb-1">Flair, The Ritz-Carlton Shanghai, Pudong</p>
        <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-2">
          <span className="text-[#AAFF00]">★</span>
          <a
            href="https://maps.google.com/?cid=2611357901897053692"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white hover:text-[#AAFF00] transition-colors"
          >
            4.0
          </a>
          <span>(208 Google reviews)</span>
        </div>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The 58th floor of the Ritz-Carlton in the IFC Tower — China&apos;s tallest rooftop bar, with a split-level
          outdoor terrace giving a genuine dual view: the historic Bund on one side, the Pudong skyline (including
          the Pearl Tower close-up) on the other. Pan-Asian tapas-style dining across Japanese, Vietnamese, Indian,
          and Thai menus, plus a sushi and raw seafood bar. A real, distinctive Shanghai story, not a generic hotel
          rooftop.
        </p>
      </div>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The Peninsula and Bulgari carry that same skyline-and-history duality — one a faithful architectural return
        after a 75-year absence, the other a restoration project disguised as a hotel opening.
      </p>
      {luxuryGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={luxuryGuide} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">ATP House Hospitality — the real numbers</p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-white">ATP House — single-day access</p>
              <p className="text-sm text-[#AAFF00] font-mono">US$2,367</p>
            </div>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Reserved sideline ticket, a guided behind-the-scenes tour, practice-court access, and an on-court photo
              experience — a genuinely different product from a Center Court ticket, not just a better seat.
              Booked via{" "}
              <a
                href="https://atptourexperiences.com/shanghai-masters-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#AAFF00] hover:text-[#BBFF33] underline"
              >
                ATP Tour Experiences
              </a>
              .
            </p>
          </div>
          <p className="text-xs text-[#6A6A6A] mb-8">
            Price confirmed directly from the official ATP Tour Experiences listing, 9 Aug 2026 — only one
            hospitality tier is currently published for this event, unlike some other Masters 1000 events that offer
            several. Reconfirm closer to the tournament, since pricing and inclusions can shift.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Is it worth it over Center Court?</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Even at its most expensive — the semifinal and final, where Center Court climbs to its highest single-day
            price — a numbered Center Court seat still runs a small fraction of ATP House&apos;s price. If a great
            seat is genuinely all you want, Center Court is the sharper buy at any point in the tournament. ATP House
            earns its price on the things a seat alone can&apos;t give you: practice-court access most fans never get
            near, and a guided tour of parts of Qizhong that aren&apos;t otherwise open. Pick ATP House specifically
            if you want the behind-the-scenes access as part of the story, not just the match itself.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A luxury day, sequenced</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book a First Class Transfeero transfer for your hospitality-day arrival, giving yourself real margin
            before ATP House&apos;s guided tour. Afterward, Flair suits a celebratory dinner — its dual Bund/Pudong
            view and height above the city make it a genuine story to tell, not just a nice meal. It sits in Pudong,
            a short transfer if you&apos;re based centrally; if you&apos;ve chosen a near-venue Minhang stay instead
            (see the{" "}
            <Link href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Stay guide
            </Link>
            ), budget real transfer time either way.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: transfeero.com (private transfer pricing), therooftopguide.com and flairrooftopbarshanghai.com
        (Flair), atptourexperiences.com (ATP House pricing and inclusions), theluxurytravelexpert.com, hok.com,
        akaia.design, fashionnetwork.com, bulgarihotels.com. Google Places ratings verified 9-10 Aug 2026: Peninsula
        Shanghai (4.6, 213 reviews), Bulgari Hotel Shanghai (4.6, 214 reviews), Flair (4.0, 208 reviews). Verified
        10 Aug 2026 — reconfirm hospitality pricing closer to the event.
      </p>
    </SpokeShell>
  );
}
