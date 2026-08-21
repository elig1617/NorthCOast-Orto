import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Insurance and billing",
  description:
    "Insurance, Workers’ Compensation, Medicare, and Medicaid billing services from Northcoast Orthopedic Sales.",
};

export default function InsurancePage() {
  return (
    <>
      <PageHero
        eyebrow="Insurance"
        title="Billing is part of the NCOS service, not an afterthought."
        lede="NCOS can provide full-service billing for patients, hospitals, orthopedic practices, and pain-management and physical-therapy groups."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <article className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">Commercial insurance</h2>
            <p className="mt-3 leading-7 text-ink-soft">
              NCOS is an in-network or preferred DME provider for the majority
              of insurance providers. Individual plans and networks should still
              be verified on each order.
            </p>
          </article>
          <article className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">Workers’ Compensation</h2>
            <p className="mt-3 leading-7 text-ink-soft">
              NCOS is a participating provider and can supply and bill for
              Workers’ Comp related injuries.
            </p>
          </article>
          <article className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">Medicare and Medicaid</h2>
            <p className="mt-3 leading-7 text-ink-soft">
              NCOS is a participating provider. See also the Medicare DMEPOS
              supplier standards page.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
