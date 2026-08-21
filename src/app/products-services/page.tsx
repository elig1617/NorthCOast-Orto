import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { productCategories } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products and DME solutions",
  description:
    "Off-the-shelf, soft-good orthopedic bracing and supports from Northcoast Orthopedic Sales, organized by body region.",
};

export default function ProductsHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Vendor-neutral distribution of off-the-shelf, soft-good orthopedic bracing and supports."
        lede="The current Products / Services page states that NCOS services the commercial and government markets and can provide high-quality products for nearly every extremity. Contact the office for quotes, ordering, or inquiries."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="divide-y divide-line border-y border-line">
          {productCategories.map((category) => (
            <article key={category.slug} className="grid gap-4 py-6 md:grid-cols-[11rem_1fr_auto] md:items-start">
              <p className="font-mono text-[0.72rem] uppercase tracking-wider text-slate">
                {category.bodyRegion}
              </p>
              <div>
                <h2 className="font-serif text-2xl">
                  <Link href={category.href} className="no-underline hover:text-red">
                    {category.name}
                  </Link>
                </h2>
                <p className="mt-2 max-w-3xl text-ink-soft leading-7">{category.summary}</p>
              </div>
              <Link href={category.href} className="text-sm text-red no-underline">
                View category →
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <CtaLink href="/lower-extremity-products">Lower extremity catalog</CtaLink>
          <CtaLink href="/upper-extremity-products" variant="secondary">
            Upper extremity catalog
          </CtaLink>
          <CtaLink href="/productcatalogs-vendors-billing" variant="ghost">
            Vendors & catalogs
          </CtaLink>
        </div>
      </section>
    </>
  );
}
