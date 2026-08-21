import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medicare DMEPOS supplier standards",
  description:
    "Medicare DMEPOS supplier standards for Northcoast Orthopedic Sales.",
};

export default function DmeposPage() {
  return (
    <>
      <PageHero
        eyebrow="Patients"
        title="Medicare DMEPOS supplier standards"
        lede="Medicare DMEPOS suppliers are required to meet supplier standards. NCOS makes this information available to patients."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 space-y-4 leading-7 text-ink-soft">
        <p>
          For a copy of the current Medicare DMEPOS supplier standards, call{" "}
          <a href={contact.phoneHref}>{contact.phone}</a>.
        </p>
      </section>
    </>
  );
}
