import Link from "next/link";
import { getAllExperiencesForReview } from "./actions";
import { ReviewActions } from "./_components/ReviewActions";

export const metadata = { title: "Review Queue" };

const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; row: string }
> = {
  draft:     { label: "Draft",      dot: "bg-neutral-300", row: "" },
  in_review: { label: "In Review",  dot: "bg-blue-400",    row: "bg-blue-50/40" },
  published: { label: "Published",  dot: "bg-green-500",   row: "bg-green-50/30" },
  archived:  { label: "Archived",   dot: "bg-neutral-200", row: "opacity-50" },
  flagged:   { label: "Flagged",    dot: "bg-red-400",     row: "bg-red-50/30" },
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
          <h1 className="text-2xl font-bold text-neutral-900">Review Queue</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {totalPublished} published · {totalDraft} in progress
          </p>
        </div>
        <Link
          href="/curator/submit"
          className="px-4 py-2.5 rounded-lg bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
        >
          + New Experience
        </Link>
      </div>

      {all.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-12 text-center">
          <p className="text-neutral-400 text-sm">No experiences yet.</p>
          <Link
            href="/curator/submit"
            className="mt-3 inline-block text-sm font-medium text-neutral-900 underline"
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
                    <h2 className="text-sm font-semibold text-neutral-600">
                      {cfg.label}
                    </h2>
                    <span className="text-xs text-neutral-400">
                      ({items.length})
                    </span>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
                    {items.map((exp) => (
                      <div
                        key={exp.id}
                        className={`px-6 py-4 ${cfg.row}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Left: title + meta */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-neutral-900 truncate">
                                {exp.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-xs text-neutral-400 capitalize">
                                {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
                              </span>
                              <span className="text-neutral-200">·</span>
                              <span className="text-xs text-neutral-400">
                                {wordCount(exp.bodyContent)} words
                              </span>
                              {exp.whyItsSpecial && (
                                <>
                                  <span className="text-neutral-200">·</span>
                                  <span className="text-xs text-green-600">
                                    ✓ Why it's special
                                  </span>
                                </>
                              )}
                              <span className="text-neutral-200">·</span>
                              <span className="text-xs text-neutral-400">
                                {timeAgo(exp.updatedAt)}
                              </span>
                              {exp.publishedAt && (
                                <>
                                  <span className="text-neutral-200">·</span>
                                  <span className="text-xs text-neutral-400">
                                    Published {timeAgo(exp.publishedAt)}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Reviewer feedback — shown on draft experiences returned with notes */}
                            {exp.status === "draft" && exp.reviewNotes && (
                              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
                                <span className="text-amber-500 mt-0.5 flex-shrink-0">↩</span>
                                <div>
                                  <p className="text-xs font-semibold text-amber-800 mb-0.5">Reviewer feedback</p>
                                  <p className="text-xs text-amber-700 leading-5">{exp.reviewNotes}</p>
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
