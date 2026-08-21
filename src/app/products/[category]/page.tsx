import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmMark } from "@/components/ConfirmMark";
import { CtaLink } from "@/components/CtaLink";
import { PageHero } from "@/components/PageHero";
import { getCategory, productCategories } from "@/lib/products";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return productCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.summary,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <PageHero
        eyebrow={category.bodyRegion}
        title={category.name}
        lede={category.summary}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_18rem] md:px-6">
        <div>
          <div className="grid gap-8 md:grid-cols-3">
            <InfoBlock title="Needs this category often addresses" items={category.needs} />
            <InfoBlock title="Who typically uses these products" items={category.who} />
            <div>
              <h2 className="font-serif text-xl">How to obtain them</h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{category.obtain}</p>
              <h3 className="mt-6 font-serif text-xl">Insurance considerations</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{category.insuranceNote}</p>
            </div>
          </div>
          <h2 className="mt-12 font-serif text-2xl">Items from the current website catalog</h2>
          <p className="mt-2 text-sm text-slate">
            This is not an e-commerce storefront. Availability, sizing, and
            contract pricing should be confirmed with the office. This list is
            not medical advice.
          </p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {category.products.map((product) => (
              <li key={product} className="py-3 text-sm md:text-base">
                {product}
              </li>
            ))}
          </ul>
        </div>
        <aside className="space-y-4">
          <div className="border border-line bg-white p-5">
            <p className="eyebrow">Next step</p>
            <p className="mt-3 font-serif text-2xl">Ask about a specific item or brand.</p>
            <div className="mt-5 flex flex-col gap-2">
              <CtaLink href="/contact">Request a quote</CtaLink>
              <CtaLink href="/providers" variant="secondary">
                Send a referral
              </CtaLink>
            </div>
            <p className="mt-4 text-xs text-slate">
              Prescription requirements vary by item and payer.{" "}
              <ConfirmMark>[CONFIRM REFERRAL INTAKE PROCESS]</ConfirmMark>
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-serif text-xl">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-soft">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
