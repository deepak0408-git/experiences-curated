export const dynamic = "force-dynamic";

import { getAllBlogArticlesForReview, getSeriesOptions } from "./actions";
import { BlogReviewActions } from "./_components/BlogReviewActions";
import { BlogFilters } from "./_components/BlogFilters";

export const metadata = { title: "Blog Review Queue" };

const STATUS_CONFIG: Record<string, { label: string; dot: string; row: string }> = {
  in_review: { label: "In Review", dot: "bg-blue-400", row: "bg-blue-400/5" },
  published: { label: "Published", dot: "bg-[#AAFF00]", row: "bg-[#AAFF00]/5" },
  archived: { label: "Archived", dot: "bg-[#2A2A2A]", row: "opacity-40" },
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

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function BlogReviewQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; structure?: string; series?: string }>;
}) {
  const { category, structure, series } = await searchParams;
  const [all, seriesOptions] = await Promise.all([
    getAllBlogArticlesForReview(),
    getSeriesOptions(),
  ]);

  const filtered = all.filter((a) => {
    if (category && a.contentCategory !== category) return false;
    if (structure === "one_off" && a.seriesSlug) return false;
    if (structure === "series" && !a.seriesSlug) return false;
    if (series && a.seriesSlug !== series) return false;
    return true;
  });

  const groups = {
    in_review: filtered.filter((a) => a.status === "in_review"),
    published: filtered.filter((a) => a.status === "published"),
    archived: filtered.filter((a) => a.status === "archived"),
  };

  const ordered = [...groups.in_review, ...groups.published, ...groups.archived];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Blog Review Queue</h1>
        <p className="mt-1 text-sm text-[#6A6A6A]">
          {groups.published.length} published · {groups.in_review.length} in review
          {filtered.length !== all.length && ` · ${filtered.length} of ${all.length} shown`}
        </p>
      </div>

      <div className="mb-6">
        <BlogFilters
          seriesOptions={seriesOptions}
          activeCategory={category}
          activeStructure={structure}
          activeSeries={series}
        />
      </div>

      {all.length === 0 ? (
        <div className="rounded-sm border border-dashed border-[#2A2A2A] p-12 text-center">
          <p className="text-[#6A6A6A] text-sm">
            No blog articles yet — seed one via a throwaway script per the
            experience-seeder pattern (see blog-article-researcher skill).
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-sm border border-dashed border-[#2A2A2A] p-12 text-center">
          <p className="text-[#6A6A6A] text-sm">No articles match this filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ordered.map((a) => {
            const cfg = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.in_review;
            return (
              <div
                key={a.id}
                className={`rounded-sm border border-[#2A2A2A] p-4 flex items-center justify-between gap-4 ${cfg.row}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <span className="text-xs text-[#6A6A6A]">{cfg.label}</span>
                    <span className="text-xs text-[#6A6A6A]">·</span>
                    <span className="text-xs font-black tracking-widest uppercase text-[#AAFF00]">
                      {CATEGORY_LABELS[a.contentCategory] ?? a.contentCategory}
                    </span>
                    {a.seriesSlug && (
                      <>
                        <span className="text-xs text-[#6A6A6A]">·</span>
                        <span className="text-xs text-[#6A6A6A]">
                          {a.seriesSlug} {a.seriesPosition ? `#${a.seriesPosition}` : ""}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-bold text-white truncate">{a.title}</p>
                  <p className="text-xs text-[#6A6A6A] mt-0.5">
                    {a.sport.map((s) => SPORT_LABELS[s] ?? s).join(" & ")}
                    {a.eventName && <> · {a.eventName}</>}
                    {" · "}
                    {a.publishedAt ? `published ${timeAgo(a.publishedAt)}` : `created ${timeAgo(a.createdAt)}`}
                  </p>
                  {a.reviewNotes && (
                    <p className="text-xs text-amber-400 mt-1.5 bg-amber-400/5 border border-amber-400/20 rounded-sm px-2 py-1.5">
                      ↩ {a.reviewNotes}
                    </p>
                  )}
                </div>
                <BlogReviewActions id={a.id} status={a.status} slug={a.slug} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
