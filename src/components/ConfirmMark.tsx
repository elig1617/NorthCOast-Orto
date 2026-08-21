import type { ReactNode } from "react";

export function ConfirmMark({
  children,
}: {
  children: string;
}) {
  return <span className="confirm-chip">{children}</span>;
}

export function ConfirmNote({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="border border-[#e0c48a] bg-confirm-bg px-4 py-3 text-sm text-confirm">
      <p className="eyebrow !text-confirm mb-1">{title ?? "Needs confirmation"}</p>
      <div className="text-[0.95rem] leading-6 text-[#5c3d12]">{children}</div>
    </aside>
  );
}
