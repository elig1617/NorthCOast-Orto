import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { getCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Lower extremity products",
  description:
    "Knee, hip, foot, ankle, AFO, and MPO products from the current Northcoast Orthopedic Sales catalog.",
};

export default function LowerExtremityPage() {
  const foot = getCategory("foot-ankle");
  const knee = getCategory("knee");

  return (
    <>
      <PageHero
        eyebrow="Lower extremity"
        title="Foot, ankle, AFO, MPO, and knee items from the current catalog."
        lede="This page preserves the existing /lower-extremity-products URL and the item names published there, then groups related knee products from the same catalog."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
        <div>
          <h2 className="font-serif text-2xl">Foot, ankle, AFO, and MPO</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
            {foot?.products.map((product) => (
              <li key={product} className="py-2">
                {product}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Knee items also in the catalog</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
            {knee?.products.slice(0, 16).map((product) => (
              <li key={product} className="py-2">
                {product}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <CtaLink href="/products/foot-ankle">Foot & ankle details</CtaLink>
            <CtaLink href="/products/knee" variant="secondary">
              Knee details
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
