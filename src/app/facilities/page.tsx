import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { CtaLink } from "@/components/CtaLink";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { confirm } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hospitals and facilities",
  description:
    "Orthopedic soft-good DME sourcing for hospitals, emergency departments, and healthcare organizations.",
};

export default function FacilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hospitals and healthcare organizations"
        title="Stocked ER soft goods, post-operative bracing, and one invoice for the facility."
        lede="The current site lists doctors and hospitals among the customers NCOS supplies, and specifically calls out low-cost ER orthopedic supply such as crutches, ankle stirrups, and hand and wrist splints."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 md:px-6">
        <div className="space-y-6 leading-7 text-ink-soft">
          <p>
            Facilities can use NCOS as a manufacturer-neutral sourcing desk:
            keep the products clinicians already know, reduce the number of
            vendor calls, and consolidate fulfillment.
          </p>
          <p>
            The published model also supports billing on an order-by-order
            basis for hospitals and practices when the facility does not want
            to carry the DME receivable.
          </p>
          <p>
            Nationwide shipping is published. The customer-service and billing
            office is currently listed in northeast Ohio.{" "}
            <ConfirmMark>{confirm.address}</ConfirmMark>
          </p>
          <CtaLink href="/products/er-soft-goods">ER soft goods</CtaLink>
        </div>
        <InquiryForm kind="quote" />
      </section>
    </>
  );
}
