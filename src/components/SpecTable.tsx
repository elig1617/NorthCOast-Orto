import type { ReactNode } from "react";

export function SpecTable({
  rows,
}: {
  rows: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid gap-2 py-3 sm:grid-cols-[12rem_1fr] sm:items-baseline"
        >
          <dt className="font-mono text-[0.72rem] uppercase tracking-wider text-slate">
            {row.label}
          </dt>
          <dd className="text-sm leading-6 text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
