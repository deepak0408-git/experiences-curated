"use client";

// Adapted from app/trip-intelligence/formula-1/_components/QuestionBlock.tsx.
// Tennis's locked questionnaire wording (spec §3) has no per-option
// description line — label only — so this omits the description text F1's
// version renders underneath each option.

export default function QuestionBlock<V extends string>({
  eyebrow,
  question,
  options,
  value,
  onSelect,
}: {
  eyebrow: string;
  question: string;
  options: { value: V; label: string }[];
  value: V | undefined;
  onSelect: (v: V) => void;
}) {
  return (
    <div className="mb-10">
      <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">{eyebrow}</p>
      <p className="text-sm text-white font-bold mb-3">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              aria-pressed={selected}
              className={
                selected
                  ? "text-left px-4 py-3 rounded-sm bg-[#AAFF00] transition-colors"
                  : "text-left px-4 py-3 rounded-sm bg-[#141414] border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors"
              }
            >
              <span className={selected ? "block text-sm font-semibold text-black" : "block text-sm font-semibold text-white"}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
