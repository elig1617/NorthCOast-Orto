import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { PageHero } from "@/components/PageHero";
import { company, confirm, published } from "@/lib/site";

export const metadata: Metadata = {
  title: "Information to confirm before launch",
  description:
    "Checklist of ownership, contact, license, and contract details that must be confirmed before the redesigned NCOS website launches.",
  robots: { index: false, follow: false },
};

const items = [
  {
    field: confirm.address,
    detail:
      `Currently published: ${published.addresses.map((address) => `${address.line1}, ${address.city}, ${address.state} ${address.zip}`).join(" AND ")}`,
  },
  {
    field: confirm.phone,
    detail: `Currently published office: ${published.phones.office}`,
  },
  {
    field: confirm.tollFree,
    detail: `Contact page lists ${published.phones.tollFreeContact}; capability page lists ${published.phones.tollFreeCapability}`,
  },
  {
    field: confirm.fax,
    detail: `Currently published: ${published.phones.fax}`,
  },
  {
    field: confirm.email,
    detail: `Currently published: ${published.emails.officeManager} and GSA listing ${published.emails.gsaListing}`,
  },
  {
    field: confirm.mobileOffice,
    detail: `Currently published: ${published.phones.mobileOhio} and ${published.phones.mobileArizona}`,
  },
  {
    field: confirm.ownership,
    detail: `Currently published: ${published.leadership.map((person) => `${person.name} (${person.role})`).join("; ")}`,
  },
  {
    field: company.hours.note,
    detail: "Monday–Friday 8:00am–5:00pm; Saturday and Sunday closed",
  },
  {
    field: confirm.licenses,
    detail:
      "The Compliance Team Exemplary Provider accreditation and any state DME licenses / surety bonds",
  },
  {
    field: "[CONFIRM MEDICARE / MEDICAID ENROLLMENT]",
    detail: "Supplier numbers, PTAN, and current participation",
  },
  {
    field: confirm.insurance,
    detail: "In-network commercial payers, Workers’ Comp panels, and any changes",
  },
  {
    field: confirm.government,
    detail: "FSS period, DAPA status, SAM registration, authorized pricelist PDF",
  },
  {
    field: "[CONFIRM WHETHER BONE / SPINE STIMULATORS ARE STILL OFFERED]",
    detail: "Listed on the current services page",
  },
  {
    field: "[CONFIRM CURRENT TEAM SIZE]",
    detail: "Capability statement says a 5-person team",
  },
  {
    field: "[CONFIRM PATIENT SURVEY URL]",
    detail: "Current patients page links a survey / QR code",
  },
  {
    field: "[CONFIRM NOTICE OF PRIVACY PRACTICES DOCUMENT]",
    detail: "Linked from the current patients page",
  },
  {
    field: "[CONFIRM MEDICARE DMEPOS STANDARDS DOCUMENT]",
    detail: "Linked from the current patients page",
  },
  {
    field: "[CONFIRM PATIENT RIGHTS & RESPONSIBILITIES DOCUMENT]",
    detail: "Linked from the current patients page",
  },
  {
    field: "[CONFIRM REFERRAL FAX / SECURE INTAKE]",
    detail: "Needed so providers can send prescriptions without using the public form",
  },
  {
    field: "[CONFIRM WHETHER ONLINE BILL PAY EXISTS]",
    detail: "Current site instructs patients to call with invoice amount and order ID",
  },
];

export default function ConfirmPage() {
  return (
    <>
      <PageHero
        eyebrow="Pre-launch"
        title="Information to confirm before launch"
        lede="These items appear as placeholders on the redesigned site. Nothing here was invented. Listed details are only what the current website already publishes."
      />
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <ol className="divide-y divide-line border-y border-line">
          {items.map((item, index) => (
            <li key={item.field} className="grid gap-2 py-4 md:grid-cols-[2rem_1fr]">
              <span className="font-mono text-xs text-slate">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p>
                  <ConfirmMark>{item.field}</ConfirmMark>
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
