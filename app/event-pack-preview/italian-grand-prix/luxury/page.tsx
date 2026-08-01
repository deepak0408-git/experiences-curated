import type { Metadata } from "next";
import Link from "next/link";
import { getSpokeData } from "../_lib/getSpokeData";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "Italian Grand Prix Luxury Guide — Paddock Club & Hospitality at Monza",
};

export default async function LuxurySpoke() {
  const { luxuryExperiences } = await getSpokeData();

  return (
    <SpokeShell
      status="teaser"
      h1="The best luxury experience at Monza"
      question="What's the best paddock club / luxury option at Monza?"
      ctaCopy="These are the real splurge and luxury options. Monza runs three real hospitality tiers above a standard ticket, and each is a meaningfully different product, not just a pricier seat — the Event Pack walks through what actually separates them, so you know what you're paying for before you commit."
    >
      {luxuryExperiences.length > 0 ? (
        <>
          <p className="text-xs text-[#6A6A6A] mb-4">
            {luxuryExperiences.length} splurge/luxury experiences exist in our pack — the real gap is editorial framing
            (&quot;which splurge is actually worth it&quot;), not raw content.
          </p>
          <div className="flex flex-col gap-2">
            {luxuryExperiences.map((e) => (
              <Link key={e.id} href={`/experience/${e.slug}`} className="block rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 hover:border-[#AAFF00] transition-colors">
                <p className="text-sm font-bold text-white">{e.title}</p>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-[#6A6A6A]">No luxury experiences found.</p>
      )}
    </SpokeShell>
  );
}
