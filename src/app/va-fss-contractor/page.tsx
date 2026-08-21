import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { SpecTable } from "@/components/SpecTable";
import { contracts } from "@/lib/site";

export const metadata: Metadata = {
  title: "VA FSS contractor",
  description:
    "Northcoast Orthopedic Sales VA Federal Supply Schedule contract 36F79720D0126 for medical equipment and supplies.",
};

export default function VaFssPage() {
  return (
    <>
      <PageHero
        eyebrow="Government / VA"
        title="Official supplier channel for VA Federal Supply Schedule orthopedic items, as published."
        lede="The current VA FSS page states that NCOS offers 3,000+ items via an awarded Federal Supply Schedule contract under Schedule 65 II A — Medical Equipment and Supplies."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr] md:px-6">
        <div>
          <SpecTable
            rows={[
              { label: "Contract", value: contracts.fss.number },
              { label: "Schedule", value: contracts.fss.schedule },
              { label: "FSC", value: `${contracts.fss.fsc} · ${contracts.fss.fscGroup}` },
              { label: "SAM UEI", value: contracts.identifiers.sam },
              { label: "DUNS", value: contracts.identifiers.duns },
              { label: "CAGE", value: contracts.identifiers.cage },
              { label: "NAICS", value: contracts.identifiers.naics },
              { label: "Size", value: contracts.identifiers.size },
              { label: "Period", value: contracts.fss.publishedPeriod },
              {
                label: "Ordering",
                value:
                  "The current site directs buyers to GSA Advantage! for contract ordering information, terms, pricing, and electronic delivery orders.",
              },
            ]}
          />
          <h2 className="mt-10 font-serif text-2xl">Awarded Special Item Numbers</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {contracts.fss.sins.map((sin) => (
              <li key={sin.code} className="grid grid-cols-[6rem_1fr] py-3">
                <span className="font-mono text-sm">{sin.code}</span>
                <span>{sin.name}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink href="/gsa-fss-products">FSS product listing</CtaLink>
            <CtaLink href="/capability-statement" variant="secondary">
              Capability statement
            </CtaLink>
          </div>
        </div>
        <aside className="space-y-5">
          <div className="border border-line bg-white p-5 text-sm leading-6 text-ink-soft">
            <p className="eyebrow">How federal buyers typically order</p>
            <ol className="mt-3 space-y-2">
              <li>01 — Confirm the item against the authorized FSS pricelist.</li>
              <li>02 — Order through GSA Advantage! or the facility’s established FSS process.</li>
              <li>03 — For DLA / DMLSS items, use the DAPA / prime-vendor channel.</li>
              <li>04 — Call the office for capability questions or backorders.</li>
            </ol>
            <p className="mt-4">
              Authorized FSS pricelist PDF, GSA eLibrary catalog, and
              capability-statement PDF are available from the office.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
