import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// One real, seeded multi-venue lodging experience covers this trip's actual
// answer: Where to Stay — Nagoya vs. the Suzuka Area (japanese-gp-suzuka-
// where-to-stay). Confirmed by live research 22 Sep 2026: Suzuka's own
// hotel stock is genuinely small and gets absorbed by F1 teams/media before
// public sale — Nagoya is the standard, well-established base, not a
// compromise. Real, founder-supplied CJ Affiliate Booking.com links added
// 29 Sep 2026 for both the Nagoya Marriott Associa Hotel (top pick) and
// Hotel LiVEMAX Nagoya-Shinkansenguchi (budget pick) — on both the
// experience row's bookingLinks (renders on the experience page itself)
// and here on the spoke directly, matching Brazilian GP's HotelsSpoke.tsx
// pattern.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const whereToStay = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-where-to-stay"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Japanese Grand Prix"
      status="teaser"
      h1="Suzuka's own hotel stock goes to F1 teams and media first — Nagoya is the real base"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="You've got the real hotel picks and the honest Nagoya-vs-Suzuka call above — what you don't have yet is our direct verdict on which specific stay to book once the Marriott sells out, plus our read on self-catered and budget formats near Nagoya Station, a gap most guides skip entirely for a genuinely new race weekend here. The pack adds both, plus this same level of tactical detail across all 12 guides."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Suzuka is a small city with genuinely limited hotel stock, and what exists there — along with nearby Tsu
        and Yokkaichi — is routinely absorbed by F1 teams and media before public sale even opens. That&apos;s not
        a minor inconvenience to work around; it makes &quot;stay near the circuit&quot; a non-option for most
        fans regardless of budget. Nagoya is the genuine, well-established base every serious Suzuka guide
        converges on — a real hotel market at every price point, connected to the circuit by rail services that
        all start from the same station.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where to stay for Suzuka</p>
      {whereToStay && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={whereToStay} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early — and expect a real race-weekend premium</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Nagoya&apos;s own flagship hotels near the station have historically quoted GP-weekend rates well above
          double their normal price once the Grand Prix dates are widely known — and this is Suzuka&apos;s
          first-ever Sprint weekend, a genuine first that could draw stronger-than-usual demand. Hotel stock near
          Nagoya Station fills 6-12 months ahead of a major Suzuka race weekend at the properties closest to the
          platforms.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which specific stay we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            The Nagoya Marriott Associa Hotel is the pack&apos;s own pick — it sits directly above JR Nagoya
            Station&apos;s Takashimaya department store, a few steps from the platforms rather than a taxi ride
            away, and reviewers consistently flag the location, room quality, and breakfast as the reasons to pay
            for it. If it&apos;s sold out for race week, the Meitetsu Grand Hotel is the honest next call — same
            station perimeter, a two-minute walk to the train, three restaurants and a sky lounge, at a real
            mid-price point below the Marriott. For a genuinely no-frills base, Hotel LiVEMAX
            Nagoya-Shinkansenguchi is the pack&apos;s budget pick — about a five-minute walk from the station,
            considerably cheaper, and enough of a functional room for a weekend built around the circuit rather
            than the hotel itself.
          </p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Two named picks, both worth booking directly</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The Nagoya Marriott Associa Hotel (top pick, direct above JR Nagoya Station) and Hotel LiVEMAX
              Nagoya-Shinkansenguchi (budget pick, a five-minute walk away) cover the top and bottom of this pack&apos;s
              named range.
            </p>
            <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <a
                  href="https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fjp%2Fnagoya-marriott-associa.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-b206c0b0-2c3b-4b31-b259-607e25beb2ce%26sid%3D10739545d173fb9cf268f24fa0055875%26checkin%3D2027-04-08%26checkout%3D2027-04-12%26dest_id%3D668083%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1790701569%26srpvid%3Dc200203bb2e42b356e526566c3fc3366%26type%3Dtotal%26ucfs%3D1%26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
                >
                  Nagoya Marriott Associa Hotel →
                </a>
                <a
                  href="https://www.kqzyfj.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fjp%2Fhoteruribumatukusuming-gu-wu-xin-gan-xian-kou.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-b206c0b0-2c3b-4b31-b259-607e25beb2ce%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D707269201_382520695_2_0_0%26checkin%3D2027-04-08%26checkout%3D2027-04-12%26dest_id%3D7072692%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D707269201_382520695_2_0_0%26hpos%3D1%26matching_block_id%3D707269201_382520695_2_0_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D707269201_382520695_2_0_0__39891852%26srepoch%3D1790701740%26srpvid%3D1486abcf5e51642af9ec13e3f855175b%26type%3Dtotal%26ucfs%3D1%26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
                >
                  Hotel LiVEMAX Nagoya-Shinkansenguchi →
                </a>
              </div>
              <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate links — we may earn a small commission at no extra cost to you.</p>
            </div>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Self-catered and budget formats near Nagoya Station</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            None of this pack&apos;s named picks are hostels or apartments, and that&apos;s worth naming rather
            than ignoring. Nagoya has a real, functioning short-term rental and hostel scene — search listings
            specifically within walking distance of Nagoya Station or one stop away on the Meitetsu/JR lines, and
            always cross-check the exact pin against the station before booking, since a listing&apos;s
            neighborhood name alone doesn&apos;t guarantee a direct, transfer-free route to Suzuka. Expect the
            same race-weekend price premium here as at named hotels once Grand Prix dates are widely known —
            Nagoya&apos;s entire accommodation market moves together during race week, not just its flagship
            properties.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking windows &amp; timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book Nagoya Station-area hotels at least 6 months ahead for this event — hotel stock near the
            platforms has historically sold out 6-12 months before a major Suzuka race weekend, and 2027&apos;s
            first-ever Sprint format adds real uncertainty about how much earlier that window might move. Don&apos;t
            assume a hotel a few stops away is automatically the safer or cheaper fallback either — check it
            against the same transfer-free Nagoya Station connection that every onward route to Suzuka starts
            from before trading location for price.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
