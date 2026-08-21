import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { PageHero } from "@/components/PageHero";
import { confirm, contact } from "@/lib/site";

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
        lede="NCOS is the DME supplier for the medical facility a patient may have visited. DME services are handled separately from that medical treatment."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 prose-ncos space-y-4 leading-7 text-ink-soft">
        <p>
          Northcoast Orthopedic Sales, LLC is HIPAA compliant. Public website
          forms on this site ask visitors not to submit protected health
          information. Use the office phone or fax for clinical documents.
        </p>
        <p>
          For a copy of the Notice of Privacy Practices, call{" "}
          <a href={contact.phoneHref}>{contact.phone}</a> or email{" "}
          <ConfirmMark>{confirm.email}</ConfirmMark>.
        </p>
      </section>
    </>
  );
}
