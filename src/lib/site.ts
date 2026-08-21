export const company = {
  legalName: "Northcoast Orthopedic Sales, LLC",
  shortName: "NCOS",
  tradeName: "Northcoast Orthopedic Sales",
  tagline:
    "Single point of contact for orthopedic supplies and soft-good DME.",
  description:
    "A northeast Ohio orthopedic DME company providing vendor-neutral bracing, soft-good supports, nationwide fulfillment, and billing services for patients, providers, facilities, and government buyers.",
  url: "https://www.northcoastorthopedics.com",
  hours: {
    weekday: "8:00am – 5:00pm",
    weekend: "Closed",
  },
} as const;

/** Confirmed office contact. Ownership names and owner contact channels are omitted. */
export const contact = {
  phone: "(330) 650-2022",
  phoneHref: "tel:+13306502022",
  tollFree: "(855) 636-9400",
  tollFreeHref: "tel:+18556369400",
  fax: "(877) 496-2071",
  email: "[CONFIRM EMAIL]",
  addresses: [
    {
      label: "Office",
      line1: "1737 Georgetown Rd. Suite B",
      city: "Hudson",
      state: "OH",
      zip: "44236",
    },
    {
      label: "Billing / customer service office",
      line1: "4301 Darrow Rd., Suite 3250",
      city: "Stow",
      state: "OH",
      zip: "44224",
    },
  ],
} as const;

export function formatAddress(
  address: (typeof contact.addresses)[number],
) {
  return `${address.line1}, ${address.city}, ${address.state} ${address.zip}`;
}

/**
 * Only fields that are still waiting on a value.
 * Ownership and former staff contact channels are not collected on the site.
 */
export const confirm = {
  email: contact.email,
} as const;

export const contracts = {
  fss: {
    number: "36F79720D0126",
    schedule: "65 II A — Medical Equipment and Supplies",
    fsc: "6515",
    fscGroup: "FSC Group 65, Part II, Section A",
    publishedPeriod: "May 1, 2020 through April 30, 2025",
    itemCount: "3,000+ items as published on the current VA FSS page",
    sins: [
      { code: "A-25A", name: "Splints" },
      { code: "A-25B", name: "Braces" },
      { code: "A-25C", name: "Immobilizers / Soft Goods" },
      { code: "A-25E", name: "Supports" },
      { code: "A-25F", name: "Cervical Collars" },
      { code: "A-25G", name: "Other Orthopedic / Surgical Supports" },
    ],
  },
  dapa: {
    number: "SP0200-21-H-0009",
    primeVendor: "Owens & Minor",
    supplierNumber: "4660",
    itemCount: "Over 1,000+ contracted items available on DMLSS, as published",
  },
  identifiers: {
    sam: "CJ4RWBC8AEW9",
    duns: "027753075",
    cage: "873M2",
    naics: "339113, 423450",
    size: "Small business, as published",
    samStatus: "SAM registered, as published",
  },
} as const;

export const credentialsPublished = [
  "Accredited by The Compliance Team Exemplary Provider Program for its patient-focused accreditation philosophy",
  "HIPAA compliant / HIPAA certified, as published on the current site",
  "DME preferred in-network provider for the majority of insurance providers, as published",
  "Participating provider for Workers’ Compensation, Medicare, and Medicaid, as published",
  "Ability to work directly with patients with a physician prescription",
  "15+ years of industry experience, as published on the capability statement",
] as const;

export const manufacturers = {
  primary: [
    { name: "Medical Specialties (MedSpec)", note: "Primary vendor listed on the current site" },
    { name: "Corflex / Corflex Global", note: "Primary vendor listed on the current site" },
    { name: "medi", note: "Primary vendor listed on the current site" },
    { name: "New Options Sports", note: "Primary vendor listed on the current site" },
  ],
  alsoRepresented: [
    { name: "Össur", note: "Named on the About page and services page" },
    { name: "RCAI", note: "Named on the current Products / Services page" },
  ],
  sourcingContracts: [
    { name: "DonJoy", note: "Sourcing contract named on the current services page" },
    { name: "Breg", note: "Sourcing contract named on the current services page" },
    { name: "Össur", note: "Sourcing contract named on the current services page" },
    { name: "Townsend", note: "Sourcing contract named on the current services page" },
  ],
} as const;

export const audiences = [
  {
    id: "patients",
    title: "Patients",
    href: "/patients",
    summary:
      "NCOS can work directly with patients who have a physician prescription, including product fulfillment, insurance billing, and invoice questions.",
  },
  {
    id: "providers",
    title: "Physicians and referral sources",
    href: "/providers",
    summary:
      "Orthopedic practices, pain management groups, and physical therapy offices use NCOS as a vendor-neutral sourcing and billing partner.",
  },
  {
    id: "facilities",
    title: "Hospitals and healthcare facilities",
    href: "/facilities",
    summary:
      "Hospitals, emergency departments, and healthcare organizations can source orthopedic soft goods through one contact and one invoice.",
  },
  {
    id: "government",
    title: "VA, DoD, and government buyers",
    href: "/va-fss-contractor",
    summary:
      "NCOS holds a published VA Federal Supply Schedule contract and a published DAPA / DLA prime-vendor relationship for federal orthopedic purchasing.",
  },
] as const;
