import Link from "next/link";
import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import { getBlogArticles } from "@/lib/queries/blog";

export const metadata: Metadata = {
  title: "Sports Travel Blog — Experiences | Curated",
  description: "History, rivalries, and the events every sports fan should see live — from the team behind Experiences | Curated.",
  alternates: { canonical: "/blog" },
};

const CATEGORY_LABELS: Record<string, string> = {
  history: "History",
  rivalry: "Rivalry",
  why_go: "Why Go",
  bucket_list: "Bucket List",
  travel_craft: "Travel Craft",
};

const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  golf: "Golf",
  formula_one: "Formula 1",
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sport?: string }>;
}) {
  const { category, sport } = await searchParams;
  const { user } = await getAuthUser();
  const isFiltered = Boolean(category || sport);
  const [articles, allArticles] = await Promise.all([
    getBlogArticles({ category, sport }),
    // Only needed to compute the "m of n" total when a filter is active —
    // skip the second query on the unfiltered view, articles.length already
    // is the total there.
    isFiltered ? getBlogArticles({}) : Promise.resolve(null),
  ]);
  const totalCount = allArticles?.length ?? articles.length;

  // Preserves the other filter dimension when toggling either row — e.g.
  // clicking "History" while "Tennis" is active keeps ?sport=tennis, and
  // vice versa. Both filters are independently combinable.
  function buildHref(next: { category?: string; sport?: string }) {
    const params = new URLSearchParams();
    const nextCategory = "category" in next ? next.category : category;
    const nextSport = "sport" in next ? next.sport : sport;
    if (nextCategory) params.set("category", nextCategory);
    if (nextSport) params.set("sport", nextSport);
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <HomepageNav email={user?.email ?? null} />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 text-balance">
          Sports Travel Blog
        </h1>
        <p className="text-sm text-[#A3A3A3] mb-8 max-w-2xl">
          History, rivalries, and the events every fan should see live — before you plan a single flight.
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Link
            href={buildHref({ sport: undefined })}
            className={`text-xs font-black uppercase tracking-wide px-3.5 py-1.5 rounded-sm border ${
              !sport ? "bg-[#AAFF00] text-black border-[#AAFF00]" : "bg-[#141414] text-[#A3A3A3] border-[#2A2A2A]"
            }`}
          >
            All
          </Link>
          {Object.entries(SPORT_LABELS).map(([key, label]) => (
            <Link
              key={key}
              href={buildHref({ sport: key })}
              className={`text-xs font-black uppercase tracking-wide px-3.5 py-1.5 rounded-sm border ${
                sport === key ? "bg-[#AAFF00] text-black border-[#AAFF00]" : "bg-[#141414] text-[#A3A3A3] border-[#2A2A2A]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href={buildHref({ category: undefined })}
            className={`text-xs font-black uppercase tracking-wide px-3.5 py-1.5 rounded-sm border ${
              !category ? "bg-[#AAFF00] text-black border-[#AAFF00]" : "bg-[#141414] text-[#A3A3A3] border-[#2A2A2A]"
            }`}
          >
            All
          </Link>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link
              key={key}
              href={buildHref({ category: key })}
              className={`text-xs font-black uppercase tracking-wide px-3.5 py-1.5 rounded-sm border ${
                category === key ? "bg-[#AAFF00] text-black border-[#AAFF00]" : "bg-[#141414] text-[#A3A3A3] border-[#2A2A2A]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-[#6A6A6A] mb-6">
          {isFiltered ? `${articles.length} of ${totalCount} articles` : `${totalCount} articles`}
        </p>

        {articles.length === 0 ? (
          <p className="text-sm text-[#6A6A6A]">No articles yet in this category.</p>
        ) : (
          <div className="flex flex-col divide-y divide-[#2A2A2A]">
            {articles.map((a) => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="py-4 group">
                <p className="text-[11px] font-black tracking-widest uppercase text-[#AAFF00] mb-1.5">
                  {CATEGORY_LABELS[a.contentCategory] ?? a.contentCategory}
                </p>
                <p className="text-base font-black text-white leading-snug mb-1.5 group-hover:text-[#AAFF00] transition-colors">
                  {a.title}
                </p>
                <p className="text-xs text-[#A3A3A3] leading-5 mb-1.5">{a.excerpt}</p>
                <p className="text-[11px] text-[#6A6A6A]">
                  {a.sport.map((s) => SPORT_LABELS[s] ?? s).join(" & ")}
                  {a.readMinutes && (
                    <>
                      <span className="mx-1.5 opacity-50">·</span>
                      {a.readMinutes} min read
                    </>
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
