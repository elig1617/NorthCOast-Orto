import type { Metadata } from "next";
import Image from "next/image";
import { ConfirmMark } from "@/components/ConfirmMark";
import { ConfirmNote } from "@/components/ConfirmMark";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { company, confirm, credentialsPublished, published } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Northcoast Orthopedic Sales is a northeast Ohio orthopedic DME company providing vendor-neutral sourcing, billing, and patient support.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About NCOS"
        title="A northeast Ohio orthopedic DME company built around one contact and one invoice."
        lede="The current About page describes superior customer service from sales and office staff, and many years of industry experience taking care of sourcing, ordering, billing, and patient needs."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-6">
        <article className="prose-ncos space-y-5 text-lg leading-8 text-ink-soft">
          <p>
            {company.tradeName} is a northeast Ohio family business that sources
            directly with top U.S. and global orthopedic manufacturers. The
            published mission is to provide a single sourcing point for
            orthopedic product needs, saving time and money.
          </p>
          <p>
            NCOS is a vendor-neutral service provider with competitive contracts
            across manufacturers. The current site states that customers can
            source any brand they already use or that their physicians prefer,
            and that those contracts help clients increase billing margins.
          </p>
          <p>
            The company describes itself as Orthopedic Product Solution
            Specialists. It offers a comprehensive variety of orthopedic
            supplies and publishes representative relationships with Medical
            Specialties, Corflex, Össur, and New Options Sports. That
            relationship is described as allowing competitive pricing and access
            to newer orthopedic equipment while consolidating everything to one
            invoice.
          </p>
          <p>
            NCOS can also provide billing services for an office. The current
            site states that, as an in-network provider to the majority of
            insurance providers, Workers’ Compensation, Medicare, and Medicaid,
            the company can support administrative billing needs.
          </p>
          <p>
            The published closing voice of the current About page is from Dave
            Farrell, President. That leadership listing must be confirmed before
            launch.
          </p>
        </article>
        <aside className="space-y-6">
          <ConfirmNote title="Ownership and leadership">
            <p>
              <ConfirmMark>{confirm.ownership}</ConfirmMark>
            </p>
            <p className="mt-3">Currently published names:</p>
            <ul className="mt-2 space-y-1">
              {published.leadership.map((person) => (
                <li key={person.name}>
                  {person.name} — {person.role}
                </li>
              ))}
            </ul>
          </ConfirmNote>
          <div className="border border-line bg-white p-5">
            <Image
              src="/brand/exemplary-provider.png"
              alt="Exemplary Provider accredited by The Compliance Team"
              width={481}
              height={113}
              className="mb-4 w-44 bg-ink p-2"
            />
            <p className="eyebrow">Published credentials</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-ink-soft">
              {credentialsPublished.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <ConfirmMark>{confirm.licenses}</ConfirmMark>
            </p>
          </div>
        </aside>
      </section>
      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10 md:px-6">
          <p className="max-w-xl font-serif text-2xl">
            If you would like product offerings from a specified manufacturer,
            the current site invites you to call the office.
          </p>
          <CtaLink href="/contact">Contact the office</CtaLink>
        </div>
      </section>
    </>
  );
}
