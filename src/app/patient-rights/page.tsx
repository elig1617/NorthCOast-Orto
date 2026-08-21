import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Patient rights and responsibilities",
  description:
    "Patient rights and responsibilities referenced on the current Northcoast Orthopedic Sales website.",
};

export default function PatientRightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Patients"
        title="Patient rights and responsibilities"
        lede="The current site links a Patient Rights & Responsibilities PDF. This page holds that destination until the confirmed document is attached."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 space-y-4 leading-7 text-ink-soft">
        <p>
          NCOS publishes patient rights and responsibilities as part of its
          DME supplier relationship. The existing PDF should be reviewed and
          re-linked here.
        </p>
        <p>
          <ConfirmMark>[CONFIRM PATIENT RIGHTS & RESPONSIBILITIES DOCUMENT]</ConfirmMark>
        </p>
      </section>
    </>
  );
}
