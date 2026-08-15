import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

// Rebuilt 10 Aug 2026, then compared directly against ATP Finals' MapSpoke
// (the depth benchmark) and found missing a real "Facilities inside the
// arena" section and a venue map image — both added here. Generic
// facility-list content found via WebSearch (food, wheelchair access)
// read as templated content-farm copy on cross-checking — not written in
// as confirmed fact per the skill's §2a sourcing bar; flagged honestly
// instead. Gate/entrance content lives in the Arrival spoke, not
// duplicated here. Venue map is the official ztmen.jussyun.com ticketing
// platform's own map, curator-supplied.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const arena = linkedExperiences.find((e) => e.slug.includes("qizhong-forest-sports-city-arena"));
  const centerCourt = linkedExperiences.find((e) => e.slug.includes("qizhong-center-court"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="public"
      h1="A first-timer's guide to Qizhong's 80 hectares"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Qizhong is a genuinely large complex — 80 hectares, three showcourts, and dozens more practice and
        qualifying courts, built around a real &quot;forest sports city&quot; concept: 46% of the site is deliberately
        kept as green, open space rather than paved-over stadium footprint. Budget real walking time between courts
        — this isn&apos;t a compact European stadium.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The roof, and why it&apos;s not just decoration</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Center Court&apos;s retractable roof is built from eight petal-shaped panels, each weighing two tons,
          modeled on Shanghai&apos;s official flower — the magnolia. It takes eight minutes to fully open or close,
          letting the tournament run matches indoors or outdoors depending on weather. Designed by Japanese
          architect Mitsuru Senda&apos;s firm, the venue was completed in October 2005 specifically for this
          tournament&apos;s move to Shanghai.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Site layout</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Center Court" value="13,779 seats — the venue's magnolia-roof marquee court" />
        <FactRow label="Grandstand 2" value="5,000 seats, own retractable canopy" />
        <FactRow label="Grandstand 3" value="3,000 seats" />
        <FactRow label="Court 17" value="1,200-seat purpose-built practice stadium, opened 2025 — included with any Grounds Pass" />
        <FactRow label="Other practice/qualifying courts" value="Dozens more across the wider 80-hectare complex" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {centerCourt && <SpokeExperienceCard experience={centerCourt} isPro={isPro} />}
        {arena && <SpokeExperienceCard experience={arena} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Facilities inside the arena</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food and drink</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Concession stands and merchandise shops operate throughout the complex. Outside food and drink
            generally isn&apos;t allowed into ticketed sports venues in China — see the{" "}
            <a href={`/event-pack/${eventSlug}/first-timer-guide`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              First-Timer&apos;s Guide
            </a>{" "}
            for the full bag and prohibited-items policy.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Accessibility and re-entry — what&apos;s actually confirmed</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            We couldn&apos;t find a genuinely primary source (an official venue or tournament page) confirming
            specific accessibility arrangements or a re-entry policy for this venue — the sources we found read as
            generic template content, not verified facts, so we&apos;re not passing them off as confirmed. If you
            need accessible seating or re-entry details, contact the tournament directly via{" "}
            <a
              href="https://en.rolexshanghaimasters.com/en/tickets/tickets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              en.rolexshanghaimasters.com
            </a>{" "}
            ahead of your visit. See the{" "}
            <a href={`/event-pack/${eventSlug}/arrival`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Arrival guide
            </a>{" "}
            for what we could confirm on gates and entry.
          </p>
        </div>
      </div>

      <div className="relative w-full aspect-[1024/683] rounded-sm border border-[#2A2A2A] overflow-hidden mb-8 bg-[#141414]">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/shanghai-masters-venue-map.jpg"
          alt="Qizhong Forest Sports City Arena venue map, showing Center Court, the outer showcourts, and Court 17"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">
        Center Court map via ztmen.jussyun.com, the official Shanghai Masters ticketing platform.
      </p>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Internationally recognized</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Qizhong won the IOC/IAKS Silver Award in 2009, a real international recognition for exemplary sports and
          leisure facility design — a signal of how the venue was regarded architecturally well before the
          tournament&apos;s current scale.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Wikipedia (Qizhong Forest Sports City Arena — design, roof, size, green-space figures, IOC/IAKS
        award), sportsmatik.com, tennistours.com seating guide, ztmen.jussyun.com (venue map). Verified 10 Aug 2026.
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
