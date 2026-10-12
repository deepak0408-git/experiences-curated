"use client";

// Adapted from app/ticket-intelligence/[slug]/_components/TicketQuiz.tsx's
// QuestionBlock — same selected/unselected styling, extended to show each
// option's description line (the handoff's UX contract requires "title and
// description on every option" — Ticket Intelligence's version only shows a
// label).

export default function QuestionBlock<V extends string>({
  eyebrow,
  question,
  options,
  value,
  onSelect,
}: {
  eyebrow: string;
  question: string;
  options: { value: V; label: string; description: string }[];
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
              <span className={selected ? "block text-xs mt-0.5 text-black/65" : "block text-xs mt-0.5 text-[#6A6A6A]"}>
                {opt.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
