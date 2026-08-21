import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { SpecTable } from "@/components/SpecTable";
import { getCategory } from "@/lib/products";
import { contracts } from "@/lib/site";

export const metadata: Metadata = {
  title: "DoD / DAPA / DMLSS products",
  description:
    "Northcoast Orthopedic Sales DAPA prime-vendor contract SP0200-21-H-0009 through Owens & Minor for DLA / DMLSS buyers.",
};

export default function DapaPage() {
  const foot = getCategory("foot-ankle");
  const sample = [
    ...(foot?.products.slice(0, 10) ?? []),
    'OAB: Pull-on OA Brace',
    'OAW: Wrap Around OA Brace with Patella Buttress',
    'KC2-U-MP',
    'K12-NOS: "Over/Under" Pull-On Knee Brace (Neoprene)',
    'KC12-NOS: "Over/Under" Pull-On Knee Brace (Koolflex)',
    'K42-HT: Sports "Rehab Knee" Brace with ROM Hinge',
    'K64-NOS / KC64-NOS: "Knee Mate" Wrap-Around with Hinges',
    'K64-HT / KC64-HT: Knee Mate Wrap-Around with Hinges',
  ];

  return (
    <>
      <PageHero
        eyebrow="DoD / DLA"
        title="DAPA prime-vendor channel for military medical logistics, as published."
        lede="The current site states that NCOS supplies through the prime vendor Owens & Minor, with more than 1,000 contracted items available on DMLSS."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_1fr] md:px-6">
        <div>
          <SpecTable
            rows={[
              { label: "DAPA", value: contracts.dapa.number },
              { label: "Prime vendor", value: contracts.dapa.primeVendor },
              { label: "Supplier #", value: contracts.dapa.supplierNumber },
              { label: "DMLSS", value: contracts.dapa.itemCount },
              { label: "Channel", value: "DLA / DMLSS through the listed prime vendor" },
            ]}
          />
          <div className="mt-8">
            <CtaLink href="/contact">Contact for DMLSS / DAPA questions</CtaLink>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Items listed on the current DAPA page</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
            {sample.map((product) => (
              <li key={product} className="py-2">
                {product}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
