import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { ConfirmNote } from "@/components/ConfirmMark";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { SpecTable } from "@/components/SpecTable";
import { company, confirm, published } from "@/lib/site";

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
        lede={`Published hours are Monday–Friday ${company.hours.weekday}. Saturday and Sunday are listed as closed.`}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] md:px-6">
        <div className="space-y-6">
          <SpecTable
            rows={[
              { label: "Address", value: <ConfirmMark>{confirm.address}</ConfirmMark> },
              { label: "Office", value: <ConfirmMark>{confirm.phone}</ConfirmMark> },
              { label: "Toll-free", value: <ConfirmMark>{confirm.tollFree}</ConfirmMark> },
              { label: "Fax", value: <ConfirmMark>{confirm.fax}</ConfirmMark> },
              { label: "Email", value: <ConfirmMark>{confirm.email}</ConfirmMark> },
              {
                label: "Mobile",
                value: <ConfirmMark>{confirm.mobileOffice}</ConfirmMark>,
              },
              { label: "Hours", value: <ConfirmMark>{company.hours.note}</ConfirmMark> },
            ]}
          />
          <ConfirmNote title="Currently published on the existing website">
            <ul className="space-y-2">
              {published.addresses.map((address) => (
                <li key={address.line1}>
                  <strong>{address.label}:</strong> {address.line1}, {address.city},{" "}
                  {address.state} {address.zip}
                </li>
              ))}
              <li>
                Office {published.phones.office}; toll-free listed as both{" "}
                {published.phones.tollFreeContact} and {published.phones.tollFreeCapability};
                fax {published.phones.fax}; mobiles {published.phones.mobileOhio} and{" "}
                {published.phones.mobileArizona}.
              </li>
              <li>
                Emails listed: {published.emails.officeManager} and{" "}
                {published.emails.gsaListing}.
              </li>
            </ul>
          </ConfirmNote>
        </div>
        <InquiryForm />
      </section>
    </>
  );
}
