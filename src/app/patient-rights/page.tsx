import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Patient rights and responsibilities",
  description:
    "Patient rights and responsibilities for Northcoast Orthopedic Sales DME patients.",
};

export default function PatientRightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Patients"
        title="Patient rights and responsibilities"
        lede="NCOS publishes patient rights and responsibilities as part of its DME supplier relationship."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 space-y-4 leading-7 text-ink-soft">
        <p>
          For a copy of the current Patient Rights and Responsibilities
          document, call <a href={contact.phoneHref}>{contact.phone}</a>.
        </p>
      </section>
    </>
  );
}
