import Image from "next/image";
import Link from "next/link";
import { BodyMap } from "@/components/BodyMap";
import { ConfirmMark } from "@/components/ConfirmMark";
import { ConfirmNote } from "@/components/ConfirmMark";
import { CtaLink } from "@/components/CtaLink";
import { FigureNote } from "@/components/FigureNote";
import { howItWorks, photoBriefs, whyChoose } from "@/lib/content";
import { productCategories } from "@/lib/products";
import {
  audiences,
  company,
  confirm,
  contracts,
  credentialsPublished,
  manufacturers,
} from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div>
            <p className="eyebrow">
              Durable medical equipment · Northeast Ohio · Nationwide shipping
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-[2.4rem] leading-[1.08] tracking-tight md:text-6xl">
              Single-source orthopedic bracing, soft-good DME, and billing.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
              {company.tradeName} is a vendor-neutral orthopedic supplier. We
              source the brands physicians already use, ship nationwide, and
              bill patients, practices, hospitals, and government buyers from
              one office.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href="/contact">Request a quote</CtaLink>
              <CtaLink href="/providers" variant="secondary">
                Refer a patient
              </CtaLink>
              <CtaLink href="/va-fss-contractor" variant="ghost">
                Government contracting
              </CtaLink>
            </div>
          </div>
          <FigureNote caption={photoBriefs.hero} tall />
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-px bg-line px-0 md:grid-cols-4">
          <TrustCell
            label="VA FSS"
            value={contracts.fss.number}
            note={contracts.fss.periodConfirm}
          />
          <TrustCell
            label="DoD / DAPA"
            value={contracts.dapa.number}
            note={contracts.dapa.confirm}
          />
          <TrustCell
            label="Accreditation"
            value="Exemplary Provider"
            note={confirm.licenses}
          />
          <TrustCell
            label="Model"
            value="Vendor-neutral"
            note="One invoice, preferred brands"
          />
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Who we are</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                An orthopedic DME company, not a retail supply store.
              </h2>
            </div>
            <div className="prose-ncos space-y-4 text-ink-soft leading-7">
              <p>
                NCOS is a northeast Ohio family business that sources directly
                with U.S. and global orthopedic manufacturers. The current site
                describes the mission as a single sourcing point for orthopedic
                product needs — saving time and consolidating paperwork.
              </p>
              <p>
                We supply off-the-shelf, soft-good orthopedic bracing and
                supports for commercial and government customers, and we publish
                our own billing and customer-service operation.
              </p>
              <p>
                Ownership and office location need to be confirmed before
                launch: <ConfirmMark>{confirm.ownership}</ConfirmMark>{" "}
                <ConfirmMark>{confirm.address}</ConfirmMark>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-[#efe8d9]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <p className="eyebrow">DME solutions</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl md:text-4xl">
            Bracing and supports organized the way clinicians think.
          </h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            The current website lists pre- and post-operative bracing, lumbar
            and neck support, hand and wrist, shoulder, knee, foot and ankle,
            bone/spine stimulators, and low-cost ER orthopedic supply.
          </p>
          <div className="mt-10">
            <BodyMap />
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <p className="eyebrow">Who we serve</p>
          <h2 className="mt-3 font-serif text-3xl">
            Patients, referral sources, facilities, and federal buyers.
          </h2>
          <div className="mt-8 grid gap-px bg-line md:grid-cols-2">
            {audiences.map((audience) => (
              <Link
                key={audience.id}
                href={audience.href}
                className="block bg-paper p-6 no-underline hover:bg-white"
              >
                <p className="font-serif text-2xl">{audience.title}</p>
                <p className="mt-3 text-sm leading-6 text-ink-soft">
                  {audience.summary}
                </p>
                <p className="mt-4 text-sm text-red">Continue →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <p className="eyebrow">Why customers use NCOS</p>
          <h2 className="mt-3 font-serif text-3xl">Meaningful differences, as published.</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {whyChoose.map((item) => (
              <article key={item.title} className="border-t border-line pt-4">
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="mt-2 text-ink-soft leading-7">{item.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-[12rem_1fr] md:items-start">
            <Image
              src="/brand/exemplary-provider.png"
              alt="Exemplary Provider accredited by The Compliance Team"
              width={481}
              height={113}
              className="w-48 bg-ink p-2"
            />
            <ul className="space-y-2 text-sm text-ink-soft">
              {credentialsPublished.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-red" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured product areas</p>
              <h2 className="mt-3 font-serif text-3xl">From the current catalog.</h2>
            </div>
            <CtaLink href="/products-services" variant="ghost">
              View all product areas
            </CtaLink>
          </div>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {productCategories.slice(0, 6).map((category) => (
              <Link
                key={category.slug}
                href={category.href}
                className="grid gap-2 py-4 no-underline hover:bg-white md:grid-cols-[10rem_1fr_auto] md:items-baseline"
              >
                <span className="font-mono text-[0.72rem] uppercase tracking-wider text-slate">
                  {category.bodyRegion}
                </span>
                <span>
                  <span className="font-serif text-xl">{category.name}</span>
                  <span className="mt-1 block text-sm text-ink-soft">
                    {category.summary}
                  </span>
                </span>
                <span className="text-sm text-red">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-forest text-[#e8efe9]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6">
          <div>
            <p className="eyebrow !text-[#b8cfc6]">Healthcare partnerships</p>
            <h2 className="mt-3 font-serif text-3xl text-white">
              Built for physicians, facilities, insurers, and agencies.
            </h2>
            <p className="mt-4 leading-7 text-[#cfe0d8]">
              The current business supplies doctors and hospitals, orthopedic
              practices, pain management, physical therapy, sports-related
              injuries, Workers’ Compensation cases, and state and federal
              agencies including the VA.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaLink href="/providers" variant="inverse">
                Provider intake
              </CtaLink>
              <CtaLink href="/facilities" variant="ghost">
                Facility purchasing
              </CtaLink>
            </div>
          </div>
          <div>
            <p className="eyebrow !text-[#b8cfc6]">How it works</p>
            <ol className="mt-4 space-y-4">
              {howItWorks.map((item) => (
                <li key={item.step} className="grid grid-cols-[3rem_1fr] gap-3">
                  <span className="font-mono text-sm text-[#9cc4b4]">{item.step}</span>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#cfe0d8]">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6">
          <div>
            <p className="eyebrow">Insurance / coverage</p>
            <h2 className="mt-3 font-serif text-3xl">Billing is part of the service.</h2>
            <p className="mt-4 leading-7 text-ink-soft">
              The current website states that NCOS is an in-network or preferred
              DME provider for the majority of insurance providers, and a
              participating provider for Workers’ Compensation, Medicare, and
              Medicaid. It also publishes HIPAA-compliant billing operations.
            </p>
            <p className="mt-4">
              <ConfirmMark>{confirm.insurance}</ConfirmMark>
            </p>
            <div className="mt-6">
              <CtaLink href="/insurance" variant="secondary">
                Insurance & billing
              </CtaLink>
            </div>
          </div>
          <div>
            <p className="eyebrow">Institutional / government</p>
            <h2 className="mt-3 font-serif text-3xl">
              VA FSS and DAPA channels, as published.
            </h2>
            <p className="mt-4 leading-7 text-ink-soft">
              Federal buyers can order against FSS contract {contracts.fss.number}{" "}
              and DAPA {contracts.dapa.number} through Owens & Minor, supplier
              #4660. Product counts and periods are taken from the current site
              and must be verified.
            </p>
            <p className="mt-4">
              <ConfirmMark>{confirm.government}</ConfirmMark>
            </p>
            <div className="mt-6">
              <CtaLink href="/va-fss-contractor" variant="secondary">
                Government contracting
              </CtaLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <p className="eyebrow">Manufacturers</p>
          <h2 className="mt-3 font-serif text-3xl">Preferred brands, or the brand you already use.</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <ManufacturerCol
              title="Primary vendors on the current site"
              items={manufacturers.primary.map((item) => item.name)}
            />
            <ManufacturerCol
              title="Also named"
              items={manufacturers.alsoRepresented.map((item) => item.name)}
            />
            <ManufacturerCol
              title="Sourcing contracts named on Services"
              items={manufacturers.sourcingContracts.map((item) => item.name)}
            />
          </div>
          <p className="mt-6 text-sm text-slate">
            Additional access to orthopedic suppliers is available. Call for
            current vendor status — do not treat this list as exclusive.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[1fr_1fr] md:px-6">
          <div>
            <p className="eyebrow">Contact / referral</p>
            <h2 className="mt-3 font-serif text-4xl">
              Patients, providers, facilities, and buyers should be able to reach the office in one step.
            </h2>
            <p className="mt-4 text-ink-soft leading-7">
              Current published office hours are Monday–Friday {company.hours.weekday}.
              Saturday and Sunday are listed as closed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaLink href="/contact">Contact NCOS</CtaLink>
              <CtaLink href="/patients" variant="ghost">
                Patient billing
              </CtaLink>
            </div>
          </div>
          <ConfirmNote title="Information to confirm before launch">
            <p>
              Address, phone, fax, email, ownership, leadership, licenses,
              accreditation, insurance participation, and government contract
              periods are marked throughout the site. See the full checklist on{" "}
              <Link href="/confirm-before-launch">Information to confirm</Link>.
            </p>
          </ConfirmNote>
        </div>
      </section>
    </>
  );
}

function TrustCell({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="bg-white px-5 py-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-mono text-sm">{value}</p>
      <p className="mt-2 text-xs text-slate">{note}</p>
    </div>
  );
}

function ManufacturerCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-3 space-y-2 text-ink-soft">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
