import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { ConfirmNote } from "@/components/ConfirmMark";
import { PageHero } from "@/components/PageHero";
import { confirm } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insurance and billing",
  description:
    "Published insurance, Workers’ Compensation, Medicare, and Medicaid billing services from Northcoast Orthopedic Sales.",
};

export default function InsurancePage() {
  return (
    <>
      <PageHero
        eyebrow="Insurance"
        title="Billing is published as part of the NCOS service, not an afterthought."
        lede="The current website states that NCOS can provide full-service billing for patients, hospitals, orthopedic practices, and pain-management and physical-therapy groups."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <article className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">Commercial insurance</h2>
            <p className="mt-3 leading-7 text-ink-soft">
              Published as an in-network or preferred DME provider for the
              majority of insurance providers. Individual plans and networks
              must be verified.
            </p>
          </article>
          <article className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">Workers’ Compensation</h2>
            <p className="mt-3 leading-7 text-ink-soft">
              The current site lists participating-provider status and the
              ability to supply and bill for Workers’ Comp related injuries.
            </p>
          </article>
          <article className="border-t border-line pt-4">
            <h2 className="font-serif text-2xl">Medicare and Medicaid</h2>
            <p className="mt-3 leading-7 text-ink-soft">
              Published as a participating provider. See also the Medicare
              DMEPOS supplier standards page. Enrollment and supplier numbers
              need confirmation.
            </p>
          </article>
        </div>
        <div className="mt-10">
          <ConfirmNote title="Do not treat payer lists as current until confirmed">
            <p>
              <ConfirmMark>{confirm.insurance}</ConfirmMark>
            </p>
            <p className="mt-2">
              Also confirm:{" "}
              <ConfirmMark>[CONFIRM MEDICARE / MEDICAID ENROLLMENT]</ConfirmMark>{" "}
              <ConfirmMark>[CONFIRM HIPAA / PRIVACY OFFICER CONTACT]</ConfirmMark>
            </p>
          </ConfirmNote>
        </div>
      </section>
    </>
  );
}
