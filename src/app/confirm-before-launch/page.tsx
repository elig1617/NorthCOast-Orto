import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { contact, formatAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Confirmed office details",
  description:
    "Office contact details confirmed for the redesigned Northcoast Orthopedic Sales website.",
  robots: { index: false, follow: false },
};

export default function ConfirmPage() {
  return (
    <>
      <PageHero
        eyebrow="Office details"
        title="Confirmed contact information"
        lede="Ownership names and former owner contacts stay off the public site. The office address, phone, and email below are the current public details."
      />
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6 space-y-3 leading-7 text-ink-soft">
        <p>
          Address: {formatAddress()}
        </p>
        <p>
          Phone: <a href={contact.phoneHref}>{contact.phone}</a>
        </p>
        <p>
          Email: <a href={contact.emailHref}>{contact.email}</a>
        </p>
      </section>
    </>
  );
}
