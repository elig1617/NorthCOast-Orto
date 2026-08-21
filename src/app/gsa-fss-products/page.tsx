import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { getCategory } from "@/lib/products";
import { contracts } from "@/lib/site";

export const metadata: Metadata = {
  title: "GSA / FSS products",
  description:
    "Published VA / GSA Federal Supply Schedule product listing for Northcoast Orthopedic Sales contract 36F79720D0126.",
};

export default function GsaProductsPage() {
  const knee = getCategory("knee");

  return (
    <>
      <PageHero
        eyebrow="VA / GSA / FSS"
        title="Contracted orthopedic items under the published FSS vehicle."
        lede={`Contract ${contracts.fss.number} · FSC ${contracts.fss.fsc} · SAM ${contracts.identifiers.sam}`}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <p className="max-w-3xl leading-7 text-ink-soft">
          The current GSA / FSS products page is a Wix catalog of contracted
          items, beginning with OA and knee braces. This page preserves those
          published item names. It is not a live e-commerce cart and does not
          invent pricing.
        </p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {knee?.products.map((product) => (
            <li key={product} className="py-3">
              {product}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink href="/va-fss-contractor">Contract details</CtaLink>
          <CtaLink href="/contact" variant="secondary">
            Request a federal quote
          </CtaLink>
        </div>
      </section>
    </>
  );
}
