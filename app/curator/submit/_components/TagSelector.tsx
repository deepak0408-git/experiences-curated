"use client";

export function TagSelector({
  options,
  selected,
  onChange,
  max,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  max?: number;
}) {
  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (!max || selected.length < max) {
      onChange([...selected, value]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        const disabled = !active && !!max && selected.length >= max;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
              active
                ? "bg-[#AAFF00] text-black font-black"
                : disabled
                ? "bg-[#1A1A1A] border border-[#2A2A2A] text-[#6A6A6A] cursor-not-allowed opacity-40"
                : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#AAFF00] hover:text-[#AAFF00]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
