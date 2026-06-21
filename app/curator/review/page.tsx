export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllExperiencesForReview } from "./actions";
import { ReviewActions } from "./_components/ReviewActions";

export const metadata = { title: "Review Queue" };

const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; row: string }
> = {
  draft:     { label: "Draft",      dot: "bg-[#6A6A6A]",  row: "" },
  in_review: { label: "In Review",  dot: "bg-blue-400",   row: "bg-blue-400/5" },
  published: { label: "Published",  dot: "bg-[#AAFF00]",  row: "bg-[#AAFF00]/5" },
  archived:  { label: "Archived",   dot: "bg-[#2A2A2A]",  row: "opacity-40" },
  flagged:   { label: "Flagged",    dot: "bg-red-400",    row: "bg-red-400/5" },
};

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity", dining: "Dining", accommodation: "Stay",
  cultural_site: "Cultural Site", natural_wonder: "Natural Wonder",
  neighborhood: "Neighbourhood", day_trip: "Day Trip", multi_day: "Multi-day",
  sports_venue: "Sports Venue", fan_experience: "Fan Experience",
  transit: "Transit", event: "Event",
};

function wordCount(text: string | null) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function ReviewQueuePage() {
  const all = await getAllExperiencesForReview();

  const groups = {
    in_review: all.filter((e) => e.status === "in_review"),
    draft: all.filter((e) => e.status === "draft"),
    published: all.filter((e) => e.status === "published"),
    archived: all.filter((e) => e.status === "archived"),
  };

  const totalPublished = groups.published.length;
  const totalDraft = groups.draft.length + groups.in_review.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Review Queue</h1>
          <p className="mt-1 text-sm text-[#6A6A6A]">
            {totalPublished} published · {totalDraft} in progress
          </p>
        </div>
        <Link
          href="/curator/submit"
          className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-sm bg-[#AAFF00] text-xs sm:text-sm font-black text-black hover:bg-[#BBFF33] transition-colors"
        >
          + Experience
        </Link>
      </div>

      {all.length === 0 ? (
        <div className="rounded-sm border border-dashed border-[#2A2A2A] p-12 text-center">
          <p className="text-[#6A6A6A] text-sm">No experiences yet.</p>
          <Link
            href="/curator/submit"
            className="mt-3 inline-block text-sm font-medium text-[#AAFF00] underline"
          >
            Write your first experience
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {(["in_review", "draft", "published", "archived"] as const).map(
            (status) => {
              const items = groups[status];
              if (items.length === 0) return null;
              const cfg = STATUS_CONFIG[status];
              return (
                <section key={status}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <h2 className="text-sm font-semibold text-[#A3A3A3]">
                      {cfg.label}
                    </h2>
                    <span className="text-xs text-[#6A6A6A]">
                      ({items.length})
                    </span>
                  </div>

                  <div className="bg-[#141414] rounded-sm border border-[#2A2A2A] divide-y divide-[#2A2A2A] overflow-hidden">
                    {items.map((exp) => (
                      <div
                        key={exp.id}
                        className={`px-6 py-4 ${cfg.row}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          {/* Left: title + meta */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-white truncate">
                                {exp.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-xs text-[#6A6A6A] capitalize">
                                {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
                              </span>
                              <span className="text-[#2A2A2A]">·</span>
                              <span className="text-xs text-[#6A6A6A]">
                                {wordCount(exp.bodyContent)} words
                              </span>
                              {exp.whyItsSpecial && (
                                <>
                                  <span className="text-[#2A2A2A]">·</span>
                                  <span className="text-xs text-[#AAFF00]">
                                    ✓ Why it&apos;s special
                                  </span>
                                </>
                              )}
                              <span className="text-[#2A2A2A]">·</span>
                              <span className="text-xs text-[#6A6A6A]">
                                {timeAgo(exp.updatedAt)}
                              </span>
                              {exp.publishedAt && (
                                <>
                                  <span className="text-[#2A2A2A]">·</span>
                                  <span className="text-xs text-[#6A6A6A]">
                                    Published {timeAgo(exp.publishedAt)}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Reviewer feedback — shown on draft experiences returned with notes */}
                            {exp.status === "draft" && exp.reviewNotes && (
                              <div className="mt-3 flex items-start gap-2 rounded-sm bg-amber-400/10 border border-amber-400/30 px-3 py-2.5">
                                <span className="text-amber-400 mt-0.5 flex-shrink-0">↩</span>
                                <div>
                                  <p className="text-xs font-semibold text-amber-400 mb-0.5">Reviewer feedback</p>
                                  <p className="text-xs text-amber-400/80 leading-5">{exp.reviewNotes}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right: actions */}
                          <div className="flex-shrink-0">
                            <ReviewActions
                              id={exp.id}
                              status={exp.status}
                              slug={exp.slug}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
