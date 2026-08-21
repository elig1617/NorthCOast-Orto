import Link from "next/link";
import { Logo } from "@/components/Logo";
import { company, contact, contracts, formatAddress } from "@/lib/site";

const productLinks = [
  { href: "/products/knee", label: "Knee" },
  { href: "/products/foot-ankle", label: "Foot & ankle" },
  { href: "/products/wrist-hand", label: "Wrist & hand" },
  { href: "/products/shoulder", label: "Shoulder" },
  { href: "/products/elbow", label: "Elbow" },
  { href: "/products/spine", label: "Spine" },
  { href: "/products/er-soft-goods", label: "ER soft goods" },
  { href: "/productcatalogs-vendors-billing", label: "Vendors & catalogs" },
];

const companyLinks = [
  { href: "/about-us", label: "About NCOS" },
  { href: "/our-services", label: "Services" },
  { href: "/capability-statement", label: "Capability statement" },
  { href: "/contact", label: "Contact" },
];

const patientLinks = [
  { href: "/patients", label: "Patient resources" },
  { href: "/insurance", label: "Insurance & billing" },
  { href: "/patient-rights", label: "Rights & responsibilities" },
  { href: "/medicare-dmepos-standards", label: "Medicare DMEPOS standards" },
  { href: "/privacy", label: "Notice of privacy practices" },
];

const providerLinks = [
  { href: "/providers", label: "Refer a patient" },
  { href: "/facilities", label: "Hospitals & facilities" },
  { href: "/va-fss-contractor", label: "VA / FSS" },
  { href: "/dapa-dod-dla-dmlss-products", label: "DoD / DAPA" },
  { href: "/contact", label: "Institutional purchasing" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-[#e8e2d6]">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo invert />
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#cfc6b4]">
              {company.legalName} is a vendor-neutral orthopedic DME supplier and
              billing partner serving commercial and government customers.
            </p>
            <address className="mt-5 text-sm not-italic leading-6">
              <div>{formatAddress()}</div>
              <div className="mt-2">
                Office{" "}
                <a href={contact.phoneHref} className="text-[#e8e2d6]">
                  {contact.phone}
                </a>
              </div>
              <div>
                Toll-free{" "}
                <a href={contact.tollFreeHref} className="text-[#e8e2d6]">
                  {contact.tollFree}
                </a>
              </div>
              <div>
                Email{" "}
                <a href={contact.emailHref} className="text-[#e8e2d6]">
                  {contact.email}
                </a>
              </div>
              <div>Fax {contact.fax}</div>
            </address>
            <p className="mt-4 font-mono text-[0.68rem] tracking-wide text-[#9c917c]">
              FSS {contracts.fss.number}
              <br />
              DAPA {contracts.dapa.number}
            </p>
          </div>
          <FooterCol title="Products" links={productLinks} />
          <FooterCol title="Company" links={companyLinks} />
          <FooterCol title="Patients" links={patientLinks} />
          <FooterCol title="Providers & buyers" links={providerLinks} />
        </div>
        <div className="mt-12 border-t border-white/15 pt-6 text-xs leading-6 text-[#b8ae9c]">
          <p>
            Information on this website is for general product and service
            description only. It is not medical advice. Durable medical equipment
            is typically provided under a physician prescription when required.
            Do not submit protected health information through public website
            forms.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="text-[#e8e2d6]">
              Privacy
            </Link>
            <Link href="/terms" className="text-[#e8e2d6]">
              Terms
            </Link>
            <Link href="/accessibility" className="text-[#e8e2d6]">
              Accessibility
            </Link>
            <Link href="/medicare-dmepos-standards" className="text-[#e8e2d6]">
              DMEPOS standards
            </Link>
          </div>
          <p className="mt-4">© {new Date().getFullYear()} {company.legalName}.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="eyebrow !text-[#9c917c]">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[#e8e2d6] no-underline hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
