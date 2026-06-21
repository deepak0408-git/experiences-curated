"use client";

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#141414] rounded-sm border border-[#2A2A2A] p-8">
      <div className="mb-6">
        <h2 className="text-lg font-black text-[#AAFF00]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[#6A6A6A]">{description}</p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#A3A3A3] mb-1">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-[#6A6A6A] mb-2">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function CharCount({
  current,
  min,
  max,
}: {
  current: number;
  min?: number;
  max: number;
}) {
  const isUnder = min !== undefined && current < min;
  const isOver = current > max;
  return (
    <span
      className={`text-xs tabular-nums ${
        isOver
          ? "text-red-400"
          : isUnder && current > 0
          ? "text-amber-400"
          : "text-[#6A6A6A]"
      }`}
    >
      {current}/{max}
      {min && current > 0 && current < min && ` (min ${min})`}
    </span>
  );
}
