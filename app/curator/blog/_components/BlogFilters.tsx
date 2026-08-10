"use client";

import { useRouter } from "next/navigation";

const CATEGORY_LABELS: Record<string, string> = {
  history: "History",
  rivalry: "Rivalry",
  why_go: "Why Go",
  bucket_list: "Bucket List",
  travel_craft: "Travel Craft",
};

export function BlogFilters({
  seriesOptions,
  activeCategory,
  activeStructure,
  activeSeries,
}: {
  seriesOptions: string[];
  activeCategory?: string;
  activeStructure?: string;
  activeSeries?: string;
}) {
  const router = useRouter();

  function pushParams(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const next = {
      category: activeCategory,
      structure: activeStructure,
      series: activeSeries,
      ...overrides,
    };
    if (next.category) params.set("category", next.category);
    if (next.structure) params.set("structure", next.structure);
    if (next.series) params.set("series", next.series);
    const qs = params.toString();
    router.push(qs ? `/curator/blog?${qs}` : "/curator/blog");
  }

  const selectClass =
    "px-3 py-2 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-white focus:outline-none focus:border-[#AAFF00]";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={activeCategory ?? ""}
        onChange={(e) => pushParams({ category: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">All categories</option>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={activeStructure ?? ""}
        onChange={(e) => pushParams({ structure: e.target.value || undefined, series: undefined })}
        className={selectClass}
      >
        <option value="">All structures</option>
        <option value="one_off">One-off</option>
        <option value="series">Series</option>
      </select>

      <select
        value={activeSeries ?? ""}
        onChange={(e) => pushParams({ series: e.target.value || undefined, structure: e.target.value ? "series" : activeStructure })}
        className={selectClass}
        disabled={seriesOptions.length === 0}
      >
        <option value="">All series</option>
        {seriesOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {(activeCategory || activeStructure || activeSeries) && (
        <button
          onClick={() => router.push("/curator/blog")}
          className="px-3 py-2 text-sm text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
