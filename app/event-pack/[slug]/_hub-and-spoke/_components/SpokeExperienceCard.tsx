import Image from "next/image";
import Link from "next/link";
import { AddOneToBoard } from "../../_components/AddToBoard";
import HowToBook from "../../_components/HowToBook";

type SpokeExperienceCardExperience = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  heroImageUrl: string | null;
  budgetTier: string | null;
  neighborhood: string | null;
  whyItsSpecial: string | null;
  insiderTips: string[] | null;
  practicalInfo: { howToBook?: string } | null;
  googleMapsRating?: string | null;
  googleMapsReviewCount?: number | null;
  googleMapsUrl?: string | null;
};

// Real visual card for a named experience inside a spoke — same fields/
// layout as the classic pack's editor's-pick card (PackView.tsx, ~line
// 1414), which was never a standalone component, just inline JSX coupled
// to that file's local state. Extracted 6 Aug 2026 as a real, reusable
// component so hub-and-spoke spokes get the same visual bar (image, badge,
// tips, HowToBook, save-to-board) instead of a plain text link with no
// image and no inline save action. Built for ATP Finals first — Bahrain GP
// and Singapore GP spokes still use the old plain-link pattern, to be
// backfilled in a later pass.
export default function SpokeExperienceCard({
  experience,
  isPro,
  hideProCtas = false,
}: {
  experience: SpokeExperienceCardExperience;
  isPro: boolean;
  hideProCtas?: boolean;
}) {
  const howToBook = experience.practicalInfo?.howToBook;

  return (
    <div className="group rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden hover:border-[#AAFF00] transition-colors">
      <Link href={`/experience/${experience.slug}`} className="block">
        {experience.heroImageUrl && (
          <div className="relative h-48 overflow-hidden bg-[#1A1A1A]">
            <Image
              src={experience.heroImageUrl}
              alt={experience.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-5 pb-0">
          {howToBook && (
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Concierge pick
              </span>
            </div>
          )}
          <h3 className="text-base font-black text-white leading-snug group-hover:text-[#AAFF00] transition-colors">
            {experience.title}
          </h3>
          {experience.googleMapsRating && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#A3A3A3]">
              <span className="text-[#AAFF00]">★</span>
              <span className="font-bold text-white">{experience.googleMapsRating}</span>
              {experience.googleMapsReviewCount != null && (
                <span>({experience.googleMapsReviewCount.toLocaleString()} Google reviews)</span>
              )}
            </div>
          )}
          {experience.subtitle && (
            <p className="mt-1.5 text-sm text-[#A3A3A3] leading-6">{experience.subtitle}</p>
          )}
          {experience.whyItsSpecial && (
            <p className="mt-3 text-sm text-[#6A6A6A] italic leading-6 line-clamp-2">
              {experience.whyItsSpecial.split("\n\n")[0]}
            </p>
          )}
          {experience.neighborhood && (
            <p className="mt-3 text-xs text-[#6A6A6A]">{experience.neighborhood}</p>
          )}
          {experience.insiderTips && experience.insiderTips.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">
                Worth knowing
              </p>
              <ul className="space-y-1">
                {experience.insiderTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[#A3A3A3] leading-5">
                    <span className="text-[#AAFF00] flex-shrink-0">—</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Link>
      <div className="px-5 pb-5">
        {howToBook && (
          <HowToBook howToBook={howToBook} isPro={isPro} eventSlug="" hideProCtas={hideProCtas} />
        )}
        <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
          <AddOneToBoard experienceId={experience.id} />
        </div>
      </div>
    </div>
  );
}
