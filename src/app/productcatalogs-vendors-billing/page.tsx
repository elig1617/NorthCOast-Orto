import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { catalogNotes } from "@/lib/products";
import { confirm, manufacturers } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vendors, catalogs, and billing",
  description:
    "Vendor-neutral orthopedic catalogs and billing services from Northcoast Orthopedic Sales.",
};

export default function CatalogsPage() {
  return (
    <>
      <PageHero
        eyebrow="Vendors and billing"
        title="One point of contact because NCOS is vendor-neutral and runs its own billing desk."
        lede={catalogNotes.vendorNeutral}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
        <div>
          <h2 className="font-serif text-2xl">Primary vendors listed today</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {manufacturers.primary.map((vendor) => (
              <li key={vendor.name} className="py-3">
                <p className="font-medium">{vendor.name}</p>
                <p className="text-sm text-slate">{vendor.note}</p>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 font-serif text-2xl">Also named</h3>
          <ul className="mt-4 space-y-2 text-ink-soft">
            {[...manufacturers.alsoRepresented, ...manufacturers.sourcingContracts].map(
              (vendor) => (
                <li key={`${vendor.name}-${vendor.note}`}>{vendor.name}</li>
              ),
            )}
          </ul>
          <p className="mt-4 text-sm text-slate">
            {catalogNotes.pediatric} Additional access to orthopedic suppliers
            is available. Call for details.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Published billing services</h2>
          <ul className="mt-4 space-y-3 leading-7 text-ink-soft">
            <li>Patients</li>
            <li>Hospitals</li>
            <li>Orthopedic practices</li>
            <li>Order-by-order billing for one or multiple products</li>
            <li>Pain management and physical therapy groups</li>
            <li>In-network provider for most major insurances, as published</li>
            <li>Participating provider: Workers’ Compensation, Medicare, and Medicaid</li>
            <li>HIPAA compliant, as published</li>
            <li>Exemplary Provider accredited by The Compliance Team, as published</li>
          </ul>
          <p className="mt-4 text-sm">
            <ConfirmMark>{confirm.insurance}</ConfirmMark>{" "}
            <ConfirmMark>{confirm.licenses}</ConfirmMark>
          </p>
          <div className="mt-6">
            <CtaLink href="/contact">Call for current catalogs</CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
