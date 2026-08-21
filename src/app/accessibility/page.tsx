import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { PageHero } from "@/components/PageHero";
import { confirm } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility statement for the Northcoast Orthopedic Sales website.",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Accessibility"
        lede="This website is designed toward WCAG 2.1 AA: semantic structure, keyboard access, visible focus, and contrast appropriate to the brand palette."
      />
      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6 space-y-4 leading-7 text-ink-soft">
        <p>
          If you have trouble using this site, contact the office. We will work
          to provide the information in another format.
        </p>
        <p>
          Accessibility contact: <ConfirmMark>{confirm.email}</ConfirmMark> or{" "}
          <ConfirmMark>{confirm.phone}</ConfirmMark>
        </p>
      </section>
    </>
  );
}
