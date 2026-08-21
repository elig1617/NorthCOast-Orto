import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { CtaLink } from "@/components/CtaLink";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { confirm } from "@/lib/site";

export const metadata: Metadata = {
  title: "Healthcare providers",
  description:
    "Refer a patient or use Northcoast Orthopedic Sales as a vendor-neutral orthopedic sourcing and billing partner.",
};

export default function ProvidersPage() {
  return (
    <>
      <PageHero
        eyebrow="Physicians and referral sources"
        title="Keep the brands you already use. Give the office one number to call."
        lede="The current website positions NCOS as a single point of contact for orthopedic supplies and soft-good DME, with its own billing and customer service."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 md:px-6">
        <div className="space-y-8">
          <article>
            <h2 className="font-serif text-2xl">What referral sources typically need</h2>
            <ul className="mt-4 space-y-3 leading-7 text-ink-soft">
              <li>A vendor-neutral partner that can source the brace the physician prefers.</li>
              <li>Help with Workers’ Compensation, commercial insurance, Medicare, and Medicaid billing, as published.</li>
              <li>Order-by-order billing for one product or several.</li>
              <li>Support for orthopedic practices, pain management, and physical therapy groups.</li>
            </ul>
          </article>
          <article className="border-t border-line pt-6">
            <h2 className="font-serif text-2xl">How to refer</h2>
            <p className="mt-3 leading-7 text-ink-soft">
              Use the form, or call <ConfirmMark>{confirm.phone}</ConfirmMark> /
              fax <ConfirmMark>{confirm.fax}</ConfirmMark>. Do not place
              protected health information in this public form. For
              prescriptions and clinical documents, use the office intake
              process once confirmed.
            </p>
            <p className="mt-3 text-sm">
              <ConfirmMark>[CONFIRM REFERRAL FAX / SECURE INTAKE]</ConfirmMark>
            </p>
          </article>
          <div className="flex flex-wrap gap-3">
            <CtaLink href="/productcatalogs-vendors-billing">Vendors & catalogs</CtaLink>
            <CtaLink href="/insurance" variant="secondary">
              Insurance participation
            </CtaLink>
          </div>
        </div>
        <InquiryForm kind="referral" />
      </section>
    </>
  );
}
