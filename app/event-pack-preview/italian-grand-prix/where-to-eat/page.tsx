import type { Metadata } from "next";
import Link from "next/link";
import { getSpokeData } from "../_lib/getSpokeData";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "Where to Eat Near Monza — Italian Grand Prix Restaurant Guide",
};

export default async function WhereToEatSpoke() {
  const { diningExperiences } = await getSpokeData();

  return (
    <SpokeShell
      status="teaser"
      h1="Where to eat near Monza"
      question="Where to eat near Monza during race weekend?"
      ctaCopy="These are real, named restaurants. The Event Pack tells you which one fits which moment — the everyday Milanese trattoria worth a short taxi ride, the Michelin-starred splurge for the other end of the weekend, and why the Milan aperitivo ritual is worth doing at least once before race day, done properly rather than at a tourist buffet."
    >
      <div className="flex flex-col gap-2">
        {diningExperiences.map((e) => (
          <Link key={e.id} href={`/experience/${e.slug}`} className="block rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 hover:border-[#AAFF00] transition-colors">
            <p className="text-sm font-bold text-white">{e.title}</p>
            {e.subtitle && <p className="text-xs text-[#6A6A6A] mt-1">{e.subtitle}</p>}
          </Link>
        ))}
      </div>
    </SpokeShell>
  );
}
