import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { PageHero } from "@/components/PageHero";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Website terms for Northcoast Orthopedic Sales.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of use"
        lede="The current Wix site does not publish a substantial terms page. This is a minimal website-use statement, not a new commercial contract."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 space-y-4 leading-7 text-ink-soft">
        <p>
          This website describes products and services offered by {company.legalName}.
          Content is provided for general information. It is not medical advice
          and does not create a supplier, payer, or clinical relationship by
          itself.
        </p>
        <p>
          Product availability, contract pricing, and insurance coverage must
          be confirmed with the office. Catalog names are taken from the
          current website and may change.
        </p>
        <p>
          <ConfirmMark>[CONFIRM TERMS OF USE / WEBSITE LEGAL REVIEW]</ConfirmMark>
        </p>
      </section>
    </>
  );
}
