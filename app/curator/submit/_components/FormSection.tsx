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
    <section className="bg-white rounded-xl border border-neutral-200 p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
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
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-neutral-400 mb-2">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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
          ? "text-red-500"
          : isUnder && current > 0
          ? "text-amber-500"
          : "text-neutral-400"
      }`}
    >
      {current}/{max}
      {min && current > 0 && current < min && ` (min ${min})`}
    </span>
  );
}
