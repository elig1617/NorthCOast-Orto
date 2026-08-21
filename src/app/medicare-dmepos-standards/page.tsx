import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Medicare DMEPOS supplier standards",
  description:
    "Medicare DMEPOS supplier standards referenced on the current Northcoast Orthopedic Sales patient page.",
};

export default function DmeposPage() {
  return (
    <>
      <PageHero
        eyebrow="Patients"
        title="Medicare DMEPOS supplier standards"
        lede="The current patient page links Medicare DMEPOS Supplier Standards. This redesign keeps the URL purpose and does not invent a substitute legal posting."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 space-y-4 leading-7 text-ink-soft">
        <p>
          Medicare durable medical equipment, prosthetics, orthotics, and
          supplies (DMEPOS) suppliers are required to meet supplier standards.
          The current NCOS website provides this document to patients.
        </p>
        <p>
          Attach the current CMS / supplier-standards document before launch.
          Do not treat this page as the official posting until that file is
          confirmed.
        </p>
        <p>
          <ConfirmMark>[CONFIRM MEDICARE DMEPOS STANDARDS DOCUMENT]</ConfirmMark>
        </p>
      </section>
    </>
  );
}
