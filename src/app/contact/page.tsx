import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { SpecTable } from "@/components/SpecTable";
import { company, confirm, contact, formatAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Northcoast Orthopedic Sales for quotes, referrals, billing, and institutional purchasing.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Reach the office for a quote, referral, existing order, or institutional purchase."
        lede={`Monday–Friday ${company.hours.weekday}. Saturday and Sunday ${company.hours.weekend}.`}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] md:px-6">
        <div className="space-y-6">
          <SpecTable
            rows={[
              {
                label: "Hudson office",
                value: formatAddress(contact.addresses[0]),
              },
              {
                label: "Stow office",
                value: formatAddress(contact.addresses[1]),
              },
              {
                label: "Office",
                value: <a href={contact.phoneHref}>{contact.phone}</a>,
              },
              {
                label: "Toll-free",
                value: <a href={contact.tollFreeHref}>{contact.tollFree}</a>,
              },
              { label: "Fax", value: contact.fax },
              {
                label: "Email",
                value: <ConfirmMark>{confirm.email}</ConfirmMark>,
              },
              {
                label: "Hours",
                value: `Monday–Friday ${company.hours.weekday}; Saturday–Sunday ${company.hours.weekend}`,
              },
            ]}
          />
        </div>
        <InquiryForm />
      </section>
    </>
  );
}
