import { CtaLink } from "@/components/CtaLink";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 md:px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-4xl">That page is not in the 2026 site map.</h1>
      <p className="mt-4 max-w-prose text-ink-soft">
        If you followed an older catalog or Wix URL, try Products, Government,
        or Contact.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <CtaLink href="/">Home</CtaLink>
        <CtaLink href="/products-services" variant="secondary">
          Products
        </CtaLink>
        <CtaLink href="/contact" variant="ghost">
          Contact
        </CtaLink>
      </div>
    </div>
  );
}
