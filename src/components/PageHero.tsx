import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:py-16">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
        </div>
        <div className="md:pt-8">
          {lede ? (
            <p className="max-w-prose text-lg leading-8 text-ink-soft">{lede}</p>
          ) : null}
          {children}
        </div>
      </div>
    </header>
  );
}
