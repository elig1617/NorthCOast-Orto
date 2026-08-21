import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { ConfirmNote } from "@/components/ConfirmMark";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { SpecTable } from "@/components/SpecTable";
import { confirm, contracts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Capability statement",
  description:
    "Northcoast Orthopedic Sales capability statement for commercial and government orthopedic DME sourcing.",
};

export default function CapabilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Capability statement"
        title="A single sourcing point for ordering, billing, and patient needs."
        lede="The current capability statement describes NCOS as more than a single orthopedic provider: one order form, one invoice, and one person to call."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 md:px-6">
        <article className="space-y-5 leading-7 text-ink-soft">
          <p>
            Northcoast Orthopedic Sales is an Ohio family business with years of
            industry experience. It represents a variety of U.S. and global
            orthopedic manufacturers, which the current document says allows
            competitive pricing, brand flexibility, and access to newer
            orthopedic equipment from one source.
          </p>
          <p>
            Qualifications published on the current page include
            manufacturer-neutral sourcing, nationwide shipping, a private
            customer-service and billing office in Stow, Ohio, preferred
            in-network DME status for the majority of insurances, and a single
            sourcing point for orthopedic needs.
          </p>
          <p>
            Credentials currently listed: The Compliance Team’s Exemplary
            Provider Program; 15+ years of industry experience; HIPAA certified;
            ability to work directly with patients with a physician prescription.
          </p>
          <p>
            Customers named on the document include state and federal agencies
            (including VA), doctors and hospitals, sports-related injuries, pain
            management, and physical therapy. Billing services are listed for
            Workers’ Comp, the majority of insurance providers, and Medicare
            and Medicaid.
          </p>
          <p>
            The differentiators section describes a five-person team focused on
            a stress-free ordering and billing experience.{" "}
            <ConfirmMark>[CONFIRM CURRENT TEAM SIZE]</ConfirmMark>
          </p>
        </article>
        <div className="space-y-5">
          <SpecTable
            rows={[
              { label: "DUNS", value: contracts.identifiers.duns },
              { label: "CAGE", value: contracts.identifiers.cage },
              { label: "NAICS", value: contracts.identifiers.naics },
              { label: "SAM UEI", value: contracts.identifiers.sam },
              { label: "FSS", value: contracts.fss.number },
              { label: "DAPA", value: contracts.dapa.number },
            ]}
          />
          <ConfirmNote>
            The PDF currently lists Dave Farrell at the Stow address, with
            office, toll-free, mobile, and fax numbers. Toll-free is listed as
            (855) 636-9400 on the contact page and (855) 666-9400 on the
            capability page.{" "}
            <ConfirmMark>{confirm.phone}</ConfirmMark>{" "}
            <ConfirmMark>{confirm.ownership}</ConfirmMark>
          </ConfirmNote>
          <CtaLink href="/contact">Request the current PDF</CtaLink>
        </div>
      </section>
    </>
  );
}
