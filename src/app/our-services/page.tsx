import type { Metadata } from "next";
import { ConfirmMark } from "@/components/ConfirmMark";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { services, whyChoose } from "@/lib/content";
import { confirm } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our services",
  description:
    "Orthopedic sourcing, soft-good DME, nationwide shipping, and billing services from Northcoast Orthopedic Sales.",
};

const listedOfferings = [
  "Pre- and post-operative bracing",
  "Lumbar and neck support",
  "Hand and wrist bracing",
  "Shoulder",
  "Knee",
  "Foot and ankle stabilizers and boots",
  "Bone / spine stimulators — [CONFIRM WHETHER STILL OFFERED]",
  "Ability to work directly with patients with a physician prescription",
  "Low-cost ER orthopedic supply (crutches, ankle stirrups, hand and wrist splints, and similar items)",
  "DME preferred in-network provider, as published",
  "Manufacturer-neutral sourcing contracts with major manufacturers",
  "Local customer service and billing office (Stow, OH is currently published)",
  "Nationwide shipping of products",
  "Supply and bill for Workers’ Comp related injuries",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Supplying orthopedic product needs, then handling the paperwork."
        lede="The current services page frames NCOS around product breadth, manufacturer-neutral sourcing, local billing support, and nationwide shipping."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="border-t border-line pt-4">
              <h2 className="font-serif text-2xl">{service.title}</h2>
              <p className="mt-3 leading-7 text-ink-soft">{service.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-t border-line bg-[#efe8d9]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
          <div>
            <p className="eyebrow">Published service list</p>
            <h2 className="mt-3 font-serif text-3xl">What the current site says NCOS supplies.</h2>
            <ul className="mt-6 space-y-2 text-ink-soft">
              {listedOfferings.map((item) => (
                <li key={item} className="border-b border-line/70 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Why choose us</p>
            <div className="mt-4 space-y-6">
              {whyChoose.map((item) => (
                <article key={item.title}>
                  <h3 className="font-serif text-2xl">{item.title}</h3>
                  <p className="mt-2 leading-7 text-ink-soft">{item.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm">
              Location currently listed as Stow, OH on this page.{" "}
              <ConfirmMark>{confirm.address}</ConfirmMark>
            </p>
            <div className="mt-6">
              <CtaLink href="/products-services">Browse product areas</CtaLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
