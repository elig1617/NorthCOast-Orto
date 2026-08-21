import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { getCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Upper extremity products",
  description:
    "Wrist, hand, thumb, shoulder, and elbow supports from the current Northcoast Orthopedic Sales catalog.",
};

export default function UpperExtremityPage() {
  const wrist = getCategory("wrist-hand");

  return (
    <>
      <PageHero
        eyebrow="Upper extremity"
        title="Wrist, hand, and thumb supports from the current catalog."
        lede="This page preserves the existing /upper-extremity-products URL. Shoulder and elbow categories are listed on the current Products / Services taxonomy and are available as separate pages."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <ul className="divide-y divide-line border-y border-line">
          {wrist?.products.map((product) => (
            <li key={product} className="py-3">
              {product}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink href="/products/wrist-hand">Wrist & hand details</CtaLink>
          <CtaLink href="/products/shoulder" variant="secondary">
            Shoulder
          </CtaLink>
          <CtaLink href="/products/elbow" variant="ghost">
            Elbow
          </CtaLink>
        </div>
      </section>
    </>
  );
}
