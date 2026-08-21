import Link from "next/link";

type CtaLinkProps = {
  href: string;
  children: string;
  variant?: "primary" | "secondary" | "ghost" | "inverse";
};

export function CtaLink({ href, children, variant = "primary" }: CtaLinkProps) {
  const styles = {
    primary:
      "bg-red text-white hover:bg-red-deep border-red",
    secondary:
      "bg-transparent text-ink border-ink hover:bg-ink hover:text-white",
    ghost: "bg-transparent text-ink border-line hover:border-ink",
    inverse:
      "bg-white text-ink border-white hover:bg-paper",
  }[variant];

  const isExternal = href.startsWith("tel:") || href.startsWith("mailto:");

  const className = `inline-flex items-center justify-center border px-4 py-2.5 text-sm font-medium tracking-wide no-underline transition-colors ${styles}`;

  if (isExternal) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
