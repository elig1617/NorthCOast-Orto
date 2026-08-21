import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { PageHero } from "@/components/PageHero";
import { confirm } from "@/lib/site";

export const metadata: Metadata = {
  title: "Notice of privacy practices",
  description:
    "Privacy practices for Northcoast Orthopedic Sales as a durable medical equipment supplier.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Notice of privacy practices"
        lede="The current patient page links a Notice of Privacy Practices. Until a confirmed legal document is provided, this page states only what the existing site already communicates and marks the rest for review."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 prose-ncos space-y-4 leading-7 text-ink-soft">
        <p>
          Northcoast Orthopedic Sales, LLC is the supplier of durable medical
          equipment for the medical facility a patient may have visited. DME
          services are handled separately from the medical treatment received
          at that facility.
        </p>
        <p>
          The current website states that NCOS is HIPAA compliant / HIPAA
          certified. This redesign does not invent a full Notice of Privacy
          Practices. Attach the current legally approved notice before launch.
        </p>
        <p>
          Public website forms on this site ask visitors not to submit
          protected health information. Use the confirmed office phone, fax, or
          secure intake process for clinical documents.
        </p>
        <p>
          Privacy officer / contact: <ConfirmMark>{confirm.email}</ConfirmMark>
        </p>
        <p>
          <ConfirmMark>[CONFIRM NOTICE OF PRIVACY PRACTICES DOCUMENT]</ConfirmMark>
        </p>
      </section>
    </>
  );
}
