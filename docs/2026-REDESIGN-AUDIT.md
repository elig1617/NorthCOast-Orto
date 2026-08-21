# NCOS 2026 website redesign — Phase 1

Source of truth: [https://www.northcoastorthopedics.com/](https://www.northcoastorthopedics.com/)  
Business remains: Northcoast Orthopedic Sales, LLC — vendor-neutral orthopedic / soft-good DME supplier and billing partner.

## 1. Existing website audit

The live site is a Wix property. It already contains the real business. It does not contain a 2026 digital presence.

### Pages reviewed

| Current URL | Role |
| --- | --- |
| `/` | Homepage: hours, service list, vendor names, phone |
| `/about-us` | Company story, leadership photos/names, accreditation |
| `/our-services` | Product/service list and “why choose us” |
| `/services-4` | Newer products/services taxonomy + quote form |
| `/our-products` | Duplicate of vendors + billing |
| `/productcatalogs-vendors-billing` | Vendor catalogs, pediatric catalogs, billing |
| `/products-services` | Wix product catalog (all items) |
| `/lower-extremity-products` | Lower-extremity catalog |
| `/upper-extremity-products` | Upper-extremity catalog |
| `/patients` | Bill pay by phone, survey, legal PDFs |
| `/contact` | Hours, address, phones, email, form |
| `/va-fss-contractor` | FSS contract identifiers and SINs |
| `/gsa-fss-products` | FSS catalog items |
| `/dapa-dod-dla-dmlss-products` | DAPA / Owens & Minor / DMLSS |
| `/capability-statement` | Government capability narrative + identifiers |

### What the business actually is

- Off-the-shelf, soft-good orthopedic bracing and supports
- Vendor-neutral / manufacturer-neutral sourcing
- Own billing and customer-service desk
- Commercial customers: patients (with Rx), physicians, hospitals, orthopedic practices, pain management, physical therapy, Workers’ Comp
- Government customers: VA FSS and DoD/DLA DAPA through Owens & Minor
- Nationwide shipping; local office in northeast Ohio
- Published accreditation: The Compliance Team Exemplary Provider Program
- Published HIPAA-compliant operations

## 2. Problems with the current website

- Wix template structure: stacked modules, slider (“1/6”), leftover editor text (“This is a Paragraph…”)
- Looks like a small local medical-supply brochure, not a contractor that sells to VA, DLA, and hospitals
- Government capability is buried and internally inconsistent (Hudson vs Stow; two toll-free numbers; FSS period printed as ending April 2025)
- Product information is a raw Wix store sort list, not a clinical taxonomy
- Patients, providers, facilities, and federal buyers share almost no dedicated workflow
- Duplicate pages (`/our-products` and `/productcatalogs-vendors-billing`; `/our-services` and `/services-4`)
- Weak SEO titles (“medical billing service”, “Stow”) that undersell the actual business
- Contact details are treated as certain even though several conflict
- No serious privacy, accessibility, or DME disclaimer architecture
- Imagery and layout do not communicate bracing, logistics, or compliance

## 3. Content inventory (keep)

- Company name, legal entity, NCOS acronym, red wordmark
- Single-source / vendor-neutral positioning
- One order, one invoice, one contact
- Soft-good / off-the-shelf bracing scope
- Body-region product list from `/services-4`
- Named manufacturers: MedSpec, Corflex, medi, New Options Sports, Össur, RCAI; sourcing mentions of DonJoy, Breg, Townsend
- Audiences actually named on the current site (do not add audiences the site does not support)
- Billing for patients, hospitals, practices, PT / pain groups
- Insurance language as published: majority of commercial payers, Workers’ Comp, Medicare, Medicaid
- FSS contract 36F79720D0126, SINs, SAM/DUNS/CAGE/NAICS
- DAPA SP0200-21-H-0009, Owens & Minor supplier 4660, DMLSS item claim
- Exemplary Provider accreditation claim
- HIPAA claim
- 15+ years claim from the capability statement
- Hours as published
- Patient bill-pay method (call with invoice amount + order ID)
- Nationwide shipping
- Ability to work with patients who have a physician Rx
- Catalog item names scraped from the current product pages

## 4. Proposed 2026 sitemap

Preserved URLs where they have SEO or buyer meaning. Weak duplicates consolidated.

```
/                                 Home
/about-us                         About
/our-services                     Solutions
/products-services                Product hub
/products/[category]              Clinical categories
/lower-extremity-products         Existing catalog URL
/upper-extremity-products         Existing catalog URL
/productcatalogs-vendors-billing  Vendors + billing
/patients                         Patient resources + bill pay
/providers                        NEW — referral / physician desk
/facilities                       NEW — hospitals & organizations
/insurance                        NEW — coverage / billing
/va-fss-contractor                VA FSS
/gsa-fss-products                 FSS items
/dapa-dod-dla-dmlss-products      DoD / DAPA
/capability-statement             Capability statement
/contact                          Contact
/privacy /terms /accessibility    Legal
/patient-rights                   Existing PDF destination
/medicare-dmepos-standards        Existing PDF destination
/confirm-before-launch            Internal checklist (noindex)
```

### Redirects

| From | To |
| --- | --- |
| `/services-4` | `/products-services` |
| `/our-products` | `/productcatalogs-vendors-billing` |

## 5. Homepage wireframe

1. Utility bar — hours, call, refer, patient billing, government
2. Header — NCOS wordmark, short nav with product and government menus
3. Hero — who we are / what we provide / primary quote + referral + government CTAs
4. Trust strip — FSS, DAPA, Exemplary Provider, vendor-neutral (all sourced or marked)
5. Who we are — family Ohio DME company, not a retailer
6. DME solutions — orthopedic body map, not generic cards
7. Who we serve — patients, providers, facilities, government
8. Why NCOS — one invoice, manufacturer-neutral, commercial + federal, accreditation
9. Featured catalog areas
10. Partnerships + how it works
11. Insurance and government bands
12. Manufacturer lists from the current site
13. Contact / confirmation reminder

## 6. Design direction

- **Colors:** NCOS red `#B42318` from the existing logo; warm paper `#F3EEE4`; ink `#161310`; forest `#1D322C` for institutional bands. Not generic healthcare blue.
- **Typography:** Source Serif 4 for titles; IBM Plex Sans for interface; IBM Plex Mono for contract identifiers.
- **Layout:** Editorial / specification, hairline rules, lists and tables. Dense enough for buyers, not empty SaaS whitespace.
- **Photography:** No smiling-doctor stock. Placeholders describe the exact product, fitting, home-recovery, or logistics image that should be commissioned.
- **Icon / diagram style:** Line body map for bracing regions.
- **Navigation:** Five top-level items. Product and government dropdowns. Mobile menu plus a three-action call/refer/contact bar.
- **Buttons:** Square, border-based, red primary. No pills, no glow.
- **Visual language:** Healthcare + logistics + compliance. Should not be reusable for a dentist or a law firm.

## 7. Information requiring confirmation

See `/confirm-before-launch` on the built site. Summary:

- Address (Hudson and Stow both published)
- Office phone
- Toll-free (two different numbers published)
- Fax
- Emails
- Mobile numbers
- Ownership / leadership names and titles
- Hours
- Licenses and Exemplary Provider status
- Medicare / Medicaid enrollment
- Insurance participation
- FSS period and authorized pricelist
- DAPA / SAM status
- Bone / spine stimulator offering
- Team size
- Patient survey URL
- Privacy, DMEPOS, and rights PDFs
- Referral fax / secure intake
- Whether online bill pay exists
