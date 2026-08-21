import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { PageHero } from "@/components/PageHero";
import { confirm } from "@/lib/site";

export const metadata: Metadata = {
  title: "Information to confirm before launch",
  description:
    "Remaining details that must be provided before the redesigned NCOS website launches.",
  robots: { index: false, follow: false },
};

export default function ConfirmPage() {
  return (
    <>
      <PageHero
        eyebrow="Pre-launch"
        title="Information still needed"
        lede="Ownership names and former owner contact channels have been removed. Office phone, fax, addresses, hours, credentials, and government identifiers now use the existing published values."
      />
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <ol className="divide-y divide-line border-y border-line">
          <li className="grid gap-2 py-4 md:grid-cols-[2rem_1fr]">
            <span className="font-mono text-xs text-slate">01</span>
            <div>
              <p>
                <ConfirmMark>{confirm.email}</ConfirmMark>
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                The emails on the current website are no longer valid. A
                replacement office email has not been provided yet. Former
                addresses will not be shown on the public site.
              </p>
            </div>
          </li>
        </ol>
      </section>
    </>
  );
}
