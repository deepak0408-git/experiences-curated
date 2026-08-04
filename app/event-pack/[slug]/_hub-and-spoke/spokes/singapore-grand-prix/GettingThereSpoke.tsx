import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const transit = linkedExperiences.find((e) => e.slug.includes("singapore-gp-getting-around"));
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Singapore Grand Prix"
      status="public"
      h1="MRT, extended hours, and real backup routes"
      question="How do I get around Singapore during race weekend?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Singapore&apos;s MRT is the backbone of race weekend, and the system genuinely adapts for it: train service
        is extended to 1am on Grand Prix weekend, well past normal closing, so getting back from a late session or a
        headline concert set doesn&apos;t mean racing the last train. Here&apos;s how the system actually works, in
        the order you&apos;ll use it: which station to head for, how to pay, what to do if it&apos;s too crowded,
        and when a taxi genuinely isn&apos;t the answer.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Which station, which line</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Raffles Place — North-South &amp; East-West Lines</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Closest to the Zone 1 side (pit straight, Turn 1/2, the Padang). A cross-platform interchange, so
            switching between the two lines here is genuinely fast.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">City Hall — North-South &amp; East-West Lines</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Serves the Padang/Stamford side of the circuit, near the Padang Stage.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Promenade — Circle &amp; Downtown Lines</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Puts you closest to Marina Bay Sands and the Zone 2 grandstands (Republic, Promenade). The Downtown
            Line also connects direct to Bayfront and Chinatown for hotel access.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Esplanade — Circle Line</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Closest to the Esplanade waterfront side and the Wharf area, one stop from Promenade.
          </p>
        </div>
      </div>
      <p className="text-sm text-[#A3A3A3] leading-6 mb-8">
        None of these four are on the same single line, so check which one lines up with your ticket&apos;s zone
        and gate before race day, not after you&apos;ve exited the wrong station.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Paying for it</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Singapore Tourist Pass</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Unlimited travel on basic buses, MRT, and LRT. $17 (1-day) to $45 (5-day). Worth it past roughly 10 trips
            across your stay — below that, a standard transit card is better value.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">EZ-Link / NETS FlashPay</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            S$10 total (S$5 non-refundable card fee, S$5 starting credit), works like a standard tap card. Better
            value than the Tourist Pass if you&apos;re not maximising trip count.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Contactless bank card</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Taps directly onto readers — no physical transit card needed if you&apos;d rather skip buying one.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">When the MRT is overcrowded — real bus backup</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Platforms at Promenade and City Hall genuinely do overcrowd after sessions end and the Padang Stage set
          finishes. Buses 106, 107, 133, 57, and 574 all serve the Marina Bay area as a real alternative, not a
          theoretical one — worth knowing the route numbers before race night, not scrambling to look them up on a
          packed platform.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Grab and taxis — why they genuinely aren&apos;t reliable here</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Rolling road closures around Marina Bay Street Circuit shut and reopen roads on a staged schedule across
          the weekend, not once for the whole event — a pickup point that worked Thursday can be sealed Saturday,
          and viable routes shift by the hour. Once closures are in force, ride-hail and taxi drivers actively avoid
          the circuit perimeter, so a matched fare often doesn&apos;t mean a car actually arrives. Expect Grab surge
          pricing of 3-5x normal fares during peak race-weekend hours, on top of the standard 25% peak-hour and 50%
          midnight-6am surcharges that apply anyway, and post-race wait times regularly exceeding 45-60 minutes even
          when a car does show. Treat Grab and taxis as a last resort on race day itself, not a backup plan — the
          MRT and named bus routes above are genuinely more reliable.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Extended hours, not unlimited flexibility</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          MRT service runs to 1am specifically for Grand Prix weekend, but don&apos;t treat that as a safety net if
          you&apos;re staying somewhere the MRT doesn&apos;t directly serve. Plan your last connection, especially
          after a late Padang Stage set — and don&apos;t treat Grab or a taxi as the fallback either, once circuit
          road closures are active, ride-hail becomes genuinely unreliable, not just pricier.
        </p>
      </div>

      {transit?.whyItsSpecial && (
        <p className="text-sm text-[#A3A3A3] leading-7 mt-4">{transit.whyItsSpecial}</p>
      )}

      {transit && (
        <Link href={`/experience/${transit.slug}`} className="inline-block mt-6 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
          Read the full transit guide →
        </Link>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: blog.sgtrains.com, thesingaporetouristpass.com.sg (official pricing), ezlink.simplygo.com.sg,
        landtransportguru.net (station/line data), singapore-spirit.com and tripmoo.net (Grab/taxi surge pricing
        and race-weekend restrictions). Verified 3 Aug 2026.
      </p>
    </SpokeShell>
  );
}
