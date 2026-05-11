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
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active
                ? "bg-neutral-900 text-white"
                : disabled
                ? "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
