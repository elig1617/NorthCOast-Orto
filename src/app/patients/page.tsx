import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Patients",
  description:
    "Patient billing, equipment questions, and DME resources from Northcoast Orthopedic Sales.",
};

export default function PatientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Patients"
        title="If you received equipment from NCOS, billing and support are handled here — separately from the medical visit."
        lede="The current patient page explains that Northcoast Orthopedic Sales, LLC is the DME supplier for the medical facility you visited. DME services are handled separately from the medical treatment you received."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 md:px-6">
        <div className="space-y-8">
          <article className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">Pay an invoice</h2>
            <p className="mt-3 leading-7 text-ink-soft">
              The current website asks patients to pay by calling the office.
              To pay, have the invoice amount and the account number (order ID)
              ready.
            </p>
            <p className="mt-3">
              Call <a href={contact.phoneHref}>{contact.phone}</a>
            </p>
            <p className="mt-3 text-sm text-slate">
              Pay by phone with the invoice amount and account number (order ID).
            </p>
          </article>
          <article className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">How patients typically work with NCOS</h2>
            <ol className="mt-4 space-y-3 text-ink-soft">
              <li>01 — A physician writes a prescription when required.</li>
              <li>02 — The clinic refers the order, or the patient contacts the office.</li>
              <li>03 — NCOS sources the product and ships or coordinates delivery.</li>
              <li>04 — Billing is handled with the published payer mix, or the patient is invoiced.</li>
            </ol>
          </article>
          <article className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">Documents on the current site</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="/patient-rights">Patient rights and responsibilities</a>
              </li>
              <li>
                <a href="/medicare-dmepos-standards">Medicare DMEPOS supplier standards</a>
              </li>
              <li>
                <a href="/privacy">Notice of privacy practices</a>
              </li>
            </ul>
            <p className="mt-3 text-sm text-slate">
              The office also invites voluntary feedback about equipment you
              have received. Ask for the current patient survey when you call.
            </p>
          </article>
          <p className="text-sm text-slate">
            For billing questions, call the office. Do not send medical records
            through the public website form.
          </p>
        </div>
        <InquiryForm kind="contact" />
      </section>
      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 md:px-6">
          <p className="font-serif text-xl">Need a product and already have a prescription?</p>
          <CtaLink href="/contact">Contact the office</CtaLink>
        </div>
      </section>
    </>
  );
}
