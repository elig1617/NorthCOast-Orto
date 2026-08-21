export const services = [
  {
    title: "Vendor-neutral orthopedic sourcing",
    text: "NCOS sources directly with U.S. and global orthopedic manufacturers and publishes competitive contracts so clinics can keep preferred brands while using one supplier.",
  },
  {
    title: "Soft-good DME and off-the-shelf bracing",
    text: "The company distributes off-the-shelf, soft-good orthopedic bracing and supports for nearly every extremity, for commercial and government customers.",
  },
  {
    title: "Billing and administrative support",
    text: "Full-service billing is published for patients, hospitals, orthopedic practices, and pain-management or physical-therapy groups, including order-by-order billing.",
  },
  {
    title: "Nationwide fulfillment",
    text: "The current site states nationwide shipping of products with a local customer-service and billing office in northeast Ohio.",
  },
  {
    title: "Physician-prescription patient support",
    text: "NCOS publishes the ability to work directly with patients who have a physician prescription.",
  },
  {
    title: "Federal contracting",
    text: "Published VA Federal Supply Schedule and DAPA / DLA prime-vendor relationships support VA, DoD, and other government purchasing.",
  },
] as const;

export const whyChoose = [
  {
    title: "One contact, one order, one invoice",
    text: "The current capability statement describes NCOS as a single sourcing point: one order form, one invoice, and one person to call.",
  },
  {
    title: "Manufacturer-neutral",
    text: "Clinics and facilities can keep the brands physicians already use. NCOS publishes sourcing relationships across major orthopedic manufacturers.",
  },
  {
    title: "Commercial and government channels",
    text: "The same orthopedic soft-good catalog is presented for private practices, hospitals, insurers, and federal buyers.",
  },
  {
    title: "Patient-focused accreditation, as published",
    text: "NCOS is accredited by The Compliance Team Exemplary Provider Program for its patient-focused accreditation philosophy.",
  },
] as const;

export const howItWorks = [
  {
    step: "01",
    title: "Refer, prescribe, or request",
    text: "A physician, facility, government buyer, or patient with a prescription contacts NCOS by phone, referral, or quote request.",
  },
  {
    step: "02",
    title: "Source the preferred product",
    text: "Because NCOS is vendor-neutral, the office can fill from contracted catalogs or source the manufacturer the clinician prefers.",
  },
  {
    step: "03",
    title: "Ship and support",
    text: "The current site publishes nationwide shipping and a local Ohio customer-service and billing office.",
  },
  {
    step: "04",
    title: "Bill the appropriate payer",
    text: "NCOS can bill commercial insurance, Workers’ Compensation, Medicare, Medicaid, or invoice the facility or agency.",
  },
] as const;

export const nav = {
  primary: [
    {
      label: "Solutions",
      href: "/our-services",
      children: [
        { label: "What we do", href: "/our-services" },
        { label: "For patients", href: "/patients" },
        { label: "For providers", href: "/providers" },
        { label: "Hospitals & facilities", href: "/facilities" },
        { label: "Insurance & billing", href: "/insurance" },
      ],
    },
    {
      label: "Products",
      href: "/products-services",
      children: [
        { label: "All product areas", href: "/products-services" },
        { label: "Lower extremity", href: "/lower-extremity-products" },
        { label: "Upper extremity", href: "/upper-extremity-products" },
        { label: "Vendors & catalogs", href: "/productcatalogs-vendors-billing" },
        { label: "Knee", href: "/products/knee" },
        { label: "Foot & ankle", href: "/products/foot-ankle" },
        { label: "Wrist & hand", href: "/products/wrist-hand" },
        { label: "Spine", href: "/products/spine" },
      ],
    },
    {
      label: "Government",
      href: "/va-fss-contractor",
      children: [
        { label: "VA FSS contractor", href: "/va-fss-contractor" },
        { label: "FSS product listing", href: "/gsa-fss-products" },
        { label: "DoD / DAPA / DMLSS", href: "/dapa-dod-dla-dmlss-products" },
        { label: "Capability statement", href: "/capability-statement" },
      ],
    },
    { label: "About", href: "/about-us" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const redirects = [
  { source: "/services-4", destination: "/products-services" },
  { source: "/our-products", destination: "/productcatalogs-vendors-billing" },
] as const;

export const photoBriefs = {
  hero: "Intended photograph: a close, well-lit still of an off-the-shelf hinged knee brace or wrist lacer on a linen surface, no model, no logo overlay. Editorial, product-first.",
  mobility:
    "Intended photograph: a person walking outdoors with a low-profile knee brace or walking boot, cropped at torso-to-shin, natural light, no posed smile-to-camera.",
  fitting:
    "Intended photograph: clinician hands fitting a soft-good brace in a clinic room. Focus on the device and the work, not faces.",
  home: "Intended photograph: a quiet home-recovery setting with a walking boot or AFO beside a chair. No hospital-stock cliché.",
  warehouse:
    "Intended photograph: labeled orthopedic soft-goods inventory or a packing bench with braces in cartons. Communicates logistics, not retail.",
  federal:
    "Intended photograph: a VA or hospital receiving dock / materials-management counter with medical supply cartons. No flags-as-decoration.",
};
