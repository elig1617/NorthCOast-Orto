export type ProductCategory = {
  slug: string;
  name: string;
  href: string;
  bodyRegion: string;
  summary: string;
  needs: string[];
  who: string[];
  obtain: string;
  insuranceNote: string;
  products: string[];
};

export const productCategories: ProductCategory[] = [
  {
    slug: "knee",
    name: "Knee bracing",
    href: "/products/knee",
    bodyRegion: "Lower extremity",
    summary:
      "Functional, hinged, post-operative, OA, patella-stabilizing, and sleeve-style knee supports from the current NCOS catalog.",
    needs: [
      "Post-operative protection",
      "Osteoarthritis unloading",
      "Sports and rehab stabilization",
      "Patellar tracking support",
    ],
    who: [
      "Orthopedic surgery patients",
      "Sports medicine and rehab patients",
      "Pain management and physical therapy",
    ],
    obtain:
      "Request a quote, send a referral, or call the office. Many items can be sourced with a physician prescription.",
    insuranceNote:
      "NCOS publishes that it bills as an in-network DME provider for most major insurers, Workers’ Compensation, Medicare, and Medicaid. Coverage should be verified on each order.",
    products: [
      'OAB: Pull-on OA Brace',
      'OAW: Wrap Around OA Brace with Patella Buttress',
      "K12-NOS: \"Over/Under\" Pull-On Knee Brace (Neoprene)",
      'KC12-NOS: "Over/Under" Pull-On Knee Brace (Koolflex)',
      'K42-HT: Sports "Rehab Knee" Brace with ROM Hinge',
      'K64-E: Knee Mate Wrap Around with Stays',
      'KC64-SL: "Super-Lite" Wrap-Around Knee Brace',
      "K64-PC: Knee Mate Wrap-Around with Hinges (Neoprene)",
      "KC64-PC: Knee Mate Wrap-Around with Hinges (Koolflex)",
      "K64-MP / KC64-MP: Knee Mate Wrap-Around with Multi-Positional Hinges",
      'K64-NOS / KC64-NOS: "Knee Mate" Wrap-Around with Hinges',
      "K64-HT / KC64-HT: Knee Mate Wrap-Around with Hinges",
      'K65-NOS / KC65-NOS: 17" Knee Mate',
      'K65-HT / KC65-HT: 17" Knee Mate with ROM Hinge',
      'K67-PC: "The Hybrid" Knee Brace',
      'K67-MP / KC67-MP: "The Hybrid" Knee Brace with Multi-Position Hinges',
      'K67-HT / KC67-HT: 13in. "Hybrid" Knee Brace',
      'KC67-NOS: 13 in. "Hybrid" Knee Brace',
      'KC68-NOS: 17 in. "Hybrid" Knee Brace',
      'K197: Hinged "SharkTrak" Wrap-Around Patella Stabilizer',
      "K9 Series Knee Sleeves",
      "K10: Perforated Under Sleeve for Functional Braces",
      "K18: Osgood Schlater Support",
      "K4-F: Patella Fan Knee Stabilizer Diamond X Theory",
      'K34-PC "SuperLite"',
      'K45-MP:"Swedish" Knee Brace',
      "K1-U-MP",
      "K2-U-MP",
      "KC2-U-MP",
    ],
  },
  {
    slug: "foot-ankle",
    name: "Foot, ankle, and walking supports",
    href: "/products/foot-ankle",
    bodyRegion: "Lower extremity",
    summary:
      "Ankle stabilizers, AFOs, Multi-Podus / MPO systems, walking boots, plantar fasciitis supports, and related foot orthoses.",
    needs: [
      "Ankle stabilization after sprain or surgery",
      "Contracture and pressure management",
      "Non-ambulatory and ambulatory foot positioning",
      "Walking-boot and plantar support needs",
    ],
    who: [
      "Emergency and post-acute patients",
      "Orthopedic and podiatry referrals",
      "Hospital and long-term care settings",
      "Federal facility buyers sourcing AFO / MPO items",
    ],
    obtain:
      "Call or submit a quote or referral. Pediatric and specialty foot items are available through the current catalog.",
    insuranceNote:
      "Coverage depends on the item, diagnosis, and payer. NCOS publishes billing support for commercial insurance, Workers’ Comp, Medicare, and Medicaid. Coverage should be verified on each order.",
    products: [
      "BABY FOOT ORTHOSIS",
      "MPO 2000 W/O TRANSFER ATTACHMENT",
      "MPO 2000 SHORTBACK W/TRANSFER ATTACHMENT",
      "MPO 2000 ACTIVE W/AMBULATORY ATTACHMENT",
      "MPO ACTIVE W/AMBULATORY ATTACHMENT",
      "MULTI PODUS SYSTEM",
      "DORSI FLEX MULTI PODUS W/OW",
      "MPO BURN UNIT",
      "CORRXIT AFO WITH TRANSFER ATTACHMENT - NON-AMBULATORY",
      "A30: Wooten (5 in 1) Ankle Orthosis",
      "A50: Cooper II Ankle Stabilizer",
      'A10: "Replay" Ankle Stabilizer with Speed Lacers',
      "EVO Ankle Stabilizer (fits left or right) (Black)",
      "EVO Ankle Stabilizer (fits left or right) (White)",
      "EVO Quatro Ankle Stabilizer (fits left or right) (black)",
      "EVO Quatro Ankle Stabilizer (fits left or right) (white)",
      "EVO Speed Lacer (fits left or right) (black)",
      "EVO Speed Lacer Hinge (fits left or right) (black)",
    ],
  },
  {
    slug: "wrist-hand",
    name: "Wrist, hand, and thumb supports",
    href: "/products/wrist-hand",
    bodyRegion: "Upper extremity",
    summary:
      "Wrist lacer supports, thumb spicas, combined wrist-and-thumb orthoses, and related hand bracing from the current catalog.",
    needs: [
      "Wrist immobilization and support",
      "Thumb and CMC stabilization",
      "Post-injury and post-operative protection",
      "Low-cost emergency-room wrist and hand splints",
    ],
    who: [
      "Orthopedic and hand clinics",
      "Emergency departments",
      "Occupational and physical therapy",
      "Patients with a physician prescription",
    ],
    obtain:
      "NCOS can source preferred brands or supply from the published catalog. Contact the office for sizing and availability.",
    insuranceNote:
      "Many wrist and hand supports are billed through DME when medically necessary and prescribed. Coverage should be verified on each order.",
    products: [
      "W1: Action Wrist Support",
      "W11: Universal Wrist & Thumb Support",
      "W20 / W28: Universal Size Wrist Support",
      "W47: Wrist & Thumb Support",
      "W56: Wrist & Thumb Neoprene Support",
      "W57: Thumb and Wrist Support",
      'W59: Universal "Boomerang" Wrist Support',
      'WC32 / WC33: KOOLFLEX 8"-10" WRIST SUPPORT',
      'WC30: "Switch Hitter" Universal Left or Right Thumb Spica & Wrist Orthosis',
      'Wrist Lacer II Wrist Support Suede/Polypro Felt (8") (black) (Left)',
      'Wrist Lacer II Wrist Support Suede/Polypro Felt (8") (black) (Right)',
      'Universal Wrist Lacer II Wrist Support (8") (black)',
      'Wrist Lacer II 10.5" Wrist Support (black) (left)',
      'Wrist Lacer II 10.5" Wrist Support (black) (Right)',
      'Universal Wrist Lacer II 10.5" Wrist Support (black)',
      'Wrist Lacer Wrist Support Suede/Polypro Felt (8") (black)',
      'Tripod Wrist Lacer (8") (black)',
      'Tripod Wrist Lacer (8") (black), Universal',
    ],
  },
  {
    slug: "shoulder",
    name: "Shoulder, slings, and clavicle",
    href: "/products/shoulder",
    bodyRegion: "Upper extremity",
    summary:
      "Shoulder immobilizers, slings, and clavicle supports for pre- and post-operative orthopedic care.",
    needs: [
      "Post-operative shoulder immobilization",
      "Fracture and dislocation support",
      "Clavicle stabilization",
    ],
    who: [
      "Orthopedic surgery practices",
      "Hospitals and emergency departments",
      "Sports medicine",
    ],
    obtain:
      "Call for current sling, immobilizer, and clavicle inventory. NCOS is manufacturer-neutral and can source preferred brands.",
    insuranceNote:
      "Coverage should be verified on each order for specific HCPCS items and payer rules.",
    products: [
      "Shoulder slings — contact for current models",
      "Shoulder immobilizers — contact for current models",
      "Clavicle supports — contact for current models",
    ],
  },
  {
    slug: "elbow",
    name: "Elbow bracing",
    href: "/products/elbow",
    bodyRegion: "Upper extremity",
    summary:
      "Elbow braces, immobilizers, sleeves, post-op elbow supports, tennis-elbow straps, and cubital-tunnel supports.",
    needs: [
      "Lateral and medial epicondylitis support",
      "Post-operative elbow protection",
      "Cubital tunnel positioning",
    ],
    who: [
      "Orthopedic and sports medicine clinics",
      "Physical therapy",
      "Occupational medicine / Workers’ Comp",
    ],
    obtain: "Request a quote or preferred manufacturer. Vendor-neutral sourcing is available.",
    insuranceNote:
      "Coverage should be verified on each order before quoting a specific elbow item.",
    products: [
      "Elbow braces — contact for current models",
      "Elbow immobilizers — contact for current models",
      "Elbow sleeves — contact for current models",
      "Post-op elbow — contact for current models",
      "Tennis elbow supports — contact for current models",
      "Cubital tunnel supports — contact for current models",
    ],
  },
  {
    slug: "spine",
    name: "Spine, lumbar, cervical, and thoracic",
    href: "/products/spine",
    bodyRegion: "Spine and trunk",
    summary:
      "Lumbar and neck supports, cervical collars, thoracic supports, abdominal and rib supports, and TLSO items listed on the current catalog.",
    needs: [
      "Lumbar and cervical support",
      "Post-operative spinal bracing",
      "Rib and abdominal support",
    ],
    who: [
      "Spine and orthopedic practices",
      "Pain management",
      "Hospital discharge planning",
      "VA / federal buyers under published SINs for cervical collars and supports",
    ],
    obtain:
      "NCOS lists a TLSO (short front with sternal attachment) in the current catalog and sources additional spinal supports through manufacturer relationships.",
    insuranceNote:
      "Spinal orthoses often require documentation and a prescription. Coverage should be verified on each order.",
    products: [
      "TLSO - Short Front w/ Sternal Attachment",
      "Back supports — contact for current models",
      "Cervical collars and neck supports — contact for current models",
      "Lumbar supports — contact for current models",
      "Thoracic supports — contact for current models",
      "Abdominal and rib supports — contact for current models",
    ],
  },
  {
    slug: "hip",
    name: "Hip supports",
    href: "/products/hip",
    bodyRegion: "Lower extremity",
    summary:
      "Hip supports as listed on the current Products / Services taxonomy. Contact the office for current models and sizing.",
    needs: ["Post-operative hip support", "Abduction and stabilization needs as prescribed"],
    who: ["Orthopedic practices", "Hospitals", "Rehabilitation settings"],
    obtain: "Call or request a quote. NCOS can source preferred brands.",
    insuranceNote: "Coverage should be verified on each order.",
    products: ["Hip supports — contact for current models"],
  },
  {
    slug: "er-soft-goods",
    name: "Emergency and post-acute soft goods",
    href: "/products/er-soft-goods",
    bodyRegion: "Multiple",
    summary:
      "Low-cost ER orthopedic supply as published on the current services page: crutches, ankle stirrups, hand and wrist splints, and related soft goods.",
    needs: [
      "Emergency-department discharge equipment",
      "Immediate immobilization",
      "Low-cost stocked soft goods for facilities",
    ],
    who: [
      "Hospital emergency departments",
      "Urgent care and orthopedic walk-in clinics",
      "Facility materials managers",
    ],
    obtain:
      "Facilities can request quotes for stocked ER items. NCOS publishes nationwide shipping and local customer service from its Ohio office.",
    insuranceNote:
      "Facility purchase and patient-billed DME are both supported in the current business model. Coverage should be verified on each order.",
    products: [
      "Crutches — contact for current models",
      "Ankle stirrups — contact for current models",
      "Hand and wrist splints — contact for current models",
    ],
  },
  {
    slug: "bone-spine-stimulators",
    name: "Bone and spine stimulators",
    href: "/products/bone-spine-stimulators",
    bodyRegion: "Specialty DME",
    summary:
      "The current services page lists bone / spine stimulators among NCOS offerings. Confirm current manufacturers, models, and coverage before quoting.",
    needs: ["Physician-directed bone or spine stimulation, as prescribed"],
    who: ["Orthopedic and spine practices", "Patients with a qualifying prescription"],
    obtain:
      "Contact the office. Do not treat this page as a complete stimulator catalog until current inventory is confirmed.",
    insuranceNote:
      "Physician-directed bone or spine stimulation is billed according to the item, payer, and documentation requirements.",
    products: [
      "Bone / spine stimulators — contact the office for current manufacturers and models",
    ],
  },
];

export function getCategory(slug: string) {
  return productCategories.find((category) => category.slug === slug);
}

export const catalogNotes = {
  vendorNeutral:
    "Northcoast Orthopedic Sales is a vendor-neutral service provider and publishes that it can source any brand a customer or physician prefers.",
  oneInvoice:
    "The current About page states that NCOS consolidates orders to one invoice to reduce paperwork and time.",
  pediatric:
    "The current catalogs page lists pediatric product catalogs in addition to adult orthopedic catalogs.",
};
